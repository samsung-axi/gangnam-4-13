package com.banghyang.object.review.dto;

import lombok.Data;

@Data
public class ReviewRequest {
    private Long memberId;
    private Long productId;
    private String content;
}
