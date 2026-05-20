package com.example.authapp.controller;

import com.example.authapp.dto.response.ApiResponse;
import com.example.authapp.entity.Role;
import com.example.authapp.entity.User;
import com.example.authapp.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Profile;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

/**
 * 개발용 컨트롤러 (개발 환경에서만 활성화)
 */
@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/dev")
@Profile("!prod") // 프로덕션 환경에서는 비활성화
public class DevController {

    private final UserService userService;
    private final PasswordEncoder passwordEncoder;

    @GetMapping("/users")
    public ResponseEntity<ApiResponse<List<String>>> getAllUsers() {
        try {
            List<User> users = userService.findAll();
            List<String> userInfo = users.stream()
                    .map(user -> String.format("ID: %d, Email: %s, Role: %s, Active: %s", 
                            user.getId(), user.getEmail(), user.getRole().name(), user.isActive()))
                    .collect(Collectors.toList());
            
            return ResponseEntity.ok(ApiResponse.success(userInfo));
        } catch (Exception e) {
            log.error("사용자 목록 조회 실패", e);
            return ResponseEntity.badRequest().body(ApiResponse.failure("사용자 목록 조회에 실패했습니다: " + e.getMessage()));
        }
    }

    @PostMapping("/create-admin")
    public ResponseEntity<ApiResponse<String>> createAdminUser(@RequestParam String email) {
        try {
            // 이미 존재하는 사용자인지 확인
            if (userService.existsByEmail(email)) {
                // 기존 사용자를 관리자로 승격
                User user = userService.findByEmail(email).orElseThrow();
                user.setRole(Role.ADMIN);
                userService.save(user);
                
                log.info("사용자를 관리자로 승격: {}", email);
                return ResponseEntity.ok(ApiResponse.success("사용자가 관리자로 승격되었습니다: " + email, email));
            } else {
                // 새 관리자 계정 생성
                User adminUser = User.builder()
                        .email(email)
                        .username(email.substring(0, email.indexOf("@")))
                        .name("Temporary Admin")
                        .password(passwordEncoder.encode("admin123"))
                        .role(Role.ADMIN)
                        .active(true)
                        .build();
                
                userService.save(adminUser);
                
                log.info("새 관리자 계정 생성: {}", email);
                return ResponseEntity.ok(ApiResponse.success("관리자 계정이 생성되었습니다: " + email + " (비밀번호: admin123)", email));
            }
        } catch (Exception e) {
            log.error("관리자 계정 생성/승격 실패", e);
            return ResponseEntity.badRequest().body(ApiResponse.failure("관리자 계정 생성에 실패했습니다: " + e.getMessage()));
        }
    }

    @PostMapping("/promote-user/{userId}")
    public ResponseEntity<ApiResponse<String>> promoteUserToAdmin(@PathVariable Long userId) {
        try {
            User user = userService.findById(userId)
                    .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다: " + userId));
            
            user.setRole(Role.ADMIN);
            userService.save(user);
            
            String message = String.format("사용자 %s (ID: %d)가 관리자로 승격되었습니다", user.getEmail(), userId);
            log.info("사용자 ID {} ({})를 관리자로 승격", userId, user.getEmail());
            return ResponseEntity.ok(ApiResponse.success(message, user.getEmail()));
        } catch (Exception e) {
            log.error("사용자 승격 실패", e);
            return ResponseEntity.badRequest().body(ApiResponse.failure("사용자 승격에 실패했습니다: " + e.getMessage()));
        }
    }

    @PostMapping("/create-default-admin")
    public ResponseEntity<ApiResponse<String>> createDefaultAdmin() {
        try {
            String adminEmail = "admin@skincarestory.com";
            
            if (userService.existsByEmail(adminEmail)) {
                return ResponseEntity.ok(ApiResponse.success("기본 관리자 계정이 이미 존재합니다: " + adminEmail, adminEmail));
            }
            
            User adminUser = User.builder()
                    .email(adminEmail)
                    .username("admin")
                    .name("System Administrator")
                    .password(passwordEncoder.encode("admin123"))
                    .role(Role.ADMIN)
                    .active(true)
                    .online(false) // 명시적으로 false 설정
                    .build();
            
            userService.save(adminUser);
            
            log.info("기본 관리자 계정 생성: {}", adminEmail);
            return ResponseEntity.ok(ApiResponse.success("기본 관리자 계정이 생성되었습니다: " + adminEmail + " (비밀번호: admin123)", adminEmail));
        } catch (Exception e) {
            log.error("기본 관리자 계정 생성 실패", e);
            return ResponseEntity.badRequest().body(ApiResponse.failure("기본 관리자 계정 생성에 실패했습니다: " + e.getMessage()));
        }
    }

    @PostMapping("/create-test-user")
    public ResponseEntity<ApiResponse<String>> createTestUser() {
        try {
            String userEmail = "test@test.com";
            
            if (userService.existsByEmail(userEmail)) {
                return ResponseEntity.ok(ApiResponse.success("테스트 사용자가 이미 존재합니다: " + userEmail, userEmail));
            }
            
            User testUser = User.builder()
                    .email(userEmail)
                    .username("testuser")
                    .name("Test User")
                    .password(passwordEncoder.encode("test123"))
                    .role(Role.USER)
                    .active(true)
                    .online(false)
                    .analysisCount(0)
                    .build();
            
            userService.save(testUser);
            
            log.info("테스트 사용자 계정 생성: {}", userEmail);
            return ResponseEntity.ok(ApiResponse.success("테스트 사용자 계정이 생성되었습니다: " + userEmail + " (비밀번호: test123)", userEmail));
        } catch (Exception e) {
            log.error("테스트 사용자 계정 생성 실패", e);
            return ResponseEntity.badRequest().body(ApiResponse.failure("테스트 사용자 계정 생성에 실패했습니다: " + e.getMessage()));
        }
    }

    @PostMapping("/fix-online-status")
    public ResponseEntity<ApiResponse<String>> fixOnlineStatus() {
        try {
            List<User> users = userService.findAll();
            int fixed = 0;
            
            for (User user : users) {
                // 온라인 상태와 마지막 로그인 시간을 안전하게 설정
                user.setOnline(false);
                if (user.getLastLoginAt() == null) {
                    // lastLoginAt이 null인 경우 생성 시간으로 설정
                    user.updateLoginStatus(); // 이것도 NULL이면
                    user.setOnline(false); // 다시 오프라인으로
                }
                // 분석 관련 필드도 초기화
                if (user.getAnalysisCount() < 0) {
                    user.setAnalysisCount(0);
                }
                userService.save(user);
                fixed++;
            }
            
            log.info("사용자 데이터 수정 완료: {}명", fixed);
            return ResponseEntity.ok(ApiResponse.success("사용자 데이터가 수정되었습니다: " + fixed + "명", String.valueOf(fixed)));
        } catch (Exception e) {
            log.error("사용자 데이터 수정 실패", e);
            return ResponseEntity.badRequest().body(ApiResponse.failure("사용자 데이터 수정에 실패했습니다: " + e.getMessage()));
        }
    }
}
