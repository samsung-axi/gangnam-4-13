import React, { useState, useEffect } from 'react';

interface ImageDivideProps {
  imageSrc: string; // 동적으로 전달받은 이미지 경로
  onPiecesGenerated: (pieces: string[]) => void; // 부모 컴포넌트에 이미지 조각 전달용 콜백 함수
}

const ImageDivide: React.FC<ImageDivideProps> = ({ imageSrc, onPiecesGenerated }) => {
  // 이미지 6등분 처리
  const handleImageDivide = () => {
    const img = new Image();
    img.crossOrigin = "anonymous"; // CORS 처리
    img.src = imageSrc; // 동적으로 전달받은 이미지 경로를 src로 지정
    img.onload = () => {
      const width = img.width;
      const height = img.height;

      const splitWidth = width / 2; // 2등분
      const splitHeight = height / 3; // 3등분

      const newPieces: string[] = [];

      // 이미지를 6등분해서 Canvas에 그리기
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 2; j++) {
          const pieceCanvas = document.createElement('canvas');
          const pieceCtx = pieceCanvas.getContext('2d');
          if (!pieceCtx) continue;

          pieceCanvas.width = splitWidth;
          pieceCanvas.height = splitHeight;

          pieceCtx.drawImage(
            img,
            j * splitWidth, // 이미지의 왼쪽
            i * splitHeight, // 이미지의 위쪽
            splitWidth,      // 자를 영역의 너비
            splitHeight,     // 자를 영역의 높이
            0, 0,            // Canvas에 그릴 위치
            splitWidth,      // 그릴 너비
            splitHeight      // 그릴 높이
          );

          // 캔버스를 이미지 URL로 변환하여 배열에 저장
          newPieces.push(pieceCanvas.toDataURL());
        }
      }

      onPiecesGenerated(newPieces); // 부모 컴포넌트로 이미지 조각 전달
    };
  };

  useEffect(() => {
    if (imageSrc) {
      handleImageDivide(); // 컴포넌트가 마운트될 때 이미지를 6등분
    }
  }, [imageSrc]);

  return null; // HTML을 렌더링하지 않음
};

export default ImageDivide;