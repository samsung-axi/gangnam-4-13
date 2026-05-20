import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { useRecoilValue } from 'recoil';
import { memberChartDataState } from '../../recoil/memberAtoms';
import { useMemberChartData } from '../../hooks/useMemberChartData';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top' as const,
    },
    title: {
      display: true,
      text: '가입 멤버 차트',
    },
  },
  scales: {
    x: {
      title: {
        display: true,
        text: '가입일',
      },
    },
    y: {
      title: {
        display: true,
        text: '가입 멤버 수',
      },
      beginAtZero: true,
    },
  },
};

export function MemberChart() {
  useMemberChartData();
  const memberChartData = useRecoilValue(memberChartDataState);

  const labels = memberChartData.map(item => item.signup_date);
  const datasets = [
    {
      label: '가입 멤버 수',
      data: memberChartData.map(item => item.member_count),
      borderColor: 'rgb(75, 192, 192)',
      backgroundColor: 'rgba(75, 192, 192, 0.5)',
    },
  ];

  const data = {
    labels,
    datasets,
  };

  return <Line options={options} data={data} />;
}
