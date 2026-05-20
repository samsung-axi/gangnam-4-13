package com.example.authapp.config;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationFailureHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;

@Slf4j
@Component
public class OAuth2AuthenticationFailureHandler extends SimpleUrlAuthenticationFailureHandler {

    @Override
    public void onAuthenticationFailure(HttpServletRequest request, 
                                       HttpServletResponse response,
                                       AuthenticationException exception) throws IOException {
        
        log.error("OAuth2 authentication failed: {}", exception.getMessage());
        
        // 프론트엔드 에러 페이지로 리다이렉트
        String targetUrl = UriComponentsBuilder.fromUriString("http://localhost:5173/login")
                .queryParam("error", "oauth_failed")
                .queryParam("message", exception.getMessage())
                .build().toUriString();
        
        getRedirectStrategy().sendRedirect(request, response, targetUrl);
    }
}
