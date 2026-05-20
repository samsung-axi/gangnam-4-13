package com.banghyang.object.bookmark.entity;

import com.banghyang.member.entity.Member;
import com.banghyang.object.product.entity.Product;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Bookmark {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; // 북마크 아이디
    private LocalDateTime timeStamp; // 생성 시간

    @ManyToOne
    @JoinColumn(name = "member_id", nullable = false)
    private Member member; // 회원 아이디

    @ManyToOne
    @JoinColumn(name = "product_id", nullable = false)
    private Product product; // 제품 아이디

    // 생성 시간 자동 입력
    @PrePersist
    protected void onCreate() {
        this.timeStamp = LocalDateTime.now();
    }

    // 빌더
    @Builder
    public Bookmark(Member member, Product product) {
        this.member = member;
        this.product = product;
    }
}
