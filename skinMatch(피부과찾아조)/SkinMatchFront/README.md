// src/services/authService.ts
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

// Axios 인스턴스 생성
const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true, // CORS 인증 정보 포함
});

// 요청 인터셉터 - JWT 토큰 자동 추가
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        
        // 디버깅용 로그
        console.log('===== Axios Request Debug =====');
        console.log('Method:', config.method?.toUpperCase());
        console.log('Base URL:', config.baseURL);
        console.log('URL:', config.url);
        console.log('Full URL:', `${config.baseURL}${config.url}`);
        console.log('Token from localStorage:', token ? 'EXISTS' : 'NOT_FOUND');
        
        if (token && token !== 'undefined' && token !== 'null') {
            config.headers.Authorization = `Bearer ${token}`;
            console.log('Authorization header set with token');
        }
        
        console.log('Headers:', config.headers);
        console.log('Data:', config.data);
        console.log('==============================');
        
        return config;
    },
    (error) => {
        console.error('Request interceptor error:', error);
        return Promise.reject(error);
    }
);

// 응답 인터셉터 - 토큰 만료 처리
apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const original = error.config;

        if (error.response?.status === 401 && !original._retry) {
            original._retry = true;

            const refreshToken = localStorage.getItem('refreshToken');
            if (refreshToken) {
                try {
                    const response = await refreshAccessToken(refreshToken);
                    localStorage.setItem('accessToken', response.data.data.accessToken);
                    return apiClient(original);
                } catch (refreshError) {
                    // 리프레시 실패 시 로그아웃
                    logout();
                    window.location.href = '/login';
                }
            }
        }

        return Promise.reject(error);
    }
);

// 인터페이스 정의
export interface SignupRequest {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
    address?: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginResponse {
    accessToken: string;
    refreshToken: string;
    user: {
        id: number;
        email: string;
        name: string;
        role: string;
    };
}

// 인증 관련 API
export const authService = {
    // 일반 회원가입
    async signup(data: SignupRequest) {
        console.log('회원가입 요청 데이터:', data); // 디버깅용
        try {
            const response = await apiClient.post('/auth/signup', data);
            console.log('회원가입 성공 응답:', response.data); // 디버깅용
            return response.data;
        } catch (error: any) {
            console.error('회원가입 API 에러:', error);
            console.error('에러 응답 데이터:', error.response?.data); // 상세 에러 정보
            throw error;
        }
    },

    // 일반 로그인
    async login(data: LoginRequest) {
        console.log('로그인 API 요청 데이터:', data); // 디버깅용
        try {
            const response = await apiClient.post('/auth/login', data);
            console.log('로그인 API 성공 응답:', response.data); // 디버깅용
            return response.data;
        } catch (error: any) {
            console.error('로그인 API 에러:', error);
            console.error('로그인 에러 응답 데이터:', error.response?.data); // 상세 에러 정보
            throw error;
        }
    },

    // OAuth 제공자 목록 조회
    async getOAuthProviders() {
        const response = await apiClient.get('/oauth/providers');
        return response.data;
    },

    // OAuth 로그인 URL 조회
    async getOAuthUrl(provider: string) {
        const response = await apiClient.get(`/oauth/url/${provider}`);
        return response.data;
    },

    // 현재 사용자 정보 조회
    async getCurrentUser() {
        // 공개 엔드포인트에서는 토큰이 없어도 되지만, 여기서는 반드시 토큰 필요
        const token = localStorage.getItem('accessToken');
        if (!token || token === 'undefined' || token === 'null') {
            throw new Error('No access token');
        }
        const response = await apiClient.get('/auth/me');
        return response.data;
    },

    // 토큰 재발급
    async refreshToken(refreshToken: string) {
        const response = await apiClient.post('/auth/refresh', { refreshToken });
        return response.data;
    },

    // 로그아웃
    async logout(refreshToken: string) {
        const response = await apiClient.post('/auth/logout', { refreshToken });
        return response.data;
    },

    // 토큰 유효성 검증
    async validateToken() {
        const response = await apiClient.post('/auth/validate');
        return response.data;
    },

    // 프로필 업데이트 (새로운 JSON 형식)
    async updateProfile(data: {
        name?: string;
        nickname?: string;
        profileImage?: string;
        gender?: string;
        birthYear?: string;
        nationality?: string;
        allergies?: string;
        surgicalHistory?: string;
    }) {
        console.log('프로필 업데이트 요청 데이터:', data); // 디버깅용
        console.log('API Base URL:', API_BASE_URL); // 디버깅용
        console.log('Full URL will be:', `${API_BASE_URL}/users/profile`); // 디버깅용
        
        try {
            const response = await apiClient.put('/users/profile', data);
            console.log('프로필 업데이트 성공 응답:', response.data); // 디버깅용
            return response.data;
        } catch (error: any) {
            console.error('프로필 업데이트 API 에러:', error);
            console.error('에러 config:', error.config); // 실제 요청 config 확인
            console.error('프로필 에러 응답 데이터:', error.response?.data);
            throw error;
        }
    },
};

// 토큰 재발급 함수
const refreshAccessToken = async (refreshToken: string) => {
    return await axios.post(`${API_BASE_URL}/auth/refresh`, {
        refreshToken: refreshToken
    });
};

// 로그아웃 처리
const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userId');
    localStorage.removeItem('userInfo');
};

export default apiClient;
