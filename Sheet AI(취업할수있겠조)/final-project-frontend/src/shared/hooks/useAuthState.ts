import { useAtom } from 'jotai';
import { isLoggedInAtom, loginAction, logoutAction, tokenAtom } from '@/shared/store/authAtom';
import { devLog } from '@/shared/util/logger';

/**
 * 인증 상태 관리 훅
 * jotai와 localStorage를 연동하여 로그인 상태를 관리합니다.
 */
export const useAuthState = () => {
  const [token] = useAtom(tokenAtom);
  const [isLoggedIn] = useAtom(isLoggedInAtom);
  const [, login] = useAtom(loginAction);
  const [, logout] = useAtom(logoutAction);

  /**
   * 로그인 처리 함수
   * @param newToken JWT 토큰
   */
  const handleLogin = (newToken: string) => {
    if (!newToken || newToken === 'null' || newToken === 'undefined') {
      devLog('유효하지 않은 토큰으로 로그인 시도:', newToken);
      return;
    }
    
    devLog('로그인 처리: 토큰 저장');
    // jotai atom에 토큰 저장 (localStorage는 atomWithStorage에 의해 자동 처리됨)
    login(newToken);
  };

  /**
   * 로그아웃 처리 함수
   */
  const handleLogout = () => {
    devLog('로그아웃 처리: 토큰 삭제');
    
    // localStorage에서 직접 삭제 (안전장치)
    localStorage.removeItem('token');
    
    // jotai atom에서 토큰 삭제
    logout();
  };

  return {
    token,
    isLoggedIn,
    login: handleLogin,
    logout: handleLogout
  };
};
