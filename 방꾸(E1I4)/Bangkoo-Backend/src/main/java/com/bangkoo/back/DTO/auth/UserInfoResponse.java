package com.bangkoo.back.dto.auth;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserInfoResponse {
    /**
     * 사용자 정보 응답 DTO
     */

    private String email;
    private String nickname;
    private String role;
}
