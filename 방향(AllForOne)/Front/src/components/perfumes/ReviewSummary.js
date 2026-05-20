import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchReviewSummary, selectReviewSummary } from '../../module/ReviewModule';
import styles from '../../css/perfumes/PerfumeReviews.module.css';

const ReviewSummary = ({ perfumeId }) => {
    const dispatch = useDispatch();
    const summary = useSelector(selectReviewSummary);

    useEffect(() => {
        if (perfumeId) {
            dispatch(fetchReviewSummary(perfumeId));
        }
    }, [perfumeId, dispatch]);

    // 로딩 상태 추가
    if (!summary) {
        return (
            <div className={styles.summarySection}>
                <div className={styles.summaryCard}>
                    <h4>리뷰 요약</h4>
                    <div className={styles.summaryContent}>
                        <p>리뷰 요약을 불러오는 중...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.summarySection}>
            <div className={styles.summaryCard}>
                <h4>리뷰 요약</h4>
                <div className={styles.summaryContent}>
                    <p>{summary}</p>
                </div>
            </div>
        </div>
    );
};

export default ReviewSummary; 