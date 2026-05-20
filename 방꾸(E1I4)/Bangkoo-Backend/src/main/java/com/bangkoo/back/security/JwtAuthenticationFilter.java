package com.bangkoo.back.security;

import com.bangkoo.back.utils.JwtUtil;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        String token = extractToken(request); // 요청에서 토큰 추출

        if (token != null && jwtUtil.isValidToken(token)) {
            // 토큰이 유효하면 이메일과 역할 추출
            String email = jwtUtil.getEmailFromToken(token);
            String role = jwtUtil.getUserRoleFromToken(token);

            // 역할을 기반으로 GrantedAuthority 생성
            UsernamePasswordAuthenticationToken authentication =
                    new UsernamePasswordAuthenticationToken(email, null, List.of(() -> role));

            // 인증 객체를 SecurityContext에 설정
            SecurityContextHolder.getContext().setAuthentication(authentication);
        }

        filterChain.doFilter(request, response); // 필터 체인 계속 진행
    }

    private String extractToken(HttpServletRequest request) {
        // 1. 쿠키에서 토큰 추출
        if (request.getCookies() != null) {
            for (Cookie cookie : request.getCookies()) {
                if ("accessToken".equals(cookie.getName())) {
                    return cookie.getValue();  // 토큰 반환
                }
            }
        }

        // 2. Authorization 헤더에서 Bearer 방식으로 토큰 추출
        String authHeader = request.getHeader("Authorization");
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            return authHeader.substring(7); // "Bearer " 이후의 토큰 값 반환
        }

        return null; // 토큰 없으면 null 반환
    }
}
