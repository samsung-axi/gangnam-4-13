import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import './index.css'

// 폰트 로딩 확인 및 fallback 처리
const checkFontLoading = () => {
  // Web Font Loader API가 있으면 사용
  if ('fonts' in document) {
    document.fonts.ready.then(() => {
      console.log('✅ 모든 폰트가 로드되었습니다.');
      
      // Rethink Sans 폰트가 실제로 로드되었는지 확인
      const testElement = document.createElement('div');
      testElement.style.fontFamily = '"Rethink Sans", sans-serif';
      testElement.style.position = 'absolute';
      testElement.style.visibility = 'hidden';
      testElement.style.fontSize = '72px';
      testElement.textContent = 'Test';
      document.body.appendChild(testElement);
      
      const computedStyle = window.getComputedStyle(testElement);
      const actualFontFamily = computedStyle.fontFamily;
      
      if (actualFontFamily.includes('Rethink Sans')) {
        console.log('✅ Rethink Sans 폰트가 정상적으로 적용되었습니다.');
        document.body.classList.add('font-loaded');
      } else {
        console.warn('⚠️ Rethink Sans 폰트를 로드할 수 없어 fallback 폰트를 사용합니다:', actualFontFamily);
        document.body.classList.add('font-fallback');
      }
      
      document.body.removeChild(testElement);
    }).catch(() => {
      console.error('❌ 폰트 로딩에 실패했습니다. fallback 폰트를 사용합니다.');
      document.body.classList.add('font-fallback');
    });
  } else {
    // Web Font Loader API가 없는 경우 타임아웃으로 확인
    setTimeout(() => {
      console.log('Web Font Loader API를 지원하지 않는 브라우저입니다.');
      document.body.classList.add('font-loaded');
    }, 3000);
  }
};

// DOM이 로드된 후 폰트 확인
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', checkFontLoading);
} else {
  checkFontLoading();
}

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
)
