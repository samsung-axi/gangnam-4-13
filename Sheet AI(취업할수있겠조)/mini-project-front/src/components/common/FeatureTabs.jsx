import { activeFeatureAtom } from '@src/config/atom';
import { useAtom } from 'jotai';
import React from 'react';

/**
 * 기능 선택 탭 컴포넌트
 * 이미지 분석과 배경 제거 기능을 선택할 수 있는 탭을 제공합니다.
 */
const FeatureTabs = () => {
  const [activeFeature, setActiveFeature] = useAtom(activeFeatureAtom);

  const handleFeatureChange = (feature) => {
    setActiveFeature(feature);
  };

  return (
    <div className="feature-tabs w-full bg-white border-b border-gray-200 mt-2 mb-4">
      <div className="container mx-auto ">
        <div className="flex">
          <button
            className={`py-4 px-6 font-medium transition-colors relative ${
              activeFeature === 'analysis'
                ? 'text-primary-600 font-semibold'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => handleFeatureChange('analysis')}
          >
            이미지 분석
            {activeFeature === 'analysis' && (
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary-600"></div>
            )}
          </button>
          <button
            className={`py-4 px-6 font-medium transition-colors relative ${
              activeFeature === 'background'
                ? 'text-primary-600 font-semibold'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => handleFeatureChange('background')}
          >
            배경 제거
            {activeFeature === 'background' && (
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary-600"></div>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FeatureTabs;
