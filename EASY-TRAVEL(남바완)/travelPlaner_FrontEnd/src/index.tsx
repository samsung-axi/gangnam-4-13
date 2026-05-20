import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

const rootElement = document.getElementById("root"); // 'root' 요소 가져오기
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement as HTMLElement); // null이 아님을 명시
  root.render(
    <>
      <App />
    </>
  );
} else {
  console.error("Root element not found."); // 'root' 요소가 없을 경우 에러 처리
}

// 성능 측정 함수 호출
reportWebVitals();
