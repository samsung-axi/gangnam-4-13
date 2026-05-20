import type { IndustryInfo, ReportData, SummaryCardStructured, NewsItem } from '@/features/report-generation/types/ReportTypes.ts';

export class ReportDataExtractor {
  static getCompanyName(reportData: ReportData | null): string {
    if (!reportData) {
      return '보고서';
    }

    // 구조화된 요약 카드에서 회사명 추출 시도
    const structuredData = this.getStructuredData(reportData);
    if (structuredData && structuredData.company_name) {
      return structuredData.company_name;
    }

    if ('json' in reportData && reportData.json) {
      return reportData.json.company_name || '보고서';
    }
    return reportData.company_name || '보고서';
  }

  static getSubtitle(reportData: ReportData | null): string {
    const defaultSubtitle = '금융 분석 | 신용평가';
    if (!reportData) {
      return defaultSubtitle;
    }

    if ('json' in reportData && reportData.json?.report_data) {
      return reportData.json.report_data.subtitle || defaultSubtitle;
    }

    if (reportData.report_data) {
      return reportData.report_data.subtitle || defaultSubtitle;
    }

    return defaultSubtitle;
  }

  static getGenerationDate(reportData: ReportData | null): string {
    const defaultDate = '2025년 06월 23일';
    if (!reportData) {
      return defaultDate;
    }

    // 구조화된 요약 카드에서 평가일자 추출 시도
    const structuredData = this.getStructuredData(reportData);
    if (structuredData && structuredData.evaluation_date) {
      return structuredData.evaluation_date;
    }

    if ('json' in reportData && reportData.json?.report_data) {
      return reportData.json.report_data.generation_date || defaultDate;
    }

    if (reportData.report_data) {
      return reportData.report_data.generation_date || defaultDate;
    }

    return defaultDate;
  }

  static getIndustryInfo(reportData: ReportData | null): IndustryInfo {
    const defaultInfo = { industry: '', market: '' };
    if (!reportData) {
      return defaultInfo;
    }

    if ('json' in reportData && reportData.json?.report_data) {
      return {
        industry: reportData.json.report_data.industry_name || '',
        market: reportData.json.report_data.market_type || '',
      };
    }

    if (reportData.report_data) {
      return {
        industry: reportData.report_data.industry_name || '',
        market: reportData.report_data.market_type || '',
      };
    }

    return defaultInfo;
  }

  static getSections(reportData: ReportData | null): any[] {
    if (!reportData) {
      return [];
    }

    if ('json' in reportData && reportData.json) {
      return reportData.json.sections || [];
    }
    return reportData.sections || [];
  }

  static extractCreditRating(
    reportData: ReportData | null,
    storedCreditRating: string | null
  ): string | null {
    if (!reportData) {
      return null;
    }

    // 1. jotai atom에 저장된 신용등급이 있으면 사용
    if (storedCreditRating) {
      console.log('jotai atom에서 신용등급 가져옴:', storedCreditRating);
      return storedCreditRating;
    }

    // 2. 구조화된 요약 카드에서 신용등급 추출 시도
    const structuredData = this.getStructuredData(reportData);
    if (structuredData && structuredData.credit_rating) {
      console.log('구조화된 요약 카드에서 신용등급 가져옴:', structuredData.credit_rating);
      return structuredData.credit_rating;
    }

    // 3. json 속성이 있는 경우
    if ('json' in reportData && reportData.json) {
      return this.extractFromJson(reportData.json);
    }

    // 4. json 속성이 없는 경우
    return this.extractFromReportData(reportData);
  }

  static getStructuredData(reportData: ReportData | null): SummaryCardStructured | null {
    if (!reportData) {
      return null;
    }

    if ('summary_card_structured' in reportData && reportData.summary_card_structured) {
      return reportData.summary_card_structured;
    }

    if ('json' in reportData && reportData.json?.summary_card_structured) {
      return reportData.json.summary_card_structured;
    }

    return null;
  }

  static getNewsData(reportData: ReportData | null): NewsItem[] {
    if (!reportData) {
      return [];
    }
    
    if ('news_data' in reportData && reportData.news_data) {
      return reportData.news_data;
    }
    
    if ('json' in reportData && reportData.json?.news_data) {
      return reportData.json.news_data;
    }
    
    return [];
  }

  private static extractFromJson(json: ReportData['json']): string | null {
    if (json.credit_rating) {
      console.log('API에서 제공된 신용등급 (json):', json.credit_rating);
      return this.normalizeRating(json.credit_rating);
    }
    console.warn('신용등급 정보를 찾을 수 없습니다.');
    return null;
  }

  private static extractFromReportData(reportData: ReportData): string | null {
    if (reportData.credit_rating) {
      console.log('API에서 제공된 신용등급:', reportData.credit_rating);
      return this.normalizeRating(reportData.credit_rating);
    }
    console.warn('신용등급 정보를 찾을 수 없습니다.');
    return null;
  }

  private static normalizeRating(rating: any): string | null {
    if (typeof rating === 'object') {
      return rating.credit_rating || null;
    }
    return rating;
  }
}
