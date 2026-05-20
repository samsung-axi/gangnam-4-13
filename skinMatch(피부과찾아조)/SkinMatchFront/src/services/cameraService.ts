import axios from 'axios';

// 백엔드 API URL
const CAMERA_API_BASE = 'http://localhost:8000';
const WS_BASE = 'ws://localhost:8000';

export interface CameraSession {
  id: number;
  session_id: string;
  user_id: number;
  device_type: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface UploadResponse {
  id: number;
  filename: string;
  original_filename: string;
  file_path: string;
  file_size: number;
  uploaded_at: string;
}

class CameraService {
  private apiClient = axios.create({
    baseURL: CAMERA_API_BASE,
    timeout: 10000,
  });

  constructor() {
    // 요청 인터셉터 - 인증 토큰 추가 (개발/테스트 모드에서는 비활성화)
    this.apiClient.interceptors.request.use((config) => {
      // 개발/테스트 모드에서는 토큰 없이 요청
      // const token = localStorage.getItem('authToken');
      // if (token) {
      //   config.headers.Authorization = `Bearer ${token}`;
      // }
      return config;
    });

    // 응답 인터셉터 - 에러 처리
    this.apiClient.interceptors.response.use(
      (response) => response,
      (error) => {
        console.error('API Error:', error.response?.data || error.message);
        return Promise.reject(error);
      }
    );
  }

  // 카메라 세션 생성
  async createSession(deviceType: string): Promise<CameraSession> {
    try {
      const response = await this.apiClient.post('/api/camera/sessions', {
        device_type: deviceType
      });
      return response.data;
    } catch (error) {
      throw new Error('카메라 세션 생성에 실패했습니다');
    }
  }

  // 카메라 세션 조회
  async getSession(sessionId: string): Promise<CameraSession> {
    try {
      const response = await this.apiClient.get(`/api/camera/sessions/${sessionId}`);
      return response.data;
    } catch (error) {
      throw new Error('카메라 세션 조회에 실패했습니다');
    }
  }

  // 이미지 업로드
  async uploadImage(file: File, sessionId?: string): Promise<UploadResponse> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      if (sessionId) {
        formData.append('session_id', sessionId);
      }

      const response = await this.apiClient.post('/api/upload/image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return response.data;
    } catch (error) {
      throw new Error('이미지 업로드에 실패했습니다');
    }
  }

  // Base64 이미지 업로드
  async uploadBase64Image(base64Data: string, sessionId?: string): Promise<UploadResponse> {
    try {
      // Base64를 Blob으로 변환
      const response = await fetch(base64Data);
      const blob = await response.blob();
      
      // Blob을 File로 변환
      const file = new File([blob], `capture_${Date.now()}.jpg`, { type: 'image/jpeg' });
      
      return await this.uploadImage(file, sessionId);
    } catch (error) {
      throw new Error('이미지 저장에 실패했습니다');
    }
  }

  // 서버 상태 확인
  async checkServerHealth(): Promise<boolean> {
    try {
      const response = await this.apiClient.get('/health');
      return response.status === 200;
    } catch (error) {
      return false;
    }
  }

  // WebSocket URL 생성 (개발/테스트 모드에서는 토큰 없이)
  getWebSocketUrl(sessionId: string): string {
    // 개발/테스트 모드에서는 토큰 없이 WebSocket 연결
    // const token = localStorage.getItem('authToken');
    // const params = new URLSearchParams();
    
    // if (token) {
    //   params.append('token', token);
    // }
    
    const wsUrl = `${WS_BASE}/ws/camera/${sessionId}`;
    console.log('Generated WebSocket URL:', wsUrl);
    return wsUrl;
  }

  // 디바이스 타입 감지
  detectDeviceType(): string {
    const userAgent = navigator.userAgent.toLowerCase();
    
    if (/iphone|ipad|ipod/.test(userAgent)) {
      return 'ios';
    } else if (/android/.test(userAgent)) {
      return 'android';
    } else if (/tablet/.test(userAgent)) {
      return 'tablet';
    } else if (/mobile/.test(userAgent)) {
      return 'mobile';
    } else {
      return 'desktop';
    }
  }

  // 카메라 지원 여부 확인
  isCameraSupported(): boolean {
    return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
  }

  // 권한 요청
  async requestCameraPermission(): Promise<boolean> {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      stream.getTracks().forEach(track => track.stop()); // 즉시 중지
      return true;
    } catch (error) {
      console.error('Camera permission denied:', error);
      return false;
    }
  }
}

// 싱글톤 인스턴스 생성
export const cameraService = new CameraService();
export default cameraService;