import WhiteLoadingComponent from '@src/components/test/loading/white/WhiteLoadingComponent.jsx';
import WhiteLoadingLayout from '@src/components/test/loading/white/WhiteLoadingLayout.jsx';
import React, { useState } from 'react';

const WhiteLoading = () => {
  const [isFullPageLoading, setIsFullPageLoading] = useState(false);
  const [isComponentLoading, setIsComponentLoading] = useState(false);

  const startFullPageLoading = () => {
    setIsFullPageLoading(true);
    setTimeout(() => {
      setIsFullPageLoading(false);
    }, 5000); // 5초 후 로딩 종료
  };

  const startComponentLoading = () => {
    setIsComponentLoading(true);
    setTimeout(() => {
      setIsComponentLoading(false);
    }, 5000); // 5초 후 로딩 종료
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">하얀색 배경 로딩 데모</h1>

      <div className="flex flex-col gap-8">
        {/* WhiteLoadingLayout 예제 */}
        <div className="border border-gray-200 rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-4">
            1. WhiteLoadingLayout 예제
          </h2>
          <p className="mb-4">
            컴포넌트를 감싸서 로딩 상태일 때 배경 애니메이션 표시
          </p>

          <WhiteLoadingLayout isLoading={isFullPageLoading}>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <p className="mb-4">
                이 콘텐츠는 로딩 중이 아닐 때만 표시됩니다.
              </p>
              <button
                onClick={startFullPageLoading}
                className="px-4 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors"
              >
                5초 로딩 시작
              </button>
            </div>
          </WhiteLoadingLayout>
        </div>

        {/* WhiteLoadingComponent 예제 */}
        <div className="border border-gray-200 rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-4">
            2. WhiteLoadingComponent 표시
          </h2>
          <p className="mb-4">버튼을 클릭하면 5초 동안 로딩 컴포넌트 표시</p>

          <button
            onClick={startComponentLoading}
            className="px-4 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors"
          >
            로딩 컴포넌트 표시
          </button>

          {isComponentLoading && (
            <WhiteLoadingComponent message="데이터를 불러오는 중입니다..." />
          )}
        </div>
      </div>
    </div>
  );
};

export default WhiteLoading;
