import React, { memo } from 'react';
import styles from '../../../css/chat/Modal.module.css';

/**
 * 로그인 모달 컴포넌트
 * 
 * 주요 기능:
 * - 비로그인 사용자에게 로그인 안내
 * - 로그인 버튼과 비회원 계속하기 옵션 제공
 * - isOpen prop으로 모달 표시 여부 제어
 * 
 * @component
 * @param {Object} props
 * @param {boolean} props.isOpen - 모달 표시 여부
 * @param {Function} props.onClose - 모달 닫기 함수 (비회원으로 계속하기)
 * @param {Function} props.onLogin - 로그인 처리 함수
 */

const LoginModal = memo(({ isOpen, onClose, onLogin }) => {
    // 모달이 닫혀있으면 아무것도 렌더링하지 않음
    if (!isOpen) return null;

    return (
        // 모달 오버레이 - 배경을 어둡게 처리
        <div className={styles.nonMemberModalOverlay}>
            {/* 모달 내용 영역 */}
            <div className={styles.nonMemberModalContent}>
                {/* 모달 제목 */}
                <h2 className={styles.nonMemberModalContent1}>로그인이 필요합니다</h2>
                {/* 모달 설명 */}
                <p className={styles.nonMemberModalContent2}>
                    회원가입 후 이용하시면<br />
                    더 많은 서비스를 이용하실 수 있습니다.
                </p>
                {/* 버튼 그룹 */}
                <div className="button-group">
                    {/* 로그인 버튼 */}
                    <button className={styles.nonMemberLoginButton} onClick={onLogin}>로그인하기</button>
                    {/* 비회원 계속하기 버튼 */}
                    <button className={styles.nonMemberCloseButton} onClick={onClose}>비회원으로 계속하기</button>
                </div>
            </div>
        </div>
    );
});

export default LoginModal;
