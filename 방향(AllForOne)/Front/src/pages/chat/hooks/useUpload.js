import { useState, useRef } from 'react';

/**
 * 이미지 업로드를 관리하는 Hook
 * 
 * 이 Hook으로 할 수 있는 것들:
 * 1. 이미지 파일 선택하기
 * 2. 선택한 이미지 미리보기
 * 3. 선택한 이미지 삭제하기
 */

export const useUpload = () => {
    // 선택된 이미지들을 저장하는 배열
    // 각 이미지는 { url: 미리보기주소, file: 실제파일 } 형태로 저장됨
    const [selectedImages, setSelectedImages] = useState([]);

    /**
     * 이미지 파일을 선택했을 때 실행되는 함수
     * 
     * 동작 과정:
     * 1. 선택한 파일이 있는지 확인
     * 2. 파일이 이미지인지 확인
     * 3. 이미지 미리보기 주소 생성
     * 4. 선택된 이미지 목록에 추가
     */

    const handleImageUpload = (e) => {
        // 파일이 선택되었는지 확인
        const file = e.target.files?.[0];

        // 파일이 있고 유효한 파일인지 확인
        if (file && file instanceof Blob) {
            // 새 이미지 정보 생성
            const newImage = {
                url: URL.createObjectURL(file),  // 미리보기용 URL 생성
                file: file                       // 실제 파일 저장
            };
            console.log('Uploaded image:', newImage); // 디버깅 로그

            // 이미지 목록에 추가
            setSelectedImages(prev => [...prev, newImage]);
        } else {
            console.error('Invalid file upload:', file);
        }
        e.target.value = ''; // 파일 입력 초기화 (같은 파일 다시 선택 가능하도록)
    };

    /**
 * 선택된 이미지를 삭제하는 함수
 * 
 * @param {number} index - 삭제할 이미지의 위치
 */
    const handleRemoveImage = (index) => {
        // 해당 위치의 이미지만 제외하고 새 배열 생성
        setSelectedImages(prev => prev.filter((_, i) => i !== index));
    };

    return {
        selectedImages,
        setSelectedImages,
        handleImageUpload,
        handleRemoveImage
    };
};
