package com.banghyang.object.subscription.dto;

import com.banghyang.object.subscription.entity.Subscription;
import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Builder

public class SubscriptionResponse {

    private Long subscriptionId;        // 구독 ID
    private Long memberId;              // 회원 ID
    private Long productId;             // 상품 ID
    private String productName;         // 상품한글명
    private LocalDateTime subscribedAt; // 구독 시작일
    private LocalDateTime canceledAt;   // 구독 취소일 (null이면 활성)
    private boolean isActive;           // 활성 상태

    // Entity → DTO 변환 메서드
    public static SubscriptionResponse from(Subscription subscription) {
        return SubscriptionResponse.builder()
                .subscriptionId(subscription.getId())
                .memberId(subscription.getMember().getId())
                .productId(subscription.getProduct().getId())
                .productName(subscription.getProduct().getNameKr())
                .subscribedAt(subscription.getSubscribedAt())
                .canceledAt(subscription.getCanceledAt())
                .isActive(subscription.isActive())
                .build();
    }
}
