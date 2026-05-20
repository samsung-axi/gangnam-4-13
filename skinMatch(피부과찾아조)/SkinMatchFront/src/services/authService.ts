// src/services/authService.ts
import axios from 'axios';
import { logger } from '@/utils/logger';

const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'}/api`;

// Axios 인스턴스 생성
const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});

// 요청 인터셉터 - JWT 토큰 자동 추가
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        
        // 고급 로깅 시스템 사용
        logger.apiRequest(
            config.method?.toUpperCase() || 'GET',
            `${config.baseURL}${config.url}`,
            {
                hasToken: !!token,
                headers: config.headers,
                data: config.data
            }
        );
        
        // 토큰이 있으면 헤더에 추가
        if (token && token !== 'undefined' && token !== 'null') {
            config.headers.Authorization = `Bearer ${token}`;
        }
        
        // FormData인 경우 Content-Type을 제거 (브라우저가 자동으로 multipart/form-data 설정)
        if (config.data instanceof FormData) {
            delete config.headers['Content-Type'];
        }
        
        return config;
    },
    (error) => {
        logger.error('Request interceptor error', error);
        return Promise.reject(error);
    }
);

// 응답 인터셉터 - 토큰 만료 처리 (개발/테스트 모드에서는 비활성화)
apiClient.interceptors.response.use(
    (response) => {
        // 성공 응답 로깅
        logger.apiResponse(
            response.config.method?.toUpperCase() || 'GET',
            `${response.config.baseURL}${response.config.url}`,
            response.status,
            { success: true }
        );
        return response;
    },
    async (error) => {
        // 에러 응답 로깅
        logger.apiResponse(
            error.config?.method?.toUpperCase() || 'GET',
            `${error.config?.baseURL}${error.config?.url}`,
            error.response?.status || 0,
            {
                error: error.response?.data,
                message: error.message
            }
        );

        // 개발/테스트 모드에서는 토큰 갱신 로직 비활성화
        /*
        const original = error.config;

        if (error.response?.status === 401 && !original._retry) {
            original._retry = true;
            logger.info('Token expired, attempting refresh');

            const refreshToken = localStorage.getItem('refreshToken');
            if (refreshToken) {
                try {
                    const response = await refreshAccessToken(refreshToken);
                    const newAccessToken = response.data.data.accessToken;
                    localStorage.setItem('accessToken', newAccessToken);
                    
                    logger.info('Token refreshed successfully');
                    return apiClient(original);
                } catch (refreshError) {
                    logger.error('Token refresh failed', refreshError);
                    logout();
                    window.location.href = '/login';
                }
            }
        }
        */

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
    loginId: string;  // 아이디 또는 이메일
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

// 인증 관련 API
export const authService = {
    // 일반 회원가입
    async signup(data: SignupRequest) {
        logger.info('회원가입 요청 시작', { email: data.email });
        try {
            // 백엔드가 요구하는 추가 필드들 포함
            const signupData = {
                ...data,
                name: data.username, // username을 name으로도 사용
                role: 'USER', // 기본 역할
                active: true, // 계정 활성화 상태
                is_online: false, // 초기 온라인 상태
                analysis_count: 0, // 초기 분석 횟수
                provider: 'LOCAL' // 로컬 회원가입
            };
            
            const response = await apiClient.post('/auth/signup', signupData);
            logger.info('회원가입 성공', { userId: response.data?.data?.id });
            return response.data;
        } catch (error: any) {
            logger.error('회원가입 실패', {
                error: error.response?.data,
                email: data.email
            });
            throw error;
        }
    },

    // 일반 로그인
    async login(data: LoginRequest) {
        logger.info('로그인 요청 시작', { loginId: data.loginId });
        try {
            const response = await apiClient.post('/auth/login', data);
            logger.info('로그인 성공', { 
                userId: response.data?.data?.user?.id,
                loginId: data.loginId 
            });
            return response.data;
        } catch (error: any) {
            logger.error('로그인 실패', {
                error: error.response?.data,
                loginId: data.loginId
            });
            throw error;
        }
    },

    // OAuth 제공자 목록 조회
    async getOAuthProviders() {
        const response = await apiClient.get('/oauth/providers');
        return response.data;
    },

    // OAuth 로그인 URL 조회 (개선된 버전)
    async getOAuthUrl(provider: string) {
        try {
            logger.oauth('URL_REQUEST', provider);
            logger.debug('OAuth URL 요청 상세', {
                provider,
                endpoint: `/oauth/url/${provider}`,
                baseURL: API_BASE_URL
            });
            
            const response = await apiClient.get(`/oauth/url/${provider}`);
            
            logger.oauth('URL_SUCCESS', provider, { 
                hasUrl: !!(response.data.url || response.data.loginUrl),
                response: response.data
            });
            return response.data;
        } catch (error: any) {
            logger.error('OAuth URL 요청 실패', {
                provider,
                status: error.response?.status,
                statusText: error.response?.statusText,
                data: error.response?.data,
                message: error.message,
                stack: error.stack
            });
            
            // 백엔드 에러 정보를 더 자세히 로깅
            if (error.response?.data) {
                console.error('=== 백엔드 에러 상세 ===');
                console.error('Status:', error.response.status);
                console.error('Error Data:', error.response.data);
                console.error('Headers:', error.response.headers);
                console.error('========================');
            }
            
            logger.oauth('URL_ERROR', provider, error.response?.data);
            throw error;
        }
    },

    // 현재 사용자 정보 조회
    async getCurrentUser() {
        const token = localStorage.getItem('accessToken');
        if (!token || token === 'undefined' || token === 'null') {
            throw new Error('인증 토큰이 없습니다.');
        }
        
        logger.debug('현재 사용자 정보 조회 요청');
        try {
            const response = await apiClient.get('/users/profile');
            logger.info('사용자 정보 조회 성공', { 
                userId: response.data?.data?.id 
            });
            return response.data;
        } catch (error: any) {
            logger.error('사용자 정보 조회 실패', error.response?.data);
            throw error;
        }
    },

    // 토큰 재발급
    async refreshToken(refreshToken: string) {
        const response = await apiClient.post('/auth/refresh', {refreshToken});
        return response.data;
    },

    // 로그아웃
    async logout(refreshToken: string) {
        const response = await apiClient.post('/auth/logout', {refreshToken});
        return response.data;
    },

    // 토큰 유효성 검증
    async validateToken() {
        const response = await apiClient.post('/auth/validate');
        return response.data;
    },

    // 프로필 업데이트 (파일 업로드 지원)
    async updateProfile(data: {
        name?: string;
        nickname?: string;
        profileImage?: File | null; // File 객체로 변경
        gender?: string;
        birthYear?: string;
        nationality?: string;
        allergies?: string;
        surgicalHistory?: string;
    }) {
        logger.info('프로필 업데이트 요청', { 
            fields: Object.keys(data),
            hasProfileImage: !!data.profileImage,
            imageSize: data.profileImage ? `${(data.profileImage.size / 1024).toFixed(1)}KB` : 'N/A'
        });

        try {
            // FormData를 사용해서 파일 업로드
            const formData = new FormData();
            
            // 다른 필드들 추가 (값이 있는 것만)
            Object.entries(data).forEach(([key, value]) => {
                if (key !== 'profileImage' && value !== undefined && value !== null) {
                    // 빈 문자열도 전송 (닉네임의 경우 빈 값이 유의미함)
                    formData.append(key, value as string);
                    logger.debug(`FormData에 추가: ${key} = ${value}`);
                }
            });
            
            // 프로필 이미지 파일 추가
            if (data.profileImage) {
                formData.append('profileImage', data.profileImage);
                logger.info('프로필 이미지 파일 추가됨', {
                    fileName: data.profileImage.name,
                    fileSize: data.profileImage.size,
                    fileType: data.profileImage.type
                });
            }

            // FormData를 사용할 때는 Content-Type을 브라우저가 자동 설정하게 함
            const response = await apiClient.put('/users/profile', formData);
            
            logger.info('프로필 업데이트 성공', {
                userId: response.data?.data?.id,
                updatedFields: Object.keys(data)
            });
            return response.data;
        } catch (error: any) {
            logger.error('프로필 업데이트 실패', {
                error: error.response?.data,
                status: error.response?.status,
                message: error.message
            });
            throw error;
        }
    },

    // JSON만으로 프로필 업데이트 (파일 업로드 없음)
    async updateProfileJson(data: {
        name?: string;
        nickname?: string;
        profileImage?: string; // URL string
        gender?: string;
        birthYear?: string;
        nationality?: string;
        allergies?: string;
        surgicalHistory?: string;
    }) {
        logger.info('프로필 업데이트 요청 (JSON)', { 
            fields: Object.keys(data)
        });

        try {
            const response = await apiClient.post('/users/profile', data, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            
            logger.info('프로필 업데이트 성공 (JSON)', {
                userId: response.data?.data?.id
            });
            return response.data;
        } catch (error: any) {
            logger.error('프로필 업데이트 실패 (JSON)', {
                error: error.response?.data,
                status: error.response?.status
            });
            throw error;
        }
    },

    // 현재 사용자 프로필 조회
    async getUserProfile() {
        logger.info('사용자 프로필 조회 요청');
        try {
            const response = await apiClient.get('/users/profile');
            logger.info('사용자 프로필 조회 성공', { 
                userId: response.data?.data?.id 
            });
            return response.data;
        } catch (error: any) {
            logger.error('사용자 프로필 조회 실패', {
                error: error.response?.data,
                status: error.response?.status
            });
            throw error;
        }
    },
};

export default apiClient;
