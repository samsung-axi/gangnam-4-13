import type { TokenUser } from '../types/user';

// 유저 토큰 정보를 가져오는 함수
export const checkAuth = async (): Promise<TokenUser | null> => {
  try {
    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/api/v1/users/auth/check`,
      {
        method: 'GET',
        credentials: 'include', // 쿠키 포함 필수
      }
    );

    if (res.ok) {
      const data = await res.json();
      console.log('현재 접속중:', data);
      return data.user || null;
    } else {
      const errorData = await res.json();
      console.warn('인증 실패:', errorData.detail || '알 수 없는 오류');
      console.log('로그인 필요');
      return null;
    }
  } catch (error) {
    console.error(`인증 확인 실패:${error}`);
    return null;
  }
};
