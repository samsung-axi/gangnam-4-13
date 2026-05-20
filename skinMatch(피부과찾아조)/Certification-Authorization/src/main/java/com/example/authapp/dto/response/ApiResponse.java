package com.example.authapp.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
@Schema(description = "API 응답")
public class ApiResponse<T> {
    
    @Schema(description = "성공 여부", example = "true")
    private boolean success;
    
    @Schema(description = "응답 메시지", example = "요청이 성공적으로 처리되었습니다.")
    private String message;
    
    @Schema(description = "응답 데이터")
    private T data;
    
    @Schema(description = "오류 메시지", example = "요청 처리 중 오류가 발생했습니다.")
    private String error;

    // 성공 응답
    public static <T> ApiResponse<T> success(T data) {
        return ApiResponse.<T>builder()
                .success(true)
                .data(data)
                .build();
    }

    public static <T> ApiResponse<T> success(String message, T data) {
        return ApiResponse.<T>builder()
                .success(true)
                .message(message)
                .data(data)
                .build();
    }

    public static ApiResponse<Void> success(String message) {
        return ApiResponse.<Void>builder()
                .success(true)
                .message(message)
                .build();
    }

    // 실패 응답
    public static <T> ApiResponse<T> failure(String error) {
        return ApiResponse.<T>builder()
                .success(false)
                .error(error)
                .build();
    }

    public static <T> ApiResponse<T> failure(String message, String error) {
        return ApiResponse.<T>builder()
                .success(false)
                .message(message)
                .error(error)
                .build();
    }
}