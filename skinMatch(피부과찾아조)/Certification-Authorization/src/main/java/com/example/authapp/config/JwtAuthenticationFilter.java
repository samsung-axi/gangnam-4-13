package com.example.authapp.config;

import com.example.authapp.service.JwtService;
import com.example.authapp.service.UserService;
import com.example.authapp.entity.User;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Slf4j
@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserService userService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, 
                                   HttpServletResponse response, 
                                   FilterChain filterChain) throws ServletException, IOException {
        
        try {
            // Authorization 헤더에서 JWT 토큰 추출
            String jwt = getJwtFromRequest(request);
            
            if (StringUtils.hasText(jwt)) {
                // 토큰에서 사용자 이메일 추출
                String userEmail = jwtService.getEmailFromToken(jwt);
                
                if (StringUtils.hasText(userEmail) && SecurityContextHolder.getContext().getAuthentication() == null) {
                    // 사용자 정보 조회
                    User user = userService.findByEmail(userEmail).orElse(null);
                    
                    if (user != null && jwtService.isTokenValid(jwt, userEmail)) {
                        // 디버깅 로그 추가
                        log.info("=== JWT 필터에서 사용자 인증 ===");
                        log.info("사용자 이메일: {}", user.getEmail());
                        log.info("사용자 닉네임: {}", user.getNickname());
                        log.info("사용자 provider: {}", user.getProvider());
                        
                        // 인증 객체 생성
                        UsernamePasswordAuthenticationToken authentication = 
                            new UsernamePasswordAuthenticationToken(
                                user, null, user.getRole().getAuthorities()
                            );
                        
                        authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                        
                        // SecurityContext에 인증 정보 설정
                        SecurityContextHolder.getContext().setAuthentication(authentication);
                        
                        log.debug("Set authentication for user: {}", userEmail);
                    }
                }
            }
        } catch (Exception ex) {
            log.error("Could not set user authentication in security context", ex);
        }

        filterChain.doFilter(request, response);
    }

    // Request에서 JWT 토큰 추출
    private String getJwtFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        return jwtService.extractTokenFromHeader(bearerToken);
    }
}
