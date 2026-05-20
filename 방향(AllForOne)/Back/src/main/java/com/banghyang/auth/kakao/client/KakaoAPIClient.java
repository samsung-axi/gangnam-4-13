package com.banghyang.auth.kakao.client;

import com.banghyang.auth.kakao.model.dto.KakaoMemberResponse;
import com.banghyang.auth.kakao.model.dto.KakaoToken;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.service.annotation.GetExchange;
import org.springframework.web.service.annotation.PostExchange;

import static org.springframework.http.HttpHeaders.AUTHORIZATION;
import static org.springframework.http.MediaType.APPLICATION_FORM_URLENCODED_VALUE;

public interface KakaoAPIClient {

    // AuthCode 로 AccessToken 발급받는 클라이언트
    @PostExchange(url = "https://kauth.kakao.com/oauth/token", contentType = APPLICATION_FORM_URLENCODED_VALUE)
    KakaoToken getToken(
            @RequestParam("grant_type") String grantType,
            @RequestParam("client_id") String clientId,
            @RequestParam("redirect_uri") String redirectUri,
            @RequestParam("code") String code,
            @RequestParam("client_secret") String clientSecret
    );

    // 사용자 정보 받는 클라이언트
    @GetExchange(url = "https://kapi.kakao.com/v2/user/me")
    KakaoMemberResponse getKakaoMember(@RequestHeader(name = AUTHORIZATION) String bearerToken);
}
