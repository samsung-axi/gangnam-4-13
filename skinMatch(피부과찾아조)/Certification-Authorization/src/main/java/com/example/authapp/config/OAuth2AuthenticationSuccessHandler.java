package com.example.authapp.config;

import com.example.authapp.dto.response.LoginResponse;
import com.example.authapp.entity.User;
import com.example.authapp.service.AuthService;
import com.example.authapp.service.OAuth2UserPrincipal;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

@Slf4j
@Component
@RequiredArgsConstructor
public class OAuth2AuthenticationSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final AuthService authService;
    private final ObjectMapper objectMapper;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, 
                                       HttpServletResponse response,
                                       Authentication authentication) throws IOException {
        
        try {
            // OAuth2UserPrincipal에서 사용자 정보 추출
            OAuth2UserPrincipal principal = (OAuth2UserPrincipal) authentication.getPrincipal();
            User user = principal.getUser();
            
            // JWT 토큰 생성
            LoginResponse loginResponse = authService.login(user);
            
            log.info("OAuth2 authentication successful for user: {}", user.getEmail());
            
            // 프론트엔드로 리다이렉트 (토큰을 쿼리 파라미터로 전달)
            String targetUrl = createTargetUrl(loginResponse);
            
            if (response.isCommitted()) {
                log.debug("Response has already been committed. Unable to redirect to {}", targetUrl);
                return;
            }
            
            getRedirectStrategy().sendRedirect(request, response, targetUrl);
            
        } catch (Exception e) {
            log.error("OAuth2 authentication success handling failed", e);
            response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Authentication processing failed");
        }
    }

    private String createTargetUrl(LoginResponse loginResponse) {
        // 프론트엔드 URL (개발환경)
        String frontendUrl = "http://localhost:5173";
        
        return UriComponentsBuilder.fromUriString(frontendUrl + "/auth/callback")
                .queryParam("accessToken", URLEncoder.encode(loginResponse.getAccessToken(), StandardCharsets.UTF_8))
                .queryParam("refreshToken", URLEncoder.encode(loginResponse.getRefreshToken(), StandardCharsets.UTF_8))
                .queryParam("userId", loginResponse.getUser().getId())
                .queryParam("email", URLEncoder.encode(loginResponse.getUser().getEmail(), StandardCharsets.UTF_8))
                .queryParam("name", URLEncoder.encode(loginResponse.getUser().getName(), StandardCharsets.UTF_8))
                .build().toUriString();
    }
}
