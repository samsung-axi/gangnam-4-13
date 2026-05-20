import axios from "axios";

// Axios 인스턴스 생성
const apis = axios.create({
    baseURL: process.env.REACT_APP_API_URL || "http://localhost:8080", // 공통 URL 설정
    headers: {
        "Content-Type": "application/json", // JSON 형식
    },
});

// 요청 인터셉터: Access Token 추가
apis.interceptors.request.use((config) => {
    const accessToken = localStorage.getItem("accessToken"); // Access Token 가져오기
    if (accessToken) {
        config.headers["Authorization"] = `Bearer ${accessToken}`; 
    }
    return config;
});

// 응답 인터셉터: 에러 처리
apis.interceptors.response.use(
    (response) => response, // 정상 응답
    (error) => {
        if (error.response && error.response.status === 401) {
            console.error("Unauthorized: Token expired or invalid");
            localStorage.removeItem("accessToken"); // Access Token 제거
            window.location.href = "/login";
        }
        return Promise.reject(error);
    }
);

export default apis;
