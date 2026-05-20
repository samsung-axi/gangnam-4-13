import { useEffect } from 'react';
import { useSetRecoilState } from 'recoil';
import { memberChartDataState } from '../recoil/memberAtoms';
import { fetchMemberChartData } from '../api/memberChartApi';

export const useMemberChartData = (): void => {
  const setMemberChartData = useSetRecoilState(memberChartDataState);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchMemberChartData();
        setMemberChartData(data.data);
      } catch (error) {
        console.error('Failed to fetch chart data:', error);
      }
    };
    loadData();
  }, [setMemberChartData]);
};

