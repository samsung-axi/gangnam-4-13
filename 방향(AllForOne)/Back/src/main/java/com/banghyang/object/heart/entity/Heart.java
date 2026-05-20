package com.banghyang.object.heart.entity;

import com.banghyang.member.entity.Member;
import com.banghyang.object.review.entity.Review;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Heart {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; // 좋아요 아이디
    private LocalDateTime timeStamp; // 좋아요 생성일시

    @ManyToOne
    @JoinColumn(name = "member_id", nullable = false)
    private Member member; // 좋아요 누른 사용자 아이디

    @ManyToOne
    @JoinColumn(name = "review_id", nullable = false)
    private Review review; // 좋아요 한 리뷰

    // 좋아요 생성일시 자동 생성
    @PrePersist
    protected void onCreate() {
        this.timeStamp = LocalDateTime.now();
    }

    // 빌더
    @Builder
    public Heart(Member member, Review review) {
        this.member = member;
        this.review = review;
    }
}
