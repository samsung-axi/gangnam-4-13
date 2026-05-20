// React와 관련 라이브러리 import
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import ShoppingTab from '../../components/shop/ShoppingTab';
import { fetchShopPerfumes, selectShopPerfumes, selectShopLoading, selectShopError } from '../../module/ShopModule';
import { 
    fetchWishlist, 
    addToWishlistThunk, 
    removeFromWishlistThunk, 
    selectWishlistIds, 
    selectWishlistLoading, 
    selectWishlistError,
    setMemberId 
} from '../../module/WishlistModule';
import { addToCartThunk, fetchCart } from '../../module/CartModule';
import '../../css/shop/Shop.css';


/**
 * Shop 컴포넌트
 * 쇼핑 페이지의 메인 컴포넌트입니다.
 * 백엔드 API에서 자체제작 향수 목록을 가져와서 표시하고 찜하기, 장바구니 추가 기능을 제공합니다.
 */
function Shop() {
    // React Router의 네비게이션 훅
    const navigate = useNavigate();
    
    // Redux hooks
    const dispatch = useDispatch();
    
    // Redux 상태에서 데이터 가져오기
    const perfumes = useSelector(selectShopPerfumes);
    const loading = useSelector(selectShopLoading);
    const error = useSelector(selectShopError);
    
    // 찜 목록 상태 (Redux에서 가져오기)
    const wishlistIds = useSelector(selectWishlistIds);
    const wishlistLoading = useSelector(selectWishlistLoading);
    const wishlistError = useSelector(selectWishlistError);
    
    // 로그인된 사용자 ID 가져오기
    const auth = JSON.parse(localStorage.getItem('auth'));
    const memberId = auth?.id || 1; // 로그인된 사용자 ID, 없으면 기본값 1

    /**
     * 컴포넌트 마운트 시 실행되는 useEffect
     * 백엔드에서 자체제작 향수 목록과 찜 목록을 가져옵니다.
     */
    useEffect(() => {
        // 회원 ID 설정
        dispatch(setMemberId(memberId));
        
        // 백엔드에서 자체제작 향수 목록 가져오기
        dispatch(fetchShopPerfumes());
        
        // 백엔드에서 찜 목록 가져오기
        dispatch(fetchWishlist(memberId));
        
        // 백엔드에서 장바구니 목록 가져오기
        dispatch(fetchCart(memberId));
    }, [dispatch, memberId]); // dispatch와 memberId가 변경될 때마다 실행

    /**
     * 찜 목록에 향수를 추가하거나 제거하는 함수
     * 백엔드 API를 통해 찜 상태를 변경합니다.
     * 
     * @param {string} id - 찜할/제거할 향수의 ID
     */
    const handleToggleWishlist = async (id) => {
        try {
            if (wishlistIds.has(id)) {
                // 이미 찜한 항목이면 제거
                await dispatch(removeFromWishlistThunk(memberId, id));
            } else {
                // 찜하지 않은 항목이면 추가
                await dispatch(addToWishlistThunk(memberId, id));
            }
            // 상태 업데이트를 위해 찜 목록 다시 가져오기
            dispatch(fetchWishlist(memberId));
        } catch (error) {
            console.error('찜하기 처리 중 오류:', error);
        }
    };

    /**
     * 장바구니에 향수를 추가하는 함수
     * 백엔드 API를 통해 장바구니에 향수를 추가합니다.
     * 추가 후 시각적 피드백을 위한 애니메이션을 적용합니다.
     * 
     * @param {Object} perfume - 장바구니에 추가할 향수 객체
     */
    const handleAddToCart = async (perfume) => {
        try {
            // 백엔드 API를 통해 장바구니에 추가
            await dispatch(addToCartThunk(memberId, perfume.id, 1));
            
            // 상태 업데이트를 위해 장바구니 다시 가져오기
            dispatch(fetchCart(memberId));
            
            // 장바구니 아이콘에 애니메이션 효과 추가 (확대 후 원래 크기로)
            // ShoppingTab 컴포넌트의 실제 클래스명 사용
            const cartIcons = document.querySelectorAll('.shoppingBagIcon');
            cartIcons.forEach(icon => {
                icon.style.transform = 'scale(1.3)';
                icon.style.transition = 'transform 0.3s ease';
                setTimeout(() => {
                    icon.style.transform = 'scale(1)';
                }, 300);
            });
            
            // 장바구니 배지에 애니메이션 효과 추가 (확대 후 원래 크기로)
            // NotificationBadge 컴포넌트의 실제 구조 사용
            const cartBadges = document.querySelectorAll('[data-badge="cart"]');
            cartBadges.forEach(badge => {
                badge.style.transform = 'scale(1.2)';
                badge.style.transition = 'transform 0.2s ease';
                setTimeout(() => {
                    badge.style.transform = 'scale(1)';
                }, 200);
            });
            
            // 장바구니 탭 버튼에도 애니메이션 효과 추가
            const cartTabButtons = document.querySelectorAll('[data-tab="cart"]');
            cartTabButtons.forEach(button => {
                button.style.transform = 'scale(1.05)';
                button.style.transition = 'transform 0.2s ease';
                setTimeout(() => {
                    button.style.transform = 'scale(1)';
                }, 200);
            });
        } catch (error) {
            console.error('장바구니 추가 중 오류:', error);
        }
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

    // 로딩 상태일 때 표시할 컴포넌트
    if (loading || wishlistLoading) {
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
                
                {/* 로딩 상태 표시 */}
                <div className="shop-container">
                    <div className="shop-content">
                        <div className="loading-container">
                            <div className="loading-spinner"></div>
                            <p>자체제작 향수 목록을 불러오는 중...</p>
                        </div>
                    </div>
                </div>
            </>
        );
    }

    // 에러 상태일 때 표시할 컴포넌트
    if (error || wishlistError) {
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
                
                {/* 에러 상태 표시 */}
                <div className="shop-container">
                    <div className="shop-content">
                        <div className="error-container">
                            <h3>오류가 발생했습니다</h3>
                            <p>{error || wishlistError}</p>
                            <button 
                                className="retry-button"
                                onClick={() => {
                                    dispatch(fetchShopPerfumes());
                                    dispatch(fetchWishlist(memberId));
                                }}
                            >
                                다시 시도
                            </button>
                        </div>
                    </div>
                </div>
            </>
        );
    }

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
            
            {/* 쇼핑 페이지 메인 컨테이너 */}
            <div className="shop-container">
                <div className="shop-content">
                    {/* ShoppingTab 컴포넌트에 필요한 props 전달 */}
                    <ShoppingTab
                        perfumes={perfumes}                    // Redux에서 가져온 자체제작 향수 목록
                        wishlist={wishlistIds}                 // 찜 목록 ID Set
                        onToggleWishlist={handleToggleWishlist} // 찜하기 토글 함수
                        onAddToCart={handleAddToCart}          // 장바구니 추가 함수
                        onViewDetail={handleViewDetail}        // 상세보기 함수
                    />
                </div>
            </div>
        </>
    );
}


// Shop 컴포넌트를 기본 export로 내보내기
export default Shop;
