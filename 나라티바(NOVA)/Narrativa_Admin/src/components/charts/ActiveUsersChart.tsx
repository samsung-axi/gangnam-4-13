import React, { useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';
import { ActiveUserStats, DailyStats } from '../../types/stats';

interface ActiveUsersChartProps {
  data: ActiveUserStats;
}

type MetricType = 'dau' | 'mau';

const ActiveUsersChart: React.FC<ActiveUsersChartProps> = ({ data }) => {
  const [selectedMetric, setSelectedMetric] = useState<MetricType>('dau');

  const formatXAxis = (date: string) => {
    const d = new Date(date);
    if (selectedMetric === 'dau') {
      return `${d.getDate()}일`;
    } else {
      return `${d.getMonth() + 1}월`;
    }
  };

  const formatTooltipLabel = (label: string) => {
    const d = new Date(label);
    if (selectedMetric === 'dau') {
      return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일`;
    } else {
      return `${d.getFullYear()}년 ${d.getMonth() + 1}월`;
    }
  };

  // 현재 날짜 표시 형식 계산
  const currentDateDisplay = useMemo(() => {
    const stats = selectedMetric === 'dau' ? data.dauStats : data.mauStats;
    const lastDate = stats[stats.length - 1]?.date;
    
    if (!lastDate) return selectedMetric === 'dau' ? '00월' : '0000년';
    
    const d = new Date(lastDate);
    if (selectedMetric === 'dau') {
      return `${d.getMonth() + 1}월`;
    } else {
      return `${d.getFullYear()}년`;
    }
  }, [data, selectedMetric]);

  return (
    <div className="bg-white rounded-lg shadow-md p-6 h-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-title font-semibold text-gray-700">활성 사용자</h2>
        <div className="flex space-x-2">
          <button
            onClick={() => setSelectedMetric('dau')}
            className={`px-3 py-1 font-contents text-sm rounded-md transition-all ${
              selectedMetric === 'dau'
                ? 'bg-pointer2 text-white'
                : 'text-gray-600 font-contents hover:bg-gray-200'
            }`}
          >
            일간
          </button>
          <button
            onClick={() => setSelectedMetric('mau')}
            className={`px-3 py-1 font-contents text-sm rounded-md transition-all ${
              selectedMetric === 'mau'
                ? 'bg-pointer2 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            월간
          </button>
        </div>
      </div>

      <div className="mb-4">
        <p className="text-3xl font-contents font-bold text-pointer">{currentDateDisplay}</p>
      </div>

      <div className="h-2/3 w-full flex justify-center items-center">
        <ResponsiveContainer width="100%" height="80%">
          <LineChart 
            data={selectedMetric === 'dau' ? data.dauStats : data.mauStats}
            margin={{ top: 10, right: 5, left: -30 }}
          >
            <CartesianGrid strokeDasharray="6 6" />
            <XAxis 
              dataKey="date" 
              tickFormatter={formatXAxis}
              tick={{ fontSize: 12 }}
            />
            <YAxis 
              tickFormatter={(value) => `${value.toLocaleString()}`}
              tick={{ fontSize: 12 }}
            />
            <Tooltip 
              formatter={(value: number) => [`${value.toLocaleString()}명`, '사용자 수']}
              labelFormatter={formatTooltipLabel}
            />
            <Line 
              type="monotone"
              dataKey="count"
              stroke="#3B48CC"
              strokeWidth={2}
              dot={{ fill: '#9DA3E5' }}
              name="사용자 수"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ActiveUsersChart;