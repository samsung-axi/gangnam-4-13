import React from 'react';
import type {
  RatingInfo, SummaryCardStructured,
} from '@/features/report-generation/types/ReportTypes.ts';

interface SummaryCardProps {
  companyName: string;
  generationDate: string;
  creditRating: string | null;
  ratingInfo: RatingInfo;
  summaryCardData?: SummaryCardStructured;
}

const ReportSummaryCard: React.FC<SummaryCardProps> = ({
  companyName,
  generationDate,
  creditRating,
  ratingInfo,
  summaryCardData,
}) => {
  // 데이터가 없는 경우 기본 렌더링
  if (!summaryCardData) {
    return (
      <div className='bg-blue-50 rounded-lg p-6 mb-8 border-l-4 border-blue-500'>
        <div className='flex items-center mb-4'>
          <div className='bg-blue-500 rounded-full w-6.5 h-6.5  p-0.5 mr-3 summary-card-icon-container'>
            <div className='summary-card-icon'>
              <span className='text-blue-600'>📊</span>
            </div>
          </div>
          <h3 className='text-xl font-bold text-gray-800'>신용분석 요약 카드</h3>
        </div>
        <div>
          <div className='mb-6 flex'>
            <div className='flex flex-col gap-2'>
              <div className='text-sm text-gray-600 mb-1'>
                <span className='font-semibold text-gray-800'>기업명: </span>
                <span>{companyName}</span>
              </div>
              <div className='text-sm text-gray-600 mb-1'>
                <span className='font-semibold text-gray-800'>평가일자: </span>
                {generationDate}
              </div>
              <div>
                <div className='text-sm text-gray-600 mb-1'>
                  <span className='font-semibold text-gray-800'>신용등급: </span>
                  {creditRating ? (
                    <span className='font-bold ml-0.5' style={{ color: ratingInfo.color }}>
                      {creditRating}
                    </span>
                  ) : (
                    <span className='font-medium ml-0.5 text-gray-500 bg-gray-100 px-2 py-1 rounded text-xs'>
                      평가 불가
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className='m-auto' />
            <div className='flex flex-col gap-3'>
              <div className='text-sm text-gray-600'>
                <span className='font-semibold text-gray-800'>주요 강점 키워드: </span>
              </div>
              <div className='text-sm text-gray-700 break-words mb-1 font-light'>데이터 없음</div>
              <div className='text-sm text-gray-600'>
                <span className='font-semibold text-gray-800'>주요 약점 키워드: </span>
              </div>
              <div className='text-sm text-gray-700 break-words font-light'>데이터 없음</div>
            </div>
          </div>
        </div>
        <div>
          <div className='text-sm font-semibold text-gray-700 mb-3'>핵심 재무지표:</div>
          <div className='grid grid-cols-4 gap-4 text-center'>
            <div>
              <div className='text-2xl font-bold text-gray-400 mb-1'>-</div>
              <div className='text-xs text-gray-600'>ROA (미정)</div>
            </div>
            <div>
              <div className='text-2xl font-bold text-gray-400 mb-1'>-</div>
              <div className='text-xs text-gray-600'>ROE (미정)</div>
            </div>
            <div>
              <div className='text-2xl font-bold text-gray-400 mb-1'>-</div>
              <div className='text-xs text-gray-600'>부채비율 (미정)</div>
            </div>
            <div>
              <div className='text-2xl font-bold text-gray-400 mb-1'>-</div>
              <div className='text-xs text-gray-600'>영업이익률 (미정)</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 평가에 따른 색상 결정
  const getColorByEvaluation = (evaluationText: string) => {
    if (evaluationText.includes('양호') || evaluationText.includes('우수')) {
      return 'text-emerald-600';
    }
    if (
      evaluationText.includes('낮음') ||
      evaluationText.includes('높은') ||
      evaluationText.includes('주의')
    ) {
      return 'text-red-500';
    }
    return 'text-orange-600'; // 보통, 중간 등
  };

  // color_grade에 따른 색상 결정 (1-5 숫자 기준)
  const getColorByGrade = (colorGrade: string | undefined): string => {
    if (!colorGrade) {
      return '';
    }

    // 문자열을 숫자로 변환
    const grade = parseInt(colorGrade);

    switch (grade) {
      case 5: // 최상
        return 'text-blue-600'; // 파란색
      case 4: // 상
        return 'text-emerald-600'; // 파란색
      case 3: // 중
        return 'text-yellow-500'; // 노란색
      case 2: // 하
        return 'text-orange-600'; // 주황색
      case 1: // 최하
        return 'text-red-500'; // 빨간색
      default:
        return ''; // 기본값 (평가 텍스트 기반 색상 사용)
    }
  };

  // 색상 결정 (color_grade가 있으면 우선 사용, 없으면 평가 텍스트 기반)
  const getMetricColor = (metric: { evaluation: string; color_grade?: string }) => {
    if (metric.color_grade) {
      return getColorByGrade(metric.color_grade);
    }
    return getColorByEvaluation(metric.evaluation);
  };

  // summaryCardData에서 강점과 약점 추출
  const strengthsText = summaryCardData.strengths.join(', ');
  const weaknessesText = summaryCardData.weaknesses.join(', ');

  return (
    <div className='bg-blue-50 rounded-lg p-6 mb-8 border-l-4 border-blue-500'>
      <div className='flex items-center mb-4'>
        <div className='bg-blue-500 rounded-full w-6.5 h-6.5  p-0.5 mr-3 summary-card-icon-container'>
          <div className='summary-card-icon'>
            <span className='text-blue-600'>📊</span>
          </div>
        </div>
        <h3 className='text-xl font-bold text-gray-800'>신용분석 요약 카드</h3>
      </div>
      <div>
        <div className='mb-6 flex'>
          <div className='flex flex-col gap-2'>
            <div className='text-sm text-gray-600 mb-1'>
              <span className='font-semibold text-gray-800'>기업명: </span>
              <span>{summaryCardData.company_name}</span>
            </div>
            <div className='text-sm text-gray-600 mb-1'>
              <span className='font-semibold text-gray-800'>평가일자: </span>
              {summaryCardData.evaluation_date}
            </div>
            <div>
              <div className='text-sm text-gray-600 mb-1'>
                <span className='font-semibold text-gray-800'>신용등급: </span>
                {summaryCardData.credit_rating ? (
                  <span className='font-bold ml-0.5' style={{ color: ratingInfo.color }}>
                    {summaryCardData.credit_rating}
                  </span>
                ) : (
                  <span className='font-medium ml-0.5 text-gray-500 bg-gray-100 px-2 py-1 rounded text-xs'>
                    평가 불가
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className='m-auto' />
          <div className='flex flex-col gap-3'>
            <div className='text-sm text-gray-600'>
              <span className='font-semibold text-gray-800'>주요 강점 키워드: </span>
            </div>
            <div className='text-sm text-gray-700 break-words mb-1 font-light'>{strengthsText}</div>
            <div className='text-sm text-gray-600'>
              <span className='font-semibold text-gray-800'>주요 약점 키워드: </span>
            </div>
            <div className='text-sm text-gray-700 break-words font-light'>{weaknessesText}</div>
          </div>
        </div>
      </div>
      <div>
        <div className='text-sm font-semibold text-gray-700 mb-3'>핵심 재무지표:</div>
        <div className='grid grid-cols-4 gap-4 text-center'>
          <div>
            <div
              className={`text-2xl font-bold mb-1 ${getMetricColor(summaryCardData.financial_metrics.roa)}`}
            >
              {summaryCardData.financial_metrics.roa.display_value ||
                `${summaryCardData.financial_metrics.roa.value * 100}%`}
            </div>
            <div className='text-xs text-gray-600'>
              ROA ({summaryCardData.financial_metrics.roa.evaluation})
            </div>
          </div>
          <div>
            <div
              className={`text-2xl font-bold mb-1 ${getMetricColor(summaryCardData.financial_metrics.roe)}`}
            >
              {summaryCardData.financial_metrics.roe.display_value ||
                `${summaryCardData.financial_metrics.roe.value * 100}%`}
            </div>
            <div className='text-xs text-gray-600'>
              ROE ({summaryCardData.financial_metrics.roe.evaluation})
            </div>
          </div>
          <div>
            <div
              className={`text-2xl font-bold mb-1 ${getMetricColor(summaryCardData.financial_metrics.debt_ratio)}`}
            >
              {summaryCardData.financial_metrics.debt_ratio.display_value ||
                `${summaryCardData.financial_metrics.debt_ratio.value * 100}%`}
            </div>
            <div className='text-xs text-gray-600'>
              부채비율 ({summaryCardData.financial_metrics.debt_ratio.evaluation})
            </div>
          </div>
          <div>
            <div
              className={`text-2xl font-bold mb-1 ${getMetricColor(summaryCardData.financial_metrics.operating_profit_margin)}`}
            >
              {summaryCardData.financial_metrics.operating_profit_margin.display_value ||
                `${summaryCardData.financial_metrics.operating_profit_margin.value * 100}%`}
            </div>
            <div className='text-xs text-gray-600'>
              영업이익률 ({summaryCardData.financial_metrics.operating_profit_margin.evaluation})
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportSummaryCard;
