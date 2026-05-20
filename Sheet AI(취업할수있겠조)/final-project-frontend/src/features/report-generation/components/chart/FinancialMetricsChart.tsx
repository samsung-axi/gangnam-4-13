import React from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

interface FinancialMetric {
  name: string;
  value: number;
  target?: number;
  industry_avg?: number;
}

interface FinancialMetricsChartProps {
  metrics: FinancialMetric[];
  title: string;
  description?: string;
}

const FinancialMetricsChart: React.FC<FinancialMetricsChartProps> = ({
  metrics,
  title,
  description,
}) => {
  // 차트 데이터 포맷팅
  const formattedMetrics = metrics.map(metric => ({
    ...metric,
    // 값이 너무 작으면 시각적으로 보기 어려울 수 있으므로 최소값 설정
    value: Math.max(metric.value, 0.5),
    industry_avg:
      metric.industry_avg !== undefined ? Math.max(metric.industry_avg, 0.5) : undefined,
    target: metric.target !== undefined ? Math.max(metric.target, 0.5) : undefined,
  }));

  // 차트 색상 설정 (2025년 트렌드에 맞는 모던한 색상)
  const colors = {
    value: '#3B82F6', // 파란색
    industry_avg: '#10B981', // 녹색
    target: '#F59E0B', // 주황색
    grid: '#E5E7EB', // 연한 회색
    text: '#4B5563', // 중간 회색
  };

  return (
    <div className='report-section'>
      <div className='report-section-header'>
        <h3 className='report-section-title'>{title}</h3>
        {description && <p className='report-section-description'>{description}</p>}
      </div>

      <div className='h-80 w-full'>
        <ResponsiveContainer width='100%' height='100%'>
          <BarChart
            data={formattedMetrics}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 5,
            }}
            barGap={2}
            barSize={20}
          >
            <CartesianGrid strokeDasharray='3 3' stroke={colors.grid} />
            <XAxis dataKey='name' tick={{ fill: colors.text }} axisLine={{ stroke: colors.grid }} />
            <YAxis
              tick={{ fill: colors.text }}
              axisLine={{ stroke: colors.grid }}
              tickFormatter={value => `${value}%`}
            />
            <Tooltip
              formatter={value => [`${value}%`, '']}
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                borderRadius: '8px',
                border: 'none',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
              }}
            />
            <Legend
              wrapperStyle={{ paddingTop: '10px' }}
              formatter={value => <span style={{ color: colors.text }}>{value}</span>}
            />
            <ReferenceLine y={0} stroke={colors.grid} />
            <Bar
              dataKey='value'
              name='기업 수치'
              fill={colors.value}
              radius={[4, 4, 0, 0]}
              animationDuration={1500}
            />
            {formattedMetrics.some(metric => metric.industry_avg !== undefined) && (
              <Bar
                dataKey='industry_avg'
                name='산업 평균'
                fill={colors.industry_avg}
                radius={[4, 4, 0, 0]}
                animationDuration={1500}
                animationBegin={300}
              />
            )}
            {formattedMetrics.some(metric => metric.target !== undefined) && (
              <Bar
                dataKey='target'
                name='목표 수치'
                fill={colors.target}
                radius={[4, 4, 0, 0]}
                animationDuration={1500}
                animationBegin={600}
              />
            )}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default FinancialMetricsChart;
