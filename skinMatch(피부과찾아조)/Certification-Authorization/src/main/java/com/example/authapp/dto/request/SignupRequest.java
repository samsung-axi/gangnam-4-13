package com.example.authapp.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Schema(description = "회원가입 요청")
public class SignupRequest {
    
    @Schema(description = "사용자 아이디", example = "user123", requiredMode = Schema.RequiredMode.REQUIRED)
    @NotBlank(message = "아이디를 입력해주세요")
    @Size(min = 3, max = 20, message = "아이디는 3-20자 사이여야 합니다")
    private String username;
    
    @Schema(description = "닉네임 (선택사항)", example = "홍길동")
    @Size(max = 20, message = "닉네임은 20자 이하여야 합니다")
    private String nickname;
    
    @Schema(description = "이메일 주소", example = "user@example.com", requiredMode = Schema.RequiredMode.REQUIRED)
    @NotBlank(message = "이메일을 입력해주세요")
    @Email(message = "올바른 이메일 형식이 아닙니다")
    private String email;
    
    @Schema(description = "비밀번호", example = "password123", requiredMode = Schema.RequiredMode.REQUIRED)
    @NotBlank(message = "비밀번호를 입력해주세요")
    @Size(min = 6, max = 50, message = "비밀번호는 6-50자 사이여야 합니다")
    private String password;
    
    @Schema(description = "비밀번호 확인", example = "password123", requiredMode = Schema.RequiredMode.REQUIRED)
    @NotBlank(message = "비밀번호 확인을 입력해주세요")
    private String confirmPassword;
    
    @Schema(description = "주소", example = "서울특별시 강남구")
    private String address;
}