package com.example.authapp.dto.response;

import com.example.authapp.entity.User;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class UserProfileResponse {
    private Long id;
    private String email;
    private String username;
    private String name;
    private String nickname;
    private String profileImage;
    private String profileImageUrl; // 프론트엔드에서 사용할 수 있는 URL
    private String gender;
    private String birthYear;
    private String nationality;
    private String provider;
    private String role;
    private String status; // active, inactive
    private boolean online; // 현재 접속 상태
    private LocalDateTime lastLoginAt; // 마지막 로그인 시간
    private int analysisCount; // 총 분석 횟수
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime lastAnalysisAt; // 마지막 분석 시간
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime createdAt;
    
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime updatedAt;

    public static UserProfileResponse from(User user) {
        return UserProfileResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .username(user.getUsername())
                .name(user.getName())
                .nickname(user.getNickname())
                .profileImage(user.getProfileImage())
                .profileImageUrl(user.getProfileImage()) // 현재는 같은 값, 추후 변환 로직 추가 가능
                .gender(user.getGender())
                .birthYear(user.getBirthYear())
                .nationality(user.getNationality())
                .provider(user.getProvider() != null ? user.getProvider().getValue() : "REGULAR")
                .role(user.getRole().name())
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