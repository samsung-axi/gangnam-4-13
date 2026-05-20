package com.example.authapp.controller;

import com.example.authapp.dto.response.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/oauth")
@RequiredArgsConstructor
@Tag(name = "OAuth Authentication", description = "소셜 로그인 관련 API")
public class OAuthController {

    @Operation(
        summary = "OAuth 로그인 URL 제공",
        description = "지정된 OAuth 제공자의 로그인 URL을 반환합니다."
    )
    @ApiResponses(value = {
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "OAuth URL 생성 성공",
            content = @Content(
                schema = @Schema(implementation = ApiResponse.class),
                examples = @ExampleObject(
                    name = "Google OAuth URL 응답",
                    value = "{\n" +
                           "  \"success\": true,\n" +
                           "  \"message\": \"google OAuth URL\",\n" +
                           "  \"data\": {\n" +
                           "    \"provider\": \"google\",\n" +
                           "    \"loginUrl\": \"http://localhost:8081/oauth2/authorization/google\",\n" +
                           "    \"url\": \"http://localhost:8081/oauth2/authorization/google\"\n" +
                           "  }\n" +
                           "}"
                )
            )),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "OAuth URL 생성 실패")
    })
    @GetMapping("/url/{provider}")
    public ResponseEntity<ApiResponse<Map<String, String>>> getOAuthUrl(
        @Parameter(
            description = "OAuth 제공자", 
            example = "google",
            schema = @Schema(allowableValues = {"google", "naver"})
        )
        @PathVariable String provider) {
        try {
            String baseUrl = "http://localhost:8081";  // 올바른 포트로 수정
            String loginUrl = baseUrl + "/oauth2/authorization/" + provider.toLowerCase();
            
            Map<String, String> response = new HashMap<>();
            response.put("provider", provider.toLowerCase());
            response.put("loginUrl", loginUrl);
            response.put("url", loginUrl);  // 프론트엔드에서 기대하는 필드 추가
            
            log.info("OAuth URL requested for provider: {}", provider);
            
            return ResponseEntity.ok(
                ApiResponse.success(provider + " OAuth URL", response)
            );
        } catch (Exception e) {
            log.error("Error getting OAuth URL for provider: {}", provider, e);
            return ResponseEntity.badRequest()
                    .body(ApiResponse.failure("OAuth URL 생성에 실패했습니다.", e.getMessage()));
        }
    }

    @Operation(
        summary = "지원하는 OAuth 제공자 목록",
        description = "현재 지원하는 모든 OAuth 제공자의 목록과 정보를 반환합니다."
    )
    @ApiResponses(value = {
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "OAuth 제공자 목록 조회 성공",
            content = @Content(
                schema = @Schema(implementation = ApiResponse.class),
                examples = @ExampleObject(
                    name = "OAuth 제공자 목록 응답",
                    value = "{\n" +
                           "  \"success\": true,\n" +
                           "  \"message\": \"지원하는 OAuth 제공자 목록\",\n" +
                           "  \"data\": {\n" +
                           "    \"google\": {\n" +
                           "      \"name\": \"Google\",\n" +
                           "      \"url\": \"/api/oauth/url/google\",\n" +
                           "      \"available\": \"true\"\n" +
                           "    },\n" +
                           "    \"naver\": {\n" +
                           "      \"name\": \"Naver\",\n" +
                           "      \"url\": \"/api/oauth/url/naver\",\n" +
                           "      \"available\": \"true\"\n" +
                           "    }\n" +
                           "  }\n" +
                           "}"
                )
            ))
    })
    @GetMapping("/providers")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getOAuthProviders() {
        Map<String, Object> providers = new HashMap<>();
        
        // Google
        Map<String, String> google = new HashMap<>();
        google.put("name", "Google");
        google.put("url", "/api/oauth/url/google");
        google.put("available", "true");
        
        // Naver
        Map<String, String> naver = new HashMap<>();
        naver.put("name", "Naver");
        naver.put("url", "/api/oauth/url/naver");
        naver.put("available", "true");
        
        providers.put("google", google);
        providers.put("naver", naver);
        
        return ResponseEntity.ok(
            ApiResponse.success("지원하는 OAuth 제공자 목록", providers)
        );
    }
}
