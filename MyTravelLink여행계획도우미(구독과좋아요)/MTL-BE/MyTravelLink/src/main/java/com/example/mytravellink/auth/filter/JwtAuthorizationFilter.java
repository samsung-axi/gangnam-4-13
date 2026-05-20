package com.example.mytravellink.auth.filter;

import com.example.mytravellink.auth.handler.JwtTokenProvider;
import com.example.mytravellink.auth.service.CustomUserDetails;
import com.example.mytravellink.domain.users.entity.Users;
import io.jsonwebtoken.Claims;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.web.filter.OncePerRequestFilter;
import java.io.IOException;
import java.util.Arrays;
import java.util.List;
import java.util.regex.Pattern;

@Slf4j
public class JwtAuthorizationFilter extends OncePerRequestFilter {

    private final JwtTokenProvider jwtTokenProvider;
    private final UserDetailsService userDetailsService;

    public JwtAuthorizationFilter(JwtTokenProvider jwtTokenProvider, UserDetailsService userDetailsService) {
        this.jwtTokenProvider = jwtTokenProvider;
        this.userDetailsService = userDetailsService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws IOException, ServletException {
        log.debug("요청 URI: {}", request.getRequestURI());
        log.debug("요청 'Authorization' 헤더: {}", request.getHeader("Authorization"));

        List<String> roleLeessList = Arrays.asList(
                "/swagger-ui/(.*)",
                "/swagger-ui/index.html",
                "/v3/api-docs",
                "/v3/api-docs/(.*)",
                "/swagger-resources",
                "/swagger-resources/(.*)",
                "/auth/google/callback",
                "/api/v1/travels/guide"
        );

        if (roleLeessList.stream().anyMatch(pattern -> Pattern.matches(pattern, request.getRequestURI()))) {
            log.debug("URI {} 는 JWT 검증 제외 대상입니다.", request.getRequestURI());
            filterChain.doFilter(request, response);
            return;
        }

        String token = jwtTokenProvider.resolveToken(request);
        log.info("추출한 토큰: {}", token);

        if (token != null && jwtTokenProvider.validateToken(token)) {
            Claims claims = jwtTokenProvider.getClaimsFromToken(token);
            log.debug("추출된 Claims: {}", claims);

            Users member = Users.builder()
                    .email(claims.getSubject())
                    .name(claims.get("name").toString())
                    .build();
            log.debug("JWT 토큰에서 생성한 사용자 정보: email={}, name={}", member.getEmail(), member.getName());

            CustomUserDetails userDetails = new CustomUserDetails();
            userDetails.setMember(member);

            UsernamePasswordAuthenticationToken authentication =
                    new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
            authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

            SecurityContextHolder.getContext().setAuthentication(authentication);
            log.debug("SecurityContext에 인증 정보가 설정되었습니다.");
        } else {
            log.debug("유효한 JWT 토큰이 없거나 검증에 실패했습니다.");
        }

        filterChain.doFilter(request, response);
    }
}
