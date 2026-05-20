
import React, { useState, useRef } from 'react';
import { ReactCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import ImageRotator from './ImageRotator';

// 이미지 크롭 기능을 제공하는 컴포넌트
// iamge : 크롭할 원본 이미지 URL
// onCropComplete : 크롭 완료 시 호출되는 함수
// onCancel : 취소 시 호출되는 함수
const ImageCropper = ({ image, onCropComplete, onCancel }) => {
    // 크롭 영역 초기 설정
    const [crop, setCrop] = useState({
        unit: '%',
        width: 30,
        height: 30,
        x: 35,
        y: 35
    });
    const [completedCrop, setCompletedCrop] = useState(null);
    const imgRef = useRef(null);

    // 이미지 로드 완료 시 전체 이미지를 크롭 영역으로 설정
    const onImageLoad = (e) => {
        const { width, height } = e.currentTarget;
        setCrop({
            unit: '%',
            width: 100,
            height: 100,
            x: 0,
            y: 0
        });
        imgRef.current = e.currentTarget;
    };

    // 선택된 영역의 이미지를 크롭하여 새로운 이미지 URL 생성
    const generateCroppedImage = async (crop) => {
        if (!crop || !imgRef.current) return;

        // 캔버스 생성 및 크기 설정
        const canvas = document.createElement('canvas');
        const image = imgRef.current;

        // 실제 이미지 크기와 화면에 표시된 크기의 비율 계산
        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;

        canvas.width = Math.floor(crop.width * scaleX);
        canvas.height = Math.floor(crop.height * scaleY);

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        try {
            ctx.drawImage(
                image,
                Math.floor(crop.x * scaleX),
                Math.floor(crop.y * scaleY),
                Math.floor(crop.width * scaleX),
                Math.floor(crop.height * scaleY),
                0,
                0,
                Math.floor(crop.width * scaleX),
                Math.floor(crop.height * scaleY)
            );

            return new Promise((resolve) => {
                canvas.toBlob(
                    (blob) => {
                        if (!blob) {
                            console.error('Canvas is empty');
                            return;
                        }
                        const croppedImageUrl = URL.createObjectURL(blob);
                        resolve(croppedImageUrl);
                    },
                    'image/jpeg',
                    1
                );
            });
        } catch (error) {
            console.error('Error during image cropping:', error);
            return null;
        }
    };

    // 크롭 완료 버튼 클릭 시 처리
    const handleCropComplete = async () => {
        if (!completedCrop) {
            // 크롭 영역이 없으면 전체 이미지 사용
            onCropComplete(image);
            return;
        }

        try {
            const croppedImage = await generateCroppedImage(completedCrop);
            if (croppedImage) {
                onCropComplete(croppedImage);
            }
        } catch (error) {
            console.error('Error handling crop complete:', error);
        }
    };

    // 버튼 스타일
    const buttonWrapperStyle = {
        position: 'absolute',
        bottom: '20px',
        left: '50%',
        transform: 'translate(-50%, -40px)',
        display: 'flex',
        gap: '15px',
        zIndex: 1000
    };

    const buttonStyle = {
        padding: '8px 24px',
        border: '1px solid rgba(255, 255, 255, 0.3)',
        borderRadius: '4px',
        background: 'rgba(255, 255, 255, 0.2)',
        backdropFilter: 'blur(5px)',
        color: 'white',
        fontFamily: 'Gowun Batang, serif',
        fontSize: '16px',
        cursor: 'pointer',
        transition: 'all 0.3s ease'
    };

    const [rotation, setRotation] = useState(0);

    const handleRotation = (direction) => {
        setRotation((prev) => (direction === 'left' ? prev - 90 : prev + 90));
    };

    return (
        <div className="crop-container">
            <ReactCrop
                crop={crop}
                onChange={(c) => setCrop(c)}
                onComplete={(c) => setCompletedCrop(c)}
                aspect={undefined}
            >
                <img
                    ref={imgRef}
                    src={image}
                    alt="Crop me"
                    style={{
                        maxWidth: '100%',
                        maxHeight: '70vh',
                        transform: `rotate(${rotation}deg)`,
                        transition: 'transform 0.3s ease'
                    }}
                    onLoad={onImageLoad}
                    crossOrigin="anonymous"
                />
            </ReactCrop>
            <div style={buttonWrapperStyle}>
                <ImageRotator
                    onRotate={handleRotation}
                    buttonStyle={buttonStyle}
                />
                <button
                    style={buttonStyle}
                    onClick={handleCropComplete}
                    onMouseOver={(e) => {
                        e.target.style.background = 'rgba(255, 255, 255, 0.3)';
                        e.target.style.transform = 'scale(1.05)';
                    }}
                    onMouseOut={(e) => {
                        e.target.style.background = 'rgba(255, 255, 255, 0.2)';
                        e.target.style.transform = 'scale(1)';
                    }}
                >
                    확인
                </button>
                <button
                    style={buttonStyle}
                    onClick={onCancel}
                    onMouseOver={(e) => {
                        e.target.style.background = 'rgba(255, 255, 255, 0.3)';
                        e.target.style.transform = 'scale(1.05)';
                    }}
                    onMouseOut={(e) => {
                        e.target.style.background = 'rgba(255, 255, 255, 0.2)';
                        e.target.style.transform = 'scale(1)';
                    }}
                >
                    취소
                </button>
            </div>
        </div>
    );
};

export default ImageCropper;