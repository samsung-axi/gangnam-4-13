package com.banghyang.object.heart.controller;

import com.banghyang.object.heart.dto.HeartRequest;
import com.banghyang.object.heart.service.HeartService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RequestMapping("/likes")
@RestController
@RequiredArgsConstructor
public class HeartController {

    private final HeartService heartService;

    /**
     * 좋아요 생성
     */
    @PostMapping
    public ResponseEntity<?> createLike(@RequestBody HeartRequest heartRequest) {
        Long userId = heartRequest.getUserId();
        Long reviewId = heartRequest.getReviewId();

        log.info("👍 [좋아요 요청] userId={}, reviewId={}", userId, reviewId);

        if (userId == null || reviewId == null) {
            log.error("❌ userId 또는 reviewId가 null입니다! userId={}, reviewId={}", userId, reviewId);
            return ResponseEntity.badRequest().body("userId 또는 reviewId가 null입니다.");
        }

        heartService.createLike(userId, reviewId);
        log.info("✅ [좋아요 성공] userId={}, reviewId={}", userId, reviewId);
        return ResponseEntity.ok().body("좋아요가 정상적으로 추가되었습니다.");
    }

    /**
     * 좋아요 삭제
     */
    /**
     * ✅ 좋아요 삭제 요청 (DELETE)
     * @param reviewId 좋아요를 취소할 리뷰 ID
     * @return 삭제 성공 여부 응답
     */
    @DeleteMapping("/{reviewId}")
    public ResponseEntity<?> deleteLike(@PathVariable("reviewId") Long reviewId) {
        log.info("🗑️ [좋아요 삭제 요청] reviewId={}", reviewId);

        if (reviewId == null) {
            log.error("❌ reviewId가 null입니다! 요청을 확인하세요.");
            return ResponseEntity.badRequest().body("reviewId가 null입니다.");
        }

        boolean isDeleted = heartService.deleteLike(reviewId);

        if (isDeleted) {
            log.info("✅ [좋아요 삭제 완료] reviewId={}", reviewId);
            return ResponseEntity.ok().body("좋아요가 정상적으로 삭제되었습니다.");
        } else {
            log.warn("⚠️ [좋아요 삭제 실패] reviewId={}에 대한 좋아요 데이터가 존재하지 않습니다.", reviewId);
            return ResponseEntity.badRequest().body("좋아요 데이터가 존재하지 않아 삭제할 수 없습니다.");
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getLikedReviews(@PathVariable("id") Long id) {
        log.info("🔍 [좋아요 조회 요청] userId={}", id);

        if (id == null) {
            log.error("❌ userId가 null입니다! 요청을 확인하세요.");
            return ResponseEntity.badRequest().body("userId가 null입니다.");
        }

        List<Long> likedReviewIds = heartService.getLikes(id);

        if (likedReviewIds.isEmpty()) {
            log.warn("⚠️ [좋아요 조회] userId={}가 좋아요한 리뷰가 없습니다.", id);
        } else {
            log.info("✅ [좋아요 조회 성공] userId={} 좋아요한 리뷰 개수: {}", id, likedReviewIds.size());
        }

        return ResponseEntity.ok(likedReviewIds);
    }
}
