/**
 * JWT 토큰 관련 유틸리티 함수
 */
import { devLog } from '@/shared/util/logger';

/**
 * JWT 토큰을 디코딩하여 페이로드를 반환합니다.
 * @param token JWT 토큰
 * @returns 디코딩된 토큰 페이로드 또는 null (토큰이 유효하지 않은 경우)
 */
export const decodeJwtToken = (token: string): any => {
  try {
    // JWT 토큰은 header.payload.signature 형식으로 구성됨
    const parts = token.split('.');
    if (parts.length !== 3) {
      devLog('유효하지 않은 JWT 형식:', token.substring(0, 10) + '...');
      return null;
    }
    
    const base64Url = parts[1];
    
    // base64Url을 base64로 변환
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    
    try {
      // base64 디코딩 후 JSON 파싱
      const jsonPayload = decodeURIComponent(
        window.atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      
      const payload = JSON.parse(jsonPayload);
      devLog('토큰 디코딩 성공:', { exp: payload.exp, iat: payload.iat });
      return payload;
    } catch (e) {
      devLog('base64 디코딩 또는 JSON 파싱 오류');
      return null;
    }
  } catch (error) {
    console.error('토큰 디코딩 오류:', error);
    return null;
  }
};

/**
 * JWT 토큰의 만료 여부를 확인합니다.
 * @param token JWT 토큰
 * @returns 만료 여부 (true: 만료됨, false: 유효함)
 */
export const isTokenExpired = (token: string | null): boolean => {
  if (!token) {
    devLog('토큰이 없음: 만료됨으로 처리');
    return true;
  }
  
  try {
    const decoded = decodeJwtToken(token);
    if (!decoded) {
      devLog('토큰 디코딩 실패: 만료됨으로 처리');
      return true;
    }
    
    if (!decoded.exp) {
      devLog('토큰에 만료 시간(exp)이 없음: 만료됨으로 처리');
      return true;
    }
    
    // exp는 초 단위, Date.now()는 밀리초 단위
    const currentTime = Date.now() / 1000;
    const isExpired = decoded.exp < currentTime;
    
    devLog(`토큰 만료 확인: 현재=${currentTime}, 만료=${decoded.exp}, 만료됨=${isExpired}`);
    return isExpired;
  } catch (error) {
    console.error('토큰 만료 확인 오류:', error);
    return true;
  }
};

/**
 * 토큰 만료 시간까지 남은 시간(초)을 계산합니다.
 * @param token JWT 토큰
 * @returns 만료까지 남은 시간(초) 또는 null (토큰이 유효하지 않은 경우)
 */
export const getTokenRemainingTime = (token: string | null): number | null => {
  if (!token) return null;
  
  try {
    const decoded = decodeJwtToken(token);
    if (!decoded || !decoded.exp) return null;
    
    const currentTime = Date.now() / 1000;
    const remainingTime = decoded.exp - currentTime;
    
    return remainingTime > 0 ? Math.floor(remainingTime) : 0;
  } catch (error) {
    console.error('토큰 남은 시간 계산 오류:', error);
    return null;
  }
};
