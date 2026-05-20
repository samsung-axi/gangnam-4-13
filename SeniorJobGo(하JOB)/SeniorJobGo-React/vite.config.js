import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { fileURLToPath, URL } from 'url'

// https://vite.dev/config/
export default defineConfig({
  define: {
    'import.meta.env.API_BASE_URL': JSON.stringify('http://localhost:8000/api/v1'),
  },
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)), // @를 입력했을 때 경로에서 src 폴더로 바로 접근이 가능하다.
      '@assets': fileURLToPath(new URL('./src/assets', import.meta.url)),
      '@components': fileURLToPath(new URL('./src/components', import.meta.url)),
      '@pages': fileURLToPath(new URL('./src/pages', import.meta.url)),
      '@recoil': fileURLToPath(new URL('./src/recoil', import.meta.url)),
      '@types': fileURLToPath(new URL('./src/types', import.meta.url)),
      '@apis': fileURLToPath(new URL('./src/apis', import.meta.url)),
    },
  },
  // SCSS 전역 사용 설정
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: '@use "@assets/styles/main.scss";',
        includePaths: ['src/assets/styles']
      },
    }
  }
})
