import { atom } from 'recoil';

export interface MemberChartData {
  signup_date: string;
  member_count: number;
}

export const memberChartDataState = atom<MemberChartData[]>({
  key: 'memberChartDataState',
  default: [],
});
