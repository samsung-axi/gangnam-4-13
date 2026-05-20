import { atom } from 'recoil';

export interface ChartDataItem {
  agent_name: string;
  metric_date: string;
  under_2: number;
  under_3: number;
  under_4: number;
  under_5: number;
  over_5: number;
}

export const chartDataState = atom<ChartDataItem[]>({
  key: 'chartDataState',
  default: [],
});
