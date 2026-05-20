import React, { memo } from 'react';
import styles from '../../../css/chat/MessageItem.module.css';

/**
 * 채팅 메시지의 개별 항목을 표시하는 컴포넌트
 * 
 * 주요 기능:
 * - 사용자/AI 메시지 구분하여 다른 스타일로 표시
 * - 검색어 하이라이트 기능
 * - 이미지 첨부 기능 (사용자 메시지)
 * - 초기 메시지 특별 스타일 지원
 * 
 * @component
 * @param {Object} props
 * @param {Object} props.message - 메시지 정보 (type, content, images 등)
 * @param {boolean} props.isHighlighted - 검색 결과 하이라이트 여부
 * @param {string} props.searchInput - 검색어
 * @param {Function} props.openModal - 이미지 클릭시 모달 열기 함수
 * @param {string} props.color - 메시지 장식용 컬러 (미사용, 필요에 따라 확장 가능)
 */
const MessageItem = memo(({
    message,
    isHighlighted,
    searchInput,
    openModal,
    color
}) => {
    /**
     * 검색어와 일치하는 텍스트를 하이라이트 처리하는 함수
     * - 텍스트가 검색어를 포함하면 해당 부분을 <mark> 태그로 감싸서 강조 표시함
     *
     * @param {string} text - 원본 텍스트
     * @returns {string|JSX.Element} 하이라이트된 텍스트 혹은 원본 텍스트
     */
    const highlightText = (text) => {
        // 텍스트 또는 검색어가 없으면 원본 텍스트 그대로 반환
        if (!text || !searchInput) return text;
        // 입력된 값이 문자열이 아닌 경우 빈 문자열 반환
        if (typeof text !== 'string') return '';

        try {
            // 정규식을 이용해 텍스트를 검색어를 기준으로 분할
            const parts = text.split(new RegExp(`(${searchInput})`, 'gi'));
            // 분할된 텍스트 조각들을 순회하면서 검색어와 일치하는 부분은 <mark> 태그로 감싸 강조 표시
            return parts.map((part, i) =>
                part.toLowerCase() === searchInput?.toLowerCase()
                    ? <mark key={i} className="highlight">{part}</mark>
                    : part
            );
        } catch (error) {
            // 정규식 처리 중 에러 발생 시 콘솔에 에러 출력 후 원본 텍스트 반환
            console.error('Highlighting error:', error);
            return text;
        }
    };

    // 초기 메시지일 경우 (앱 시작 시 안내 메시지 등) 별도의 스타일로 렌더링
    if (message?.isInitialMessage) {
        return (
            <div className="chat-bot-message">
                <img
                    src="/images/logo-bot.png"
                    alt="Bot Avatar"
                    className="chat-avatar"
                    style={{ width: '40px', height: '40px' }}
                />
                <p className="chat-message-text">{message.content}</p>
            </div>
        );
    }

    // 일반 메시지 렌더링: 메시지 유형(User 또는 AI)에 따라 다른 스타일과 구조 적용
    return (
        <div className={`
            ${styles.messageItem} 
            ${message?.type === 'USER' ? styles.userMessage : styles.botMessage}
            ${message?.images?.length > 0 && message.content ? styles.withImageAndText : ''}
            ${isHighlighted ? styles.highlighted : ''}
        `}>
            {/* AI 메시지 렌더링 */}
            {message?.type === 'AI' && (
                <>
                    {/* AI 메시지인 경우 로고 아바타 이미지 출력 */}
                    <img
                        src="/images/logo-bot.png"
                        alt="Bot Avatar"
                        className={styles.avatar}
                    />
                    <div className={styles.messageContent}>
                        {/* AI 메시지 텍스트를 하이라이트 처리 후 출력 */}
                        <p className={styles.messageText}>
                            {highlightText(message.content)}
                        </p>
                    </div>
                </>
            )}

            {/* 사용자 메시지 렌더링 */}
            {message?.type === 'USER' && (
                <div className={styles.messageContent}>
                    {/* 이미지가 존재하는 경우: 사용자 메시지에 첨부된 이미지 렌더링 */}
                    {((message.images && message.images.length > 0 && message.images[0].url) || message.userImage) && (
                        <div className={styles.imageContainer}>
                            <img
                                // 이미지 URL은 images 배열의 첫 번째 요소 또는 userImage를 우선 사용
                                src={message.images && message.images.length > 0 ? message.images[0].url : message.userImage}
                                alt="Uploaded"
                                className={styles.uploadedImage}
                                // 이미지 클릭 시 모달을 열어 크게 볼 수 있도록 함
                                onClick={() => openModal(message.images && message.images.length > 0 ? message.images[0].url : message.userImage)}
                                // 이미지 로드 실패 시 에러 로그를 남김
                                onError={(e) => {
                                    console.error(`이미지 로드 오류 (메시지 ID: ${message.id || 'unknown'}):`, {
                                        src: e.target.src,
                                        error: e
                                    });
                                }}
                            />
                        </div>
                    )}
                    
                    {/* 텍스트 메시지가 존재하는 경우: 하이라이트 적용 후 렌더링 */}
                    {message.content && (
                        <p className={styles.messageText}>
                            {highlightText(message.content)}
                        </p>
                    )}
                </div>
            )}
        </div>
    );
});

export default MessageItem;
