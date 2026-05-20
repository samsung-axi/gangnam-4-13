package com.pickfit.pickfit.config;

import com.pickfit.pickfit.oauth2.handler.OAuth2AuthenticationSuccessHandler;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
@EnableWebSecurity
public class SecurityConfig implements WebMvcConfigurer {

    private final OAuth2AuthenticationSuccessHandler successHandler;

    public SecurityConfig(OAuth2AuthenticationSuccessHandler successHandler) {
        this.successHandler = successHandler;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors() // CORS 설정 활성화
                .and()
                .csrf().disable() // CSRF 보호 비활성화 (FastAPI와의 통신 테스트를 위해 비활성화)
                .authorizeHttpRequests(authorize -> authorize
                        .requestMatchers("/api/**").permitAll() // `/api/**` 경로는 모두 인증 없이 접근 가능
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll() // OPTIONS 요청 허용 (CORS 사전 요청)
                        .anyRequest().permitAll() // 모든 요청 인증 없이 허용
                )
                .oauth2Login(oauth2 -> oauth2
                        .successHandler(successHandler) // OAuth2 로그인 성공 핸들러 설정
                );

        return http.build();
    }

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**") // 모든 경로에 대해 CORS 허용
                .allowedOrigins("http://localhost:3000", "http://localhost:5000", "http://pickfit.store", "http://52.79.200.245:5688", "http://52.79.200.245") // React, FastAPI 허용
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS") // 허용할 HTTP 메서드
                .allowedHeaders("*") // 모든 헤더 허용
                .allowCredentials(true); // 쿠키 및 인증 정보 허용
    }
}
