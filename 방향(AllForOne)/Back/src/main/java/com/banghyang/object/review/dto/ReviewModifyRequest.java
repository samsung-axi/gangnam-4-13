package com.banghyang.object.review.dto;

import lombok.Data;

@Data
public class ReviewModifyRequest {
    private Long reviewId;
    private String content;
}
