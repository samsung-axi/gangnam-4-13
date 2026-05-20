package com.banghyang.object.review.controller;

import com.banghyang.object.review.dto.MyReviewResponse;
import com.banghyang.object.review.dto.ReviewModifyRequest;
import com.banghyang.object.review.dto.ReviewRequest;
import com.banghyang.object.review.dto.ReviewResponse;
import com.banghyang.object.review.service.ReviewService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequestMapping("/reviews")
@RestController
@Slf4j
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    /**
     * 특정 향수의 리뷰 목록 조회
     */
    @GetMapping
    public ResponseEntity<List<ReviewResponse>> getReviewsByProductId(
            @RequestParam(required = false) Long memberId, @RequestParam Long productId) {
        return ResponseEntity.ok(reviewService.getReviewsByProductId(memberId, productId));
    }

    // 제품 리뷰 요약 조회
    @GetMapping("/summary/{productId}")
    public ResponseEntity<String> getReviewSummary(@PathVariable Long productId) {
        return ResponseEntity.ok(reviewService.getReviewSummary(productId));
    }

    /**
     * 특정 회원이 작성한 리뷰 목록 조회
     */
    @GetMapping("/member/{memberId}")
    public ResponseEntity<List<MyReviewResponse>> getReviewsByMemberId(@PathVariable Long memberId) {
        return ResponseEntity.ok(reviewService.getReviewsByMemberId(memberId));
    }

    /**
     * 리뷰 생성 메소드
     */
    @PostMapping
    public ResponseEntity<?> createReview(@RequestBody ReviewRequest reviewRequest) {
        reviewService.createReview(reviewRequest);
        return ResponseEntity.ok().build();
    }

    /**
     * 리뷰 수정 메소드
     */
    @PutMapping
    public ResponseEntity<?> updateReview(@RequestBody ReviewModifyRequest request) {
        reviewService.modifyReview(request);
        return ResponseEntity.ok().build();
    }

    /**
     * 리뷰 삭제 메소드
     */
    @DeleteMapping("/{reviewId}")
    public ResponseEntity<?> deleteReview(@PathVariable Long reviewId) {
        reviewService.deleteReview(reviewId);
        return ResponseEntity.ok().build();
    }
}
