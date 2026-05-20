import type { DashboardResponse, FilterOptions } from '../types/dashboard';

// 대시보드 데이터 타입 정의
export interface DashboardSummary {
  title: string;
  unit: string;
  target: number;
  average: number;
  labelTarget: string;
  labelAvg: string;
  color: string;
  colorAvg: string;
  yMax: number;
}

export interface ChartData {
  year: string;
  발생빈도: number;
  처리시간: number;
  period: string;
}

export interface TableData {
  period: string;
  target: string;
  value: string;
  pop: string;
  prevValue: string;
  growth: string;
}

// API 기본 URL
// const API_BASE_URL =
//   import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';

// 대시보드 통계 데이터 조회
export const fetchDashboardStats = async (params: {
  period?: string;
  project_id?: string;
  department?: string;
  user_id?: string;
  start_date?: string;
  end_date?: string;
}): Promise<DashboardResponse> => {
  try {
    // 쿼리 파라미터 구성
    const queryParams = new URLSearchParams();
    if (params.period) queryParams.append('period', params.period);
    if (params.project_id) queryParams.append('project_id', params.project_id);
    if (params.department) queryParams.append('department', params.department);
    if (params.user_id) queryParams.append('user_id', params.user_id);
    if (params.start_date) queryParams.append('start_date', params.start_date);
    if (params.end_date) queryParams.append('end_date', params.end_date);

    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/v1/dashboard/stats?${queryParams}`,
      {
        method: 'GET',
        credentials: 'include', // 쿠키 포함
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.detail || '대시보드 데이터 조회에 실패했습니다.'
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('대시보드 데이터 조회 오류:', error);
    throw error;
  }
};

// 대시보드 필터 옵션 조회
export const fetchDashboardFilterOptions = async (params?: {
  project_id?: string;
  department?: string;
  user_id?: string;
  start_date?: string;
  end_date?: string;
}): Promise<FilterOptions> => {
  try {
    // 쿼리 파라미터 구성
    const queryParams = new URLSearchParams();
    if (params?.project_id) queryParams.append('project_id', params.project_id);
    if (params?.department) queryParams.append('department', params.department);
    if (params?.user_id) queryParams.append('user_id', params.user_id);
    if (params?.start_date) queryParams.append('start_date', params.start_date);
    if (params?.end_date) queryParams.append('end_date', params.end_date);

    const response = await fetch(
      `${
        import.meta.env.VITE_API_URL
      }/api/v1/dashboard/filter-options?${queryParams}`,
      {
        method: 'GET',
        credentials: 'include', // 쿠키 포함
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || '필터 옵션 조회에 실패했습니다.');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('필터 옵션 조회 오류:', error);
    throw error;
  }
};
