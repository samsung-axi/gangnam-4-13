import React from 'react';
import { Cell, Pie, PieChart } from 'recharts';
import type { ChartDataItem, RatingInfo } from '@/features/report-generation/types/ReportTypes.ts';

interface CreditRatingSectionProps {
  creditRating: string | null;
  ratingInfo: RatingInfo;
  chartData: ChartDataItem[];
}

interface CreditRatingCenterTextProps {
  creditRating: string | null;
  ratingInfo: RatingInfo;
}

const CreditRatingCenterText: React.FC<CreditRatingCenterTextProps> = ({
  creditRating,
  ratingInfo,
}) => (
  <div className='absolute inset-0 flex flex-col items-center justify-center credit-rating-center'>
    {creditRating ? (
      <>
        <div
          className='text-5xl font-bold mb-2 credit-rating-main'
          style={{ color: ratingInfo.color }}
        >
          {creditRating}
        </div>
        <div className='text-gray-600 text-sm font-medium credit-rating-sub'>
          {ratingInfo.message}
        </div>
        <div className='text-gray-500 text-xs credit-rating-sub'>{ratingInfo.progress}% 신뢰도</div>
      </>
    ) : (
      <>
        <div className='text-3xl font-bold mb-2 text-gray-400 credit-rating-main'>?</div>
        <div className='text-gray-500 text-sm font-medium text-center credit-rating-sub'>
          신용등급
          <br />
          정보 없음
        </div>
        <div className='text-gray-400 text-xs mt-2 bg-yellow-50 px-3 py-1 rounded credit-rating-sub'>
          평가 불가
        </div>
      </>
    )}
  </div>
);

const CreditRatingWarning: React.FC = () => (
  <div className='mt-6 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded-r-lg'>
    <div className='flex items-start'>
      <div className='text-yellow-400 mr-3'>⚠️</div>
      <div>
        <p className='text-yellow-800 font-medium text-sm'>신용등급 정보를 확인할 수 없습니다</p>
        <p className='text-yellow-700 text-xs mt-1'>
          서버에서 신용등급 데이터를 제공받지 못했습니다. 관리자에게 문의해주세요.
        </p>
      </div>
    </div>
  </div>
);

const CreditRatingSection: React.FC<CreditRatingSectionProps> = ({
  creditRating,
  ratingInfo,
  chartData,
}) => (
  <div className='avoid-break page-break'>
    <h3 className='text-2xl font-bold mb-6 text-gray-800'>신용등급</h3>
    <div className='flex items-center justify-center'>
      <div className='relative'>
        <PieChart width={280} height={280}>
          <Pie
            data={chartData}
            dataKey='value'
            nameKey='name'
            cx='50%'
            cy='50%'
            outerRadius={120}
            innerRadius={80}
            startAngle={90}
            endAngle={-270}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Pie>
        </PieChart>
        <CreditRatingCenterText creditRating={creditRating} ratingInfo={ratingInfo} />
      </div>
    </div>
    {!creditRating && <CreditRatingWarning />}
  </div>
);

export default CreditRatingSection;
