import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';
import { 
  Chart as ChartJS, 
  ArcElement, 
  Tooltip, 
  Legend,
  CategoryScale,
  LinearScale 
} from 'chart.js';

// Chart.js 요소들 등록
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale
);

interface GenreStatsProps {
  gamesByGenre: Record<string, number>;
}

export const GenreBarChart: React.FC<GenreStatsProps> = ({ gamesByGenre }) => {

  const allGenres = ['Survival', 'Mystery', 'Romance', 'Simulation'];
  
  const data = allGenres.map(genre => ({
    genre,
    count: gamesByGenre[genre] || 0
  })).sort((a, b) => b.count - a.count);

  const total = data.reduce((sum, item) => sum + item.count, 0);

  return (
    <div className="bg-white rounded-lg shadow-md p-6 flex flex-col h-[300px]">
      <div className="mb-1">
        <h2 className="text-lg font-title font-semibold text-gray-700">장르별 게임 실행 횟수</h2>
      </div>
      
      <div className="flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 15, right: 30, left: -30, bottom: -10 }}
          >
            <CartesianGrid strokeDasharray="6 6" />
            <XAxis 
              dataKey="genre"
              tick={{ fontSize: 12 }}
              interval={0}
              textAnchor="middle"
            />
            <YAxis 
              tickFormatter={(value) => value.toLocaleString()}
              tick={{ fontSize: 12 }}
            />
            <RechartsTooltip 
              formatter={(value) => [value.toLocaleString() + '회', '실행 횟수']}
              contentStyle={{ fontSize: '12px' }}
            />
            <Bar 
              dataKey="count" 
              fill="#3B48CC"
              radius={[4, 4, 0, 0]}
              barSize={20}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-1 border-gray-200">
        <div className="flex justify-between items-center">
          <span className="text-sm font-contents font-semibold text-gray-600">총계</span>
          <span className="text-sm font-contents font-semibold text-blue-600">
            {total.toLocaleString()}회
          </span>
        </div>
      </div>
    </div>
  );
};

export const GenrePieChart: React.FC<GenreStatsProps> = ({ gamesByGenre }) => {
  // 모든 장르 정의
  const allGenres = ['Survival', 'Mystery', 'Romance', 'Simulation'];
  
  // 각 장르에 대한 색상 매핑
  const genreColors = {
    Survival: {
      background: 'rgba(255, 99, 132, 0.5)',
      border: 'rgba(255, 99, 132, 1)'
    },
    Mystery: {
      background: 'rgba(54, 162, 235, 0.5)', 
      border: 'rgba(54, 162, 235, 1)'
    },
    Romance: {
      background: 'rgba(255, 206, 86, 0.5)',
      border: 'rgba(255, 206, 86, 1)'
    },
    Simulation: {
      background: 'rgba(75, 192, 192, 0.5)',
      border: 'rgba(75, 192, 192, 1)'
    }
  };
 
  const data = {
    labels: allGenres,
    datasets: [
      {
        data: allGenres.map(genre => gamesByGenre[genre] || 0),
        backgroundColor: allGenres.map(genre => genreColors[genre].background),
        borderColor: allGenres.map(genre => genreColors[genre].border),
        borderWidth: 1,
      },
    ],
  };
 
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right' as const,
        align: 'center' as const,
        labels: {
          padding: 20,
          boxWidth: 15,
          boxHeight: 15
        },
      },
      tooltip: {
        titleFont: {
          size: 14,
          weight: 700
        },
        bodyFont: {
          size: 12
        },
        padding: 12,
        callbacks: {
          label: function(context: any) {
            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
            const value = context.raw;
            const percentage = ((value / total) * 100).toFixed(1);
            return `${context.label}: ${value.toLocaleString()}회 (${percentage}%)`;
          }
        }
      }
    },
    layout: {
      padding: {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0
      }
    },
    cutout: '50%',
    rotation: 90,
    animation: {
      animateScale: true,
      animateRotate: true
    }
  };
 
  return (
    <div className="bg-white rounded-lg shadow-md p-6 flex flex-col h-[300px]">
      <div className="mb-4">
        <h2 className="text-lg font-title font-title font-semibold text-gray-700">장르별 게임 실행 비율</h2>
      </div>
      
      <div className="flex-1">
        <div className="flex items-center justify-center h-full">
          <div className="w-full h-full max-w-[200px] max-h-[200px]">
            <Doughnut data={data} options={options} />
          </div>
        </div>
      </div>
    </div>
  );
};