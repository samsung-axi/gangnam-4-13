import React, { useState } from 'react';
import styles from '../../css/perfumes/ReviewModal.module.css';
import { useDispatch, useSelector } from 'react-redux';
import { createNewReview } from '../../module/ReviewModule';

const ReviewModal = ({ isOpen, onClose, perfume }) => {
    const [reviewContent, setReviewContent] = useState('');
    const dispatch = useDispatch();
    const auth = JSON.parse(localStorage.getItem('auth'));

    if (!isOpen) return null;

    const handleSubmit = async () => {
        // 로컬 스토리지에서 최신 auth 정보 가져오기
        const currentAuth = JSON.parse(localStorage.getItem('auth'));
        if (!auth) {
            return;
        }

        if (!reviewContent.trim()) {
            alert('리뷰 내용을 입력해주세요.');
            return;
        }

        try {
            // 데이터 유효성 검사
            if (!perfume?.id || !currentAuth?.id) {
                console.error('Required data missing:', {
                    productId: perfume?.id,
                    memberId: currentAuth?.id
                });
                alert('필요한 정보가 누락되었습니다. 다시 시도해주세요.');
                return;
            }

            const reviewData = {
                memberId: currentAuth.id,
                productId: perfume.id,
                content: reviewContent.trim()
            };

            console.log('Sending review data:', reviewData);

            // 리뷰 생성 액션 디스패치
            await dispatch(createNewReview(reviewData));

            // 입력 필드 초기화 및 모달 닫기
            setReviewContent('');
            onClose();

        } catch (error) {
            console.error('리뷰 작성 실패:', error);
            alert('리뷰 작성에 실패했습니다. 다시 시도해주세요.');
        }
    };

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContainer}>
                {/* 닫기 버튼 */}
                <div className={styles.closeButton} onClick={onClose}>
                    <div className={styles.line1}></div>
                    <div className={styles.line2}></div>
                </div>

                {/* 향수 정보 */}
                <div className={styles.perfumeInfo}>
                    <img
                        src={perfume?.imageUrlList?.[0]}
                        alt={perfume?.nameKr}
                        className={styles.perfumeImage}
                    />
                    <h2 className={styles.perfumeName}>{perfume?.nameEn}</h2>
                </div>

                {/* 구분선 */}
                <div className={styles.divider}></div>

                {/* 리뷰 작성 영역 */}
                <textarea
                    className={styles.reviewInput}
                    value={reviewContent}
                    onChange={(e) => setReviewContent(e.target.value)}
                    placeholder="향수의 느낌 등을 살려 향수의 구체적인 리뷰를 작성해주세요."
                />

                {/* 작성 버튼 */}
                <button className={styles.submitButton} onClick={handleSubmit}>
                    작성
                </button>
            </div>
        </div>
    );
};

export default ReviewModal;