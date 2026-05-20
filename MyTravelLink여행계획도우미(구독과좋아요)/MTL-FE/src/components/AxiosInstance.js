import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 인터셉터 등 추가 설정도 가능
axiosInstance.interceptors.request.use(
  (config) => {
    // 요청 전에 수행할 작업
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    // 응답 데이터 처리
    return response;
  },
  (error) => {
    // 에러 처리
    return Promise.reject(error);
  }
);

export default axiosInstance;