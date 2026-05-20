import React, { useEffect, useState } from 'react';
import styles from '../../css/perfumes/BookmarkPopover.module.css';
import { X } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBookmarks, handleDeleteBookmark } from '../../module/BookmarkModule';

const BookmarkPopover = ({ show, onClose }) => {
    const dispatch = useDispatch();
    const { bookmarkedPerfumes, recommendedPerfumes, loading, error } = useSelector(state => state.bookmark);
    const [activeTab, setActiveTab] = useState('bookmarked');
    const [recommendedLoading, setRecommendedLoading] = useState(true);
    const [isInitialLoad, setIsInitialLoad] = useState(true);

    useEffect(() => {
        // 팝업이 처음 열릴 때만 데이터 가져오기
        if (show && isInitialLoad) {
            const auth = JSON.parse(localStorage.getItem('auth'));
            if (auth?.id) {
                setRecommendedLoading(activeTab === 'recommended');
                dispatch(fetchBookmarks(auth.id))
                    .finally(() => {
                        setRecommendedLoading(false);
                        setIsInitialLoad(false);
                    });
            }
        }
    }, [show, isInitialLoad, dispatch, activeTab]);

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        if (tab === 'recommended' && isInitialLoad) {
            setRecommendedLoading(true);
        }
    };

    const handleDelete = async (productId) => {
        const auth = JSON.parse(localStorage.getItem('auth'));
        if (!auth?.id) return;

        try {
            await dispatch(handleDeleteBookmark(productId, auth.id));
        } catch (error) {
            console.error('북마크 삭제 실패:', error);
        }
    };

    if (!show) return null;

    return (
        <div className={styles.popoverContainer}>
            <div className={styles.header}>
                <h3>북마크</h3>
                <button onClick={onClose} className={styles.closeButton}>
                    <X size={16} />
                </button>
            </div>

            <div className={styles.tabs}>
                <button
                    className={`${styles.tabButton} ${activeTab === 'bookmarked' ? styles.active : ''}`}
                    onClick={() => setActiveTab('bookmarked')}
                >
                    내가 찜한 향수
                </button>
                <button
                    className={`${styles.tabButton} ${activeTab === 'recommended' ? styles.active : ''}`}
                    onClick={() => handleTabChange('recommended')}
                >
                    유사 취향 선호 향수
                </button>
            </div>

            <div className={styles.contentContainer}>
                {activeTab === 'bookmarked' && (
                    <div className={styles.section}>
                        <div className={styles.perfumeGrid}>
                            {bookmarkedPerfumes?.length > 0 ? (
                                bookmarkedPerfumes.map((perfume, index) => (
                                    <div key={`bookmarked-${perfume.productId || index}`} className={styles.perfumeItem}>
                                        <div className={styles.perfumeItemHeader}>
                                            <button
                                                className={styles.deleteButton}
                                                onClick={() => handleDelete(perfume.productId)}
                                            >
                                                <X size={16} />
                                            </button>
                                        </div>
                                        <img
                                            src={perfume.imageUrls?.[0]}
                                            alt={perfume.nameKr}
                                            className={styles.perfumeImage}
                                        />
                                        <div className={styles.perfumeInfo}>
                                            <span className={styles.perfumeName}>{perfume.nameKr}</span>
                                            <span className={styles.perfumeBrand}>{perfume.brand}</span>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p>북마크한 향수가 없습니다.</p>
                            )}
                        </div>
                    </div>
                )}

                {activeTab === 'recommended' && (
                    <div className={styles.section}>
                        {isInitialLoad && recommendedLoading ? (
                            <div className={styles.loading}>로딩 중...</div>
                        ) : (
                            <div className={styles.perfumeGrid}>
                                {recommendedPerfumes?.length > 0 ? (
                                    recommendedPerfumes.map((perfume, index) => (
                                        <div key={`recommended-${perfume.productId || index}`} className={styles.perfumeItem}>
                                            <img
                                                src={perfume.imageUrls}
                                                alt={perfume.nameKr}
                                                className={styles.perfumeImage}
                                            />
                                            <div className={styles.perfumeInfo}>
                                                <span className={styles.perfumeName}>{perfume.nameKr}</span>
                                                <span className={styles.perfumeBrand}>{perfume.brand}</span>
                                                {perfume.mainAccord && (
                                                    <span className={styles.mainAccord}>{perfume.mainAccord}</span>
                                                )}
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p>추천 향수가 없습니다.</p>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default BookmarkPopover;