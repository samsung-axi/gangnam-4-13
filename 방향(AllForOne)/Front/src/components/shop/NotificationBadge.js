// React와 CSS 모듈 import
import React from 'react';
import styles from '../../css/shop/NotificationBadge.module.css';

/**
 * NotificationBadge 컴포넌트
 * 찜 목록이나 장바구니 등의 개수를 표시하는 알림 배지 컴포넌트입니다.
 * 개수가 0이거나 표시하지 않을 때는 렌더링되지 않습니다.
 * 
 * @param {number} count - 표시할 개수
 * @param {boolean} show - 배지를 표시할지 여부 (기본값: false)
 * @param {string} type - 배지 타입 ('wishlist', 'cart' 등, 기본값: 'wishlist')
 */
function NotificationBadge({ count, show = false, type = 'wishlist' }) {
    // 표시하지 않거나 개수가 0이면 아무것도 렌더링하지 않음
    if (!show || count === 0) return null;

    return (
        <div className={styles.badge} data-badge={type}>
            {/* 개수가 99를 초과하면 '99+'로 표시, 그렇지 않으면 실제 개수 표시 */}
            {count > 99 ? '99+' : count}
        </div>
    );
}

// NotificationBadge 컴포넌트를 기본 export로 내보내기
export default NotificationBadge;
