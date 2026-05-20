// PerfumeReviewState.js
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectPerfumes } from '../../module/PerfumeModule';
import { fetchReviews, selectReviews, createNewReview } from '../../module/ReviewModule';
import { fetchUserLikedReviews, createHeart, deleteHeart } from '../../api/PerfumeAPICalls';
import styles from '../../css/perfumes/PerfumeReviews.module.css';

const usePerfumeReviewState = (perfumeId) => {
    const dispatch = useDispatch();

    // 🟢 슬라이더/리뷰/좋아요/모달 관련 상태
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [sliderLeft, setSliderLeft] = useState(0);
    const [cardOffset, setCardOffset] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [animation, setAnimation] = useState(null);

    const [reviewContent, setReviewContent] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [likedReviews, setLikedReviews] = useState([]);
    const [heartCounts, setHeartCounts] = useState({});
    const [hasInitialized, setHasInitialized] = useState(false);

    // Redux & Auth
    const perfumes = useSelector(selectPerfumes);
    const perfume = perfumes?.find(p => p.id === perfumeId);
    const rawReviews = useSelector(selectReviews) ?? [];

    // 리뷰를 최신순으로 정렬
    const reviews = [...rawReviews].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    // 가장 좋아요가 많은 리뷰 찾기
    const mostLikedReview = reviews.length > 0
        ? [...reviews].sort((a, b) => (b.heartCount || 0) - (a.heartCount || 0))[0]
        : null;

    const auth = JSON.parse(localStorage.getItem('auth'));
    const userId = auth?.id;

    // 상수
    const CARDS_PER_PAGE = 5;
    const totalPages = Math.ceil(reviews.length / CARDS_PER_PAGE);

    // (1) 초기 로딩 (마운트 시 1회) : 리뷰 + 좋아요
    useEffect(() => {
        if (!perfumeId) return;

        const initializeData = async () => {
            try {
                await dispatch(fetchReviews(perfumeId));
                if (userId) {
                    const likedReviewIds = await fetchUserLikedReviews(userId);
                    setLikedReviews(likedReviewIds);
                }
                setHasInitialized(true);

                // 초기 로딩 시 슬라이더를 맨 앞으로 설정
                setCurrentPage(1);
                setSliderLeft(0);
                setCardOffset(0);
            } catch (error) {
                console.error('Data initialization error:', error);
            }
        };

        initializeData();
    }, [perfumeId]);

    // (2) 실제 새로고침 감지
    useEffect(() => {
        const handleRealRefresh = async () => {
            if (!perfumeId) return;

            if (performance.navigation.type === 1) {
                try {
                    await dispatch(fetchReviews(perfumeId));
                    if (userId) {
                        const likedReviewIds = await fetchUserLikedReviews(userId);
                        setLikedReviews(likedReviewIds);
                    }
                    // 새로고침 시에도 슬라이더를 맨 앞으로 설정
                    setCurrentPage(1);
                    setSliderLeft(0);
                    setCardOffset(0);
                } catch (error) {
                    console.error('Refresh data fetch error:', error);
                }
            }
        };

        window.addEventListener('load', handleRealRefresh);
        return () => window.removeEventListener('load', handleRealRefresh);
    }, [perfumeId, userId]);

    // (3) 리뷰 변경 시 슬라이더 상태 & 하트 카운트 업데이트
    useEffect(() => {
        if (reviews.length > 0) {
            const counts = {};
            reviews.forEach(review => {
                counts[review.id] = review.heartCount || 0;
            });
            setHeartCounts(counts);
        }

        // 슬라이더 위치 초기화 (현재 페이지 변경 시)
        if (currentPage === 1) {
            setSliderLeft(0);
            setCardOffset(0);
        } else {
            const percentage = ((currentPage - 1) / (totalPages - 1)) * 100;
            const newOffset = (percentage / 100) * ((reviews.length - CARDS_PER_PAGE) * (196 + 37));
            setSliderLeft(percentage);
            setCardOffset(newOffset);
        }
    }, [reviews.length, currentPage]);

    // (4) 슬라이더 마우스 이벤트 (드래그 & 이동)
    useEffect(() => {
        const handleGlobalMouseMove = (e) => {
            if (!isDragging) return;
            if (animation) cancelAnimationFrame(animation);

            const animate = () => {
                const sliderLine = document.querySelector(`.${styles.sliderLine}`);
                if (!sliderLine) return;

                const rect = sliderLine.getBoundingClientRect();
                const newPosition = e.clientX - rect.left;
                const maxPosition = rect.width - 100;

                const boundedPosition = Math.max(0, Math.min(newPosition, maxPosition));
                const percentage = (boundedPosition / maxPosition) * 100;

                const cardWidth = 196 + 37;
                const maxScroll = (reviews.length - CARDS_PER_PAGE) * cardWidth;
                const newOffset = Math.min((percentage / 100) * maxScroll, maxScroll);

                setSliderLeft(percentage);
                setCardOffset(newOffset);

                const approximatePage = Math.floor((newOffset / maxScroll) * totalPages) + 1;
                if (approximatePage !== currentPage && approximatePage > 0 && approximatePage <= totalPages) {
                    setCurrentPage(approximatePage);
                }
            };

            const animationId = requestAnimationFrame(animate);
            setAnimation(animationId);
        };

        const handleGlobalMouseUp = () => {
            setIsDragging(false);
            if (animation) cancelAnimationFrame(animation);
        };

        window.addEventListener('mousemove', handleGlobalMouseMove);
        window.addEventListener('mouseup', handleGlobalMouseUp);

        return () => {
            window.removeEventListener('mousemove', handleGlobalMouseMove);
            window.removeEventListener('mouseup', handleGlobalMouseUp);
            if (animation) cancelAnimationFrame(animation);
        };
    }, [isDragging, animation, currentPage, reviews.length, totalPages, CARDS_PER_PAGE]);

    // (5) 마우스다운 핸들러
    const handleMouseDown = (e) => {
        e.preventDefault();
        setIsDragging(true);
        setStartX(e.clientX);
    };

    // (6) 좋아요 토글
    const handleToggleHeart = async (reviewId) => {
        if (!userId) {
            alert("로그인이 필요합니다.");
            return;
        }
        try {
            // 즉시 UI 반영
            const isLiked = likedReviews.includes(reviewId);
            setLikedReviews(prev =>
                isLiked ? prev.filter(id => id !== reviewId) : [...prev, reviewId]
            );
            setHeartCounts(prev => ({
                ...prev,
                [reviewId]: isLiked
                    ? Math.max(0, (prev[reviewId] || 1) - 1)
                    : (prev[reviewId] || 0) + 1
            }));

            // 서버 요청
            if (isLiked) {
                await deleteHeart(reviewId);
            } else {
                await createHeart(userId, reviewId);
            }

            // 서버 최신 리뷰
            await dispatch(fetchReviews(perfumeId));
        } catch (error) {
            console.error("좋아요 처리 실패:", error);
            // 에러 시 서버 데이터로 복구
            await dispatch(fetchReviews(perfumeId));
        }
    };

    // (7) 리뷰 작성
    const handleReviewSubmit = async () => {
        if (!userId) {
            alert('리뷰를 작성하려면 로그인이 필요합니다.');
            return;
        }
        try {
            await dispatch(createNewReview({
                productId: perfumeId,
                memberId: userId,
                content: reviewContent
            }));
            setReviewContent('');
            setIsModalOpen(false);

            // 리뷰 작성 후 최신 데이터를 가져오고 슬라이더를 맨 앞으로 리셋
            await dispatch(fetchReviews(perfumeId));
            setCurrentPage(1);
            setSliderLeft(0);
            setCardOffset(0);

        } catch (error) {
            console.error("리뷰 작성 실패:", error);
            alert('리뷰 작성에 실패했습니다.');
        }
    };

    // (8) 모달 열기 / 닫기
    const handleModalOpen = () => {
        setIsModalOpen(true);
    };

    const handleModalClose = async () => {
        setIsModalOpen(false);
        if (userId) {
            await dispatch(fetchReviews(perfumeId));
            try {
                const likedReviewIds = await fetchUserLikedReviews(userId);
                setLikedReviews(likedReviewIds);
            } catch (error) {
                console.error("좋아요 데이터 불러오기 실패:", error);
            }
        }
    };

    return {
        // 상태
        isDragging,
        startX,
        sliderLeft,
        cardOffset,
        currentPage,
        animation,
        reviewContent,
        isModalOpen,
        likedReviews,
        heartCounts,
        // Redux
        reviews,
        perfume,
        CARDS_PER_PAGE,
        totalPages,
        mostLikedReview,
        // 핸들러
        handleMouseDown,
        handleToggleHeart,
        handleReviewSubmit,
        handleModalClose,
        handleModalOpen,
        setReviewContent,
        setCurrentPage,
        setSliderLeft,
        setCardOffset
    };
};

export default usePerfumeReviewState;