package com.example.mytravellink.config;

import com.example.mytravellink.auth.filter.JwtAuthorizationFilter;
import com.example.mytravellink.auth.handler.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.security.servlet.PathRequest;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

import static org.springframework.security.config.Customizer.withDefaults;

@Configuration
@EnableWebSecurity
public class WebSecurityConfig {

    @Autowired
    private JwtTokenProvider jwtTokenProvider; // JWT 토큰 제공자

    @Autowired
    private UserDetailsService userDetailsService; // 사용자 세부 정보 서비스

    @Bean
    SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http
                .csrf(AbstractHttpConfigurer::disable)
                .formLogin(AbstractHttpConfigurer::disable)
                .httpBasic(AbstractHttpConfigurer::disable)

                // CORS 설정
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .authorizeHttpRequests(auth -> {
                    auth.requestMatchers("/api/public/**").permitAll();
                    auth.requestMatchers("/", "/login/**", "/auth/google/callback", "/loginSuccess",
                            "/travels/guides","/user/check",
                            "/images/**","/swagger-ui/**","/api-docs/**","/api*","/v3/api-docs/**", 
                            "/swagger-resources/**","/auth/send-code","/auth/verify-code","/url/**").permitAll();
                    auth.requestMatchers(PathRequest.toStaticResources().atCommonLocations()).permitAll();
                    auth.anyRequest().permitAll();
                    
                })
                // JWT 필터 추가
                .addFilterBefore(new JwtAuthorizationFilter(jwtTokenProvider, userDetailsService), 
                               UsernamePasswordAuthenticationFilter.class)
//                .oauth2Login(withDefaults())
                .build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration configuration = new CorsConfiguration();

        configuration.setAllowedOrigins(Arrays.asList("https://mytravellink.site","http://localhost:3000"));
        configuration.setAllowedMethods(Arrays.asList("GET","POST","PUT","DELETE","OPTIONS"));
        configuration.setAllowCredentials(true);
        configuration.setAllowedHeaders(Arrays.asList("Authorization","Content-Type"));
        // 응답 시 노출할 헤더 설정
        configuration.setExposedHeaders(Arrays.asList("Authorization"));

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**",configuration);
        return source;
    }

}
