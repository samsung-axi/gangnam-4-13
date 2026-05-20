package com.banghyang.object.heart.service;

import com.banghyang.member.entity.Member;
import com.banghyang.member.repository.MemberRepository;
import com.banghyang.object.heart.entity.Heart;
import com.banghyang.object.heart.repository.HeartRepository;
import com.banghyang.object.review.entity.Review;
import com.banghyang.object.review.repository.ReviewRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@Service
@Transactional
@RequiredArgsConstructor
public class HeartService {

    private final HeartRepository heartRepository;
    private final MemberRepository memberRepository;
    private final ReviewRepository reviewRepository;

    /**
     * 새로운 좋아요 생성 메소드
     */
    public void createLike(Long userId, Long reviewId) {
        if (userId == null || reviewId == null) {
            throw new IllegalArgumentException("❌ userId 또는 reviewId가 null입니다. 요청을 확인하세요.");
        }

        // 좋아요 누른 사용자 찾기
        Member targetMemberEntity = memberRepository.findById(userId).orElseThrow(() ->
                new EntityNotFoundException("[좋아요-서비스-생성] 아이디에 해당하는 멤버 엔티티를 찾을 수 없습니다. ID: " + userId));

        // 좋아요 누른 리뷰 찾기
        Review targetReviewEntity = reviewRepository.findById(reviewId).orElseThrow(() ->
                new EntityNotFoundException("[좋아요-서비스-생성] 아이디에 해당하는 리뷰 엔티티를 찾을 수 없습니다. ID: " + reviewId));

        // 좋아요 엔티티 생성 및 저장
        Heart heart = Heart.builder()
                .member(targetMemberEntity)
                .review(targetReviewEntity)
                .build();

        heartRepository.save(heart);
    }



    /**
     * 좋아요 삭제 메소드
     *
     * @return
     */
    public boolean deleteLike(Long reviewId) {
        if (reviewId == null) {
            log.error("❌ [좋아요 삭제] reviewId가 null입니다!");
            throw new IllegalArgumentException("reviewId가 null입니다.");
        }

        log.info("🗑️ [좋아요 삭제] reviewId={} 삭제 요청 처리 중...", reviewId);

        int deletedCount = heartRepository.deleteByReviewId(reviewId);

        if (deletedCount > 0) {
            log.info("✅ [좋아요 삭제 완료] reviewId={} 삭제된 행 수: {}", reviewId, deletedCount);
            return true;
        } else {
            log.warn("⚠️ [좋아요 삭제 실패] reviewId={}에 대한 좋아요 데이터가 존재하지 않습니다.", reviewId);
            return false;
        }
    }

    /**
     * 리뷰에 해당하는 좋아요 삭제 메소드
     */
    public void deleteLikesByReview(Review targetReviewEntity) {
        // 리뷰에 해당하는 좋아요 엔티티 리스트
        List<Heart> likesToDelete = heartRepository.findByReview(targetReviewEntity);
        // 만약 존재한다면 삭제 진행, 아니면 별도의 처리없음.
        if (!likesToDelete.isEmpty()) {
            heartRepository.deleteAll(likesToDelete);
        }
    }

    public List<Long> getLikes(Long userId) {
        if (userId == null) {
            log.error("❌ [좋아요 서비스] userId가 null입니다!");
            throw new IllegalArgumentException("userId가 null입니다.");
        }

        log.info("🔍 [좋아요 서비스] userId={} 좋아요한 리뷰 조회 중...", userId);
        List<Long> likedReviewIds = heartRepository.findLikedReviewIdsByUserId(userId);

        if (likedReviewIds.isEmpty()) {
            log.warn("⚠️ [좋아요 서비스] userId={}가 좋아요한 리뷰가 없습니다.", userId);
        } else {
            log.info("✅ [좋아요 서비스] userId={}가 좋아요한 리뷰 개수: {}", userId, likedReviewIds.size());
        }

        return likedReviewIds;
    }
}
