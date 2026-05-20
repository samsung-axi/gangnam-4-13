import Tooltip from '@src/components/common/Tooltip';
import { inputImageAtom } from '@src/config/atom';
import useRemoveBackground from '@src/hooks/useRemoveBackground';
import { useAtom } from 'jotai';
import React, { useState, useEffect } from 'react';
import LoadingModal from '@src/components/modal/LoadingModal';

/**
 * 이미지 배경 제거 컴포넌트
 */
const BackgroundRemover = () => {
  const [image, setImage] = useAtom(inputImageAtom);
  const [originalImage, setOriginalImage] = useState(null);
  const [selectedModel, setSelectedModel] = useState('modnet'); // 기본 모델은 modnet
  const [showLoading, setShowLoading] = useState(false); // 로딩 상태를 명시적으로 관리
  const {
    removeBackground,
    clearResult,
    removedBackgroundUrl,
    isLoading,
    error,
  } = useRemoveBackground();

  // isLoading 상태가 변경될 때마다 showLoading 상태 업데이트
  useEffect(() => {
    setShowLoading(isLoading);
    console.log('isLoading 상태 변경:', isLoading);
  }, [isLoading]);

  // removedBackgroundUrl이 변경될 때 로딩 상태 해제
  useEffect(() => {
    if (removedBackgroundUrl) {
      setShowLoading(false);
      console.log('배경 제거 완료, 로딩 상태 해제');
    }
  }, [removedBackgroundUrl]);

  // 에러 발생 시 로딩 상태 해제
  useEffect(() => {
    if (error) {
      setShowLoading(false);
      console.log('에러 발생, 로딩 상태 해제');
    }
  }, [error]);

  // 배경 제거 처리
  const handleRemoveBackground = () => {
    if (!image) {
      alert('이미지를 먼저 업로드해주세요.');
      return;
    }

    // 로딩 상태 활성화
    setShowLoading(true);
    console.log('배경 제거 시작, 로딩 상태 활성화');
    
    // 원본 이미지 저장
    setOriginalImage(image);

    // 배경 제거 API 호출 (선택한 모델 전달)
    removeBackground(image, selectedModel);
  };

  // 모델 선택 변경 핸들러
  const handleModelChange = (e) => {
    setSelectedModel(e.target.value);
  };

  // 배경이 제거된 이미지 적용
  const handleApplyImage = async () => {
    if (!removedBackgroundUrl) return;

    try {
      // URL에서 이미지 파일 가져오기
      const response = await fetch(removedBackgroundUrl);
      const blob = await response.blob();

      // 파일 이름 생성 (원본 이미지 이름 + _nobg)
      const originalName = image.name;
      const extension = originalName.split('.').pop();
      const nameWithoutExtension = originalName.replace(`.${extension}`, '');
      const newFileName = `${nameWithoutExtension}_nobg.${extension}`;

      // 새 File 객체 생성
      const newFile = new File([blob], newFileName, { type: image.type });

      // 이미지 상태 업데이트
      setImage(newFile);

      // 결과 초기화
      clearResult();
      setOriginalImage(null);
      setShowLoading(false); // 적용 완료 시 로딩 상태 해제
    } catch (error) {
      console.error('이미지 적용 중 오류 발생:', error);
      alert('이미지 적용 중 오류가 발생했습니다.');
      setShowLoading(false); // 에러 발생 시 로딩 상태 해제
    }
  };

  // 원본 이미지로 복원
  const handleRestoreOriginal = () => {
    if (originalImage) {
      setImage(originalImage);
      clearResult();
      setOriginalImage(null);
      setShowLoading(false); // 복원 완료 시 로딩 상태 해제
    }
  };

  // 배경 제거 취소
  const handleCancel = () => {
    clearResult();
    setOriginalImage(null);
    setShowLoading(false); // 취소 시 로딩 상태 해제
  };

  return (
    <>
      {!removedBackgroundUrl && !isLoading && (
        <>
          <div className="mt-4">
            <Tooltip
              content="배경 제거에 사용할 AI 모델을 선택하세요"
              position="right"
              lightTheme={true}
            >
              <div className="flex space-x-4">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    className="form-radio text-primary-600"
                    name="model"
                    value="modnet"
                    checked={selectedModel === 'modnet'}
                    onChange={handleModelChange}
                  />
                  <span className="ml-2">ModNet</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    className="form-radio text-primary-600"
                    name="model"
                    value="bria"
                    checked={selectedModel === 'bria'}
                    onChange={handleModelChange}
                  />
                  <span className="ml-2">RMBG-1.4</span>
                </label>
              </div>
            </Tooltip>
          </div>
          <button
            onClick={handleRemoveBackground}
            disabled={!image || showLoading} // isLoading 대신 showLoading 사용
            className="btn-primary"
          >
            배경 제거하기
          </button>
        </>
      )}

      {/* LoadingModal 컴포넌트로 로딩 상태 표시 - 명시적인 상태 사용 */}
      <LoadingModal isOpen={showLoading} />

      {error && (
        <div className="mt-2 p-3 bg-red-100 text-red-700 rounded-md">
          <p className="text-sm">{error}</p>
          <button
            onClick={handleCancel}
            className="mt-2 text-sm text-red-700 underline"
          >
            취소
          </button>
        </div>
      )}

      {removedBackgroundUrl && (
        <div className="mt-2">
          <div className="mb-3 flex justify-center">
            <img
              src={removedBackgroundUrl}
              alt="배경이 제거된 이미지"
              className="max-w-full h-auto max-h-64 rounded-md border border-gray-200"
            />
          </div>

          <div className="flex space-x-2">
            <button onClick={handleApplyImage} className="btn-success">
              적용하기
            </button>
            <button onClick={handleCancel} className="btn-secondary">
              취소
            </button>
          </div>

          {originalImage && (
            <button
              onClick={handleRestoreOriginal}
              className="mt-2 w-full btn-sm bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
            >
              원본 이미지로 복원
            </button>
          )}
        </div>
      )}
    </>
  );
};

export default BackgroundRemover;
