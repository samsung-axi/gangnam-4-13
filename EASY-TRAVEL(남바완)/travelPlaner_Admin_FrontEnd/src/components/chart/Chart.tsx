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
import { chartDataState } from '../../recoil/atoms';

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
  },
};

interface AgentChartProps {
  agentName: string;
}

export function AgentChart({ agentName }: AgentChartProps) {
  const chartData = useRecoilValue(chartDataState);

  const agentData = chartData.filter(item => item.agent_name === agentName);

  const labels = agentData.map(item => item.metric_date).reverse();
  const datasets = [
    {
      label: '2분 이하',
      data: agentData.map(item => item.under_2).reverse(),
      borderColor: 'rgb(255, 99, 132)',
      backgroundColor: 'rgba(255, 99, 132, 0.5)',
    },
    {
      label: '3분 이하',
      data: agentData.map(item => item.under_3).reverse(),
      borderColor: 'rgb(53, 162, 235)',
      backgroundColor: 'rgba(53, 162, 235, 0.5)',
    },
    {
      label: '4분 이하',
      data: agentData.map(item => item.under_4).reverse(),
      borderColor: 'rgb(75, 192, 192)',
      backgroundColor: 'rgba(75, 192, 192, 0.5)',
    },
    {
      label: '5분 이하',
      data: agentData.map(item => item.under_5).reverse(),
      borderColor: 'rgb(255, 159, 64)',
      backgroundColor: 'rgba(255, 159, 64, 0.5)',
    },
    {
      label: '5분 이상',
      data: agentData.map(item => item.over_5).reverse(),
      borderColor: 'rgb(153, 102, 255)',
      backgroundColor: 'rgba(153, 102, 255, 0.5)',
    },
  ];

  const data = {
    labels,
    datasets,
  };

  return <Line options={options} data={data} />;
}
