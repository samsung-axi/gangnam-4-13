import React from 'react';
import { MdRotateLeft, MdRotateRight } from 'react-icons/md';

// 이미지 회전 기능을 제공하는 컴포넌트
// onRotate : 회전 버튼 클릭 시 호출되는 함수
// buttonStyle : 부모 컴포넌트에서 전달받는 기본 버튼 스타일
const ImageRotator = ({ onRotate, buttonStyle }) => {
    // 회전 버튼 스타일
    const rotateButtonStyle = {
        ...buttonStyle,
        padding: '8px 12px',
        marginRight: '10px',
        outline: 'none',
        boxShadow: 'none',
    };

    // 아이콘 스타일 추가
    // pointerEvents: 'none' : 아이콘에 대한 마우스 이벤트 비활성화
    // 이를 통해 클릭 시 아이콘 주변에 네모 상자가 생기는 것을 방지
    const iconStyle = {
        pointerEvents: 'none',
        marginTop: '5px'
    };

    return (
        <>
            {/* 왼쪽 회전 버튼 */}
            <button
                style={rotateButtonStyle}
                onClick={() => onRotate('left')}
                onMouseOver={(e) => {
                    e.target.style.background = 'rgba(255, 255, 255, 0.3)';
                    e.target.style.transform = 'scale(1.05)';
                }}
                onMouseOut={(e) => {
                    e.target.style.background = 'rgba(255, 255, 255, 0.2)';
                    e.target.style.transform = 'scale(1)';
                }}
            >
                <MdRotateLeft size={20} style={iconStyle} />
            </button>
            {/* 오른쪽 회전 버튼 */}
            <button
                style={rotateButtonStyle}
                onClick={() => onRotate('right')}
                onMouseOver={(e) => {
                    e.target.style.background = 'rgba(255, 255, 255, 0.3)';
                    e.target.style.transform = 'scale(1.05)';
                }}
                onMouseOut={(e) => {
                    e.target.style.background = 'rgba(255, 255, 255, 0.2)';
                    e.target.style.transform = 'scale(1)';
                }}
            >
                <MdRotateRight size={20} style={iconStyle} />
            </button>
        </>
    );
};

export default ImageRotator;
