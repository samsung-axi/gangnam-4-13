import axios from 'axios';
import { devLog } from '@/shared/util/logger.ts';

// 인증 관련 상태를 저장할 변수
let isAlreadyFetchingAccessToken = false;
let isSessionExpiredNotified = false;

const api = axios.create({
  baseURL: 'http://localhost:8080',
});

// 요청 보낼 때마다 JWT 자동으로 붙이기
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    
    // 토큰이 있으면 헤더에 추가
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      devLog('JWT-Token 요청에 추가:', token.substring(0, 15) + '...');
    }
    return config;
  },
  error => Promise.reject(error)
);

// 응답 처리 인터셉터 추가 - 401 에러 처리
api.interceptors.response.use(
  response => response,
  error => {
    // 401 Unauthorized 에러 처리
    if (error.response && error.response.status === 401) {
      devLog('401 Unauthorized 에러 발생 - 토큰 삭제');
      
      // 토큰 삭제
      localStorage.removeItem('token');
      
      // 중복 알림 방지
      if (!isAlreadyFetchingAccessToken) {
        isAlreadyFetchingAccessToken = true;
        
        // 사용자에게 알림
        setTimeout(() => {
          alert('인증이 필요합니다. 다시 로그인해주세요.');
          
          // 로그인 페이지로 리다이렉트
          window.location.href = '/login';
          
          // 플래그 초기화
          isAlreadyFetchingAccessToken = false;
        }, 0);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
