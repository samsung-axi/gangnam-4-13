package com.bangkoo.back.config;


import com.bangkoo.back.security.JwtAuthenticationFilter;
import com.bangkoo.back.utils.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.*;
import org.springframework.security.config.annotation.authentication.configuration.*;
import org.springframework.security.config.annotation.web.builders.*;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

/**
 * 최초 작성자 : 김동규
 * 최초 작성일 : 2025-04-01
 *
 * Spring Security 보안 설정 클래스
 * */
@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtUtil jwtUtil;
    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    /**
     *
     * 허용 주소 목록
     *  alloUrls
     */
    public static final String[] allowUrls= {
            "/swagger-ui/**",
            "/swagger-resources/**",
            "/v3/api-docs/**",
            "/login",
            "/oauth2/**",
            "/error",
            "/auth/**",
            "/kakao/login",
            "/kakao/callback",
            "/oauth/callback/kakao",
            "/kakao/login",
            "/favicon.ico",
            "/api/search",
            "/api/placement",
            "/api/placement/**",
            "/api/3d-url/**",
            "/api/products/dummy",
            "/api/detect_all_base64",
            "/api/embedding",
            "/api/recommendation",
            "/api/analyze_room",
            "/api/style_recommendation",
    };


    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                        .requestMatchers("/api/search/**").permitAll()
                        .requestMatchers("/actuator/health", "/actuator/info", "/").permitAll()
                        .requestMatchers("/api/**").permitAll()
                        .requestMatchers("/api/placement").permitAll()
                        .requestMatchers("/api/placement/**").permitAll()
                        .requestMatchers("/api/3d-url/**").permitAll()
                        .requestMatchers("/api/redis/**").permitAll()//인증된 사용자만 가능
                        .requestMatchers("/auth/**", "/oauth/**").permitAll() // 인증 제외 경로
                        .requestMatchers("/api/detect_all_base64").permitAll()
                        .requestMatchers("/product/**").authenticated()     //인증된 사용자만 가능
                        .requestMatchers("/api/admin/product/**").hasRole("ADMIN")
                        .requestMatchers(allowUrls).permitAll()
                      //관리자만 접근 가능
                        .anyRequest().authenticated()
                )
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class); // ✅ 수정됨

        return http.build();
    }
  
    /**
     * CORS 설정 Bean
     */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
//        configuration.setAllowedOrigins(Arrays.asList("https://bangkoo.store", "https://www.bangkoo.store", "https://api.bangkoo.store"));
        configuration.setAllowedOrigins(Arrays.asList("http://localhost:3000"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type"));
        configuration.setAllowCredentials(true); // HttpOnly 쿠키 사용 시 필요
        configuration.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }


    /**
     * 인증 매니저 Bean
     */
    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration configuration
    ) throws Exception {
        return configuration.getAuthenticationManager();
    }

    /**
     * 비밀번호 암호화용 PasswordEncoder Bean
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }



}
