import { atom } from 'jotai';

export const inputImageAtom = atom(null);
export const isLoadingAtom = atom(false);
export const evaluationResultAtom = atom(null);
export const errorStateAtom = atom({
  isError: false,
  message: '',
  statusCode: null
});

// 현재 활성화된 기능을 추적하는 atom (배경 제거 또는 이미지 분석)
export const activeFeatureAtom = atom('analysis'); // 기본값은 이미지 분석
