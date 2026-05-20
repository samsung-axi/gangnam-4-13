package com.banghyang.object.wishlist.entity;

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
public class Wishlist {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;                 // 찜 아이디
    private LocalDateTime timeStamp; // 좋아요 생성일시

    @ManyToOne
    @JoinColumn(name = "member_id", nullable = false)
    private Member member;           // 찜 누른 사용자 아이디

    @ManyToOne
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;         // 찜 누른 제품 아이디

    @PrePersist
    protected void onCreate() {
        this.timeStamp = LocalDateTime.now();
    }

    // 빌더
    @Builder
    public Wishlist(Member member, Product product) {
        this.member = member;
        this.product = product;
    }
}
