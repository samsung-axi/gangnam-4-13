import { useEffect } from 'react';
import { useSetRecoilState } from 'recoil';
import { chartDataState } from '../recoil/atoms';
import { fetchChartData } from '../api/chartApi';

export const useChartData = (): void => {
  const setChartData = useSetRecoilState(chartDataState);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchChartData();
        setChartData(data.data);
      } catch (error) {
        console.error('Failed to fetch chart data:', error);
      }
    };
    loadData();
  }, [setChartData]);
};

