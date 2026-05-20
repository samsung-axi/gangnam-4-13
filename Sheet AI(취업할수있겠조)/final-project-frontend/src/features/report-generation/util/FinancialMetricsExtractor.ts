import type {
  FinancialMetrics,
  ReportData,
  SummaryCardStructured,
} from '@/features/report-generation/types/ReportTypes.ts';

export default class FinancialMetricsExtractor {
  static extract(reportData: ReportData | null): FinancialMetrics {
    const defaultMetrics: FinancialMetrics = {
      roa: 6.7,
      roe: 8.57,
      debtRatio: 27.93,
      operatingProfitMargin: 10.88,
    };

    if (!reportData) {
      return defaultMetrics;
    }

    try {
      // 먼저 구조화된 요약 카드 데이터에서 재무 지표를 추출 시도
      const structuredData = this.getStructuredData(reportData);
      if (structuredData) {
        return this.extractFromStructuredData(structuredData);
      }
      
      // 구조화된 데이터가 없으면 기존 방식으로 추출
      const content = this.getDetailedContent(reportData);
      return this.parseMetricsFromContent(content, defaultMetrics);
    } catch (error) {
      console.error('재무 지표 추출 중 오류:', error);
      return defaultMetrics;
    }
  }

  private static getStructuredData(reportData: ReportData): SummaryCardStructured | null {
    // json 내부 또는 최상위에서 summary_card_structured 찾기
    return reportData?.json?.summary_card_structured || reportData?.summary_card_structured || null;
  }

  private static extractFromStructuredData(data: SummaryCardStructured): FinancialMetrics {
    return {
      roa: data.financial_metrics.roa.value,
      roe: data.financial_metrics.roe.value,
      debtRatio: data.financial_metrics.debt_ratio.value,
      operatingProfitMargin: data.financial_metrics.operating_profit_margin.value,
    };
  }

  private static getDetailedContent(reportData: ReportData): string {
    if ('json' in reportData && reportData.json) {
      return reportData.json.report_data?.detailed_content || '';
    }
    return reportData.report_data?.detailed_content || '';
  }

  private static parseMetricsFromContent(
    content: string,
    defaultMetrics: FinancialMetrics
  ): FinancialMetrics {
    const metrics = { ...defaultMetrics };

    const patterns = {
      roa: /ROA[:\s]*([0-9.]+)%/i,
      roe: /ROE[:\s]*([0-9.]+)%/i,
      debtRatio: /부채비율[:\s]*([0-9.]+)%/i,
      operatingProfitMargin: /영업이익률[:\s]*([0-9.]+)%/i,
    };

    Object.entries(patterns).forEach(([key, pattern]) => {
      const match = content.match(pattern);
      if (match && match[1]) {
        metrics[key as keyof FinancialMetrics] = parseFloat(match[1]);
      }
    });

    return metrics;
  }
}
