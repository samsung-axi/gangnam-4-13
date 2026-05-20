import { useMutation, useQuery } from '@tanstack/react-query';
import api from '@/shared/config/axios';

// SSE 보고서 생성 URL
export const SSE_REPORT_URL = `${import.meta.env.VITE_AI_SERVER_URL || 'http://localhost:8000'}/api/ai/v1/report/generate-from-financial-data/sse`;
// export const SSE_REPORT_URL = `${import.meta.env.VITE_BACKEND_API_URL || 'http://localhost:8080'}/api/query/financial-sse`;

interface FinancialData {
  corp_code: string;
  corp_name?: string;
  market_type: string;
  industry_name: string;
  revenue: number;
  operating_profit: number;
  net_income: number;
  total_assets: number;
  total_liabilities: number;
  total_equity: number;
  debt_ratio: number;
  ROA: number;
  ROE: number;
  asset_turnover_ratio: number;
}

interface ReportRequest {
  company_name: string;
  financial_data: FinancialData;
  report_type: 'agent_based';
  additional_context?: string;
}

interface SaveReportRequest {
  company_name: string;
  report: any; // 보고서 데이터 타입
}

interface ReportResponse {
  exists: boolean;
  report?: any;
  message?: string;
}

// 보고서 생성 요청 함수
const generateReport = async (requestData: ReportRequest) => {
  const response = await api.post('/api/query/financial', requestData);
  return response.data;
};

// 보고서 조회 함수
export const fetchReport = async (companyName: string): Promise<ReportResponse> => {
  try {
    const response = await api.get(`/api/query/report/${encodeURIComponent(companyName)}`);
    return response.data;
  } catch (error) {
    console.error('보고서 조회 오류:', error);
    return { exists: false, message: '보고서 조회 중 오류가 발생했습니다.' };
  }
};

// 보고서 저장 함수
export const saveReport = async (data: SaveReportRequest) => {
  try {
    const response = await api.post('/api/query/save-report', data);
    return response.data;
  } catch (error) {
    console.error('보고서 저장 오류:', error);
    throw error;
  }
};

// useMutation을 사용하는 커스텀 훅
export const useReportMutation = () => {
  return useMutation({
    mutationFn: generateReport,
  });
};

// 보고서 저장을 위한 useMutation 훅
export const useSaveReportMutation = () => {
  return useMutation({
    mutationFn: saveReport,
  });
};

// 보고서 조회를 위한 useQuery 훅
export const useReportQuery = (companyName: string, enabled = true) => {
  return useQuery({
    queryKey: ['report', companyName],
    queryFn: () => fetchReport(companyName),
    enabled,
  });
};
