import React, { useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAtom } from 'jotai';
import { creditRatingAtom } from '@/shared/store/atoms.ts';
import { devLog } from '@/shared/util/logger';

import Header from '@/shared/components/Header';
import type { ReportData } from '@/features/report-generation/types/ReportTypes.ts';
import {
  useCreditRating, useReportChartData, useReportData,
} from '@/features/report-generation/hooks/useReportData.ts';
import CreditRatingUtils from '@/features/report-generation/util/CreditRatingUtils.ts';
import { ReportDataExtractor } from '@/features/report-generation/util/ReportDataExtractor.ts';
import PdfGenerationService from '@/features/report-generation/util/PdfGenerationService.ts';
import ReportFooter from '@/features/report-generation/components/ReportFooter.tsx';
import ReportSections from '@/features/report-generation/components/ReportSection.tsx';
import CreditRatingSection from '@/features/report-generation/components/CreditRatingSection.tsx';
import ReportSummaryCard from '@/features/report-generation/components/ReportSummaryCard.tsx';
import { ReportHeader } from '@/features/report-generation/components/ReportHeader.tsx';
import NewsSection from '@/features/report-generation/components/NewsSection.tsx';

const NewReportPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const reportRef = useRef<HTMLDivElement>(null);
  const [isPdfGenerating, setIsPdfGenerating] = useState(false);

  // Data extraction from location state
  const initialData = location.state?.reportData as ReportData;
  const companyData = location.state?.companyData;

  // 디버깅을 위한 로그 추가
  devLog('NewReportPage - location.state:', location.state);
  devLog('NewReportPage - initialData:', initialData);

  // 보고서 데이터가 이미 있는 경우 바로 사용
  // const hasReportData = !!initialData;

  // Atom data
  // const [storedFinancialData] = useAtom(financialDataAtom);
  const [storedCreditRating] = useAtom(creditRatingAtom);

  // Data fetching and processing
  const { data: reportData, isLoading, error } = useReportData(companyData, initialData);

  // 디버깅을 위한 로그 추가
  devLog('NewReportPage - reportData:', reportData);
  devLog('NewReportPage - isLoading:', isLoading);
  devLog('NewReportPage - error:', error);

  // 데이터가 없는 경우 초기 데이터를 직접 사용
  const finalReportData = reportData || initialData;

  // const financialMetrics = useFinancialMetrics(finalReportData);
  const creditRating = useCreditRating(finalReportData, storedCreditRating);
  const ratingInfo = CreditRatingUtils.getRatingInfo(creditRating);
  const chartData = useReportChartData(creditRating);

  // Data extraction
  const companyName = ReportDataExtractor.getCompanyName(finalReportData);
  const subtitle = ReportDataExtractor.getSubtitle(finalReportData);
  const generationDate = ReportDataExtractor.getGenerationDate(finalReportData);
  // const industryInfo = ReportDataExtractor.getIndustryInfo(finalReportData);
  const sections = ReportDataExtractor.getSections(finalReportData);
  const newsItems = ReportDataExtractor.getNewsData(finalReportData);

  // 새로운 구조화된 요약 카드 데이터 추출
  const summaryCardData =
    finalReportData?.json?.summary_card_structured || finalReportData?.summary_card_structured;

  // 디버깅을 위한 로그 추가
  devLog('NewReportPage - summaryCardData:', summaryCardData);
  devLog('NewReportPage - newsItems:', newsItems);

  // Event handlers
  const handleBack = () => navigate(-1);

  const handlePdfGeneration = async () => {
    setIsPdfGenerating(true);
    try {
      await PdfGenerationService.generateSmartPDF(
        reportRef.current,
        `${companyName}_신용등급보고서.pdf`
      );
    } catch (error) {
      alert('PDF 생성 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsPdfGenerating(false);
    }
  };

  // Loading and error states
  if (isLoading) {
    return <div>보고서를 불러오는 중입니다...</div>;
  }
  if (error) {
    return <div>오류가 발생했습니다: {(error as Error).message}</div>;
  }
  if (!finalReportData) {
    return <div>보고서 데이터가 없습니다.</div>;
  }

  return (
    <div>
      {/* Header */}
      <div className='no-print header-wrapper'>
        <Header onBack={handleBack} />
      </div>
      {/* Controls */}
      <div className='no-print flex mx-auto justify-end py-5 max-w-[210mm]'>
        <div className='flex gap-4 items-end'>
          <button
            onClick={handlePdfGeneration}
            disabled={isPdfGenerating}
            className={`
              px-6 py-2 rounded-lg font-medium text-sm shadow-lg transition-all duration-200
              ${
                isPdfGenerating
                  ? 'bg-gray-400 cursor-not-allowed text-gray-200'
                  : 'bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white'
              }
            `}
          >
            {isPdfGenerating ? (
              <div className='flex items-center gap-2'>
                <svg className='animate-spin h-4 w-4' viewBox='0 0 24 24'>
                  <circle
                    className='opacity-25'
                    cx='12'
                    cy='12'
                    r='10'
                    stroke='currentColor'
                    strokeWidth='4'
                    fill='none'
                  />
                  <path
                    className='opacity-75'
                    fill='currentColor'
                    d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                  />
                </svg>
                PDF 생성 중...
              </div>
            ) : (
              'PDF 내보내기'
            )}
          </button>
        </div>
      </div>
      {/* Report Content */}
      <div
        ref={reportRef}
        className='max-w-[210mm] mx-auto bg-white shadow-md rounded-lg overflow-hidden report-container'
      >
        <ReportHeader companyName={companyName} subtitle={subtitle} />

        <div className='p-8'>
          <ReportSummaryCard
            companyName={companyName}
            generationDate={generationDate}
            creditRating={creditRating}
            ratingInfo={ratingInfo}
            summaryCardData={summaryCardData}
          />

          <CreditRatingSection
            creditRating={creditRating}
            ratingInfo={ratingInfo}
            chartData={chartData}
          />

          {/* 기업 개요 섹션 */}
          {sections.length > 0 && sections[0] && (
            <div className='report-section avoid-break mb-8 page-break'>
              <h3 className='text-xl font-bold mb-4 text-gray-800 border-b-2 border-gray-200 pb-2'>
                <div className='report-section-title'>{sections[0].name}</div>
              </h3>
              {sections[0].description && (
                <div className='bg-blue-50 p-4 rounded-lg mb-4'>
                  <p className='text-base font-medium text-blue-800'>
                    <div className='report-section-description'>{sections[0].description}</div>
                  </p>
                </div>
              )}
              <div className='text-base leading-relaxed text-gray-700 whitespace-pre-line'>
                {sections[0].content}
              </div>
            </div>
          )}

          {/* 관련 뉴스 섹션 */}
          <NewsSection newsItems={newsItems} />

          {/* 나머지 섹션들 (기업 개요 제외) */}
          {sections.length > 1 && <ReportSections sections={sections.slice(1)} />}

          <ReportFooter />
        </div>
      </div>
    </div>
  );
};

export default NewReportPage;
