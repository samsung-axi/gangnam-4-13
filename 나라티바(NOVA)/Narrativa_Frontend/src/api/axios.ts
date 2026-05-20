import axios from 'axios';

// Axios 인스턴스 생성
const axiosBaseURL = axios.create({
  baseURL: process.env.REACT_APP_SPRING_URI, // API URL
  withCredentials: true,  // 인증 정보 포함 (쿠키 등)
});

export default axiosBaseURL;