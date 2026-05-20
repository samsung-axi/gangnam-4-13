package com.banghyang.object.review.entity;

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
public class Review {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; // 리뷰 아이디
    @Lob
    @Column(columnDefinition = "TEXT")
    private String content; // 리뷰 본문
    @ManyToOne
    @JoinColumn(name = "member_id", nullable = false)
    private Member member; // 리뷰 작성자 아이디
    @ManyToOne
    @JoinColumn(name = "product_id", nullable = false)
    private Product product; // 리뷰 상품
    private LocalDateTime timeStamp; // 리뷰 작성일시

    @PrePersist
    protected void onCreate() {
        this.timeStamp = LocalDateTime.now();
    }

    // 빌더
    @Builder
    public Review(String content, LocalDateTime timeStamp, Member member, Product product) {
        this.content = content;
        this.timeStamp = timeStamp;
        this.member = member;
        this.product = product;
    }

    // 리뷰 본문 수정 메소드
    public void modify(String content) {
        this.content = content;
    }
}
