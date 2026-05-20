// React와 관련 라이브러리 import
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Heart, ShoppingCart, Search, ShoppingBag } from 'lucide-react';
import PerfumeCard from '../../components/shop/PerfumeCard';
import NotificationBadge from '../../components/shop/NotificationBadge';
import { 
    fetchWishlist, 
    clearAllWishlistThunk, 
    moveWishlistToCartThunk,
    removeFromWishlistThunk,
    addToWishlistThunk,
    selectWishlist, 
    selectWishlistIds, 
    selectWishlistLoading, 
    selectWishlistError,
    setMemberId 
} from '../../module/WishlistModule';
import { addToCartThunk, selectCartCount, fetchCart } from '../../module/CartModule';
import '../../css/shop/Wishlist.css';
import styles from '../../css/shop/ShoppingTab.module.css';

/**
 * 향수 데이터 타입 정의
 * 향수 객체의 구조를 명시하는 타입 정의입니다.
 * 실제 데이터는 이 구조를 따릅니다.
 */
const Perfume = {
    id: String,                    // 향수 고유 ID
    name: String,                  // 향수 이름
    brand: String,                 // 브랜드명
    price: Number,                 // 현재 가격
    originalPrice: Number,         // 원가 (할인이 있는 경우)
    image: String,                 // 메인 이미지 경로
    rating: Number,                // 평점
    category: String,              // 카테고리
    description: String,           // 향수 설명
    volume: String,                // 용량 (예: '50ml', '100ml')
    notes: {                       // 향수 노트 정보
        top: Array,               // 탑 노트 (처음 느껴지는 향)
        middle: Array,            // 미들 노트 (중간에 느껴지는 향)
        base: Array               // 베이스 노트 (마지막에 남는 향)
    },
    detailImages: {                // 상세 페이지용 이미지들
        ingredients: String,       // 재료 이미지
        process: String,           // 제조 과정 이미지
        brand: String,             // 브랜드 이미지
        lifestyle: String          // 라이프스타일 이미지
    }
};

/**
 * Wishlist 컴포넌트
 * 찜 목록 페이지를 담당하는 컴포넌트입니다.
 * 찜한 향수들을 표시하고, 전체 삭제, 전체 장바구니 추가 기능을 제공합니다.
 */
function Wishlist() {
    // React Router의 네비게이션 훅
    const navigate = useNavigate();
    
    // Redux hooks
    const dispatch = useDispatch();
    
    // Redux 상태에서 데이터 가져오기
    const wishlist = useSelector(selectWishlist);
    const wishlistIds = useSelector(selectWishlistIds);
    const wishlistLoading = useSelector(selectWishlistLoading);
    const wishlistError = useSelector(selectWishlistError);
    const cartCount = useSelector(selectCartCount);
    
    // localStorage에서 로그인된 사용자 정보 가져오기
    const auth = JSON.parse(localStorage.getItem('auth'));
    const memberId = auth?.id; // 로그인된 사용자의 ID (auth가 없으면 undefined)

    /**
     * 컴포넌트 마운트 시 백엔드에서 찜 목록을 불러오는 useEffect
     */
    useEffect(() => {
        // 로그인된 사용자가 있을 때만 데이터를 가져옴
        if (memberId) {
            // 회원 ID 설정
            dispatch(setMemberId(memberId));
            
            // 백엔드에서 찜 목록 가져오기
            dispatch(fetchWishlist(memberId));
            
            // 백엔드에서 장바구니 목록 가져오기
            dispatch(fetchCart(memberId));
        }
    }, [dispatch, memberId]); // dispatch와 memberId가 변경될 때마다 실행

    /**
     * 찜 목록에 있는 향수들 (Redux에서 가져온 데이터 사용)
     */
    const wishlistPerfumes = wishlist;

    /**
     * 찜 목록에 향수를 추가하거나 제거하는 함수
     * 백엔드 API를 통해 찜 상태를 변경합니다.
     * 
     * @param {string} perfumeId - 찜할/제거할 향수의 ID
     */
    const handleToggleWishlist = (perfumeId) => {
        if (wishlistIds.has(perfumeId)) {
            // 이미 찜한 항목이면 제거
            dispatch(removeFromWishlistThunk(memberId, perfumeId));
        } else {
            // 찜하지 않은 항목이면 추가
            dispatch(addToWishlistThunk(memberId, perfumeId));
        }
    };

    /**
     * 장바구니에 향수를 추가하는 함수
     * 백엔드 API를 통해 장바구니에 향수를 추가합니다.
     * 추가 후 시각적 피드백을 위한 애니메이션을 적용합니다.
     * 
     * @param {Object} perfume - 장바구니에 추가할 향수 객체
     */
    const handleAddToCart = (perfume) => {
        // 백엔드 API를 통해 장바구니에 추가
        dispatch(addToCartThunk(memberId, perfume.id, 1));
        
        // 장바구니 아이콘에 애니메이션 효과 추가 (확대 후 원래 크기로)
        const cartIcons = document.querySelectorAll('.shopping-bag-icon');
        cartIcons.forEach(icon => {
            icon.style.transform = 'scale(1.3)';
            icon.style.transition = 'transform 0.3s ease';
            setTimeout(() => {
                icon.style.transform = 'scale(1)';
            }, 300);
        });
        
        // 장바구니 배지에 애니메이션 효과 추가 (확대 후 원래 크기로)
        const cartBadges = document.querySelectorAll('[data-badge="cart"]');
        cartBadges.forEach(badge => {
            badge.style.transform = 'scale(1.2)';
            badge.style.transition = 'transform 0.2s ease';
            setTimeout(() => {
                badge.style.transform = 'scale(1)';
            }, 200);
        });
    };

    /**
     * 향수 상세보기 함수
     * 향수 카드 클릭 시 상세 페이지로 이동합니다.
     * 
     * @param {Object} perfume - 상세보기할 향수 객체
     */
    const handleViewDetail = (perfume) => {
        // 향수 상세 페이지로 이동
        navigate(`/perfume/${perfume.id}`);
    };

    /**
     * 찜 목록을 모두 비우는 함수
     * 백엔드 API를 통해 찜 목록을 모두 삭제합니다.
     */
    const handleClearAll = () => {
        dispatch(clearAllWishlistThunk(memberId));
    };

    /**
     * 찜 목록의 모든 향수를 장바구니에 추가하는 함수
     * 백엔드 API를 통해 찜 상품을 장바구니에 추가합니다.
     */
    const handleAddAllToCart = () => {
        // 찜 목록이 비어있으면 함수 종료
        if (wishlistPerfumes.length === 0) {
            return;
        }

        // 백엔드 API를 통해 찜 상품을 장바구니에 추가
        dispatch(moveWishlistToCartThunk(memberId));
        
        // 장바구니 아이콘에 애니메이션 효과 추가 (확대 후 원래 크기로)
        const cartIcons = document.querySelectorAll('.shopping-bag-icon');
        cartIcons.forEach(icon => {
            icon.style.transform = 'scale(1.3)';
            icon.style.transition = 'transform 0.3s ease';
            setTimeout(() => {
                icon.style.transform = 'scale(1)';
            }, 300);
        });
        
        // 장바구니 배지에 애니메이션 효과 추가 (확대 후 원래 크기로)
        const cartBadges = document.querySelectorAll('[data-badge="cart"]');
        cartBadges.forEach(badge => {
            badge.style.transform = 'scale(1.2)';
            badge.style.transition = 'transform 0.2s ease';
            setTimeout(() => {
                badge.style.transform = 'scale(1)';
            }, 200);
        });
    };

    /**
     * 탭 클릭 시 실행되는 함수
     * 탭 전환 애니메이션을 적용하고 해당 페이지로 이동합니다.
     * 
     * @param {string} tab - 클릭된 탭 이름 ('shopping', 'cart')
     */
    const handleTabClick = (tab) => {
        // 부드러운 페이지 전환을 위한 페이드 아웃 애니메이션
        const container = document.querySelector('.wishlist-container');
        if (container) {
            container.style.opacity = '0.7';
            container.style.transform = 'translateY(10px)';
        }
        
        // 애니메이션 후 페이지 이동 (150ms 지연)
        setTimeout(() => {
            if (tab === 'shopping') {
                navigate('/shop'); // 쇼핑 페이지로 이동
            } else if (tab === 'cart') {
                navigate('/cart'); // 장바구니 페이지로 이동
            }
        }, 150);
    };

    return (
        <>
            {/* 상단 로고 (클릭 시 메인 페이지로 이동) */}
            <img
                src="/images/logo.png"
                alt="로고"
                className="main-logo-image"
                onClick={() => navigate('/')}
                style={{ cursor: 'pointer' }}
            />
            <div className="wishlist-container">
                <div className="wishlist-content">
                    {/* 페이지 상단 헤더 영역 - ShoppingTab과 동일한 구조 */}
                    <div className={styles.header}>
                        <div className={styles.headerContent}>
                            {/* 제목 영역 (검색바 대신) */}
                            <div className={styles.searchBar}>
                                <div className="title-section">
                                    <h1 className="wishlist-title">찜 목록</h1>
                                    <p className="wishlist-subtitle">마음에 드는 향수를 모아보세요. ({wishlistPerfumes.length})</p>
                                </div>
                            </div>
                            
                            {/* 액션 버튼들 (찜 목록이 있을 때만 표시) - 가운데 배치 */}
                            {wishlistPerfumes.length > 0 && (
                                <div className="wishlist-action-buttons">
                                    <div className="action-buttons">
                                        {/* 전체 삭제 버튼 */}
                                        <button 
                                            className="clear-all-btn"
                                            onClick={handleClearAll}
                                        >
                                            전체 삭제
                                        </button>
                                        {/* 전체 장바구니 추가 버튼 */}
                                        <button 
                                            className="add-all-cart-btn"
                                            onClick={handleAddAllToCart}
                                        >
                                            <div className="cart-icon-with-plus">
                                                <ShoppingBag size={16} />
                                                <div className="plus-icon">+</div>
                                            </div>
                                            전체 장바구니 추가
                                        </button>
                                    </div>
                                </div>
                            )}
                            
                            {/* 네비게이션 탭 영역 */}
                            <div className={styles.navTabs}>
                                {/* 쇼핑 탭 */}
                                <button 
                                    className={styles.tabButton}
                                    onClick={() => handleTabClick('shopping')}
                                >
                                    쇼핑
                                </button>
                                <div className={styles.tabSeparator}></div>
                                
                                {/* 찜 탭 (현재 활성화된 탭, 하트 아이콘과 알림 배지 포함) */}
                                <button 
                                    className={`${styles.tabButton} ${styles.tabButtonActive}`}
                                >
                                    <div className={styles.tabIconContainer}>
                                        <Heart className={styles.tabIcon} size={16} />
                                        <NotificationBadge count={wishlistIds.size} show={wishlistIds.size > 0} type="wishlist" />
                                    </div>
                                    찜
                                </button>
                                <div className={styles.tabSeparator}></div>
                                
                                {/* 장바구니 탭 (쇼핑백 아이콘과 알림 배지 포함) */}
                                <button 
                                    className={styles.tabButton}
                                    onClick={() => handleTabClick('cart')}
                                >
                                    <div className={styles.tabIconContainer}>
                                        <div className={styles.shoppingBagIcon}></div>
                                        <NotificationBadge count={cartCount} show={cartCount > 0} type="cart" />
                                    </div>
                                    장바구니
                                </button>
                            </div>
                        </div>
                        {/* 헤더 하단 구분선 */}
                        <div className={styles.headerLine}></div>
                    </div>

                    {/* 찜 목록에 아이템이 있을 때와 없을 때의 조건부 렌더링 */}
                    {wishlistPerfumes.length > 0 ? (
                        // 찜 목록에 아이템이 있을 때: 향수 카드들을 그리드로 표시
                        <div className="wishlist-grid" style={{ marginTop: '30px' }}>
                            {wishlistPerfumes.map((perfume) => (
                                <PerfumeCard
                                    key={perfume.id}
                                    perfume={perfume}
                                    isWishlisted={wishlistIds.has(perfume.id)} // Redux 상태에서 찜 여부 확인
                                    onToggleWishlist={handleToggleWishlist}
                                    onAddToCart={handleAddToCart}
                                    onViewDetail={handleViewDetail}
                                />
                            ))}
                        </div>
                    ) : (
                        // 찜 목록이 비어있을 때: 빈 상태 메시지 표시
                        <div className="wishlist-empty" style={{ marginTop: '30px' }}>
                            <Heart className="empty-icon" size={48} />
                            <h3>찜한 향수가 없습니다</h3>
                            <p>마음에 드는 향수를 찜해보세요!</p>
                            <button 
                                className="browse-button"
                                onClick={() => navigate('/shop')}
                            >
                                향수 둘러보기
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

// Wishlist 컴포넌트를 기본 export로 내보내기
export default Wishlist;
