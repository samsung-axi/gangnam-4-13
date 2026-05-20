package com.example.authapp.service;

import com.example.authapp.dto.request.UserSearchRequest;
import com.example.authapp.dto.response.AdminStatsResponse;
import com.example.authapp.dto.response.UserProfileResponse;
import com.example.authapp.entity.Role;
import com.example.authapp.entity.User;
import com.example.authapp.exception.ResourceNotFoundException;
import com.example.authapp.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import jakarta.persistence.criteria.Predicate;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AdminService {

    private final UserRepository userRepository;
    private final FileStorageService fileStorageService;

    /**
     * 관리자 통계 정보 조회
     */
    public AdminStatsResponse getAdminStats() {
        log.info("관리자 통계 정보 조회 시작");

        Long totalUsers = userRepository.count();
        Long onlineUsers = userRepository.countByOnlineTrue();
        
        // 최근 5분 이내 활동한 사용자 수
        LocalDateTime recentThreshold = LocalDateTime.now().minusMinutes(5);
        Long recentlyActiveUsers = userRepository.countRecentlyActiveUsers(recentThreshold);
        
        // 오늘 가입한 사용자 수
        LocalDateTime startOfDay = LocalDate.now().atStartOfDay();
        LocalDateTime endOfDay = startOfDay.plusDays(1);
        Long newUsersToday = userRepository.countByCreatedAtBetween(startOfDay, endOfDay);

        // TODO: AI 분석 서비스와 연동하여 분석 통계 추가
        Long totalAnalyses = 0L;
        Long analysesToday = 0L;

        AdminStatsResponse stats = AdminStatsResponse.builder()
                .totalUsers(totalUsers)
                .onlineUsers(onlineUsers)
                .recentlyActiveUsers(recentlyActiveUsers)
                .newUsersToday(newUsersToday)
                .totalAnalyses(totalAnalyses)
                .analysesToday(analysesToday)
                .build();

        log.info("통계 조회 완료 - 총 사용자: {}, 접속중: {}, 최근활동: {}", 
                totalUsers, onlineUsers, recentlyActiveUsers);

        return stats;
    }

    /**
     * 사용자 목록 조회 (페이징, 검색)
     */
    public Page<UserProfileResponse> getUsers(UserSearchRequest searchRequest, Pageable pageable) {
        log.info("사용자 목록 조회 - 검색어: {}, 상태: {}", 
                searchRequest.getSearch(), searchRequest.getStatus());

        Specification<User> spec = createUserSpecification(searchRequest);
        Page<User> users = userRepository.findAll(spec, pageable);

        return users.map(this::convertToUserProfileResponse);
    }

    /**
     * 사용자 상태 토글 (활성/비활성)
     */
    @Transactional
    public UserProfileResponse toggleUserStatus(Long userId) {
        log.info("사용자 상태 변경 - userId: {}", userId);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("사용자를 찾을 수 없습니다: " + userId));

        user.setActive(!user.isActive());
        User savedUser = userRepository.save(user);

        log.info("사용자 상태 변경 완료 - userId: {}, 새 상태: {}", 
                userId, savedUser.isActive() ? "활성" : "비활성");

        return convertToUserProfileResponse(savedUser);
    }

    /**
     * 사용자 삭제
     */
    @Transactional
    public void deleteUser(Long userId) {
        log.info("사용자 삭제 - userId: {}", userId);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("사용자를 찾을 수 없습니다: " + userId));

        // 프로필 이미지가 있다면 파일도 삭제
        if (user.getProfileImage() != null && !user.getProfileImage().isEmpty()) {
            try {
                fileStorageService.deleteFile(user.getProfileImage());
            } catch (Exception e) {
                log.warn("프로필 이미지 삭제 실패 - userId: {}, imagePath: {}", 
                        userId, user.getProfileImage(), e);
            }
        }

        userRepository.delete(user);
        log.info("사용자 삭제 완료 - userId: {}", userId);
    }

    /**
     * 사용자 프로필 이미지 업데이트
     */
    @Transactional
    public UserProfileResponse updateUserProfileImage(Long userId, MultipartFile file) {
        log.info("사용자 프로필 이미지 업데이트 - userId: {}", userId);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("사용자를 찾을 수 없습니다: " + userId));

        // 기존 프로필 이미지 삭제
        if (user.getProfileImage() != null && !user.getProfileImage().isEmpty()) {
            try {
                fileStorageService.deleteFile(user.getProfileImage());
            } catch (Exception e) {
                log.warn("기존 프로필 이미지 삭제 실패", e);
            }
        }

        // 새 프로필 이미지 저장
        String imageUrl = fileStorageService.storeFile(file);
        user.setProfileImage(imageUrl);
        User savedUser = userRepository.save(user);

        log.info("프로필 이미지 업데이트 완료 - userId: {}", userId);

        return convertToUserProfileResponse(savedUser);
    }

    /**
     * 특정 사용자 정보 조회
     */
    public UserProfileResponse getUser(Long userId) {
        log.info("사용자 정보 조회 - userId: {}", userId);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("사용자를 찾을 수 없습니다: " + userId));

        return convertToUserProfileResponse(user);
    }

    /**
     * 사용자 검색 조건 생성
     */
    private Specification<User> createUserSpecification(UserSearchRequest request) {
        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            // 검색어 조건
            if (request.getSearch() != null && !request.getSearch().trim().isEmpty()) {
                String searchTerm = "%" + request.getSearch().trim().toLowerCase() + "%";
                Predicate searchPredicate = criteriaBuilder.or(
                        criteriaBuilder.like(criteriaBuilder.lower(root.get("name")), searchTerm),
                        criteriaBuilder.like(criteriaBuilder.lower(root.get("email")), searchTerm),
                        criteriaBuilder.like(criteriaBuilder.lower(root.get("username")), searchTerm)
                );
                predicates.add(searchPredicate);
            }

            // 상태 조건
            if (request.getStatus() != null && !"all".equalsIgnoreCase(request.getStatus())) {
                boolean isActive = "active".equalsIgnoreCase(request.getStatus());
                predicates.add(criteriaBuilder.equal(root.get("active"), isActive));
            }

            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }

    /**
     * User 엔티티를 UserProfileResponse로 변환
     */
    private UserProfileResponse convertToUserProfileResponse(User user) {
        return UserProfileResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .name(user.getName())
                .nickname(user.getNickname())
                .profileImage(user.getProfileImage())
                .gender(user.getGender())
                .birthYear(user.getBirthYear())
                .nationality(user.getNationality())
                .provider(user.getProvider() != null ? user.getProvider().name() : null)
                .role(user.getRole() != null ? user.getRole().name() : null)
                .status(user.isActive() ? "active" : "inactive")
                .online(user.isOnline())
                .lastLoginAt(user.getLastLoginAt())
                .analysisCount(user.getAnalysisCount())
                .lastAnalysisAt(user.getLastAnalysisAt())
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt())
                .build();
    }
}
