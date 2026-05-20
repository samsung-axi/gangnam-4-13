package com.banghyang.auth.kakao.model.dto;

import com.banghyang.member.entity.Member;
import com.fasterxml.jackson.databind.PropertyNamingStrategies;
import com.fasterxml.jackson.databind.annotation.JsonNaming;

import java.time.LocalDateTime;

import static com.banghyang.common.type.OauthServerType.KAKAO;

@JsonNaming(PropertyNamingStrategies.SnakeCaseStrategy.class)
public record KakaoMemberResponse(
        Long id,
        boolean hasSignedUp,
        LocalDateTime connectedAt,
        KakaoAccount kakaoAccount
) {

    public Member toEntity() {
        return Member.builder()
                .oauthId(new OauthId(String.valueOf(id), KAKAO))
                .name(kakaoAccount.name)
                .email(kakaoAccount.email)
                .birthyear(kakaoAccount.birthyear)
                .gender(kakaoAccount.gender)
                .build();
    }

    @JsonNaming(PropertyNamingStrategies.SnakeCaseStrategy.class)
    public record KakaoAccount(
            boolean nameNeedsAgreement,
            String name, // 이름
            boolean emailNeedsAgreement,
            boolean isEmailValid, // 이메일 유효 여부
            boolean isEmailVerified, // 이메일 인증 여부
            String email, // 이메일
            boolean birthyearNeedsAgreement,
            String birthyear, // 출생연도
            boolean genderNeedsAgreement,
            String gender // 성별
    ) {
    }
}
