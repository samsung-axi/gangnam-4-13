package com.example.authapp.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.DynamicUpdate;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@EntityListeners(AuditingEntityListener.class)
@DynamicUpdate // 변경된 필드만 업데이트
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(unique = true)
    private String username; // 사용자명 추가

    @Column(nullable = false)
    private String name;

    private String nickname;

    private String profileImage;

    private String gender;

    @Column(name = "birth_year")
    private String birthYear;

    private String nationality;

    @Column(name = "password")
    private String password; // 일반 회원가입용 비밀번호

    private String address; // 주소 필드 추가

    @Column(nullable = false)
    private boolean active = true; // 계정 활성 상태 (유지 - 계정 삭제/정지용)

    @Column(name = "last_login_at")
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime lastLoginAt; // 마지막 로그인 시간

    @Column(name = "is_online", nullable = false)
    private boolean online = false; // 현재 온라인 상태

    @Column(name = "analysis_count", nullable = false)
    private int analysisCount = 0; // 총 분석 횟수

    @Column(name = "last_analysis_at")
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime lastAnalysisAt; // 마지막 분석 시간

    @Enumerated(EnumType.STRING)
    private Provider provider; // nullable로 변경 (일반 회원가입은 null)

    @Column(name = "provider_id")
    private String providerId; // nullable로 변경

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role = Role.USER;

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "updated_at")
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime updatedAt;

    @Builder
    public User(String email, String username, String name, String nickname, String profileImage,
                String password, String address, boolean active,
                String gender, String birthYear, String nationality, 
                Provider provider, String providerId, Role role,
                LocalDateTime lastLoginAt, boolean online,
                int analysisCount, LocalDateTime lastAnalysisAt) {
        this.email = email;
        this.username = username;
        this.name = name;
        this.nickname = nickname;
        this.profileImage = profileImage;
        this.password = password;
        this.address = address;
        this.active = active;
        this.gender = gender;
        this.birthYear = birthYear;
        this.nationality = nationality;
        this.provider = provider;
        this.providerId = providerId;
        this.role = role != null ? role : Role.USER;
        this.lastLoginAt = lastLoginAt;
        this.online = online;
        this.analysisCount = analysisCount;
        this.lastAnalysisAt = lastAnalysisAt;
    }

    // 일반 회원가입용 사용자 생성
    public static User createRegularUser(String email, String username, String name, String password, String address, String nickname) {
        return User.builder()
                .email(email)
                .username(username)
                .name(name)
                .nickname(nickname != null && !nickname.trim().isEmpty() ? nickname.trim() : username) // 닉네임이 없으면 username 사용
                .password(password)
                .address(address)
                .active(true)
                .online(false) // 명시적으로 false 설정
                .analysisCount(0) // 초기값 0
                .provider(null) // 일반 회원가입은 provider가 null
                .providerId(null)
                .role(Role.USER)
                .build();
    }

    // 사용자 정보 업데이트 (기본 정보만)
    public void updateProfile(String name, String nickname, String profileImage,
                            String gender, String birthYear, String nationality) {
        System.out.println("=== User.updateProfile() 호출 ===");
        System.out.println("기존 닉네임: " + this.nickname);
        System.out.println("새 닉네임: " + nickname);
        
        if (name != null) this.name = name;
        if (nickname != null) {
            System.out.println("닉네임 업데이트: " + nickname);
            this.nickname = nickname;
        }
        if (profileImage != null) this.profileImage = profileImage;
        if (gender != null) this.gender = gender;
        if (birthYear != null) this.birthYear = birthYear;
        if (nationality != null) this.nationality = nationality;
        
        System.out.println("업데이트 후 닉네임: " + this.nickname);
        System.out.println("=== User.updateProfile() 완료 ===");
    }

    // 기본 사용자 정보 업데이트 (기존 메서드 유지)
    public void updateBasicProfile(String name, String profileImage) {
        if (name != null) this.name = name;
        if (profileImage != null) this.profileImage = profileImage;
    }

    // 관리자용 메서드들 추가
    public void setActive(boolean active) {
        this.active = active;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    public void setProfileImage(String profileImage) {
        this.profileImage = profileImage;
    }

    public void setNickname(String nickname) {
        this.nickname = nickname;
    }

    // 온라인 상태 관리 메서드들
    public void updateLoginStatus() {
        this.lastLoginAt = LocalDateTime.now();
        this.online = true;
    }

    public void updateLogoutStatus() {
        this.online = false;
    }

    public void setOnline(boolean online) {
        this.online = online;
    }

    // 접속 상태 확인 (5분 이내 활동이 있으면 온라인으로 간주)
    public boolean isRecentlyActive() {
        if (lastLoginAt == null) return false;
        return lastLoginAt.isAfter(LocalDateTime.now().minusMinutes(5));
    }

    // 분석 관련 메서드들
    public void incrementAnalysisCount() {
        this.analysisCount++;
        this.lastAnalysisAt = LocalDateTime.now();
    }

    public void updateLastAnalysisAt() {
        this.lastAnalysisAt = LocalDateTime.now();
    }

    public void setAnalysisCount(int analysisCount) {
        this.analysisCount = analysisCount;
    }

    public void setLastAnalysisAt(LocalDateTime lastAnalysisAt) {
        this.lastAnalysisAt = lastAnalysisAt;
    }

    // OAuth 제공자별 사용자 생성 팩토리 메서드
    public static User createGoogleUser(String email, String name, String profileImage, String providerId) {
        String username = generateUsernameFromEmail(email);
        return User.builder()
                .email(email)
                .username(username) // 이메일에서 사용자명 생성
                .name(name)
                .nickname(username) // 초기 닉네임을 username으로 설정
                .profileImage(profileImage)
                .active(true)
                .online(false) // 명시적으로 false 설정
                .analysisCount(0) // 초기값 0
                .provider(Provider.GOOGLE)
                .providerId(providerId)
                .role(Role.USER)
                .build();
    }

    public static User createNaverUser(String email, String name, String profileImage, String providerId) {
        String username = generateUsernameFromEmail(email);
        return User.builder()
                .email(email)
                .username(username) // 이메일에서 사용자명 생성
                .name(name)
                .nickname(username) // 초기 닉네임을 username으로 설정
                .profileImage(profileImage)
                .active(true)
                .online(false) // 명시적으로 false 설정
                .analysisCount(0) // 초기값 0
                .provider(Provider.NAVER)
                .providerId(providerId)
                .role(Role.USER)
                .build();
    }

    // 이메일에서 사용자명 생성 유틸리티 메서드
    private static String generateUsernameFromEmail(String email) {
        if (email == null || !email.contains("@")) {
            return "user" + System.currentTimeMillis();
        }
        return email.substring(0, email.indexOf("@"));
    }

}