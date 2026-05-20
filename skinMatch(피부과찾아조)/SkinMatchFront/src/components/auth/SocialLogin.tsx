import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Typography } from '@/components/ui/theme-typography';
import { authService } from '@/services/authService';
import { toast } from 'sonner';
import { validateRedirectUrl } from '@/utils/oauth';
import { logger } from '@/utils/logger';
import { oauthDebugger } from '@/utils/debugger';

interface SocialLoginProps {
  isSignup?: boolean;
}

const SocialLogin = ({ isSignup = false }: SocialLoginProps) => {
  const [loading, setLoading] = useState<string | null>(null);

  const handleSocialLogin = async (provider: string) => {
    const providerKey = provider.toLowerCase();
    setLoading(providerKey);
    
    try {
      // 디버깅 정보 출력
      oauthDebugger.logRequest(provider, 'GET', `/oauth/url/${providerKey}`);
      
      logger.oauth('LOGIN_START', provider, { isSignup });
      
      // OAuth URL 가져오기
      const response = await authService.getOAuthUrl(providerKey);
      
      // 응답 디버깅
      oauthDebugger.logResponse(provider, response);
      
      if (response.success && (response.data.url || response.data.loginUrl)) {
        const redirectUrl = response.data.url || response.data.loginUrl;
        
        // URL 안전성 검증
        if (!validateRedirectUrl(redirectUrl)) {
          logger.error('Unsafe redirect URL', { url: redirectUrl, provider });
          toast.error('안전하지 않은 리다이렉트 URL입니다.');
          return;
        }
        
        // 서버(Sprint Security)가 state를 관리하므로 그대로 리다이렉트
        logger.oauth('REDIRECT', provider, { url: redirectUrl });
        window.location.href = redirectUrl;
      } else {
        logger.oauth('URL_FAILED', provider, response);
        toast.error(`${provider} 로그인 URL을 가져올 수 없습니다.`);
      }
    } catch (error: any) {
      // 에러 디버깅
      oauthDebugger.logResponse(provider, error, true);
      
      logger.oauth('LOGIN_ERROR', provider, {
        error: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      
      // 사용자에게 더 자세한 에러 정보 제공
      let errorMessage = `${provider} 로그인에 실패했습니다.`;
      
      if (error.response?.status === 500) {
        errorMessage = `${provider} 서버에서 내부 오류가 발생했습니다. 백엔드 서버를 확인해주세요.`;
      } else if (error.response?.status === 404) {
        errorMessage = `${provider} OAuth 엔드포인트를 찾을 수 없습니다.`;
      } else if (error.code === 'ERR_NETWORK') {
        errorMessage = '백엔드 서버에 연결할 수 없습니다. 서버가 실행 중인지 확인해주세요.';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      }
      
      toast.error(errorMessage);
    } finally {
      setLoading(null);
    }
  };

  const socialProviders = [
    {
      name: 'Google',
      key: 'google',
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
      ),
      bgColor: 'bg-white hover:bg-gray-50 border-gray-200',
      textColor: 'text-gray-700',
      available: true
    },
    {
      name: 'Naver',
      key: 'naver',
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M16.273 12.845 7.376 0H0v24h7.726V11.156L16.624 24H24V0h-7.727v12.845Z"/>
        </svg>
      ),
      bgColor: 'bg-[#03C75A] hover:bg-[#02B350]',
      textColor: 'text-white',
      available: true
    }
  ];

  return (
    <div className="mt-6 space-y-3">
      {socialProviders.map((provider) => (
  <Button
    key={provider.key}
    variant="outline"
    size="lg"
    className={`
      w-full
      ${provider.bgColor} ${provider.textColor} border border-black
      hover:border-2 hover:border-black
      transition-none
      ${!provider.available ? 'opacity-50 cursor-not-allowed' : ''}
    `}
    onClick={() => handleSocialLogin(provider.name)}
    disabled={loading === provider.key || !provider.available}
  >
    <div className="flex items-center justify-center gap-3">
      {loading === provider.key ? (
        <div className="w-5 h-5 animate-spin rounded-full border-2 border-current border-t-transparent" />
      ) : (
        provider.icon
      )}
      <Typography variant="body" className="font-medium">
        {loading === provider.key
          ? '연결 중...'
          : `${provider.name}로 ${isSignup ? '회원가입' : '로그인'}`
        }
        {!provider.available && ' (준비중)'}
      </Typography>
    </div>
  </Button>
))}
    </div>
  );
};

export default SocialLogin;