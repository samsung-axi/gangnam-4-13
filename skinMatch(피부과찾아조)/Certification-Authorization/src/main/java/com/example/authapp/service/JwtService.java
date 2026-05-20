package com.example.authapp.service;

import com.example.authapp.entity.User;
import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Slf4j
@Service
public class JwtService {

    private final SecretKey secretKey;
    private final long accessTokenExpiration;
    private final long refreshTokenExpiration;

    public JwtService(
            @Value("${jwt.secret}") String secret,
            @Value("${jwt.expiration}") long accessTokenExpiration,
            @Value("${jwt.refresh-expiration}") long refreshTokenExpiration) {
        this.secretKey = Keys.hmacShaKeyFor(Decoders.BASE64.decode(secret));
        this.accessTokenExpiration = accessTokenExpiration * 1000; // 초를 밀리초로 변환
        this.refreshTokenExpiration = refreshTokenExpiration * 1000;
    }

    // Access Token 생성
    public String generateAccessToken(User user) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("userId", user.getId());
        claims.put("email", user.getEmail());
        claims.put("role", user.getRole().name());
        claims.put("provider", user.getProvider() != null ? user.getProvider().getValue() : "REGULAR");

        return createToken(claims, user.getEmail(), accessTokenExpiration);
    }

    // Refresh Token 생성
    public String generateRefreshToken(User user) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("userId", user.getId());

        return createToken(claims, user.getEmail(), refreshTokenExpiration);
    }

    // 토큰 생성 공통 메서드
    private String createToken(Map<String, Object> claims, String subject, long expiration) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + expiration);

        return Jwts.builder()
                .claims(claims)
                .subject(subject)
                .issuedAt(now)
                .expiration(expiryDate)
                .signWith(secretKey, SignatureAlgorithm.HS256)
                .compact();
    }

    // 토큰에서 사용자 이메일 추출
    public String getEmailFromToken(String token) {
        return getClaimFromToken(token, Claims::getSubject);
    }

    // 토큰에서 사용자 ID 추출
    public Long getUserIdFromToken(String token) {
        return getClaimFromToken(token, claims -> claims.get("userId", Long.class));
    }

    // 토큰에서 만료 시간 추출
    public Date getExpirationFromToken(String token) {
        return getClaimFromToken(token, Claims::getExpiration);
    }

    // 토큰에서 특정 클레임 추출
    public <T> T getClaimFromToken(String token, ClaimsResolver<T> claimsResolver) {
        final Claims claims = getAllClaimsFromToken(token);
        return claimsResolver.resolve(claims);
    }

    // 토큰에서 모든 클레임 추출
    private Claims getAllClaimsFromToken(String token) {
        try {
            return Jwts.parser()
                    .verifyWith(secretKey)
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();
        } catch (ExpiredJwtException e) {
            log.warn("JWT token is expired: {}", e.getMessage());
            throw e;
        } catch (UnsupportedJwtException e) {
            log.warn("JWT token is unsupported: {}", e.getMessage());
            throw e;
        } catch (MalformedJwtException e) {
            log.warn("JWT token is malformed: {}", e.getMessage());
            throw e;
        } catch (SecurityException e) {
            log.warn("JWT signature validation failed: {}", e.getMessage());
            throw e;
        } catch (IllegalArgumentException e) {
            log.warn("JWT token compact of handler are invalid: {}", e.getMessage());
            throw e;
        }
    }

    // 토큰 유효성 검증
    public boolean isTokenValid(String token, String email) {
        try {
            final String tokenEmail = getEmailFromToken(token);
            return (tokenEmail.equals(email) && !isTokenExpired(token));
        } catch (Exception e) {
            log.warn("Token validation failed: {}", e.getMessage());
            return false;
        }
    }

    // 토큰 만료 여부 확인
    public boolean isTokenExpired(String token) {
        try {
            final Date expiration = getExpirationFromToken(token);
            return expiration.before(new Date());
        } catch (Exception e) {
            return true; // 토큰 파싱 실패 시 만료된 것으로 간주
        }
    }

    // Refresh Token 만료 시간 계산 (LocalDateTime)
    public LocalDateTime calculateRefreshTokenExpiryDate() {
        return LocalDateTime.now().plusSeconds(refreshTokenExpiration / 1000);
    }

    // 토큰에서 Bearer 접두사 제거
    public String extractTokenFromHeader(String authHeader) {
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            return authHeader.substring(7);
        }
        return null;
    }

    @FunctionalInterface
    public interface ClaimsResolver<T> {
        T resolve(Claims claims);
    }
}