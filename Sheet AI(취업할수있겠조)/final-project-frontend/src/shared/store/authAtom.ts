import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import { devLog } from '@/shared/util/logger';

// localStorage에서 토큰 가져오기 (문자열 "null"이나 "undefined"를 실제 null로 변환)
const getInitialToken = (): string | null => {
  const storedToken = localStorage.getItem('token');
  
  // 토큰이 없거나 "null", "undefined" 문자열인 경우 null 반환
  if (!storedToken || storedToken === 'null' || storedToken === 'undefined') {
    if (storedToken) {
      devLog('유효하지 않은 토큰 감지:', storedToken);
      localStorage.removeItem('token'); // 잘못된 값 삭제
    }
    return null;
  }
  
  return storedToken;
};

// localStorage와 연동되는 토큰 atom
export const tokenAtom = atomWithStorage<string | null>('token', getInitialToken());

// 로그인 상태 atom (토큰 존재 여부에 따라 결정)
export const isLoggedInAtom = atom(
  (get) => {
    const token = get(tokenAtom);
    return !!token && token !== 'null' && token !== 'undefined';
  }
);

// 로그인 함수
export const loginAction = atom(
  null,
  (_, set, token: string) => {
    if (!token || token === 'null' || token === 'undefined') {
      devLog('유효하지 않은 토큰으로 로그인 시도:', token);
      return;
    }
    set(tokenAtom, token);
    devLog('로그인 처리: 토큰 저장');
  }
);

// 로그아웃 함수
export const logoutAction = atom(
  null,
  (_, set) => {
    set(tokenAtom, null);
    devLog('로그아웃 처리: 토큰 삭제');
  }
);
