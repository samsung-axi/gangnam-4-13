package com.banghyang.object.review.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ReviewResponse {
    private Long id;
    private String memberName;  // 리뷰 작성자명
    private String content; // 리뷰 내용
    private int heartCount; // 공감 개수
    private boolean myHeart; // 사용자가 공감 누른 여부
    private LocalDateTime createdAt; // 작성 날짜
}
