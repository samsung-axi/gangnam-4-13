import React from 'react';
import styles from '../../../css/chat/Loading.module.css';

/**
 * AI가 응답을 생성하는 동안 표시되는 로딩 애니메이션 컴포넌트
 * 
 * 주요 특징:
 * - 4개의 연기 효과 애니메이션을 사용
 * - CSS 모듈을 통한 스타일 적용
 * - 순차적으로 움직이는 애니메이션 효과
 */
const LoadingDots = () => (
    <div className={styles.loadingEnhancedLoader}>
        {/* 4개의 연기 효과 요소 */}
        <div className={styles.smoke1}></div>
        <div className={styles.smoke2}></div>
        <div className={styles.smoke3}></div>
        <div className={styles.smoke4}></div>
    </div>
);

export default LoadingDots;
