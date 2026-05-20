import { ReactNode, useEffect } from 'react';
import { useAtom } from 'jotai';
import { tokenAtom } from '@/shared/store/authAtom';
import { devLog } from '@/shared/util/logger';
import { isTokenExpired, getTokenRemainingTime } from '@/shared/util/tokenUtils';

interface AuthInitializerProps {
  children: ReactNode;
}

/**
 * 인증 상태 초기화 컴포넌트
 * 앱이 시작될 때 localStorage에서 토큰을 확인하고 jotai 상태를 초기화합니다.
 * 토큰 만료 여부를 확인하고 만료된 경우 자동으로 로그아웃합니다.
 */
const AuthInitializer = ({ children }: AuthInitializerProps) => {
  const [token, setToken] = useAtom(tokenAtom);

  // 앱 시작 시 localStorage에서 토큰 확인 및 만료 여부 체크
  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    
    // localStorage에 토큰이 있지만 jotai 상태에는 없는 경우 동기화
    if (savedToken && !token) {
      devLog('토큰 상태 동기화: localStorage → jotai');
      setToken(savedToken);
    }
    
    // localStorage에 토큰이 없지만 jotai 상태에는 있는 경우 동기화
    if (!savedToken && token) {
      devLog('토큰 상태 동기화: jotai → localStorage');
      localStorage.setItem('token', token);
    }
  }, [token, setToken]);

  // 토큰 만료 시간 모니터링 (앱 시작 시 한 번만 실행)
  useEffect(() => {
    // 토큰이 없으면 아무 작업도 하지 않음
    if (!token) return;

    // 토큰 만료 시간 확인 (디버깅용)
    const remainingTime = getTokenRemainingTime(token);
    if (remainingTime !== null) {
      devLog(`토큰 만료까지 남은 시간: ${remainingTime}초`);
      
      // 토큰이 이미 만료된 경우에만 로그아웃 처리
      if (remainingTime <= 0) {
        devLog('토큰이 이미 만료됨: 자동 로그아웃 처리');
        localStorage.removeItem('token');
        setToken(null);
      }
    }
  }, []); // 의존성 배열을 비워 앱 시작 시 한 번만 실행

  return <>{children}</>;
};

export default AuthInitializer;
