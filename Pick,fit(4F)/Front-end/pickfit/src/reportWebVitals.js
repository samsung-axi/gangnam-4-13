// src/reportWebVitals.js

const reportWebVitals = (onPerfEntry) => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      // 각 성능 지표 함수가 onPerfEntry 콜백을 통해 결과를 반환하도록 설정
      getCLS(onPerfEntry);  // Cumulative Layout Shift
      getFID(onPerfEntry);  // First Input Delay
      getFCP(onPerfEntry);  // First Contentful Paint
      getLCP(onPerfEntry);  // Largest Contentful Paint
      getTTFB(onPerfEntry); // Time to First Byte
    });
  }
};

// 결과를 콘솔에 출력하는 콜백 함수 예시
// const logMetrics = (metric) => {
//   console.log(metric);  // 각 성능 지표 데이터를 콘솔에 출력
// };

// reportWebVitals 함수 호출 시 logMetrics 함수 전달
// reportWebVitals(logMetrics);

export default reportWebVitals;

// CLS: 페이지의 레이아웃 안정성을 나타내는 값
// FID: 페이지 상호작용에 대한 응답 시간
// FCP: 페이지의 첫 번째 콘텐츠가 화면에 표시된 시간
// LCP: 페이지에서 가장 큰 콘텐츠가 로드된 시간
// TTFB: 서버에서 첫 번째 바이트를 받는 데 걸린 시간

// CLS (Cumulative Layout Shift):

// 페이지의 콘텐츠가 얼마나 시각적으로 불안정한지를 측정합니다. 예를 들어, 페이지 로드 중에 레이아웃이 갑자기 바뀌면 사용자가 불편하게 느낄 수 있습니다. CLS 값이 낮을수록 안정적인 레이아웃을 의미합니다.


// FID (First Input Delay):

// 사용자가 페이지에서 처음으로 상호작용을 시도했을 때, 그 상호작용이 반응하기까지의 지연 시간을 측정합니다. FID가 낮을수록 사용자 경험이 원활하다는 뜻입니다.


// FCP (First Contentful Paint):

// 페이지가 로드된 후, 사용자가 첫 번째로 볼 수 있는 콘텐츠(텍스트, 이미지 등)가 화면에 나타나기까지 걸린 시간을 측정합니다. FCP가 빠를수록 사용자는 페이지가 더 빨리 로드된다고 느낍니다.


// LCP (Largest Contentful Paint):

// 페이지에서 가장 큰 콘텐츠 요소(주로 이미지나 큰 텍스트)가 로드되기까지 걸린 시간을 측정합니다. 이 지표는 페이지 로딩 성능의 중요한 지표로, LCP가 빠를수록 페이지가 더 빨리 로드된다고 사용자에게 인식됩니다.


// TTFB (Time to First Byte):

// 페이지 요청 후 첫 번째 바이트가 서버로부터 반환되기까지 걸린 시간입니다. 서버 성능을 나타내며, 이 값이 짧을수록 빠르게 응답이 시작된다는 의미입니다.