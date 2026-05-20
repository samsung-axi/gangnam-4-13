package com.example.authapp.dto.request;

import lombok.Data;
import jakarta.validation.constraints.NotBlank;

@Data
public class UpdateRoleRequest {
    @NotBlank(message = "역할은 필수입니다")
    private String role;
}
