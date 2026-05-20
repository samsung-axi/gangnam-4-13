package com.bangkoo.back.controller.auth;

import com.bangkoo.back.service.auth.SocialOAuthService;
import com.bangkoo.back.dto.jwt.TokenResponseDTO;
import com.bangkoo.back.utils.JwtUtil;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Map;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    /*
    *카카오 로그인엔 대한 컨트롤러
    *
     */

    private final SocialOAuthService socialOAuthService;
    private final JwtUtil jwtUtil;

//    @Value("${kakao.client-id}")
    @Value("${security.oauth2.client.registration.kakao.client-id}")
    private String kakaoClientId;

    @Value("${kakao.redirect-uri}")
    private String kakaoRedirectUri;

    // 1. 프론트에서 카카오 로그인 URL 요청 시
    @GetMapping("/kakao/login")
    public ResponseEntity<?> kakaoLogin() {

        String kakaoAuthUrl = "https://kauth.kakao.com/oauth/authorize?" +
                "client_id=" + kakaoClientId +
                "&redirect_uri=" + kakaoRedirectUri +
                "&response_type=code";

        return ResponseEntity.ok(Map.of("url", kakaoAuthUrl));
    }

    // 2. 카카오 인가 코드 받은 후 JWT 발급 및 쿠키 설정
    @PostMapping("/callback/kakao")
    public ResponseEntity<?> callback(@RequestParam("code") String code,
                                      HttpServletResponse response) {
        try {

            TokenResponseDTO tokenDto = socialOAuthService.kakaoLogin(code);

            // JWT → HttpOnly 쿠키로 저장
            ResponseCookie accessTokenCookie = ResponseCookie.from("accessToken", tokenDto.getAccessToken())
                    .httpOnly(true)
                    .secure(true)
                    .path("/")
                    .maxAge(60 * 60) // 1시간
                    .sameSite("Lax")
                    .build();

            // 닉네임 → 일반 쿠키로 저장 (✅ 한글 인코딩 처리 필수)
            String encodedNickname = URLEncoder.encode(tokenDto.getNickname(), StandardCharsets.UTF_8);
            ResponseCookie nicknameCookie = ResponseCookie.from("nickname", encodedNickname)
                    .httpOnly(false)
                    .secure(true)
                    .path("/")
                    .maxAge(60 * 60)
                    .sameSite("Lax")
                    .build();

            // role도 함께 쿠키로 저장 (optional)
            String encodedRole = URLEncoder.encode(tokenDto.getRole(), StandardCharsets.UTF_8);
            ResponseCookie roleCookie = ResponseCookie.from("role", encodedRole)
                    .httpOnly(false)
                    .secure(true)
                    .path("/")
                    .maxAge(60 * 60)
                    .sameSite("Lax")
                    .build();

            response.addHeader(HttpHeaders.SET_COOKIE, accessTokenCookie.toString());
            response.addHeader(HttpHeaders.SET_COOKIE, nicknameCookie.toString());
            response.addHeader(HttpHeaders.SET_COOKIE, roleCookie.toString());

            // 응답 DTO에서 accessToken 제거 후 반환
            tokenDto.setAccessToken(null);
            tokenDto.setLogin(true);

            return ResponseEntity.ok(tokenDto);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity
                    .badRequest()
                    .body(Map.of("error", e.getMessage()));
        }
    }

    // 3. 로그아웃
    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletResponse response) {
        ResponseCookie deleteAccessToken = ResponseCookie.from("accessToken", "")
                .httpOnly(true)
                .secure(false)
                .path("/")
                .maxAge(0)
                .sameSite("Lax")
                .build();

        ResponseCookie deleteNickname = ResponseCookie.from("nickname", "")
                .httpOnly(false)
                .secure(false)
                .path("/")
                .maxAge(0)
                .sameSite("Lax")
                .build();

        ResponseCookie deleteRole = ResponseCookie.from("role", "")
                .httpOnly(false)
                .secure(false)
                .path("/")
                .maxAge(0)
                .sameSite("Lax")
                .build();
        response.addHeader(HttpHeaders.SET_COOKIE, deleteAccessToken.toString());
        response.addHeader(HttpHeaders.SET_COOKIE, deleteNickname.toString());
        response.addHeader(HttpHeaders.SET_COOKIE, deleteRole.toString());

        return ResponseEntity.ok(Map.of("message", "로그아웃 완료"));
    }


}
