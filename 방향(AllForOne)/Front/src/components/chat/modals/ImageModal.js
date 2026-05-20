import React, { memo } from 'react';
import styles from '../../../css/chat/Modal.module.css';

/**
 * 이미지 모달 컴포넌트
 * 
 * 주요 기능:
 * - 채팅에서 이미지 클릭시 큰 화면으로 표시
 * - 모달 외부 영역 클릭시 닫기 가능
 * - 우측 상단의 X 버튼으로 닫기 가능
 * 
 * @component
 * @param {Object} props
 * @param {string} props.image - 표시할 이미지 URL
 * @param {Function} props.onClose - 모달 닫기 함수
 */

// React.memo로 감싸서 불필요한 리렌더링 방지
const ImageModal = memo(({ image, onClose, isOpen }) => {
    console.log('ImageModal 렌더링:', { image, onClose, isOpen });
    if (!image) return null;
    
    return (
        // 모달 오버레이 - 배경을 어둡게 처리하고 클릭시 모달 닫기
        <div className={styles.modalOverlay} onClick={onClose}>
            {/* 
                모달 내용 영역
                - stopPropagation으로 내부 클릭시 모달이 닫히지 않도록 처리
            */}
            <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
                {/* 확대된 이미지 표시 */}
                <img src={image} alt="확대된 이미지" />
                {/* 모달 닫기 버튼 */}
                <button className={styles.modalClose} onClick={onClose}>×</button>
            </div>
        </div>
    );
});

export default ImageModal;
