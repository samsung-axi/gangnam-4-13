package com.banghyang.auth.kakao.controller;

import com.banghyang.auth.kakao.service.KakaoService;
import com.banghyang.auth.kakao.model.dto.OauthMemberResponse;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RequestMapping("/kakao")
@RestController
@RequiredArgsConstructor
public class KakaoController {

    private final KakaoService kakaoService;

    /**
     * KakaoAuthCode 발급받는 URL 로 리다이렉트 시키는 메소드
     */
    @SneakyThrows
    @GetMapping("/login")
    ResponseEntity<Void> redirectAuthCodeRequestUri(HttpServletResponse response) {
        String redirectUrl = kakaoService.getKakaoAuthCodeRequestUrl();
        response.sendRedirect(redirectUrl);
        return ResponseEntity.ok().build();
    }

    /**
     * authCode 로 AccessToken 을 발급받고 발급받은 토큰으로 사용자 정보를 가져와서 저장하는 메소드
     * @param authCode
     * @return
     */
    @GetMapping("/login/callback")
    ResponseEntity<OauthMemberResponse> kakaoLogin(@RequestParam("code") String authCode) {
        OauthMemberResponse loginMember = kakaoService.createOauthMemberFromKakao(authCode);
        return ResponseEntity.ok(loginMember);
    }
}
