import React, { memo } from 'react';
import ImageUpload from './ImageUpload';
import PropTypes from 'prop-types';
import styles from '../../../css/chat/ChatInput.module.css';

/**
 * 채팅 입력창 컴포넌트
 * 
 * 이 컴포넌트는 채팅창 맨 아래에 있는 입력 영역입니다.
 * 메시지를 입력하고 이미지를 첨부할 수 있습니다.
 */
const ChatInput = memo(({
    onSend,              // 메시지 전송 함수
    handleImageUpload,   // 이미지 업로드 처리 함수
    selectedImages,      // 선택된 이미지들
    setSelectedImages,   // 이미지 목록 변경 함수
    handleRemoveImage,   // 이미지 삭제 함수
    fileInputRef,        // 파일 입력창 참조
    input,               // 입력값 상태 (외부에서 관리)
    setInput             // 입력값 상태 변경 함수 (외부에서 관리)
}) => {
    // 메시지 입력시 실행되는 함수
    const handleInputChange = (e) => {
        setInput(e.target.value);
    };

    // 메시지 전송 버튼 클릭시 실행되는 함수
    const handleSendMessage = () => {
        if (input.trim() || selectedImages.length > 0) {
            // 전송할 때 전체 이미지 객체 배열을 전달 (미리보기 URL 포함)
            console.log('전송할 이미지 객체:', selectedImages);
            onSend(input, selectedImages);
            // 전송 후 입력창과 선택된 이미지 초기화
            setInput('');
            // 이미지 목록 초기화
            setSelectedImages([]);
        }
    };

    // Enter 키 입력시 메시지 전송
    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault(); // Enter 키로 인한 줄바꿈 방지
            handleSendMessage();
        }
    };

    /**
     * 이미지 삭제 핸들러
     * - 선택된 모든 이미지를 제거하고 파일 입력창을 초기화
     */
    const handleImageRemove = () => {
        setSelectedImages([]);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';  // 파일 입력 필드 초기화
        }
    };

    /**
     * 이미지 붙여넣기 핸들러
     * - 클립보드에 복사된 이미지가 있으면 이를 업로드 처리
     * - 첫 번째 이미지 항목만 처리함
     * @param {Event} e - 붙여넣기 이벤트 객체
     */
    const handlePaste = (e) => {
        const items = e.clipboardData?.items;
        if (!items) return;

        // 클립보드 데이터 내에서 이미지 파일 검색
        for (let item of items) {
            if (item.type.indexOf('image') !== -1) {
                e.preventDefault(); // 기본 붙여넣기 동작 방지
                const file = item.getAsFile();
                // 이미지 업로드 핸들러에 이미지 파일 전달
                handleImageUpload({ target: { files: [file] } });
                break;  // 첫 번째 이미지만 처리
            }
        }
    };

    return (
        <div className={styles.inputAreaWrapper}>
            {/* 선택된 이미지 미리보기 */}
            {selectedImages.length > 0 && (
                <div className={styles.imagePreviewContainer}>
                    <div className={styles.imagePreviewWrapper}>
                        <img
                            src={selectedImages[0].url}
                            alt="Preview"
                            className={styles.imagePreview}
                        />
                        {/* 이미지 삭제 버튼 */}
                        <button
                            onClick={handleImageRemove}
                            className={styles.removeImageButton}
                        >
                            ×
                        </button>
                    </div>
                </div>
            )}

            {/* 메시지 입력 및 전송 영역 */}
            <div className={styles.inputArea}>
                {/* 이미지 업로드 버튼 컴포넌트 */}
                <ImageUpload
                    onUpload={handleImageUpload}
                    fileInputRef={fileInputRef}
                />

                {/* 메시지 입력창 */}
                <input
                    type="text"
                    value={input}
                    onChange={handleInputChange}
                    onPaste={handlePaste}       // 이미지 붙여넣기 처리
                    onKeyPress={handleKeyPress} // Enter 키로 메시지 전송
                    placeholder="메시지를 입력하세요"
                    className={styles.input}
                />

                {/* 메시지 전송 버튼 */}
                <button
                    className={styles.sendButton}
                    onClick={handleSendMessage}
                    disabled={!input.trim() && selectedImages.length === 0} // 메시지나 이미지가 없으면 버튼 비활성화
                >
                    ➤
                </button>
            </div>
        </div>
    );
});

ChatInput.propTypes = {
    onSend: PropTypes.func.isRequired,
    handleImageUpload: PropTypes.func.isRequired,
    selectedImages: PropTypes.array.isRequired,
    setSelectedImages: PropTypes.func.isRequired,
    handleRemoveImage: PropTypes.func.isRequired,
    fileInputRef: PropTypes.object.isRequired,
    input: PropTypes.string.isRequired,  // 입력값 상태
    setInput: PropTypes.func.isRequired  // 입력값 상태 변경 함수
};

export default ChatInput;