package com.banghyang.member.entity;

import com.banghyang.auth.kakao.model.dto.OauthId;
import com.banghyang.common.type.MemberRoleType;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
@Table(uniqueConstraints = {
        @UniqueConstraint(
                name = "oauth_id_unique",
                columnNames = {
                        "oauth_server_id",
                        "oauth_server"
                })})
public class Member {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Embedded
    private OauthId oauthId;            // OauthServerId

    private String name;                // 사용자명
    private String email;               // 이메일
    private String birthyear;           // 촐생연도
    private String gender;              // 성별
    private LocalDateTime createdAt;    // 가입일시
    private LocalDateTime leavedAt;    // 탈퇴일시

    @Enumerated(EnumType.STRING)
    private MemberRoleType role;   // 권한

    /**
     * 권한, 가입일시 초기값 설정 메소드
     */
    @PrePersist
    public void prePersist() {
        if (this.role == null) {
            this.role = MemberRoleType.USER;
        }

        if (this.createdAt == null) {
            this.createdAt = LocalDateTime.now();
        }
    }

    /**
     * 회원정보 조회에 필요한 항목들만 포함한 생성자 메소드
     */
    @Builder
    public Member(
            String name,
            String email,
            String birthyear,
            String gender,
            MemberRoleType role,
            LocalDateTime createdAt
    ) {
        this.name = name;
        this.email = email;
        this.birthyear = birthyear;
        this.gender = gender;
        this.role = role;
        this.createdAt = createdAt;
    }

    /**
     * 회원 탈퇴 상태로 바꾸는 메소드
     */
    public void setMemberLeave() {
        this.role = MemberRoleType.LEAVE;
        this.leavedAt = LocalDateTime.now();
    }
}
