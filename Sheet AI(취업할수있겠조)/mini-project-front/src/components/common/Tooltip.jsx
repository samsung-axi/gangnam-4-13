import React, { useState } from 'react';

/**
 * 툴팁 컴포넌트
 * @param {Object} props - 컴포넌트 속성
 * @param {React.ReactNode} props.children - 툴팁을 표시할 요소
 * @param {string} props.content - 툴팁 내용
 * @param {string} [props.position='top'] - 툴팁 위치 (top, bottom, left, right)
 * @param {boolean} [props.lightTheme=false] - 밝은 테마 사용 여부
 * @returns {React.ReactElement} 툴팁 컴포넌트
 */
const Tooltip = ({ children, content, position = 'top', lightTheme = false }) => {
  const [isVisible, setIsVisible] = useState(false);

  // 툴팁 위치에 따른 클래스 설정
  const getPositionClass = () => {
    switch (position) {
      case 'bottom':
        return 'top-full left-1/2 transform -translate-x-1/2 mt-1';
      case 'left':
        return 'right-full top-1/2 transform -translate-y-1/2 mr-1';
      case 'right':
        return 'left-full top-1/2 transform -translate-y-1/2 ml-1';
      case 'top':
      default:
        return 'bottom-full left-1/2 transform -translate-x-1/2 mb-1';
    }
  };

  // 테마에 따른 클래스 설정
  const getThemeClass = () => {
    return lightTheme
      ? 'bg-white text-gray-800 border border-gray-200'
      : 'bg-gray-900 text-white';
  };

  // 화살표 테마에 따른 클래스 설정
  const getArrowThemeClass = () => {
    return lightTheme
      ? position === 'top'
        ? 'border-t-white'
        : position === 'bottom'
        ? 'border-b-white'
        : position === 'left'
        ? 'border-l-white'
        : 'border-r-white'
      : position === 'top'
        ? 'border-t-gray-900'
        : position === 'bottom'
        ? 'border-b-gray-900'
        : position === 'left'
        ? 'border-l-gray-900'
        : 'border-r-gray-900';
  };

  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
      >
        {children}
      </div>
      {isVisible && (
        <div
          className={`absolute z-10 px-3 py-2 text-sm font-medium rounded-lg shadow-sm ${getPositionClass()} ${getThemeClass()} whitespace-nowrap`}
        >
          {content}
          <div
            className={`absolute ${
              position === 'top'
                ? 'top-full left-1/2 transform -translate-x-1/2'
                : position === 'bottom'
                ? 'bottom-full left-1/2 transform -translate-x-1/2'
                : position === 'left'
                ? 'left-full top-1/2 transform -translate-y-1/2'
                : 'right-full top-1/2 transform -translate-y-1/2'
            } border-solid border-4 border-transparent ${getArrowThemeClass()}`}
          />
        </div>
      )}
    </div>
  );
};

export default Tooltip;
