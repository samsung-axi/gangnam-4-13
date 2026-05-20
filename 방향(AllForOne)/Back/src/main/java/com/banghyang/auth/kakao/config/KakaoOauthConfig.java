package com.banghyang.auth.kakao.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

// 상수값들을 저장해놓은 properties 파일에서 값들을 가져오는 클래스
@ConfigurationProperties(prefix = "oauth.kakao")
public record KakaoOauthConfig(
        String redirectUri,
        String clientId,
        String clientSecret,
        String[] scope
) {
}