package com.example.authapp.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Schema(description = "로그인 요청")
public class LoginRequest {
    
    @Schema(description = "사용자 아이디 또는 이메일", example = "user123 또는 user@example.com", requiredMode = Schema.RequiredMode.REQUIRED)
    @NotBlank(message = "아이디 또는 이메일을 입력해주세요")
    private String loginId;
    
    @Schema(description = "사용자 비밀번호", example = "password123", requiredMode = Schema.RequiredMode.REQUIRED)
    @NotBlank(message = "비밀번호를 입력해주세요")
    private String password;
}