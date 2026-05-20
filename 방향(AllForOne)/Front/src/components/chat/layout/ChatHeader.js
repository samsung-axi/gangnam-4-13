import React, { memo } from 'react';
import { NavLink } from 'react-router-dom';
import styles from '../../../css/chat/ChatHeader.module.css';

/**
 * 채팅 화면 상단의 헤더 컴포넌트
 * 
 * 주요 구성 요소:
 * 1. 뒤로가기 버튼 - 이전 페이지로 이동
 * 2. 로고 이미지 - 홈으로 이동하는 링크
 * 3. 서비스 설명 문구
 * 
 * @component
 * @param {Object} props
 * @param {Function} props.onGoBack - 뒤로가기 버튼 클릭시 실행되는 함수
 */

const ChatHeader = memo(({ onGoBack }) => {
    return (
        <div className={styles.header}>
            {/* 뒤로가기 버튼 */}
            <button
                className={styles.backButton}
                onClick={onGoBack}
                aria-label="뒤로 가기"
            >
                <img src="/images/back.png" alt="back" className={styles.backImage} />
            </button>

            {/* 홈으로 이동하는 로고 링크 */}
            <NavLink to="/">
                <img src="/images/logo.png" alt="방향" className={styles.titleImage} />
            </NavLink>

            {/* 서비스 설명 문구 */}
            <p className={styles.subtitle}>
                일상의 순간을 향으로 기록해보세요.
            </p>
        </div>
    );
});

export default ChatHeader;
