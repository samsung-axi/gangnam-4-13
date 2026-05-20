package com.example.authapp.dto.response;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class TokenInfo {
    private String accessToken;
    private String refreshToken;
    private Long accessTokenExpiresIn;
    private Long refreshTokenExpiresIn;

    public static TokenInfo of(String accessToken, String refreshToken,
                               Long accessTokenExpiresIn, Long refreshTokenExpiresIn) {
        return TokenInfo.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .accessTokenExpiresIn(accessTokenExpiresIn)
                .refreshTokenExpiresIn(refreshTokenExpiresIn)
                .build();
    }
}