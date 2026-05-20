import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { BasicStats } from '../../types/stats';

interface TrafficChartProps {
  view: 'daily' | 'weekly';
  stats: BasicStats | null;
  onViewChange: (view: 'daily' | 'weekly') => void;
}

export const TrafficChart: React.FC<TrafficChartProps> = ({ view, stats, onViewChange }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-title font-semibold text-gray-700">트래픽 통계</h2>
        <div className="flex space-x-2">
          <button
            onClick={() => onViewChange('daily')}
            className={`px-3 py-1 font-nanum text-sm rounded-md transition-all ${
              view === 'daily'
                ? 'bg-pointer2 text-white'
                : 'text-gray-600 font-contents hover:bg-gray-200'
            }`}
          >
            일간
          </button>
          <button
            onClick={() => onViewChange('weekly')}
            className={`px-3 py-1 font-contents text-sm rounded-md transition-all ${
              view === 'weekly'
                ? 'bg-pointer2 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            주간
          </button>
        </div>
      </div>
      
      {view === 'daily' ? (
        <DailyTrafficView stats={stats} />
      ) : (
        <WeeklyTrafficView stats={stats} />
      )}
    </div>
  );
};

const DailyTrafficView: React.FC<{ stats: BasicStats | null }> = ({ stats }) => (
  <>
    <div className="mb-4">
      <p className="text-3xl font-contents font-bold text-pointer">{stats?.totalDailyTraffic || 0}</p>
    </div>
    <div className="h-2/3 w-full flex justify-center items-center">
      <ResponsiveContainer width="100%" height="80%">
        <LineChart
          data={stats?.hourlyTraffic || []}
          margin={{ top: 10, right: 5, left: -30 }}
        >
          <CartesianGrid strokeDasharray="6 6" />
          <XAxis 
            dataKey="hour"
            tickFormatter={(hour) => `${hour}시`}
            tick={{ fontSize: 12 }}
          />
          <YAxis
            tick={{ fontSize: 12 }}
          />
          <Tooltip 
            formatter={(value) => [`${value}회`, '트래픽']}
            labelFormatter={(hour) => `${hour}시`}
            contentStyle={{ fontSize: 12 }}
          />
          <Line
            type="monotone"
            dataKey="count"
            stroke="#3B48CC"
            strokeWidth={2}
            dot={{ fill: '#9DA3E5' }}
            name="트래픽"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  </>
);

const WeeklyTrafficView: React.FC<{ stats: BasicStats | null }> = ({ stats }) => (
  <>
    <div className="mb-4">
      <p className="text-3xl font-nanum font-bold text-pointer">{stats?.totalWeeklyTraffic || 0}</p>
    </div>
    <div className="h-2/3 w-full flex justify-center items-center">
      <ResponsiveContainer width="100%" height="80%">
        <LineChart
          data={Object.entries(stats?.weeklyTraffic || {})
            .map(([date, count]) => ({
              date: new Date(date).toLocaleDateString('ko-KR', {
                month: 'short',
                day: 'numeric',
              }),
              count: count,
            }))
            .reverse()
          }
          margin={{ top: 10, right: 5, left: -30 }}
        >
          <CartesianGrid strokeDasharray="6 6" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip formatter={(value) => [`${value}회`, '트래픽']} />
          <Line
            type="monotone"
            dataKey="count"
            stroke="#3B48CC"
            strokeWidth={2}
            dot={{ fill: '#9DA3E5' }}
            name="트래픽"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  </>
);
