import { inputImageAtom } from '@src/config/atom.js';
import { useAtom } from 'jotai';
import React, { useEffect, useRef, useState } from 'react';
//input file을 만들기
//input은 보이지 않게 하고
//div를 클릭할 경우 만들 수 있도록
/**
 * @param props {object}
 * @param props.images {Array} 파일 객체 리스트
 * @param props.setImages {Function} 파일 객체 리스트를 변경하는 함수
 * @param props.Layout {Function} input 디자인 컴포넌트
 * @param props.layoutProps {Object} Layout 컴포넌트에 전달할 props
 * @returns {Element}
 * @constructor
 */
const InputImage = (props) => {
  const { Layout, layoutProps = {} } = props;
  const [image, setImage] = useAtom(inputImageAtom);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file.length === 0) {
      return;
    }
    
    // 이미지 처리 시작 - 로딩 상태 활성화
    setIsProcessing(true);
    
    const reader = new FileReader();
    
    // 이미지가 로드되면 로딩 상태 비활성화
    reader.onload = () => {
      setTimeout(() => {
        setImage(file);
        setIsProcessing(false);
      }, 1500); // 로딩 시뮬레이션 (실제 환경에서는 실제 처리 시간에 맞게 조절)
    };
    
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    console.log('images', image);
  }, [image]);

  return (
    <>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/*"
        multiple
      />
      {Layout && (
        <Layout
          onClick={() => fileInputRef.current.click()}
          fileInputRef={fileInputRef}
          handleFile={handleFileChange}
          isLoading={isProcessing}
          {...layoutProps}
        />
      )}
    </>
  );
};

export default InputImage;
