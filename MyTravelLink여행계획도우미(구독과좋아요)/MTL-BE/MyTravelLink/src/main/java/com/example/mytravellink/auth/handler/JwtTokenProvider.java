package com.example.mytravellink.auth.handler;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import com.example.mytravellink.domain.users.entity.Users;
import java.util.Date;

@Slf4j
@Service
public class JwtTokenProvider {

    @Value("${jwt.secret}")
    private String secretKey;

    @Value("${jwt.expiration-time}")
    private long expirationTime;

    public String generateToken(Users user) {
        Claims claims = Jwts.claims().setSubject(user.getEmail());
        claims.put("name", user.getName());
        claims.put("email", user.getEmail());

        Date now = new Date();
        Date validity = new Date(now.getTime() + expirationTime);

        String token = Jwts.builder()
                .setClaims(claims)
                .setIssuedAt(now)
                .setExpiration(validity)
                .signWith(SignatureAlgorithm.HS256, secretKey)
                .compact();
        log.debug("생성된 JWT 토큰: {}", token);
        return token;
    }

    public String resolveToken(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        log.debug("요청 헤더 'Authorization': {}", bearerToken);
        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            String token = bearerToken.substring(7);
            log.debug("추출된 JWT 토큰: {}", token);
            return token;
        }
        log.debug("Bearer 토큰 형식이 아니거나 헤더에 값이 없음");
        return null;
    }

    public boolean validateToken(String token) {
        try {
            Jwts.parser().setSigningKey(secretKey).parseClaimsJws(token);
            log.debug("JWT 토큰 검증 성공");
            return true;
        } catch (io.jsonwebtoken.ExpiredJwtException e) {
            log.error("JWT 만료: {}", e.getMessage());
            return false;
        } catch (io.jsonwebtoken.SignatureException e) {
            log.error("잘못된 JWT 서명: {}", e.getMessage());
            return false;
        } catch (Exception e) {
            log.error("JWT 검증 오류: {}", e.getMessage());
            return false;
        }
    }

    public Claims getClaimsFromToken(String token) {
        Claims claims = Jwts.parser().setSigningKey(secretKey).parseClaimsJws(token).getBody();
        log.debug("JWT 토큰에서 추출한 Claims: {}", claims);
        return claims;
    }

    public String getEmailFromToken(String token) {
        Claims claims = getClaimsFromToken(token);
        String email = claims.getSubject();
        log.debug("토큰에서 추출한 이메일: {}", email);
        return email;
    }
}