import LoadingModal from '@src/components/modal/LoadingModal.jsx';
import ErrorMessage from '@src/components/error/ErrorMessage.jsx';
import { inputImageAtom, isLoadingAtom, errorStateAtom } from '@src/config/atom.js';
import useEvalutePhoto from '@src/hooks/useEvalutePhoto.js';
import { useAtom } from 'jotai';
import React from 'react';

/**
 * 사진 분석 제출 버튼 컴포넌트
 */
const SubmitButton = () => {
  const [isLoading] = useAtom(isLoadingAtom);
  const [image] = useAtom(inputImageAtom);
  const [errorState] = useAtom(errorStateAtom);
  const { mutate, resetError } = useEvalutePhoto();

  /**
   * 제출 버튼 클릭 핸들러
   */
  const handleSubmit = () => {
    if (!image) {
      alert('이미지를 먼저 업로드해주세요.');
      return;
    }

    // 이미지 평가 API 호출
    mutate(image);
  };

  /**
   * 다시 시도 핸들러
   */
  const handleRetry = () => {
    resetError();
    if (image) {
      mutate(image);
    }
  };

  return (
    <>
      <button
        className="btn-primary"
        onClick={handleSubmit}
        disabled={isLoading}
      >
        {isLoading ? '분석 중...' : '분석'}
      </button>
      
      {/* 에러 메시지 표시 */}
      {errorState.isError && (
        <ErrorMessage 
          message={errorState.message} 
          onRetry={handleRetry} 
        />
      )}
      
      <LoadingModal isOpen={isLoading} />
    </>
  );
};

export default SubmitButton;
