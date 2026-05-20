import backgroundRemovalService from '@src/services/backgroundRemovalService';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';

/**
 * 이미지 배경 제거 기능을 위한 커스텀 훅
 * @returns {Object} 배경 제거 관련 상태와 함수들
 */
const useRemoveBackground = () => {
  // 배경이 제거된 이미지 URL 상태
  const [removedBackgroundUrl, setRemovedBackgroundUrl] = useState(null);
  // 에러 상태
  const [error, setError] = useState(null);

  // React Query의 useMutation을 사용하여 배경 제거 API 호출
  const { mutate, isLoading, isError, reset } = useMutation({
    mutationFn: async ({ file, method = 'modnet' }) => {
      return await backgroundRemovalService.removeBackground(file, method);
    },
    onSuccess: (data) => {
      // API 호출 성공 시 URL 설정
      if (data.success && data.file_url) {
        // 백엔드 URL과 파일 경로 결합
        const fullUrl = `${import.meta.env.VITE_BACKEND_URL}${data.file_url}`;
        setRemovedBackgroundUrl(fullUrl);
        setError(null);
      } else {
        setError('배경 제거에 실패했습니다.');
      }
    },
    onError: (error) => {
      // 에러 처리
      setError(error.message || '배경 제거 중 오류가 발생했습니다.');
      setRemovedBackgroundUrl(null);
    },
  });

  /**
   * 이미지 배경 제거 함수
   * @param {File} imageFile - 배경을 제거할 이미지 파일
   * @param {string} method - 배경 제거 방법 (기본값: 'modnet')
   */
  const removeBackground = (imageFile, method = 'modnet') => {
    if (!imageFile) {
      setError('이미지 파일이 선택되지 않았습니다.');
      return;
    }

    // 이전 결과 초기화
    setRemovedBackgroundUrl(null);
    setError(null);

    // 배경 제거 API 호출
    mutate({ file: imageFile, method });
  };

  /**
   * 상태 초기화 함수
   */
  const clearResult = () => {
    setRemovedBackgroundUrl(null);
    setError(null);
    reset();
  };

  return {
    removeBackground,
    clearResult,
    removedBackgroundUrl,
    isLoading,
    isError,
    error,
  };
};

export default useRemoveBackground;
