package com.example.authapp.config;

import com.example.authapp.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.convert.converter.Converter;
import org.springframework.http.RequestEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.FormHttpMessageConverter;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.oauth2.client.endpoint.DefaultAuthorizationCodeTokenResponseClient;
import org.springframework.security.oauth2.client.endpoint.OAuth2AccessTokenResponseClient;
import org.springframework.security.oauth2.client.endpoint.OAuth2AuthorizationCodeGrantRequest;
import org.springframework.security.oauth2.client.http.OAuth2ErrorResponseErrorHandler;
import org.springframework.security.oauth2.core.OAuth2AccessToken;
import org.springframework.security.oauth2.core.endpoint.OAuth2AccessTokenResponse;
import org.springframework.security.oauth2.core.endpoint.OAuth2ParameterNames;
import org.springframework.security.oauth2.core.http.converter.OAuth2AccessTokenResponseHttpMessageConverter;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.util.StringUtils;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
@EnableGlobalMethodSecurity(prePostEnabled = true) // 메서드 레벨 보안 활성화
public class SecurityConfig {

    private final AuthService authService;
    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final OAuth2AuthenticationSuccessHandler oAuth2AuthenticationSuccessHandler;
    private final OAuth2AuthenticationFailureHandler oAuth2AuthenticationFailureHandler;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                // CSRF 비활성화 (JWT 사용으로 불필요)
                .csrf(AbstractHttpConfigurer::disable)
                
                // CORS 설정
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                
                // 세션 정책 - STATELESS (JWT 사용)
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                
                // 요청 권한 설정
                .authorizeHttpRequests(auth -> auth
                        // 공개 엔드포인트
                        .requestMatchers("/", "/login/**", "/oauth2/**", "/error", "/favicon.ico").permitAll()
                        .requestMatchers("/api/auth/refresh").permitAll()
                        .requestMatchers("/api/auth/signup").permitAll() // 회원가입 허용 추가
                        .requestMatchers("/api/auth/login").permitAll() // 일반 로그인 허용 추가
                        .requestMatchers("/api/oauth/**").permitAll() // OAuth API 허용 추가
                        .requestMatchers("/actuator/health").permitAll()
                        .requestMatchers("/h2-console/**").permitAll() // H2 Console 허용
                        
                        // 정적 파일 (업로드된 이미지) 허용
                        .requestMatchers("/uploads/**").permitAll()
                        
                        // 개발용 API 허용 (인증 불필요)
                        .requestMatchers("/api/dev/**").permitAll()
                        
                        // Swagger UI 허용
                        .requestMatchers("/swagger-ui/**", "/v3/api-docs/**", "/swagger-ui.html").permitAll()
                        
                        // API 엔드포인트 - 인증 필요
                        .requestMatchers("/api/**").authenticated()
                        
                        // 나머지 모든 요청은 인증 필요
                        .anyRequest().authenticated()
                )
                
                // OAuth2 로그인 설정
                .oauth2Login(oauth2 -> oauth2
                        .tokenEndpoint(token -> token.accessTokenResponseClient(accessTokenResponseClient()))
                        .userInfoEndpoint(userInfo -> userInfo.userService(authService))
                        .successHandler(oAuth2AuthenticationSuccessHandler)
                        .failureHandler(oAuth2AuthenticationFailureHandler)
                )
                
                // JWT 인증 필터 추가
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
                
                // 로그아웃 설정
                .logout(logout -> logout
                        .logoutUrl("/api/auth/logout")
                        .logoutSuccessUrl("/")
                        .clearAuthentication(true)
                        .invalidateHttpSession(true)
                );

        return http.build();
    }

    @Bean
    public OAuth2AccessTokenResponseClient<OAuth2AuthorizationCodeGrantRequest> accessTokenResponseClient() {
        DefaultAuthorizationCodeTokenResponseClient accessTokenResponseClient = new DefaultAuthorizationCodeTokenResponseClient();
        
        OAuth2AccessTokenResponseHttpMessageConverter tokenResponseHttpMessageConverter = new OAuth2AccessTokenResponseHttpMessageConverter();
        
        // 네이버 OAuth2 응답을 위한 커스텀 컨버터 설정
        tokenResponseHttpMessageConverter.setAccessTokenResponseConverter(mapOAuth2AccessTokenResponse -> {
            // access_token 필드 확인
            String accessToken = null;
            if (mapOAuth2AccessTokenResponse.containsKey("access_token")) {
                accessToken = (String) mapOAuth2AccessTokenResponse.get("access_token");
            } else if (mapOAuth2AccessTokenResponse.containsKey(OAuth2ParameterNames.ACCESS_TOKEN)) {
                accessToken = (String) mapOAuth2AccessTokenResponse.get(OAuth2ParameterNames.ACCESS_TOKEN);
            }
            
            if (accessToken == null || accessToken.trim().isEmpty()) {
                throw new IllegalArgumentException("Access token not found in OAuth2 response");
            }

            OAuth2AccessTokenResponse.Builder builder = OAuth2AccessTokenResponse.withToken(accessToken)
                    .tokenType(OAuth2AccessToken.TokenType.BEARER);

            // expires_in 처리
            if (mapOAuth2AccessTokenResponse.containsKey("expires_in")) {
                Object expiresInObj = mapOAuth2AccessTokenResponse.get("expires_in");
                long expiresIn = 0;
                if (expiresInObj instanceof String) {
                    expiresIn = Long.parseLong((String) expiresInObj);
                } else if (expiresInObj instanceof Number) {
                    expiresIn = ((Number) expiresInObj).longValue();
                }
                if (expiresIn > 0) {
                    builder.expiresIn(expiresIn);
                }
            }

            // refresh_token 처리
            if (mapOAuth2AccessTokenResponse.containsKey("refresh_token")) {
                String refreshToken = (String) mapOAuth2AccessTokenResponse.get("refresh_token");
                if (refreshToken != null && !refreshToken.trim().isEmpty()) {
                    builder.refreshToken(refreshToken);
                }
            }

            // scope 처리
            if (mapOAuth2AccessTokenResponse.containsKey("scope")) {
                String scope = (String) mapOAuth2AccessTokenResponse.get("scope");
                if (scope != null && !scope.trim().isEmpty()) {
                    builder.scopes(StringUtils.commaDelimitedListToSet(scope));
                }
            }

            return builder.build();
        });
        
        RestTemplate restTemplate = new RestTemplate(Arrays.asList(
                new FormHttpMessageConverter(), tokenResponseHttpMessageConverter));
        restTemplate.setErrorHandler(new OAuth2ErrorResponseErrorHandler());
        
        accessTokenResponseClient.setRestOperations(restTemplate);
        return accessTokenResponseClient;
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        
        // 허용할 Origin 설정
        configuration.setAllowedOrigins(List.of(
                "http://localhost:3000",
                "http://localhost:5173",
                "http://localhost:8081",  // 현재 프론트엔드 포트 추가
                "http://192.168.0.117:8081"  // 네트워크 주소도 추가
        ));
        
        // 허용할 HTTP 메서드
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        
        // 허용할 헤더
        configuration.setAllowedHeaders(List.of("*"));
        
        // 인증 정보 포함 허용
        configuration.setAllowCredentials(true);
        
        // 모든 경로에 CORS 설정 적용
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        
        return source;
    }
}
