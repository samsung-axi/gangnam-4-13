import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Edit2 } from 'lucide-react';
import styles from '../../css/mypage/MyReviews.module.css';
import { fetchMemberReviews, deleteExistingReview, updateExistingReview } from '../../module/ReviewModule';

const MyReviews = () => {
    const dispatch = useDispatch();
    const { reviews, loading } = useSelector(state => state.reviews);
    const auth = JSON.parse(localStorage.getItem('auth'));
    const [editingReview, setEditingReview] = useState(null);
    const [editContent, setEditContent] = useState('');

    useEffect(() => {
        const loadReviews = async () => {
            if (auth?.id) {
                try {
                    console.log('Fetching reviews for member:', auth.id);
                    await dispatch(fetchMemberReviews(auth.id));
                } catch (error) {
                    console.error('Failed to load reviews:', error);
                }
            }
        };

        loadReviews();
    }, [auth?.id, dispatch]);

    const handleDelete = async (reviewId, productId) => {
        if (window.confirm('리뷰를 삭제하시겠습니까?')) {
            try {
                // productId 없이 삭제만 수행
                await dispatch(deleteExistingReview(reviewId));
                // 회원 리뷰 목록 재조회
                await dispatch(fetchMemberReviews(auth.id));
            } catch (error) {
                console.error('리뷰 삭제 실패:', error);
                alert('리뷰 삭제에 실패했습니다.');
            }
        }
    };

    const handleEdit = (review) => {
        setEditingReview(review);
        setEditContent(review.content);
    };

    const handleUpdate = async () => {
        if (editContent.trim() === '') return;
        
        try {
            const updatedReview = {
                id: editingReview.id,
                content: editContent,
                productId: editingReview.productId,
                memberId: auth.id
            };
    
            console.log('Attempting to update review:', updatedReview);
            
            await dispatch(updateExistingReview(updatedReview));
            setEditingReview(null);
            setEditContent('');
            
            await dispatch(fetchMemberReviews(auth.id));
        } catch (error) {
            console.error('Failed to update review:', error);
            alert('리뷰 수정에 실패했습니다.');
        }
    };

    return (
        <div className={styles.container}>
            {loading ? (
                <div className={styles.loading}>로딩 중...</div>
            ) : reviews?.length > 0 ? (
                reviews.map(review => (
                    <div key={review.id} className={styles.reviewItem}>
                        <div className={styles.reviewHeader}>
                            <span className={styles.productName}>
                                {review.productNameKr}
                            </span>
                            <div className={styles.actions}>
                                <button
                                    className={styles.editButton}
                                    onClick={() => handleEdit(review)}
                                >
                                    <Edit2 size={16} />
                                </button>
                                <button
                                    className={styles.deleteButton}
                                    onClick={() => handleDelete(review.id, review.productId)}
                                >
                                    삭제
                                </button>
                            </div>
                        </div>
                        {editingReview?.id === review.id ? (
                            <div className={styles.editContainer}>
                                <textarea
                                    className={styles.editInput}
                                    value={editContent}
                                    onChange={(e) => setEditContent(e.target.value)}
                                />
                                <div className={styles.editActions}>
                                    <button
                                        className={styles.saveButton}
                                        onClick={handleUpdate}
                                    >
                                        저장
                                    </button>
                                    <button
                                        className={styles.cancelButton}
                                        onClick={() => setEditingReview(null)}
                                    >
                                        취소
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <p className={styles.reviewContent}>{review.content}</p>
                        )}
                        <span className={styles.date}>
                            {new Date(review.createdAt).toLocaleDateString()}
                        </span>
                    </div>
                ))
            ) : (
                <p className={styles.noReviews}>작성한 리뷰가 없습니다.</p>
            )}
        </div>
    );
};

export default MyReviews;

