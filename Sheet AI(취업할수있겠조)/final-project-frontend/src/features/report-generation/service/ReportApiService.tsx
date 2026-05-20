import api from '@/shared/config/axios';
import type { ReportData } from '@/features/report-generation/types/ReportTypes.ts';

export class ReportApiService {
  static async fetchReportData(companyName: string, financialData: any, similarityScore?: number): Promise<ReportData> {
    try {
      console.log('API 요청 데이터:', {
        company_name: companyName,
        similarity_score: similarityScore,
        financial_data: financialData,
        report_type: 'agent_based',
      });

      const response = await api.post('/api/query/financial', {
        company_name: companyName,
        similarity_score: similarityScore,
        financial_data: financialData,
        report_type: 'agent_based',
      });

      console.log('API 응답 데이터:', response.data);
      return response.data;
    } catch (error) {
      console.error('API 요청 오류:', error);
      throw error;
    }
  }
}
