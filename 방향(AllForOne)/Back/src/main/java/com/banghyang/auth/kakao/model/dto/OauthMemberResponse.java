package com.banghyang.auth.kakao.model.dto;

import com.banghyang.member.entity.Member;

public record OauthMemberResponse(
        Long id,
        String name,
        String email,
        String birthyear,
        String gender,
        String role
) {
    public static OauthMemberResponse from(Member member) {
        return new OauthMemberResponse(
                member.getId(),
                member.getName(),
                member.getEmail(),
                member.getBirthyear(),
                member.getGender(),
                member.getRole().name()
        );
    }
}
