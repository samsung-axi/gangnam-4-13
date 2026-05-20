import apiClient from './authService';

// 병원 타입 정의
export interface Hospital {
  id: number;
  name: string;
  image?: string;
  rating: number;
  distance: string;
  specialties: string[];
  address: string;
  phone: string;
  description: string;
  availableToday: boolean;
  openHours: string;
  reviewCount: number;
  isBookmarked?: boolean;
  latitude?: number;
  longitude?: number;
  // 추가 필드들
  website?: string;
  parkingAvailable?: boolean;
  nightService?: boolean;
  weekendService?: boolean;
  reservationAvailable?: boolean;
  sameDayService?: boolean;
  insuranceAccepted?: boolean;
}

// 병원 검색 요청 타입
export interface HospitalSearchRequest {
  location?: string;
  latitude?: number;
  longitude?: number;
  specialties?: string[];
  radius?: number; // 검색 반경 (km)
  sortBy?: 'distance' | 'rating' | 'reviewCount';
  limit?: number;
  offset?: number;
}

// 병원 검색 응답 타입
export interface HospitalSearchResponse {
  hospitals: Hospital[];
  total: number;
  hasMore: boolean;
}

// 병원 백엔드 결과(있는 그대로)
// (구) 백엔드 원본 결과 타입은 제거되었습니다.

// 지오코딩 서비스 (주소 -> 좌표 변환) - 네이버 지오코딩 API 사용
export const geocodeAddress = async (address: string): Promise<{ lat: number; lng: number } | null> => {
  try {
    // 브라우저 내장 지오코딩 사용 (네이버 지도 스크립트가 로드된 경우)
    if (window.naver && window.naver.maps && window.naver.maps.Service) {
      return new Promise((resolve) => {
        window.naver.maps.Service.geocode({
          query: address
        }, (status: any, response: any) => {
          if (status === window.naver.maps.Service.Status.OK && response.v2.addresses.length > 0) {
            const result = response.v2.addresses[0];
            resolve({
              lat: parseFloat(result.y),
              lng: parseFloat(result.x)
            });
          } else {
            resolve(null);
          }
        });
      });
    }
    
    return null;
  } catch (error) {
    console.error('Geocoding 오류:', error);
    return null;
  }
};

// 현재 위치 가져오기
export const getCurrentLocation = (): Promise<{ lat: number; lng: number }> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation이 지원되지 않습니다.'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
      },
      (error) => {
        reject(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      }
    );
  });
};

// 두 좌표 간의 거리 계산 (Haversine 공식)
export const calculateDistance = (
  lat1: number, 
  lng1: number, 
  lat2: number, 
  lng2: number
): number => {
  const R = 6371; // 지구 반지름 (km)
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

// Hospital-Location-Backend API 클라이언트 설정
const HOSPITAL_BACKEND_URL = import.meta.env.VITE_HOSPITAL_BACKEND_URL || 'http://localhost:8002';

// 병원 백엔드 API 클라이언트
const hospitalApiClient = {
  async post(endpoint: string, data: any) {
    const doFetch = (ep: string) => fetch(`${HOSPITAL_BACKEND_URL}${ep}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    });

    // 1차 시도: 주 경로로 호출
    let response = await doFetch(endpoint);

    // 호환용 폴백: 로컬 백엔드가 루트 경로(`/search-ft-xml`)만 제공하는 경우
    if (response.status === 404 && endpoint === '/api/v1/search/search-ft-xml') {
      try {
        const fallbackEp = '/search-ft-xml';
        response = await doFetch(fallbackEp);
      } catch (_) {
        // 그대로 아래 공통 에러 처리로 진행
      }
    }

    if (!response.ok) {
      const text = await response.text().catch(() => '');
      throw new Error(`Hospital API 오류: ${response.status} ${response.statusText} ${text}`.trim());
    }

    return response.json();
  },
  
  async get(endpoint: string) {
    const response = await fetch(`${HOSPITAL_BACKEND_URL}${endpoint}`);
    
    if (!response.ok) {
      throw new Error(`Hospital API 오류: ${response.statusText}`);
    }
    
    return response.json();
  }
};

// AI 분석 결과를 XML 형태로 변환하는 함수
const convertToFTXML = (diagnosis: string, description?: string, similarDiseases: string[] = []): string => {
  console.log('🔄 XML 변환 입력 데이터:', { diagnosis, description, similarDiseases });
  
  const xml = `<root>
    <diagnosis>${diagnosis}</diagnosis>
    ${description ? `<description>${description}</description>` : ''}
    ${similarDiseases.length > 0 ? `<similar_diseases>${similarDiseases.join(', ')}</similar_diseases>` : ''}
  </root>`;
  
  console.log('📝 생성된 XML:', xml);
  return xml;
};

// Hospital-Location-Backend 검색 결과를 프론트엔드 형태로 변환
const convertHospitalResults = (backendResults: any[]): Hospital[] => {
  return backendResults.map((result: any, index: number) => {
    // Shape A: parent/child/contacts (older backend)
    if (result && (result.parent || result.child)) {
      const parent = result.parent || {};
      const child = result.child || {};
      const contacts = parent.contacts || {};
      return {
        id: index + 1,
        name: parent.name || '병원명 없음',
        rating: 0,
        distance: '',
        specialties: Array.isArray(parent.specialties) ? parent.specialties : [],
        address: contacts.addr || parent.address || '',
        phone: contacts.tel || contacts.phone || '',
        description: child.embedding_text || child.title || '',
        availableToday: false,
        openHours: '',
        reviewCount: 0,
        isBookmarked: false,
        website: contacts.url || '',
        parkingAvailable: false,
        reservationAvailable: false,
        insuranceAccepted: false,
      };
    }

    // Shape B: flattened fields (newer backend)
    return {
      id: index + 1,
      name: result?.name || '병원명 없음',
      rating: 0,
      distance: result?.distance || '',
      specialties: Array.isArray(result?.specialties) ? result.specialties : [],
      address: result?.addr || result?.address || '',
      phone: result?.tell || result?.tel || result?.phone || '',
      description: result?.description || '',
      availableToday: false,
      openHours: '',
      reviewCount: 0,
      isBookmarked: false,
      website: result?.url || result?.website || '',
      parkingAvailable: false,
      reservationAvailable: false,
      insuranceAccepted: false,
    };
  });
};

// 병원 서비스 API
export const hospitalService = {
  // 병원 검색 (AI 분석 결과 기반)
  async searchHospitals(params: HospitalSearchRequest): Promise<HospitalSearchResponse> {
    try {
      // AI 분석 결과가 있는 경우 Hospital-Location-Backend 사용
      const diagnosis = params.specialties && params.specialties.length > 0 
        ? params.specialties[0] 
        : '일반 피부과';
      
      const searchData = {
        xml: convertToFTXML(diagnosis),
        rerank_mode: 'ce',  // CrossEncoder 모드
        top_k: 24,
        group_size: 10,
        final_k: 2
      };
      
      const response = await hospitalApiClient.post('/api/v1/search/search-ft-xml', searchData);
      
      const hospitals = convertHospitalResults(response.results || []);
      
      return {
        hospitals,
        total: hospitals.length,
        hasMore: false
      };
    } catch (error) {
      console.error('병원 검색 오류 (Hospital-Location-Backend):', error);
      
      // 백엔드 연결 실패 시 빈 결과 반환
      return {
        hospitals: [],
        total: 0,
        hasMore: false
      };
    }
  },

  // AI 진단 기반 병원 검색 (새로운 메서드)
  async searchHospitalsByDiagnosis(
    diagnosis: string, 
    description?: string, 
    similarDiseases: string[] = [],
    finalK: number = 5
  ): Promise<HospitalSearchResponse> {
    try {
      const xmlData = convertToFTXML(diagnosis, description, similarDiseases);
      
      console.log('📝 Hospital-Location-Backend XML 요청:', xmlData);
      
      const searchData = {
        xml: xmlData,
        rerank_mode: 'ce',
        top_k: 24,
        group_size: 10,
        final_k: finalK
      };
      
      console.log('🚀 Hospital-Location-Backend 전송 데이터:', searchData);
      
      const response = await hospitalApiClient.post('/api/v1/search/search-ft-xml', searchData);
      
      console.log('📥 Hospital-Location-Backend 응답:', response);
      
      const hospitals = convertHospitalResults(response.results || []);
      
      console.log('🏥 변환된 병원 데이터:', hospitals);
      
      return {
        hospitals,
        total: hospitals.length,
        hasMore: false
      };
    } catch (error) {
      console.error('❌ AI 진단 기반 병원 검색 오류:', error);
      throw error;
    }
  },

  // (구) 원본 결과 반환 메서드는 제거되었습니다.

  // 자연어 쿼리 기반 병원 검색
  async searchHospitalsByQuery(query: string, k: number = 5): Promise<HospitalSearchResponse> {
    try {
      const searchData = {
        message: query,
        k: k
      };
      
      const response = await hospitalApiClient.post('/agent-query', searchData);
      
      // sources를 병원 정보로 변환
      const hospitals = response.sources.map((source: any, index: number) => ({
        id: index + 1,
        name: source.source || '알 수 없는 병원',
        rating: 4.5,
        distance: '알 수 없음',
        specialties: ['피부과'],
        address: '주소 정보 없음',
        phone: '연락처 정보 없음',
        description: source.snippet || '설명 없음',
        availableToday: true,
        openHours: '09:00-18:00',
        reviewCount: Math.floor(Math.random() * 1000) + 100,
        isBookmarked: false
      }));
      
      return {
        hospitals,
        total: hospitals.length,
        hasMore: false
      };
    } catch (error) {
      console.error('자연어 쿼리 기반 병원 검색 오류:', error);
      throw error;
    }
  },

  // 백엔드 상태 확인
  async checkBackendHealth(): Promise<any> {
    try {
      const response = await hospitalApiClient.get('/health');
      return response;
    } catch (error) {
      console.error('Hospital-Location-Backend 상태 확인 오류:', error);
      throw error;
    }
  },

  // 병원 상세 정보 조회
  async getHospitalDetail(hospitalId: number): Promise<Hospital> {
    try {
      const response = await apiClient.get(`/hospitals/${hospitalId}`);
      return response.data.data;
    } catch (error) {
      console.error('병원 상세 정보 조회 오류:', error);
      throw error;
    }
  },

  // 병원 북마크 토글
  async toggleBookmark(hospitalId: number): Promise<{ isBookmarked: boolean }> {
    try {
      const response = await apiClient.post(`/hospitals/${hospitalId}/bookmark`);
      return response.data.data;
    } catch (error) {
      console.error('북마크 토글 오류:', error);
      throw error;
    }
  },

  // 사용자 북마크 목록 조회
  async getBookmarkedHospitals(): Promise<Hospital[]> {
    try {
      const response = await apiClient.get('/hospitals/bookmarks');
      return response.data.data;
    } catch (error) {
      console.error('북마크 목록 조회 오류:', error);
      return [];
    }
  },

  // 병원 리뷰 작성
  async addReview(hospitalId: number, review: {
    rating: number;
    comment: string;
    visitDate?: string;
  }): Promise<void> {
    try {
      await apiClient.post(`/hospitals/${hospitalId}/reviews`, review);
    } catch (error) {
      console.error('리뷰 작성 오류:', error);
      throw error;
    }
  },

  // 근처 병원 검색 (현재 위치 기반)
  async findNearbyHospitals(
    latitude: number, 
    longitude: number, 
    radius: number = 5
  ): Promise<Hospital[]> {
    try {
      const response = await apiClient.get('/hospitals/nearby', {
        params: { latitude, longitude, radius }
      });
      return response.data.data;
    } catch (error) {
      console.error('근처 병원 검색 오류:', error);
      
      // 위치 기반 검색 미사용
      return [];
    }
  }
};

// 더미데이터 제거됨 - 실제 백엔드 연결만 사용

export default hospitalService;
