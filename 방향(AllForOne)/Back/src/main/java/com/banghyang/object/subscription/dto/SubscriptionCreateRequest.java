package com.banghyang.object.subscription.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class SubscriptionCreateRequest {

    private Long productId;
    private Long memberId;
}
