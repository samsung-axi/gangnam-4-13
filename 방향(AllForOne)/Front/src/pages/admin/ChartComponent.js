import React, { useEffect } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

// Chart.js 설정
ChartJS.register(ArcElement, Tooltip, Legend);

const ChartComponent = ({ title, labels, data }) => {
  useEffect(() => {
    console.log('labels:', labels);  // labels 확인
    console.log('data:', data);  // data 확인
  }, [labels, data]);

  const chartData = {
    labels: labels,
    datasets: [
      {
        data: data,
        backgroundColor: ['#FF5757', '#FFE043', '#56D2FF', '#62D66A', '#86390F'],
        hoverBackgroundColor: ['#FF9F40', '#36A2EB', '#FFCD56', '#FF6384', '#4BC0C0'],
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
        display: true,
        position: 'left', // 범례를 차트 오른쪽에 세로 정렬
        labels: {
          boxWidth: 15, // 색상 네모 크기 조절
          padding: 10,  // 항목 간 간격 조절
          font: {
            size: 14 // 글씨 크기 조정
          }
        }
      }
    }
  };

  return (
    <div className="chart-container">
      <h3>{title}</h3>
      <Doughnut data={chartData} options={options} />
    </div>
  );
};

export default ChartComponent;
