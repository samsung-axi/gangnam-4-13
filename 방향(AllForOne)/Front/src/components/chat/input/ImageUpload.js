import React, { memo } from 'react';
import styles from '../../../css/chat/ChatInput.module.css';

/**
 * 이미지 업로드 버튼 컴포넌트
 * 
 * 이 컴포넌트는 채팅창에서 이미지를 첨부할 수 있는 버튼을 제공합니다.
 * 사진 아이콘을 클릭하면 파일 선택창이 열립니다.
 */

const ImageUpload = memo(({
    onUpload,      // 이미지가 선택됐을 때 실행되는 함수
    fileInputRef,   // 파일 입력창을 제어하기 위한 참조
    onPaste
}) => {
    return (
        // 파일 업로드 영역
        <div className={styles.fileUpload} onPaste={onPaste}>
            {/* 
                이미지 업로드 버튼
                - 클릭하면 숨겨진 파일 선택창이 열림
            */}
            <label htmlFor="file-upload">
                <img
                    src="/images/image.png"
                    alt="이미지 업로드"
                    className={styles.uploadIcon}
                />
            </label>

            {/* 
                실제 파일 선택 입력창
                - 숨김 처리되어 있음
                - 이미지 파일만 선택 가능
            */}

            <input
                id="file-upload"
                type="file"
                accept="image/*"        // 이미지 파일만 선택 가능
                onChange={onUpload}     // 파일 선택시 실행될 함수
                ref={fileInputRef}      // 파일 입력창 참조
                style={{ display: 'none' }}  // 화면에서 숨김
                multiple={false}
            />
        </div>
    );
});

export default ImageUpload;
