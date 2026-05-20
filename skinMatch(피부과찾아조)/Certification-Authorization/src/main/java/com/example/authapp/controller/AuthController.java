package com.example.authapp.controller;

import com.example.authapp.dto.request.LoginRequest;
import com.example.authapp.dto.request.SignupRequest;
import com.example.authapp.dto.request.TokenRequest;
import com.example.authapp.dto.response.ApiResponse;
import com.example.authapp.dto.response.LoginResponse;
import com.example.authapp.dto.response.TokenInfo;
import com.example.authapp.dto.response.UserProfileResponse;
import com.example.authapp.entity.User;
import com.example.authapp.service.AuthService;
import com.example.authapp.service.JwtService;
import com.example.authapp.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Tag(name = "Authentication", description = "사용자 인증 관련 API")
public class AuthController {

    private final AuthService authService;
    private final JwtService jwtService;
    private final UserService userService;

    @Operation(
        summary = "일반 회원가입",
        description = "이메일과 비밀번호를 사용한 회원가입"
    )
    @ApiResponses(value = {
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "회원가입 성공",
            content = @Content(schema = @Schema(implementation = ApiResponse.class))),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "회원가입 실패",
            content = @Content(schema = @Schema(implementation = ApiResponse.class)))
    })
    @PostMapping("/signup")
    public ResponseEntity<ApiResponse<UserProfileResponse>> signup(
        @io.swagger.v3.oas.annotations.parameters.RequestBody(
            description = "회원가입 정보",
            content = @Content(
                schema = @Schema(implementation = SignupRequest.class),
                examples = @ExampleObject(
                    name = "회원가입 예시",
                    value = "{\n" +
                           "  \"username\": \"홍길동\",\n" +
                           "  \"email\": \"user@example.com\",\n" +
                           "  \"password\": \"password123\",\n" +
                           "  \"confirmPassword\": \"password123\",\n" +
                           "  \"address\": \"서울특별시 강남구\"\n" +
                           "}"
                )
            )
        )
        @Valid @RequestBody SignupRequest request) {
        try {
            User user = authService.signup(request);
            UserProfileResponse userProfile = UserProfileResponse.from(user);
            return ResponseEntity.ok(ApiResponse.success("회원가입이 완료되었습니다.", userProfile));
        } catch (Exception e) {
            log.error("Signup failed: {}", e.getMessage());
            return ResponseEntity.badRequest()
                    .body(ApiResponse.failure("회원가입에 실패했습니다.", e.getMessage()));
        }
    }

    @Operation(
        summary = "일반 로그인",
        description = "이메일과 비밀번호를 사용한 로그인"
    )
    @ApiResponses(value = {
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "로그인 성공",
            content = @Content(schema = @Schema(implementation = LoginResponse.class))),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "로그인 실패",
            content = @Content(schema = @Schema(implementation = ApiResponse.class)))
    })
    @PostMapping("/login")
    public ResponseEntity<ApiResponse<LoginResponse>> login(
        @io.swagger.v3.oas.annotations.parameters.RequestBody(
            description = "로그인 정보",
            content = @Content(
                schema = @Schema(implementation = LoginRequest.class),
                examples = @ExampleObject(
                    name = "로그인 예시",
                    value = "{\n" +
                           "  \"loginId\": \"user123 또는 user@example.com\",\n" +
                           "  \"password\": \"password123\"\n" +
                           "}"
                )
            )
        )
        @Valid @RequestBody LoginRequest request) {
        try {
            LoginResponse loginResponse = authService.regularLogin(request);
            return ResponseEntity.ok(ApiResponse.success("로그인이 완료되었습니다.", loginResponse));
        } catch (Exception e) {
            log.error("Login failed: {}", e.getMessage());
            return ResponseEntity.badRequest()
                    .body(ApiResponse.failure("로그인에 실패했습니다.", e.getMessage()));
        }
    }

    @Operation(
        summary = "토큰 재발급",
        description = "리프레시 토큰을 사용하여 새로운 액세스 토큰 발급"
    )
    @ApiResponses(value = {
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "토큰 재발급 성공",
            content = @Content(schema = @Schema(implementation = TokenInfo.class))),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "토큰 재발급 실패",
            content = @Content(schema = @Schema(implementation = ApiResponse.class)))
    })
    @PostMapping("/refresh")
    public ResponseEntity<ApiResponse<TokenInfo>> refreshToken(
        @io.swagger.v3.oas.annotations.parameters.RequestBody(
            description = "리프레시 토큰",
            content = @Content(
                schema = @Schema(implementation = TokenRequest.class),
                examples = @ExampleObject(
                    name = "토큰 재발급 예시",
                    value = "{\n" +
                           "  \"refreshToken\": \"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...\"\n" +
                           "}"
                )
            )
        )
        @Valid @RequestBody TokenRequest tokenRequest) {
        try {
            TokenInfo tokenInfo = authService.refreshToken(tokenRequest.getRefreshToken());
            return ResponseEntity.ok(ApiResponse.success("토큰이 재발급되었습니다.", tokenInfo));
        } catch (Exception e) {
            log.error("Token refresh failed: {}", e.getMessage());
            return ResponseEntity.badRequest()
                    .body(ApiResponse.failure("토큰 재발급에 실패했습니다.", e.getMessage()));
        }
    }

    @Operation(
        summary = "로그아웃",
        description = "리프레시 토큰을 무효화하여 로그아웃"
    )
    @ApiResponses(value = {
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "로그아웃 성공"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "로그아웃 실패")
    })
    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<Void>> logout(
        @io.swagger.v3.oas.annotations.parameters.RequestBody(
            description = "리프레시 토큰",
            content = @Content(schema = @Schema(implementation = TokenRequest.class))
        )
        @Valid @RequestBody TokenRequest tokenRequest) {
        try {
            authService.logout(tokenRequest.getRefreshToken());
            return ResponseEntity.ok(ApiResponse.success("로그아웃되었습니다."));
        } catch (Exception e) {
            log.error("Logout failed: {}", e.getMessage());
            return ResponseEntity.badRequest()
                    .body(ApiResponse.failure("로그아웃에 실패했습니다.", e.getMessage()));
        }
    }

    @Operation(
        summary = "현재 사용자 정보 조회",
        description = "JWT 토큰으로 인증된 사용자의 정보 조회",
        security = @SecurityRequirement(name = "JWT")
    )
    @ApiResponses(value = {
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "사용자 정보 조회 성공",
            content = @Content(schema = @Schema(implementation = UserProfileResponse.class))),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "인증 실패"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "조회 실패")
    })
    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserProfileResponse>> getCurrentUser(
            @Parameter(hidden = true) @AuthenticationPrincipal User user) {
        try {
            UserProfileResponse userProfile = UserProfileResponse.from(user);
            return ResponseEntity.ok(ApiResponse.success(userProfile));
        } catch (Exception e) {
            log.error("Get current user failed: {}", e.getMessage());
            return ResponseEntity.badRequest()
                    .body(ApiResponse.failure("사용자 정보 조회에 실패했습니다.", e.getMessage()));
        }
    }

    @Operation(
        summary = "토큰 유효성 검증",
        description = "JWT 토큰의 유효성을 검증"
    )
    @ApiResponses(value = {
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "토큰 검증 완료")
    })
    @PostMapping("/validate")
    public ResponseEntity<ApiResponse<Boolean>> validateToken(
        @Parameter(description = "HTTP 요청", hidden = true) HttpServletRequest request) {
        try {
            String authHeader = request.getHeader("Authorization");
            String token = jwtService.extractTokenFromHeader(authHeader);
            
            if (token == null) {
                return ResponseEntity.ok(ApiResponse.success("토큰이 없습니다.", false));
            }
            
            boolean isValid = authService.validateToken(token);
            return ResponseEntity.ok(ApiResponse.success("토큰 검증 완료", isValid));
        } catch (Exception e) {
            log.error("Token validation failed: {}", e.getMessage());
            return ResponseEntity.ok(ApiResponse.success("토큰이 유효하지 않습니다.", false));
        }
    }

    @Operation(
        summary = "OAuth 로그인 링크 제공",
        description = "지정된 제공자의 OAuth 로그인 URL 반환"
    )
    @ApiResponses(value = {
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "OAuth URL 생성 성공")
    })
    @GetMapping("/oauth/{provider}")
    public ResponseEntity<ApiResponse<String>> getOAuthLoginUrl(
        @Parameter(description = "OAuth 제공자 (google, naver)", example = "google")
        @PathVariable String provider) {
        String loginUrl = "/oauth2/authorization/" + provider.toLowerCase();
        return ResponseEntity.ok(ApiResponse.success(provider + " 로그인 URL", loginUrl));
    }
}
