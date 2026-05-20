package com.example.authapp.controller;

import com.example.authapp.dto.request.UserSearchRequest;
import com.example.authapp.dto.response.AdminStatsResponse;
import com.example.authapp.dto.response.ApiResponse;
import com.example.authapp.dto.response.UserProfileResponse;
import com.example.authapp.service.AdminService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/admin")
@Tag(name = "Admin", description = "관리자 API")
@SecurityRequirement(name = "bearerAuth")
public class AdminController {

    private final AdminService adminService;

    @Operation(summary = "관리자 통계 조회")
    @GetMapping("/stats")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<AdminStatsResponse>> getAdminStats() {
        log.info("관리자 통계 조회 요청");
        AdminStatsResponse stats = adminService.getAdminStats();
        return ResponseEntity.ok(ApiResponse.success(stats));
    }

    @Operation(summary = "사용자 목록 조회")
    @GetMapping("/users")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Page<UserProfileResponse>>> getUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "") String search,
            @RequestParam(defaultValue = "all") String status,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDirection
    ) {
        log.info("사용자 목록 조회 요청 - page: {}, size: {}, search: {}", page, size, search);
        
        Sort.Direction direction = "asc".equalsIgnoreCase(sortDirection) 
            ? Sort.Direction.ASC : Sort.Direction.DESC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortBy));
        
        UserSearchRequest searchRequest = UserSearchRequest.builder()
                .search(search)
                .status(status)
                .build();
        
        Page<UserProfileResponse> users = adminService.getUsers(searchRequest, pageable);
        return ResponseEntity.ok(ApiResponse.success(users));
    }

    @Operation(summary = "사용자 상태 토글")
    @PatchMapping("/users/{userId}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<UserProfileResponse>> toggleUserStatus(@PathVariable Long userId) {
        log.info("사용자 상태 변경 요청 - userId: {}", userId);
        UserProfileResponse updatedUser = adminService.toggleUserStatus(userId);
        return ResponseEntity.ok(ApiResponse.success(updatedUser));
    }

    @Operation(summary = "사용자 삭제")
    @DeleteMapping("/users/{userId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteUser(@PathVariable Long userId) {
        log.info("사용자 삭제 요청 - userId: {}", userId);
        adminService.deleteUser(userId);
        return ResponseEntity.ok(ApiResponse.success(null));
    }

    @Operation(summary = "사용자 프로필 이미지 업데이트")
    @PutMapping("/users/{userId}/profile-image")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<UserProfileResponse>> updateUserProfileImage(
            @PathVariable Long userId,
            @RequestParam("profileImage") MultipartFile file) {
        log.info("프로필 이미지 업데이트 요청 - userId: {}", userId);
        UserProfileResponse updatedUser = adminService.updateUserProfileImage(userId, file);
        return ResponseEntity.ok(ApiResponse.success(updatedUser));
    }

    @Operation(summary = "특정 사용자 정보 조회")
    @GetMapping("/users/{userId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<UserProfileResponse>> getUser(@PathVariable Long userId) {
        log.info("사용자 정보 조회 요청 - userId: {}", userId);
        UserProfileResponse user = adminService.getUser(userId);
        return ResponseEntity.ok(ApiResponse.success(user));
    }
}
