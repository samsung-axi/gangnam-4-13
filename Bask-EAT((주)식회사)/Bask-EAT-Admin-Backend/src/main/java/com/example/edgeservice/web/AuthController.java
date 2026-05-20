package com.example.edgeservice.web;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.http.server.reactive.ServerHttpResponse;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.jwt.*;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

import java.time.Duration;
import java.time.Instant;
import java.util.*;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final ReactiveJwtDecoder jwtDecoder;

    public AuthController(ReactiveJwtDecoder jwtDecoder) {
        this.jwtDecoder = jwtDecoder;
    }

    public record SessionReq(String idToken) {}

    @Value("${app.security.cookie-name:ADMIN_ID_TOKEN}")
    private String cookieName;

    @Value("${app.security.cookie-secure:false}")
    private boolean cookieSecure;

    /** Lax | None | Strict (대소문자 무관). 기본 Lax (동일 오리진 개발 권장) */
    @Value("${app.security.cookie-samesite:Lax}")
    private String cookieSameSite;

    /** 필요 시 운영에서만 설정 (예: .your.dom). 비면 설정하지 않음 */
    @Value("${app.security.cookie-domain:}")
    private String cookieDomain;

    /** 기본 "/" */
    @Value("${app.security.cookie-path:/}")
    private String cookiePath;

    /** 쿠키 Max-Age 상한(초). 기본 3600(1h) */
    @Value("${app.security.cookie-maxage-cap-seconds:3600}")
    private long cookieMaxAgeCap;

    @PostMapping("/session")
    public Mono<ResponseEntity<Object>> createSession(@RequestBody SessionReq req, ServerHttpResponse resp) {
        if (req == null || req.idToken == null || req.idToken.isBlank()) {
            return Mono.just(ResponseEntity.badRequest().build());
        }
        return jwtDecoder.decode(req.idToken)
                .map(jwt -> {
                    if (!isAdmin(jwt)) {
                        return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
                    }
                    long maxAge = computeMaxAgeSeconds(jwt);

                    ResponseCookie.ResponseCookieBuilder b = ResponseCookie.from(cookieName, req.idToken)
                            .httpOnly(true)
                            .secure(cookieSecure)  // 운영 https: true
                            .path(cookiePath)
                            .maxAge(Duration.ofSeconds(maxAge));

                    // SameSite
                    String ss = (cookieSameSite == null) ? "Lax" : cookieSameSite.trim();
                    if (!ss.isEmpty()) {
                        // spring-web 6.x: 문자열로 설정 (None/Lax/Strict)
                        b = b.sameSite(capitalize(ss));
                    }
                    // Domain (선택)
                    if (cookieDomain != null && !cookieDomain.isBlank()) {
                        b = b.domain(cookieDomain.trim());
                    }

                    resp.addCookie(b.build());
                    // CORS에서 쿠키를 쓰는 경우, 핸드셰이크가 맞아야 함(게이트웨이 globalcors 설정 참고)
                    return ResponseEntity.noContent().build();
                })
                .onErrorResume(ex -> Mono.just(ResponseEntity.status(HttpStatus.UNAUTHORIZED).build()));
    }

    @GetMapping("/logout")
    public ResponseEntity<Void> logout(ServerHttpResponse resp) {
        ResponseCookie.ResponseCookieBuilder b = ResponseCookie.from(cookieName, "")
                .httpOnly(true)
                .secure(cookieSecure)
                .path(cookiePath)
                .maxAge(Duration.ZERO);

        String ss = (cookieSameSite == null) ? "Lax" : cookieSameSite.trim();
        if (!ss.isEmpty()) b = b.sameSite(capitalize(ss));
        if (cookieDomain != null && !cookieDomain.isBlank()) b = b.domain(cookieDomain.trim());

        resp.addCookie(b.build());
        return ResponseEntity.noContent().build();
    }

    /** 프론트 라우트가드/디버깅용: 인증되면 200, 아니면 401 */
    @GetMapping("/me")
    public Mono<ResponseEntity<?>> me(Mono<Authentication> authMono) {
        return authMono
                .map(auth -> {
                    if (auth instanceof JwtAuthenticationToken t) {
                        Jwt jwt = t.getToken();
                        Map<String, Object> body = new LinkedHashMap<>();
                        body.put("sub", jwt.getSubject());
                        body.put("exp", jwt.getExpiresAt());
                        body.put("claims", jwt.getClaims());
                        body.put("admin", isAdmin(jwt));
                        return ResponseEntity.ok(body);
                    }
                    return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
                })
                .defaultIfEmpty(ResponseEntity.status(HttpStatus.UNAUTHORIZED).build());
    }

    // -------- 내부 유틸 --------

    private boolean isAdmin(Jwt jwt) {
        // roles: ["ADMIN", ...]
        Object rolesObj = jwt.getClaims().get("roles");
        if (rolesObj instanceof Collection<?> c) {
            for (Object r : c) if ("ADMIN".equals(String.valueOf(r))) return true;
        }
        // admin: true
        Boolean admin = jwt.getClaim("admin");
        if (Boolean.TRUE.equals(admin)) return true;

        // Keycloak 호환
        Object realmAccess = jwt.getClaims().get("realm_access");
        if (realmAccess instanceof Map<?,?> m) {
            Object r = m.get("roles");
            if (r instanceof Collection<?> c) {
                for (Object v : c) if ("ADMIN".equals(String.valueOf(v))) return true;
            }
        }
        return false;
    }

    private long computeMaxAgeSeconds(Jwt jwt) {
        Instant now = Instant.now();
        Instant exp = jwt.getExpiresAt();
        long secondsLeft = (exp != null) ? Math.max(0, exp.getEpochSecond() - now.getEpochSecond()) : 0L;
        long cap = (cookieMaxAgeCap > 0 ? cookieMaxAgeCap : 3600L);
        return Math.max(60, Math.min(secondsLeft, cap)); // [60s, cap]
    }

    private static String capitalize(String v) {
        String s = v.trim().toLowerCase(Locale.ROOT);
        return switch (s) {
            case "none" -> "None";
            case "strict" -> "Strict";
            default -> "Lax";
        };
    }
}
