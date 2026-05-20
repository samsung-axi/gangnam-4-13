import { faArrowUpFromBracket } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { inputImageAtom, isLoadingAtom } from '@src/config/atom.js';
import { useAtom } from 'jotai';
import React, { useState } from 'react';

const InputLayout = (props) => {
  const { onClick = () => {}, text, fileInputRef, handleFile } = props;
  const [isDragging, setIsDragging] = useState(false);
  const [image, setImage] = useAtom(inputImageAtom);
  const [isLoading, setIsLoading] = useAtom(isLoadingAtom);

  // 드래그 이벤트 핸들러
  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragging) {
      setIsDragging(true);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    setIsLoading(true);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const files = Array.from(e.dataTransfer.files);

      // 두 가지 방법으로 처리 (둘 중 하나만 사용)
      if (handleFile) {
        // 1. 상위 컴포넌트에서 제공한 핸들러 사용
        files.forEach((file) => handleFile({ target: { files: [file] } }));
      } else if (fileInputRef && fileInputRef.current) {
        // 2. 파일 입력 요소에 파일 설정
        const dataTransfer = new DataTransfer();
        files.forEach((file) => dataTransfer.items.add(file));
        fileInputRef.current.files = dataTransfer.files;

        // 파일 변경 이벤트 트리거
        const event = new Event('change', { bubbles: true });
        fileInputRef.current.dispatchEvent(event);
      }
      
      // 로딩 시뮬레이션 (실제로는 이미지 처리 작업이 완료되면 호출)
      setTimeout(() => {
        setIsLoading(false);
      }, 2000);
    }
  };

  return (
      <div
        className={`flex flex-col rounded-2xl m-auto
        justify-center items-center
        border-2 ${isDragging ? 'border-primary-700' : 'border-primary-500'}
        border-dashed
        cursor-pointer transition-colors duration-200 ease-in-out
        ${isDragging ? 'bg-primary-100' : ''}
        h-96 w-full
        ${image ? 'w-fit' : 'w-full'}
        `}
        onClick={onClick}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {image ? (
          <img
            src={URL.createObjectURL(image)}
            alt={`Image`}
            className="w-full h-full object-contain rounded-2xl"
          />
        ) : (
          <div className="flex flex-col gap-2 items-center justify-center h-40 text-primary-700">
            <FontAwesomeIcon icon={faArrowUpFromBracket} />
            {isDragging ? (
              <div>파일을 여기에 놓으세요</div>
            ) : (
              <div>이미지를 올려주세요</div>
            )}
          </div>
        )}
      </div>
  );
};

export default InputLayout;
