import React, { useState, useEffect } from 'react';
import { Edit } from 'lucide-react';
import styles from '../../css/perfumes/PerfumeCard.module.css';
import { useNavigate } from 'react-router-dom';
import { toggleBookmark } from '../../api/BookmarkAPICalls';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBookmarks } from '../../module/BookmarkModule';
import { addBookmarkDirect, deleteBookmarkDirect } from '../../module/BookmarkModule';

const PerfumeCard = ({
    perfume,
    showCheckboxes,
    selectedCard,  // selectedCard 값을 prop으로 받음
    role,
    onCheckboxChange,
    onEditClick,
    currentPage,
    isBookmarked,
}) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [isMarked, setIsMarked] = useState(isBookmarked);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [clickCount, setClickCount] = useState(0);
    const [clickTimer, setClickTimer] = useState(null);
    const [lastClickTime, setLastClickTime] = useState(0);
    const { bookmarkedPerfumes } = useSelector(state => state.bookmark);

    // 로컬 스토리지에서 auth 정보 가져오기
    const auth = JSON.parse(localStorage.getItem('auth'));

    // 이미지 URL이 배열인지 확인하고 기본값 설정
    const imageUrls = Array.isArray(perfume?.imageUrlList) && perfume.imageUrlList.length > 0
        ? perfume.imageUrlList
        : ['https://sensient-beauty.com/wp-content/uploads/2023/11/Fragrance-Trends-Alcohol-Free.jpg'];

    useEffect(() => {
        let slideInterval;

        if (imageUrls.length > 1) {
            slideInterval = setInterval(() => {
                setIsTransitioning(true);
                setTimeout(() => {
                    setCurrentImageIndex(prevIndex =>
                        prevIndex === imageUrls.length - 1 ? 0 : prevIndex + 1
                    );
                    setIsTransitioning(false);
                }, 300);
            }, 3000);
        }

        return () => {
            if (slideInterval) {
                clearInterval(slideInterval);
            }
        };
    }, [imageUrls.length]);

    // 컴포넌트 언마운트 시 타이머 정리
    useEffect(() => {
        return () => {
            if (clickTimer) clearTimeout(clickTimer);
        };
    }, [clickTimer]);

    // 1. 데이터 로드용 useEffect (API 호출은 필요할 때만)
    useEffect(() => {
        if (!bookmarkedPerfumes.length && auth?.id) {
            dispatch(fetchBookmarks(auth.id))
                .catch(error => console.error('북마크 상태 확인 실패:', error));
        }
    }, [auth?.id, dispatch, bookmarkedPerfumes.length]);

    // 2. 상태 업데이트용 useEffect (UI 표시 최적화)
    useEffect(() => {
        if (bookmarkedPerfumes.length > 0) {
            const isBookmarkedInRedux = bookmarkedPerfumes.some(
                bookmark => bookmark.productId === perfume.id
            );
            
            // 상태가 다를 때만 업데이트 (불필요한 리렌더링 방지)
            if (isMarked !== isBookmarkedInRedux) {
                setIsMarked(isBookmarkedInRedux);
            }
        }
    }, [bookmarkedPerfumes, perfume.id, isMarked]);

    const handleCardClick = async (e) => {
        // 체크박스나 편집 버튼 클릭 시 무시
        if (e.target.type === 'checkbox' || e.target.closest('button')) {
            return;
        }
    
        // 체크박스 모드일 때는 바로 체크박스 토글
        if (showCheckboxes) {
            onCheckboxChange(perfume.id);
            return;
        }
    
        const currentTime = new Date().getTime();
        const timeDiff = currentTime - lastClickTime;
    
        if (timeDiff < 300) {
            // 더블클릭: 북마크 토글
            if (clickTimer) {
                clearTimeout(clickTimer); // 싱글클릭 타이머 취소
                setClickTimer(null);
            }
            
            const auth = JSON.parse(localStorage.getItem('auth'));
            if (!auth?.id) {
                return;
            }
        
            try {
                // 현재 북마크 상태 토글
                const newIsMarked = !isMarked;
                
                // UI 상태 즉시 업데이트
                setIsMarked(newIsMarked);
                
                // 북마크 상태 업데이트
                if (newIsMarked) {
                    dispatch(addBookmarkDirect({
                        productId: perfume.id,
                        nameKr: perfume.nameKr,
                        brand: perfume.brand,
                        imageUrls: [imageUrls[currentImageIndex]]
                    }));
                } else {
                    dispatch(deleteBookmarkDirect(perfume.id));
                }
                
                // API 호출은 별도 스레드에서 비동기적으로
                setTimeout(() => {
                    toggleBookmark(perfume.id, auth.id)
                        .catch(error => console.error('북마크 API 호출 실패:', error));
                }, 0);
                
            } catch (error) {
                setIsMarked(prev => !prev);
                console.error('북마크 토글 실패:', error);
            }
            
            setLastClickTime(0);
        } else {
            // 첫 번째 클릭 - 타이머 설정
            setLastClickTime(currentTime);
            
            // 이전 타이머가 있으면 정리
            if (clickTimer) {
                clearTimeout(clickTimer);
            }
            
            // 새 타이머 설정 및 저장
            const newTimer = setTimeout(() => {
                // 더블클릭이 발생하지 않았을 경우에만 페이지 이동
                navigate(`/perfumes/${perfume.id}`, {
                    state: { previousPage: currentPage }
                });
                setClickTimer(null);
            }, 300);
            
            setClickTimer(newTimer);
        }
    };

    // 컴포넌트 언마운트 시 타이머 정리
    useEffect(() => {
        return () => {
            if (clickTimer) {
                clearTimeout(clickTimer);
            }
        };
    }, [clickTimer]);

    return (
        <div className={`${styles.card} ${isMarked ? styles.bookmarked : ''}`} onClick={handleCardClick}>
            {showCheckboxes && (
                <input
                    type="checkbox"
                    className={styles.checkbox}
                    checked={selectedCard === perfume.id}
                    onChange={() => onCheckboxChange(perfume.id)}
                    onClick={(e) => e.stopPropagation()}
                />
            )}

            {role === 'ADMIN' && (
                <button className={styles.editButton} onClick={(e) => {
                    e.stopPropagation();
                    onEditClick(perfume);
                }}>
                    <Edit size={16} color="#333" />
                </button>
            )}

            <div className={styles.imageContainer}>
                <img src={imageUrls[currentImageIndex]} alt={perfume.name} className={styles.image} />
            </div>

            <div className={styles.name}><strong>{perfume.nameKr}</strong></div>
            <div className={styles.divider}></div>
            <div className={styles.category}>{perfume.brand}</div>
            <div className={styles.grade}>{perfume.grade}</div>
            <div className={styles.description}>
                <p>"{perfume.content}"</p>
                <br />
                {perfume.singleNote && <p><strong>싱글 노트 | </strong> {perfume.singleNote}</p>}
                {perfume.topNote && <p><strong>탑 노트 | </strong> {perfume.topNote}</p>}
                {perfume.middleNote && <p><strong>미들 노트 | </strong> {perfume.middleNote}</p>}
                {perfume.baseNote && <p><strong>베이스 노트 | </strong> {perfume.baseNote}</p>}
            </div>
        </div>
    );
};

export default PerfumeCard;
