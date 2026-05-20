package com.example.edgeservice.security;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpCookie;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.oauth2.server.resource.authentication.BearerTokenAuthenticationToken;
import org.springframework.security.web.server.SecurityWebFilterChain;
import org.springframework.security.web.server.authentication.ServerAuthenticationConverter;
import reactor.core.publisher.Mono;

@EnableWebFluxSecurity
@Configuration
public class SecurityConfig {

    @Value("${app.security.cookie-name:ADMIN_ID_TOKEN}")
    private String cookieName;

    @Bean
    public SecurityWebFilterChain springSecurityFilterChain(ServerHttpSecurity http) {
        return http
                .csrf(ServerHttpSecurity.CsrfSpec::disable)
                .cors(ServerHttpSecurity.CorsSpec::disable) // CORS는 Gateway(globalcors)에서 처리
                .authorizeExchange(reg -> reg
                        // ✅ Preflight 전부 허용
                        .pathMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                        // ✅ 공개 엔드포인트
                        .pathMatchers("/", "/admin-login.html",
                                "/auth/session", "/auth/logout",
                                "/actuator/**",
                                "/favicon.ico", "/static/**", "/config/**").permitAll()

                        // 이외는 인증 필요 (/admin, /admin/** 포함)
                        .anyExchange().authenticated()
                )
                .oauth2ResourceServer(oauth2 -> oauth2
                        // ✅ 헤더 없으면 쿠키에서 토큰 추출
                        .bearerTokenConverter(cookieOrHeaderBearerConverter())
                        .jwt(jwt -> {}) // issuer-uri 기반 ReactiveJwtDecoder 자동 구성
                )
                .build();
    }

    // Authorization: Bearer ... 없으면 쿠키(ADMIN_ID_TOKEN)에서 추출
    private ServerAuthenticationConverter cookieOrHeaderBearerConverter() {
        return exchange -> {
            var req = exchange.getRequest();
            var auth = req.getHeaders().getFirst(HttpHeaders.AUTHORIZATION);
            if (auth != null && auth.startsWith("Bearer ")) {
                return Mono.just(new BearerTokenAuthenticationToken(auth.substring(7)));
            }
            HttpCookie cookie = req.getCookies().getFirst(cookieName);
            if (cookie != null && !cookie.getValue().isBlank()) {
                return Mono.just(new BearerTokenAuthenticationToken(cookie.getValue()));
            }
            return Mono.empty();
        };
    }
}
