import axios from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_SPRING_URI, // 환경 변수에서 가져오기
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export default axiosInstance;
