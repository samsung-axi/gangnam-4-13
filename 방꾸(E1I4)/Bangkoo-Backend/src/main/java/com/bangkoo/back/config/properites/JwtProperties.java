package com.bangkoo.back.config.properites;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Primary;


@Getter
@Setter
@Primary
@ConfigurationProperties(prefix = "jwt")
public class JwtProperties {

    /**
     * Base64 인코딩된 secret key
     * 예: echo -n 'your-256-bit-secret' | base64
     */
    private String secretKey;

    private Long accessTokenExpirationMs;
    private Long refreshTokenExpirationMs;

}
