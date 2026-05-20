// PerfumeReviews.js
import React from 'react';
import styles from '../../css/perfumes/PerfumeReviews.module.css';
import ReviewSlider from '../../components/perfumes/ReviewSlider';
import ReviewModal from './ReviewModal';
import { Heart } from 'lucide-react';
import usePerfumeReviewState from './PerfumeReviewState';
import ReviewSummary from './ReviewSummary';

const PerfumeReviews = ({ perfumeId }) => {
    const {
        isDragging,
        sliderLeft,
        cardOffset,
        currentPage,
        animation,
        reviewContent,
        isModalOpen,
        likedReviews,
        heartCounts,
        reviews,
        perfume,
        CARDS_PER_PAGE,
        totalPages,
        mostLikedReview,
        handleMouseDown,
        handleToggleHeart,
        handleReviewSubmit,
        handleModalClose,
        handleModalOpen,
        setReviewContent,
        setCurrentPage,
        setSliderLeft,
        setCardOffset,
    } = usePerfumeReviewState(perfumeId);

    return (
        <div className={styles.reviewsContainer}>
            {/* 리뷰 요약 섹션 추가 */}
            <ReviewSummary perfumeId={perfumeId} />

            {/* 상단 Top 1 리뷰 */}
            <div className={styles.topReviewsSection}>
                <div className={styles.topReviewCard}>
                    <h4>사용자 리뷰 Top 1</h4>
                    <div className={styles.reviewContent}>
                        <p>{mostLikedReview?.content || "사용자 리뷰가 없습니다."}</p>
                    </div>
                </div>
            </div>

            {/* 리뷰 목록 섹션 */}
            <div className={styles.reviewListSection}>
                {/* 🔹 "리뷰 작성하기" 버튼 → 모달 열기 */}
                <button className={styles.writeReviewBtn} onClick={handleModalOpen}>
                    리뷰 작성하기
                </button>

                {/* 리뷰 작성 모달 */}
                <ReviewModal
                    isOpen={isModalOpen}
                    onClose={handleModalClose}
                    perfume={perfume}
                    onSubmit={handleReviewSubmit}
                />

                <div className={styles.reviewCardsContainer}>
                    <div className={styles.reviewCards} style={{ transform: `translateX(-${cardOffset}px)` }}>
                        {reviews.map(review => (
                            <div
                                key={review.id}
                                className={`${styles.reviewCard} ${likedReviews.includes(review.id) ? styles.likedBorder : ''}`}
                            >
                                {/* 이미지, divider, 내용, 작성자 */}
                                <img
                                    src={perfume?.imageUrlList?.[0]}
                                    alt="향수 이미지"
                                    className={styles.perfumeThumb}
                                />
                                <div className={styles.divider} />
                                <p className={styles.reviewContent}>{review.content}</p>
                                <p className={styles.reviewerName}>{review.memberName}</p>

                                {/* 좋아요(하트) */}
                                <div className={styles.heartContainer}>
                                    <button
                                        className={likedReviews.includes(review.id) ? styles.heartActive : styles.heart}
                                        onClick={() => handleToggleHeart(review.id)}
                                    >
                                        <Heart
                                            size={20}
                                            fill={likedReviews.includes(review.id) ? "#FF0000" : "none"}
                                            color={likedReviews.includes(review.id) ? "#FF0000" : "#000000"}
                                        />
                                    </button>
                                    <span className={styles.heartCount}>
                                        {heartCounts[review.id] || 0}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 슬라이더 */}
                <ReviewSlider
                    currentPage={currentPage}
                    totalPages={totalPages}
                    isDragging={isDragging}
                    sliderLeft={sliderLeft}
                    cardOffset={cardOffset}
                    allReviews={reviews}
                    CARDS_PER_PAGE={CARDS_PER_PAGE}
                    onMouseDown={handleMouseDown}
                    setCurrentPage={(page) => {
                        setCurrentPage(page);
                        const percentage = ((page - 1) / (totalPages - 1)) * 100;
                        const newOffset = (percentage / 100) * ((reviews.length - CARDS_PER_PAGE) * (196 + 37));
                        setSliderLeft(percentage);
                        setCardOffset(newOffset);
                    }}
                    setSliderLeft={setSliderLeft}
                    setCardOffset={setCardOffset}
                />
            </div>
        </div>
    );
};

export default PerfumeReviews;
