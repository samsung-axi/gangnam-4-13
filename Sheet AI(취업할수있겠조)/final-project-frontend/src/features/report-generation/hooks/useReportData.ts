import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import type {
  ChartDataItem,
  FinancialMetrics,
  ReportData,
} from '@/features/report-generation/types/ReportTypes.ts';
import { ReportApiService } from '@/features/report-generation/service/ReportApiService.tsx';
import FinancialMetricsExtractor from '@/features/report-generation/util/FinancialMetricsExtractor.ts';
import CreditRatingUtils from '@/features/report-generation/util/CreditRatingUtils.ts';
import { ReportDataExtractor } from '@/features/report-generation/util/ReportDataExtractor.ts';
import { devLog } from '@/shared/util/logger';

export const useReportData = (companyData: any, initialData: ReportData | null) => {
  devLog('useReportData - companyData:', companyData);
  devLog('useReportData - initialData:', initialData);

  return useQuery({
    queryKey: ['reportData', companyData?.company_name],
    queryFn: () =>
      ReportApiService.fetchReportData(
        companyData?.company_name,
        companyData?.financial_data,
        companyData?.similarity_score
      ),
    enabled: !!companyData && !initialData,
    initialData: initialData,
  });
};

export const useFinancialMetrics = (reportData: ReportData | null): FinancialMetrics => {
  return useMemo(() => FinancialMetricsExtractor.extract(reportData), [reportData]);
};

export const useCreditRating = (
  reportData: ReportData | null,
  storedCreditRating: string | null
) => {
  return useMemo(
    () => ReportDataExtractor.extractCreditRating(reportData, storedCreditRating),
    [reportData, storedCreditRating]
  );
};

export const useReportChartData = (creditRating: string | null): ChartDataItem[] => {
  return useMemo(() => {
    const ratingInfo = CreditRatingUtils.getRatingInfo(creditRating);

    return creditRating
      ? [
          { name: 'progress', value: ratingInfo.progress, fill: ratingInfo.color },
          { name: 'remaining', value: 100 - ratingInfo.progress, fill: '#e5e7eb' },
        ]
      : [{ name: 'unknown', value: 100, fill: '#f3f4f6' }];
  }, [creditRating]);
};
