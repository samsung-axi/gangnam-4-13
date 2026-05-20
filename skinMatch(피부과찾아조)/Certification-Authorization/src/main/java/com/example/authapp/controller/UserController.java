package com.example.authapp.controller;

import com.example.authapp.dto.request.UpdateProfileRequest;
import com.example.authapp.dto.response.ApiResponse;
import com.example.authapp.dto.response.UserProfileResponse;
import com.example.authapp.entity.User;
import com.example.authapp.service.FileUploadService;
import com.example.authapp.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@Slf4j
@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@Tag(name = "User Management", description = "사용자 관리 관련 API")
@SecurityRequirement(name = "JWT")
public class UserController {

    private final UserService userService;
    private final FileUploadService fileUploadService;

    @Operation(
        summary = "사용자 프로필 조회",
        description = "현재 로그인한 사용자의 프로필 정보 조회"
    )
    @ApiResponses(value = {
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "프로필 조회 성공",
            content = @Content(schema = @Schema(implementation = UserProfileResponse.class))),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "인증 실패"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "조회 실패")
    })
    @GetMapping("/profile")
    public ResponseEntity<ApiResponse<UserProfileResponse>> getProfile(
            @Parameter(hidden = true) @AuthenticationPrincipal User user) {
        try {
            log.info("=== 프로필 조회 ===");
            log.info("사용자 ID: {}", user.getId());
            log.info("사용자 이메일: {}", user.getEmail());
            log.info("사용자 username: {}", user.getUsername());
            log.info("사용자 닉네임: {}", user.getNickname());
            log.info("사용자 provider: {}", user.getProvider());
            
            UserProfileResponse profile = UserProfileResponse.from(user);
            log.info("응답 닉네임: {}", profile.getNickname());
            
            return ResponseEntity.ok(ApiResponse.success(profile));
        } catch (Exception e) {
            log.error("Get user profile failed: {}", e.getMessage());
            return ResponseEntity.badRequest()
                    .body(ApiResponse.failure("프로필 조회에 실패했습니다.", e.getMessage()));
        }
    }

    @Operation(
        summary = "특정 사용자 프로필 조회",
        description = "사용자 ID로 특정 사용자의 프로필 조회 (관리자용)"
    )
    @ApiResponses(value = {
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "사용자 조회 성공",
            content = @Content(schema = @Schema(implementation = UserProfileResponse.class))),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "사용자를 찾을 수 없음"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "인증 실패")
    })
    @GetMapping("/{userId}")
    public ResponseEntity<ApiResponse<UserProfileResponse>> getUserById(
        @Parameter(description = "사용자 ID", example = "1")
        @PathVariable Long userId) {
        try {
            User user = userService.findById(userId)
                    .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));
            
            UserProfileResponse profile = UserProfileResponse.from(user);
            return ResponseEntity.ok(ApiResponse.success(profile));
        } catch (Exception e) {
            log.error("Get user by id failed: {}", e.getMessage());
            return ResponseEntity.badRequest()
                    .body(ApiResponse.failure("사용자 조회에 실패했습니다.", e.getMessage()));
        }
    }

    @Operation(
        summary = "사용자 프로필 업데이트",
        description = "사용자의 전체 프로필 정보 업데이트 (파일 업로드 지원)"
    )
    @ApiResponses(value = {
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "프로필 업데이트 성공",
            content = @Content(schema = @Schema(implementation = UserProfileResponse.class))),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "인증 실패"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "업데이트 실패")
    })
    @PutMapping(value = "/profile", consumes = {"multipart/form-data"})
    public ResponseEntity<ApiResponse<UserProfileResponse>> updateProfile(
            @Parameter(hidden = true) @AuthenticationPrincipal User user,
            @Parameter(description = "사용자 이름") @RequestParam(required = false) String name,
            @Parameter(description = "닉네임") @RequestParam(required = false) String nickname,
            @Parameter(description = "성별") @RequestParam(required = false) String gender,
            @Parameter(description = "출생년도") @RequestParam(required = false) String birthYear,
            @Parameter(description = "국적") @RequestParam(required = false) String nationality,
            @Parameter(description = "프로필 이미지 파일") @RequestParam(required = false) MultipartFile profileImage) {
        try {
            // UpdateProfileRequest 생성
            UpdateProfileRequest request = new UpdateProfileRequest();
            request.setName(name);
            request.setNickname(nickname);
            request.setGender(gender);
            request.setBirthYear(birthYear);
            request.setNationality(nationality);
            
            // 프로필 이미지 업로드 처리
            if (profileImage != null && !profileImage.isEmpty()) {
                log.info("=== 프로필 이미지 업로드 시작 ===");
                log.info("파일명: {}", profileImage.getOriginalFilename());
                log.info("파일 크기: {} bytes", profileImage.getSize());
                log.info("컨텐츠 타입: {}", profileImage.getContentType());
                
                // 기존 이미지 삭제
                if (user.getProfileImage() != null) {
                    log.info("기존 이미지 삭제: {}", user.getProfileImage());
                    fileUploadService.deleteFile(user.getProfileImage());
                }
                
                try {
                    // 새 이미지 업로드
                    String imageUrl = fileUploadService.uploadProfileImage(profileImage);
                    request.setProfileImage(imageUrl);
                    
                    log.info("=== 프로필 이미지 업로드 완료 ===");
                    log.info("업로드된 이미지 URL: {}", imageUrl);
                } catch (Exception e) {
                    log.error("프로필 이미지 업로드 실패: {}", e.getMessage(), e);
                    throw new RuntimeException("프로필 이미지 업로드에 실패했습니다: " + e.getMessage());
                }
            } else {
                log.info("프로필 이미지 파일이 없음");
            }
            
            User updatedUser = userService.updateUserProfile(user.getId(), request);
            
            log.info("=== 프로필 업데이트 완료 후 확인 ===");
            log.info("업데이트된 사용자 프로필 이미지: {}", updatedUser.getProfileImage());
            
            UserProfileResponse profile = UserProfileResponse.from(updatedUser);
            log.info("응답에 포함될 프로필 이미지: {}", profile.getProfileImage());
            log.info("응답에 포함될 프로필 이미지 URL: {}", profile.getProfileImageUrl());
            
            return ResponseEntity.ok(ApiResponse.success("프로필이 업데이트되었습니다.", profile));
        } catch (Exception e) {
            log.error("Update user profile failed: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(ApiResponse.failure("프로필 업데이트에 실패했습니다.", e.getMessage()));
        }
    }

    @Operation(
        summary = "사용자 기본 정보 업데이트",
        description = "사용자의 기본 정보만 업데이트 (이름, 프로필 이미지)"
    )
    @ApiResponses(value = {
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "기본 정보 업데이트 성공",
            content = @Content(schema = @Schema(implementation = UserProfileResponse.class))),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "인증 실패"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "업데이트 실패")
    })
    @PutMapping("/profile/basic")
    public ResponseEntity<ApiResponse<UserProfileResponse>> updateBasicProfile(
            @Parameter(hidden = true) @AuthenticationPrincipal User user,
            @Parameter(description = "사용자 이름", example = "홍길동")
            @RequestParam(required = false) String name,
            @Parameter(description = "프로필 이미지 URL", example = "https://example.com/profile.jpg")
            @RequestParam(required = false) String profileImage) {
        try {
            User updatedUser = userService.updateUser(
                    user.getId(),
                    name != null ? name : user.getName(),
                    profileImage != null ? profileImage : user.getProfileImage()
            );
            
            UserProfileResponse profile = UserProfileResponse.from(updatedUser);
            return ResponseEntity.ok(ApiResponse.success("프로필이 업데이트되었습니다.", profile));
        } catch (Exception e) {
            log.error("Update user profile failed: {}", e.getMessage());
            return ResponseEntity.badRequest()
                    .body(ApiResponse.failure("프로필 업데이트에 실패했습니다.", e.getMessage()));
        }
    }
}
