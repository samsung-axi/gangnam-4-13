package com.example.authapp.exception;

import com.example.authapp.dto.response.ApiResponse;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.security.SecurityException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.validation.BindException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.servlet.NoHandlerFoundException;
import org.springframework.web.servlet.resource.NoResourceFoundException;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    /**
     * JWT 토큰 만료 예외
     */
    @ExceptionHandler(ExpiredJwtException.class)
    public ResponseEntity<ApiResponse<Void>> handleExpiredJwtException(ExpiredJwtException e) {
        log.warn("JWT token expired: {}", e.getMessage());
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(ApiResponse.failure("토큰이 만료되었습니다.", "EXPIRED_TOKEN"));
    }

    /**
     * JWT 토큰 형식 오류 예외
     */
    @ExceptionHandler({MalformedJwtException.class, SecurityException.class})
    public ResponseEntity<ApiResponse<Void>> handleInvalidJwtException(Exception e) {
        log.warn("Invalid JWT token: {}", e.getMessage());
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(ApiResponse.failure("유효하지 않은 토큰입니다.", "INVALID_TOKEN"));
    }

    /**
     * 인증 예외
     */
    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<ApiResponse<Void>> handleAuthenticationException(AuthenticationException e) {
        log.warn("Authentication failed: {}", e.getMessage());
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(ApiResponse.failure("인증에 실패했습니다.", "AUTHENTICATION_FAILED"));
    }

    /**
     * 권한 예외
     */
    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ApiResponse<Void>> handleAccessDeniedException(AccessDeniedException e) {
        log.warn("Access denied: {}", e.getMessage());
        return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(ApiResponse.failure("접근 권한이 없습니다.", "ACCESS_DENIED"));
    }

    /**
     * 유효성 검사 예외
     */
    @ExceptionHandler({MethodArgumentNotValidException.class, BindException.class})
    public ResponseEntity<ApiResponse<Void>> handleValidationException(Exception e) {
        log.warn("Validation failed: {}", e.getMessage());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(ApiResponse.failure("입력값이 올바르지 않습니다.", "VALIDATION_FAILED"));
    }

    /**
     * 정적 리소스 찾을 수 없음 예외 (조용히 처리)
     */
    @ExceptionHandler({NoResourceFoundException.class, NoHandlerFoundException.class})
    public ResponseEntity<Void> handleResourceNotFoundException(Exception e) {
        // 정적 리소스 요청은 로그 레벨을 낮춤 (favicon.ico, 이미지 등)
        log.debug("Resource not found: {}", e.getMessage());
        return ResponseEntity.notFound().build();
    }

    /**
     * 런타임 예외
     */
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<ApiResponse<Void>> handleRuntimeException(RuntimeException e) {
        log.error("Runtime exception occurred: {}", e.getMessage(), e);
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(ApiResponse.failure(e.getMessage(), "RUNTIME_ERROR"));
    }

    /**
     * 일반 예외
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<Void>> handleException(Exception e) {
        log.error("Unexpected exception occurred: {}", e.getMessage(), e);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.failure("서버 오류가 발생했습니다.", "INTERNAL_SERVER_ERROR"));
    }
}
