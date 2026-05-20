package com.bangkoo.back.utils;

import com.bangkoo.back.config.properites.JwtProperties;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.*;

@Component
public class JwtUtil {

    private final JwtProperties jwtProperties;
    private SecretKey secretKey;
    private static final String COOKIE_NAME = "accessToken";

    public JwtUtil(JwtProperties jwtProperties) {
        this.jwtProperties = jwtProperties;
    }

    @PostConstruct
    public void init() {
        String key = jwtProperties.getSecretKey();
        System.out.println("JWT Raw Key: " + key);
        if (key == null || key.isEmpty()) {
            throw new IllegalArgumentException("JWT secret key is missing.");
        }
        this.secretKey = Keys.hmacShaKeyFor(Base64.getDecoder().decode(key));
    }

    // ====== JWT 생성 ======
    public String generateAccessToken(String id, String email, String nickname, String role) {
        String token = Jwts.builder()
                .setSubject(email)
                .claim("id", id)
                .claim("nickname", nickname)
                .claim("role", role)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + jwtProperties.getAccessTokenExpirationMs()))
                .signWith(secretKey, SignatureAlgorithm.HS256)
                .compact();
        System.out.println("Generated JWT Token: " + token);  // 여기서 토큰을 출력하여 확인
        return token;
    }

    public String generateRefreshToken(String email) {
        return Jwts.builder()
                .setSubject(email)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + jwtProperties.getRefreshTokenExpirationMs()))
                .signWith(secretKey, SignatureAlgorithm.HS256)
                .compact();
    }

    // ====== 쿠키 저장 ======
    public void addJwtToCookie(HttpServletResponse response, String token) {
        String encodedToken = URLEncoder.encode(token, StandardCharsets.UTF_8);
        String cookie = COOKIE_NAME + "=" + encodedToken + ";"
                + "HttpOnly; Secure; SameSite=None; Path=/; Max-Age=" + (jwtProperties.getAccessTokenExpirationMs() / 1000);
        response.addHeader("Set-Cookie", cookie);
    }

    public void addNicknameToCookie(HttpServletResponse response, String nickname) {
        String encoded = URLEncoder.encode(nickname, StandardCharsets.UTF_8);
        String cookie = "nickname=" + encoded + "; Path=/; Max-Age=" + (jwtProperties.getAccessTokenExpirationMs() / 1000)
                + "; Secure; SameSite=None";
        response.addHeader("Set-Cookie", cookie);
    }

    // ✅ 로그아웃 시 쿠키 제거
    public void removeCookies(HttpServletResponse response) {
        String expiredAccessToken = COOKIE_NAME + "=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=None";
        String expiredNickname = "nickname=; Path=/; Max-Age=0; Secure; SameSite=None";

        response.addHeader("Set-Cookie", expiredAccessToken);
        response.addHeader("Set-Cookie", expiredNickname);
    }

    // ====== 토큰 파싱 ======
    public String resolveToken(HttpServletRequest request) {
        if (request.getCookies() != null) {
            for (Cookie cookie : request.getCookies()) {
                if (COOKIE_NAME.equals(cookie.getName())) {
                    return cookie.getValue();
                }
            }
        }
        return null;
    }

    public boolean isValidToken(String token) {
        try {
            getClaims(token);
            return !isTokenExpired(token);
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }

    public boolean isTokenExpired(String token) {
        return getClaims(token).getExpiration().before(new Date());
    }

    public String getEmailFromToken(String token) {
        return getClaims(token).getSubject();
    }

    public Claims getClaims(String token) {
        try {
            return Jwts.parserBuilder()
                    .setSigningKey(secretKey)
                    .build()
                    .parseClaimsJws(token)
                    .getBody();
        } catch (JwtException | IllegalArgumentException e) {
            // 여기에 예외를 기록하여 어떤 문제가 있는지 파악
            System.out.println("JWT 토큰 오류:"+e.getMessage());
            throw e;
        }
    }

    /**
     * 토큰의 유효성 검증
     * @param token
     * @return
     */
    public Authentication getAuthentication(String token) {
        Claims claims = parseClaims(token);
        String role = claims.get("role", String.class); // 역할을 가져옴
        List<GrantedAuthority> authorities = Arrays.asList(new SimpleGrantedAuthority(role));
        return new UsernamePasswordAuthenticationToken(claims.getSubject(), null, authorities);
    }
    // ====== 기타 유틸 ======
    public SecretKey getSecretKey(String key) {
        return Keys.hmacShaKeyFor(Base64.getDecoder().decode(key));
    }


    /**
     * 🔐 요청에서 JWT 토큰 추출
     * 작성자: 김태원
     *
     * - 우선적으로 HttpOnly 쿠키에서 ACCESS_TOKEN 값을 찾음
     * - 쿠키가 없다면 Authorization 헤더(Bearer 토큰)에서 추출
     * - 둘 다 없으면 null 반환
     *
     * @param request 클라이언트의 HTTP 요청 객체
     * @return JWT 토큰 문자열 or null
     */
    public String extractToken(HttpServletRequest request) {
        // ✅ 1. 쿠키에서 ACCESS_TOKEN 찾기
        if (request.getCookies() != null) {
            for (Cookie cookie : request.getCookies()) {
                if ("accessToken".equals(cookie.getName())) {
                    return cookie.getValue();
                }
            }
        }

        // ✅ 2. Authorization 헤더에서 Bearer 토큰 찾기 (백업 플랜)
        String authHeader = request.getHeader("Authorization");
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7); // "Bearer " 제거
            return token;
        }

        return null; // 둘 다 없으면 null
    }

    /**
     * 🔍 JWT 토큰에서 Claims(페이로드) 추출
     *  작성자: 김태원
     * - JWT 서명을 검증한 뒤 토큰의 Body(Claims)를 반환
     * - 내부에 있는 사용자 정보(id, nickname 등)에 접근할 때 사용됨
     *
     * @param token 클라이언트로부터 전달된 JWT 액세스 토큰
     * @return Claims 객체 (key-value 쌍의 Map 구조)
     */
    public Claims parseClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(secretKey) // 서명 검증을 위한 SecretKey 설정
                .build()
                .parseClaimsJws(token)   // JWT 파싱 및 서명 유효성 검증
                .getBody();              // 검증된 Claims 반환
    }

    /**
     * 🧠 JWT에서 사용자 고유 ID 추출
     *  작성자: 김태원
     * - 로그인한 유저의 ID를 JWT의 클레임에서 가져옴
     * - 클레임 내부의 "id" 키를 기준으로 추출
     *
     * @param token 클라이언트의 JWT 액세스 토큰
     * @return 사용자 ID (String)
     */
    public String getUserIdFromToken(String token) {
        if (token == null || token.isEmpty()) {
            throw new IllegalArgumentException("JWT Token cannot be null or empty");
        }

        System.out.println("JWT Token: " + token);  // 토큰이 제대로 전달되었는지 로그로 확인

        try {
            // 클레임 파싱
            Claims claims = parseClaims(token);

            // JWT의 subject (사용자 ID) 반환
            String userId = claims.getSubject();

            if (userId == null || userId.isEmpty()) {
                throw new IllegalArgumentException("User ID is missing in the JWT claims");
            }

            return userId;
        } catch (JwtException | IllegalArgumentException e) {
            // 예외가 발생하면 로그를 남기고, 적절한 메시지를 반환
            System.err.println("JWT Token Parsing Error: " + e.getMessage());
            throw new IllegalArgumentException("Invalid JWT Token", e);
        }
    }


    /**
     * use인지 admin인지
     */
    public String getJwtFromRequest(HttpServletRequest request) {
        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if ("accessToken".equals(cookie.getName())) {
                    return cookie.getValue();
                }
            }
        }
        return null;
    }

    public String getUserRoleFromToken(String token) {
        Claims claims = getClaims(token);
        return claims.get("role", String.class);
    }


}
