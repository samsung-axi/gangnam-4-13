package com.bangkoo.back.config.properites;

import lombok.Getter;
import lombok.Setter;
import lombok.Value;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Getter
@Setter
@ConfigurationProperties(prefix = "kakao")
public class SocialOAuthProperties {

    /**
     *
     * 카카오 클라이언트 아이디, 시크릿, 리다이렉트 값 가져오는 곳
     */

    private String clientId;
    private String clientSecret;
    private String redirectUri;
}
