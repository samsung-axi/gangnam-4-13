// React와 관련 라이브러리 import
import React from 'react';
import { Heart, ShoppingCart } from 'lucide-react';
import styles from '../../css/shop/PerfumeCard.module.css';

/**
 * PerfumeCard 컴포넌트
 * 개별 향수 정보를 카드 형태로 표시하는 컴포넌트입니다.
 * 찜하기, 장바구니 추가, 상세보기 기능을 제공합니다.
 * 
 * @param {Object} perfume - 향수 정보 객체
 * @param {boolean} isWishlisted - 찜 목록에 포함되어 있는지 여부
 * @param {Function} onToggleWishlist - 찜 추가/제거 함수
 * @param {Function} onAddToCart - 장바구니 추가 함수
 * @param {Function} onViewDetail - 향수 상세보기 함수
 */
function PerfumeCard({ perfume, isWishlisted, onToggleWishlist, onAddToCart, onViewDetail }) {

    return (
        <div className={styles.perfumeCard}>
            {/* 향수 이미지와 찜 버튼이 들어있는 컨테이너 */}
            <div className={styles.cardImageContainer}>
                {/* 향수 이미지 (클릭 시 상세보기) */}
                <img
                    src={perfume.image}
                    alt={perfume.name}
                    className={styles.cardImage}
                    onClick={() => onViewDetail(perfume)}
                />

                {/* 찜하기 버튼 (하트 아이콘) */}
                <button
                    className={styles.wishlistButton}
                    onClick={(e) => {
                        e.stopPropagation(); // 이미지 클릭 이벤트 전파 방지
                        onToggleWishlist(perfume.id); // 찜 추가/제거 함수 호출
                    }}
                >
                    <Heart 
                        className={`${styles.heartIcon} ${isWishlisted ? styles.heartIconActive : ''}`} 
                    />
                </button>

            </div>

            {/* 카드 하단 콘텐츠 영역 */}
            <div className={styles.cardContent}>
                {/* 향수 정보 (클릭 시 상세보기) */}
                <div onClick={() => onViewDetail(perfume)}>
                    <h3 className={styles.perfumeName}>
                        {perfume.name}
                    </h3>
                    <p className={styles.volume}>{perfume.volume}</p>
                </div>

                {/* 가격 정보와 장바구니 버튼 영역 */}
                <div className={styles.priceCartContainer}>
                    {/* 가격 표시 영역 */}
                    <div className={styles.priceContainer}>
                        <div className={styles.priceRow}>
                            {/* 현재 가격 */}
                            <span className={styles.price}>
                                ₩{perfume.price.toLocaleString()}
                            </span>
                        </div>
                    </div>

                    {/* 장바구니 추가 버튼 */}
                    <button
                        className={styles.cartButton}
                        onClick={(e) => {
                            e.stopPropagation(); // 상위 요소 클릭 이벤트 전파 방지
                            onAddToCart(perfume); // 장바구니 추가 함수 호출
                        }}
                    >
                        <div className={styles.cartIcon}></div>
                        장바구니
                    </button>
                </div>
            </div>
        </div>
    );
}

// PerfumeCard 컴포넌트를 기본 export로 내보내기
export default PerfumeCard;
