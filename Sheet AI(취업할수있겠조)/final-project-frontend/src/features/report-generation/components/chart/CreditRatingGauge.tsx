import React from 'react';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

// 신용등급 정의
export const CREDIT_RATINGS = [
  'AAA',
  'AA+',
  'AA',
  'AA-',
  'A+',
  'A',
  'A-',
  'BBB+',
  'BBB',
  'BBB-',
  'BB+',
  'BB',
  'BB-',
  'B+',
  'B',
  'B-',
  'CCC+',
  'CCC',
  'CCC-',
  'CC+',
  'CC',
  'CC-',
  'C+',
  'C',
  'C-',
  'D',
];

// 투자등급과 투기등급 구분 인덱스 (BBB- 이상이 투자등급)
const INVESTMENT_GRADE_THRESHOLD = 9; // BBB- 인덱스

interface CreditRatingGaugeProps {
  rating?: string | null;
  title?: string;
  description?: string;
}

const CreditRatingGauge: React.FC<CreditRatingGaugeProps> = ({
  rating,
  title = '신용등급',
  description,
}) => {
  // 신용등급이 없는 경우 에러 표시
  if (!rating) {
    return (
      <div className='report-section'>
        <div className='report-section-header'>
          <h3 className='report-section-title'>{title}</h3>
          {description && <p className='report-section-description'>{description}</p>}
        </div>

        <div className='flex flex-col items-center p-4'>
          <div className='w-full max-w-xs h-52 flex items-center justify-center bg-gray-50 rounded-lg'>
            <div className='text-center'>
              <div className='text-red-500 text-4xl mb-2'>⚠️</div>
              <div className='text-gray-700 font-medium'>신용등급 정보가 없습니다</div>
              <p className='text-sm text-gray-500 mt-2'>
                해당 기업의 신용등급 정보를 제공할 수 없습니다.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 등급 인덱스 찾기
  const ratingIndex = CREDIT_RATINGS.findIndex(r => r === rating);
  if (ratingIndex === -1) {
    console.error(`Invalid credit rating: ${rating}`);
    return (
      <div className='report-section'>
        <div className='report-section-header'>
          <h3 className='report-section-title'>{title}</h3>
          {description && <p className='report-section-description'>{description}</p>}
        </div>

        <div className='flex flex-col items-center p-4'>
          <div className='w-full max-w-xs h-52 flex items-center justify-center bg-gray-50 rounded-lg'>
            <div className='text-center'>
              <div className='text-red-500 text-4xl mb-2'>⚠️</div>
              <div className='text-gray-700 font-medium'>잘못된 신용등급</div>
              <p className='text-sm text-gray-500 mt-2'>
                '{rating}'은(는) 유효한 신용등급이 아닙니다.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 투자등급 여부 확인
  const isInvestmentGrade = ratingIndex <= INVESTMENT_GRADE_THRESHOLD;

  // 게이지 데이터 생성
  const totalSegments = CREDIT_RATINGS.length;

  // 높은 등급(AAA)일수록 게이지가 더 많이 채워지도록 수정
  const qualityPercentage = 100 - (ratingIndex / (totalSegments - 1)) * 100;

  const data = [
    { name: '현재 등급', value: qualityPercentage },
    { name: '나머지', value: 100 - qualityPercentage },
  ];

  // 색상 설정
  const ratingColor = isInvestmentGrade ? '#10B981' : '#F59E0B';
  const ratingColorLight = isInvestmentGrade ? '#D1FAE5' : '#FEF3C7';

  // 등급 설명 생성
  const ratingDescription = isInvestmentGrade ? '투자 적격 등급' : '투기 등급';

  // 위험도 계산 (0-100%)
  const riskPercentage = (ratingIndex / (totalSegments - 1)) * 100;
  const riskLevel =
    riskPercentage <= 25
      ? '낮음'
      : riskPercentage <= 50
        ? '중간'
        : riskPercentage <= 75
          ? '높음'
          : '매우 높음';

  return (
    <div className='report-section'>
      <div className='report-section-header'>
        <h3 className='report-section-title'>{title}</h3>
        {description && <p className='report-section-description'>{description}</p>}
      </div>

      <div className='flex flex-col items-center p-4'>
        <div className='w-full max-w-xs h-52 relative'>
          <ResponsiveContainer width='100%' height='100%'>
            <PieChart>
              <Pie
                data={data}
                cx='50%'
                cy='50%'
                startAngle={180}
                endAngle={0}
                innerRadius='60%'
                outerRadius='80%'
                paddingAngle={0}
                dataKey='value'
                cornerRadius={5}
              >
                <Cell key={`cell-0`} fill={ratingColor} />
                <Cell key={`cell-1`} fill={ratingColorLight} />
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>

          {/* 중앙에 등급 표시 */}
          <div className='absolute inset-0 flex flex-col items-center justify-center'>
            <div className='text-2xl font-bold' style={{ color: ratingColor }}>
              {rating}
            </div>
            <div className='text-sm text-gray-500'>{ratingDescription}</div>
          </div>
        </div>

        {/* 추가 정보 */}
        <div className='w-full max-w-xs mt-4 gap-4'>
          <div className='bg-gray-50 p-3 rounded-lg'>
            <div className='text-sm text-gray-500'>위험도</div>
            <div className='font-medium'>{riskLevel}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreditRatingGauge;
