// import { defineConfig } from 'vite';
// import react from '@vitejs/plugin-react';

// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [react()],
//   // server: {
//   //   proxy: {
//   //     '/api': {
//   //       target: 'http://127.0.0.1:8000',
//   //       changeOrigin: true,
//   //       secure: false,
//   //       // rewrite: (path) => path.replace(/^\/api/, ''), // 필요 시 경로 조정
//   //     },
//   //   },
//   // },
// });

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: { // <-- 이 'server' 객체를 주석 해제하거나 새로 추가
    host: '0.0.0.0', // 컨테이너 외부에서 접근 가능하도록 설정
    port: 5173,      // 컨테이너 내부 포트 명시
    watch: {
      usePolling: true, // 파일 변경 감지 방식 변경 (WSL/Docker에서 매우 중요)
      interval: 1000,   // 1초마다 파일 변경 감지
    },
    // 백엔드 API와 통신이 필요하다면 아래 proxy 설정도 주석을 해제하고 사용하세요.
    // target을 Docker 서비스 이름으로 변경하는 것이 중요합니다.
    proxy: {
      '/api': {
        target: 'http://flowy-dev-app:8000', // 백엔드 컨테이너 이름:내부 포트
        changeOrigin: true,
        secure: false,
      },
    },
  },
});