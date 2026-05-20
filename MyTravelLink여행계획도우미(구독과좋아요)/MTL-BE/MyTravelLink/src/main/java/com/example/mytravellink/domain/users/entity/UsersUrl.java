package com.example.mytravellink.domain.users.entity;

import com.example.mytravellink.domain.BaseTimeEntity;
import com.example.mytravellink.domain.url.entity.Url;

import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.MapsId;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.FetchType;
import jakarta.persistence.Column;

/**
 * 사용자 URL (UsersUrl) 엔티티
 * 사용자와 URL 간의 다대다 관계를 위한 중간 테이블 엔티티입니다.
 * 복합 키를 사용하여 매핑하며, @MapsId를 활용해 연관관계를 명시합니다.
 */
@Entity
@Table(name = "user_url")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UsersUrl extends BaseTimeEntity {

    @EmbeddedId
    private UsersUrlId id;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("email")
    @JoinColumn(name = "email", nullable = false)
    private Users user;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("urlId")
    @JoinColumn(name = "url_id", nullable = false)
    private Url url;
    
    @Column(name = "is_use")
    private boolean isUse;
    
    /**
     * 편의 생성자: 사용자와 URL 객체를 받아 즉시 복합키(id)를 생성하며 isUse를 true로 설정합니다.
     */
    public UsersUrl(Users user, Url url) {
        this.user = user;
        this.url = url;
        this.id = UsersUrlId.builder()
                       .email(user.getEmail())
                       .urlId(url.getId())
                       .build();
        this.isUse = true;
    }
} 