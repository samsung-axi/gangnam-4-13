// src/utils/oauth.ts
// OAuth 관련 유틸리티 함수들

/**
 * OAuth State 파라미터 생성 (CSRF 공격 방지)
 */
export const generateOAuthState = (): string => {
  const randomString = Math.random().toString(36).substring(2, 15) + 
                      Math.random().toString(36).substring(2, 15);
  const timestamp = Date.now().toString();
  const state = btoa(`${randomString}_${timestamp}`);
  
  // 세션 스토리지에 저장 (페이지 리로드 시 유지)
  sessionStorage.setItem('oauth_state', state);
  
  return state;
};

/**
 * OAuth State 파라미터 검증
 */
export const validateOAuthState = (receivedState: string): boolean => {
  const storedState = sessionStorage.getItem('oauth_state');
  
  if (!storedState || storedState !== receivedState) {
    console.error('OAuth State validation failed:', {
      stored: storedState,
      received: receivedState
    });
    return false;
  }
  
  // 검증 후 삭제
  sessionStorage.removeItem('oauth_state');
  return true;
};

/**
 * OAuth 에러 메시지 매핑
 */
export const getOAuthErrorMessage = (error: string, provider: string): string => {
  const errorMessages: { [key: string]: string } = {
    'access_denied': '사용자가 인증을 거부했습니다.',
    'invalid_request': '잘못된 요청입니다.',
    'unauthorized_client': '인증되지 않은 클라이언트입니다.',
    'unsupported_response_type': '지원하지 않는 응답 타입입니다.',
    'invalid_scope': '잘못된 권한 범위입니다.',
    'server_error': `${provider} 서버에서 오류가 발생했습니다.`,
    'temporarily_unavailable': `${provider} 서비스가 일시적으로 사용할 수 없습니다.`,
  };
  
  return errorMessages[error] || `${provider} 로그인 중 알 수 없는 오류가 발생했습니다.`;
};

/**
 * 브라우저 지원 여부 확인
 */
export const checkBrowserSupport = (): boolean => {
  // 필수 브라우저 기능 확인
  const requiredFeatures = [
    'localStorage' in window,
    'sessionStorage' in window,
    'URLSearchParams' in window,
    'fetch' in window,
  ];
  
  return requiredFeatures.every(feature => feature);
};

/**
 * OAuth 리다이렉트 URL 검증
 */
export const validateRedirectUrl = (url: string): boolean => {
  try {
    const parsedUrl = new URL(url);
    const allowedDomains = [
      'localhost',
      'accounts.google.com',
      'nid.naver.com'
    ];
    
    return allowedDomains.some(domain => 
      parsedUrl.hostname === domain || 
      parsedUrl.hostname.endsWith(`.${domain}`)
    );
  } catch {
    return false;
  }
};