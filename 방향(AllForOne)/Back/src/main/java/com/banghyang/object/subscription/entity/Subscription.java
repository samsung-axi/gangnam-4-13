package com.banghyang.object.subscription.entity;

import com.banghyang.member.entity.Member;
import com.banghyang.object.product.entity.Product;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)

public class Subscription {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private LocalDateTime subscribedAt;
    private LocalDateTime canceledAt;

    @ManyToOne
    @JoinColumn(name = "member_id", nullable = false)
    private Member member;

    @ManyToOne
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @PrePersist
    protected void onCreate() {
        this.subscribedAt = LocalDateTime.now();
    }
    public boolean isActive(){ return canceledAt==null; }

    // 취소 메서드
    public void cancel() {
        this.canceledAt = LocalDateTime.now();
    }

    // 생성 메서드
    public static Subscription create(Member member, Product product) {
        Subscription subscription = new Subscription();
        subscription.member = member;
        subscription.product = product;
        return subscription;
    }

    // 구독 재활성화
    public void reactivate() {
        this.subscribedAt = LocalDateTime.now();
        this.canceledAt = null;
    }
}
