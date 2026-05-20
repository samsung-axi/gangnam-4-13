import React from 'react';
import {
  Legend,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';

interface FinancialData {
  ROA: number;
  ROE: number;
  debt_ratio: number;
  asset_turnover_ratio: number;
  interest_to_assets_ratio?: number;
  cash_flow_to_interest?: number;
}

interface FinancialHealthRadarProps {
  financialData: FinancialData;
  industryAverages?: Partial<FinancialData>;
  title?: string;
  description?: string;
}

const FinancialHealthRadar: React.FC<FinancialHealthRadarProps> = ({
  financialData,
  industryAverages,
  title = '재무 건전성 분석',
  description,
}) => {
  // 데이터 정규화 함수 (0-100 스케일로 변환)
  const normalizeData = () => {
    // 각 지표별 최대값 기준 (일반적인 좋은 수치 기준)
    const maxValues = {
      수익성: 0.15, // ROA 15%를 만점으로
      자본효율성: 0.25, // ROE 25%를 만점으로
      안정성: 0.6, // 부채비율 역수 (낮을수록 좋음, 60%를 기준으로)
      효율성: 2.0, // 자산회전율 2.0을 만점으로
      이자부담: 0.1, // 이자비용/자산 역수 (낮을수록 좋음, 10%를 기준으로)
    };

    // 기준 설명 텍스트
    const criteriaDesc = {
      수익성: 'ROA 15% 기준',
      자본효율성: 'ROE 25% 기준',
      안정성: '부채비율 60% 이하 기준',
      효율성: '자산회전율 2.0 기준',
      이자부담: '이자비용/자산 10% 이하 기준',
    };

    // 원본 데이터 저장 (툴팁 표시용)
    const originalValues = {
      수익성: financialData.ROA,
      자본효율성: financialData.ROE,
      안정성: financialData.debt_ratio,
      효율성: financialData.asset_turnover_ratio,
      이자부담: financialData.interest_to_assets_ratio || 0,
    };

    // 데이터 정규화 및 포맷팅
    const normalizedCompany = {
      수익성: Math.min(100, (financialData.ROA / maxValues.수익성) * 100),
      자본효율성: Math.min(100, (financialData.ROE / maxValues.자본효율성) * 100),
      안정성: Math.min(100, (1 - financialData.debt_ratio / maxValues.안정성) * 100),
      효율성: Math.min(100, (financialData.asset_turnover_ratio / maxValues.효율성) * 100),
      이자부담: financialData.interest_to_assets_ratio
        ? Math.min(100, (1 - financialData.interest_to_assets_ratio / maxValues.이자부담) * 100)
        : 50, // 데이터가 없는 경우 중간값 설정
    };

    // 산업 평균이 있는 경우 정규화
    let normalizedIndustry = {};
    let originalIndustryValues = {};
    if (industryAverages) {
      normalizedIndustry = {
        수익성: industryAverages.ROA
          ? Math.min(100, (industryAverages.ROA / maxValues.수익성) * 100)
          : 0,
        자본효율성: industryAverages.ROE
          ? Math.min(100, (industryAverages.ROE / maxValues.자본효율성) * 100)
          : 0,
        안정성: industryAverages.debt_ratio
          ? Math.min(100, (1 - industryAverages.debt_ratio / maxValues.안정성) * 100)
          : 0,
        효율성: industryAverages.asset_turnover_ratio
          ? Math.min(100, (industryAverages.asset_turnover_ratio / maxValues.효율성) * 100)
          : 0,
        이자부담: industryAverages.interest_to_assets_ratio
          ? Math.min(
              100,
              (1 - industryAverages.interest_to_assets_ratio / maxValues.이자부담) * 100
            )
          : 0,
      };

      originalIndustryValues = {
        수익성: industryAverages.ROA || 0,
        자본효율성: industryAverages.ROE || 0,
        안정성: industryAverages.debt_ratio || 0,
        효율성: industryAverages.asset_turnover_ratio || 0,
        이자부담: industryAverages.interest_to_assets_ratio || 0,
      };
    }

    // 레이더 차트 데이터 형식으로 변환
    return Object.keys(normalizedCompany).map(key => ({
      subject: key,
      기업: normalizedCompany[key as keyof typeof normalizedCompany],
      산업평균: industryAverages
        ? normalizedIndustry[key as keyof typeof normalizedIndustry] || 0
        : 0,
      fullMark: 100,
      // 툴팁에 표시할 원본 데이터와 기준 정보
      originalValue: originalValues[key as keyof typeof originalValues],
      originalIndustryValue: industryAverages
        ? originalIndustryValues[key as keyof typeof originalIndustryValues] || 0
        : 0,
      criteria: criteriaDesc[key as keyof typeof criteriaDesc],
    }));
  };

  const data = normalizeData();

  // 색상 설정
  const colors = {
    company: '#3B82F6', // 파란색
    industry: '#10B981', // 녹색
    grid: '#E5E7EB', // 연한 회색
  };

  // 커스텀 툴팁 컴포넌트
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className='bg-white p-3 shadow-md rounded-md border border-gray-100'>
          <p className='font-medium text-gray-700'>{data.subject}</p>
          <p className='text-sm text-gray-600'>
            기업: {data.originalValue.toFixed(2)}
            {data.subject === '수익성' || data.subject === '자본효율성' ? '%' : ''}
          </p>
          {data.originalIndustryValue > 0 && (
            <p className='text-sm text-gray-600'>
              산업평균: {data.originalIndustryValue.toFixed(2)}
              {data.subject === '수익성' || data.subject === '자본효율성' ? '%' : ''}
            </p>
          )}
          <p className='text-xs text-gray-500 mt-1'>* {data.criteria}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className='report-section'>
      <div className='report-section-header'>
        <h3 className='report-section-title'>{title}</h3>
        {description && <p className='report-section-description'>{description}</p>}
      </div>

      <div className='financial-health-radar flex flex-col items-center p-4'>
        <div className='w-full h-80'>
          <ResponsiveContainer width='100%' height='100%'>
            <RadarChart outerRadius='70%' data={data}>
              <PolarGrid stroke={colors.grid} />
              <PolarAngleAxis dataKey='subject' />
              <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} />

              <Radar
                name='기업'
                dataKey='기업'
                stroke={colors.company}
                fill={colors.company}
                fillOpacity={0.3}
              />

              {industryAverages && (
                <Radar
                  name='산업평균'
                  dataKey='산업평균'
                  stroke={colors.industry}
                  fill={colors.industry}
                  fillOpacity={0.3}
                />
              )}

              <Legend />
              <Tooltip content={<CustomTooltip />} />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        <div className='w-full mt-4 text-sm text-gray-500 text-center'>
          <p>
            * 각 지표는 일반적인 기준으로 정규화되어 있으며, 산업별 특성에 따라 다를 수 있습니다.
          </p>
        </div>
      </div>
    </div>
  );
};

export default FinancialHealthRadar;
