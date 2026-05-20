import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';
import tailwindcss from '@tailwindcss/vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],

  // 개발 서버 설정
  server: {
    port: 3000, // 개발 서버 포트
    open: true, // 브라우저 자동 열기
    host: false, // 네트워크에서 접근 가능 (0.0.0.0)
    cors: true, // CORS 허용
    hmr: {
      overlay: true, // 오류 오버레이 표시
    },
  },

  // 경로 별칭 설정
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@app': path.resolve(__dirname, './src/app'),
      '@assets': path.resolve(__dirname, './src/assets'),
      '@entities': path.resolve(__dirname, './src/entities'),
      '@features': path.resolve(__dirname, './src/features'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@shared': path.resolve(__dirname, './src/shared'),
    },
  },

  // 빌드 설정
  build: {
    outDir: 'dist', // 빌드 출력 디렉토리
    sourcemap: true, // 소스맵 생성 (디버깅용)
    minify: 'esbuild', // 압축 도구 (esbuild가 빠름)
    target: 'esnext', // 타겟 브라우저
    rollupOptions: {
      output: {
        // 청크 파일 분리 (큰 라이브러리들 분리)
        manualChunks: {
          react: ['react', 'react-dom'],
          // 추가 라이브러리들도 분리 가능
          // router: ['react-router-dom'],
          // components: ['@mui/material', 'antd'],
        },
      },
    },
    // 빌드 크기 경고 한도 증가
    chunkSizeWarningLimit: 1000,
  },

  // CSS 설정
  css: {
    devSourcemap: true, // 개발 중 CSS 소스맵
    modules: {
      // CSS 모듈 설정
      localsConvention: 'camelCase',
    },
  },

  // 환경 변수 설정
  envPrefix: 'VITE_', // VITE_로 시작하는 환경변수만 노출

  // 최적화 설정
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      // 자주 사용하는 라이브러리들 미리 번들링
      // 'lodash',
      // 'axios',
    ],
  },

  // 파일 감시 설정
  define: {
    __DEV__: JSON.stringify(process.env.NODE_ENV === 'development'),
  },
});