import type { RatingInfo } from '@/features/report-generation/types/ReportTypes.ts';

export default class CreditRatingUtils {
  static getRatingInfo(rating: string | null): RatingInfo {
    if (!rating) {
      return { color: '#6B7280', progress: 50 };
    }

    const configs: Record<string, RatingInfo> = {
      // 투자 적격 등급 (Investment Grade)
      AAA: { color: '#059669', progress: 100, message: '최우수' },
      'AA+': { color: '#059669', progress: 95, message: '우수+' },
      AA: { color: '#059669', progress: 90, message: '우수' },
      'AA-': { color: '#059669', progress: 85, message: '우수-' },
      'A+': { color: '#10B981', progress: 80, message: '양호+' },
      A: { color: '#10B981', progress: 75, message: '양호' },
      'A-': { color: '#10B981', progress: 70, message: '양호-' },
      'BBB+': { color: '#34D399', progress: 65, message: '적정+' },
      BBB: { color: '#34D399', progress: 60, message: '적정' },
      'BBB-': { color: '#34D399', progress: 55, message: '적정-' },
      
      // 투자 주의 등급 (Non-Investment Grade)
      'BB+': { color: '#F59E0B', progress: 50, message: '보통+' },
      BB: { color: '#F59E0B', progress: 45, message: '보통' },
      'BB-': { color: '#F59E0B', progress: 40, message: '보통-' },
      'B+': { color: '#F97316', progress: 35, message: '주의+' },
      B: { color: '#F97316', progress: 30, message: '주의' },
      'B-': { color: '#F97316', progress: 25, message: '주의-' },
      
      // 투자 위험 등급 (High Risk)
      'CCC+': { color: '#EF4444', progress: 20, message: '위험+' },
      CCC: { color: '#EF4444', progress: 18, message: '위험' },
      'CCC-': { color: '#EF4444', progress: 16, message: '위험-' },
      'CC+': { color: '#DC2626', progress: 14, message: '매우 위험+' },
      CC: { color: '#DC2626', progress: 12, message: '매우 위험' },
      'CC-': { color: '#DC2626', progress: 10, message: '매우 위험-' },
      'C+': { color: '#B91C1C', progress: 8, message: '극도 위험+' },
      C: { color: '#B91C1C', progress: 6, message: '극도 위험' },
      'C-': { color: '#B91C1C', progress: 4, message: '극도 위험-' },
      D: { color: '#7F1D1D', progress: 2, message: '부도' },
    };

    return configs[rating] || { color: '#6B7280', progress: 50, message: '미분류' };
  }
}
