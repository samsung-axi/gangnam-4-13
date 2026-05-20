// api/axios.js
import axios from "axios"
import Cookies from "js-cookie";

const api = axios.create({
    baseURL: "http://localhost:8080",   //백엔드 주소
    // baseURL: "https://api.bangkoo.store",
    withCredentials: true,  //쿠키를 포함한 요청 허용
})



api.interceptors.request.use((config) => {
    const token = Cookies.get("jwtToken"); // JWT 토큰 가져오기
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`; // 토큰을 Authorization 헤더에 추가
    }
    return config;
  });

// ✅ 응답 인터셉터: 401 (토큰 만료) 시 로그아웃 처리(태원)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.warn("🔐 토큰 만료됨 - 자동 로그아웃");
      Cookies.remove("jwtToken");
      window.location.href = "/"; 
    }
    return Promise.reject(error);
  }
);

export default api;
