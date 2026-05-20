import { atomWithStorage } from 'jotai/utils';

// 재무 데이터 인터페이스
export interface FinancialData {
  ROA: number;
  ROE: number;
  debt_ratio: number;
  asset_turnover_ratio: number;
  interest_to_assets_ratio?: number;
  cash_flow_to_interest?: number;
}

// 세션 스토리지를 사용하는 커스텀 스토리지 객체
const sessionStorage = {
  getItem: (key: string) => {
    if (typeof window === 'undefined') {
      return null;
    }
    const value = window.sessionStorage.getItem(key);
    return value === null ? null : JSON.parse(value);
  },
  setItem: (key: string, value: unknown) => {
    if (typeof window !== 'undefined') {
      window.sessionStorage.setItem(key, JSON.stringify(value));
    }
  },
  removeItem: (key: string) => {
    if (typeof window !== 'undefined') {
      window.sessionStorage.removeItem(key);
    }
  },
};

// 신용등급 atom
export const creditRatingAtom = atomWithStorage<string | null>(
  'creditRating',
  null,
  sessionStorage
);
creditRatingAtom.debugLabel = 'creditRatingAtom';

// 재무 데이터 atom
export const financialDataAtom = atomWithStorage<FinancialData | null>(
  'financialData',
  null,
  sessionStorage
);
financialDataAtom.debugLabel = 'financialDataAtom';

// 산업 평균 데이터 atom
export const industryAveragesAtom = atomWithStorage<Partial<FinancialData> | null>(
  'industryAverages',
  null,
  sessionStorage
);
industryAveragesAtom.debugLabel = 'industryAveragesAtom';

// 회사 정보 atom
export const companyInfoAtom = atomWithStorage<{
  company_name: string;
  industry_name: string;
  market_type: string;
} | null>('companyInfo', null, sessionStorage);
companyInfoAtom.debugLabel = 'companyInfoAtom';
