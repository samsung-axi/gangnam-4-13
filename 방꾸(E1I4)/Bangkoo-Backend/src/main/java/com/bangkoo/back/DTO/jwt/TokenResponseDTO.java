package com.bangkoo.back.dto.jwt;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TokenResponseDTO {

    /**
     * 카카오 로그인 후 클라이언트에게 반환되는
     * 정보들 중
     * 엑세스 토큰, 리프레쉬 토큰, 이메일, 닉네임, 로그인 유무
     */

    private String accessToken;
    private String refreshToken;
    private String email;
    private String nickname;
    private String role;
    private boolean login;

    // role 값이 null이거나 빈 값일 경우 기본값 설정
    public void setRole(String role) {
        if (role == null || role.trim().isEmpty()) {
            this.role = "user"; // 기본값 설정 (필요시 다른 값으로 설정 가능)
        } else {
            this.role = role;
        }
    }

    @Override
    public String toString() {
        return "TokenResponseDTO{" +
                "accessToken='" + accessToken + '\'' +
                ", refreshToken='" + refreshToken + '\'' +
                ", email='" + email + '\'' +
                ", nickname='" + nickname + '\'' +

                ", role='" + role + '\'' +
                ", login=" + login +
                '}';
    }
}
