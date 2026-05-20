// src/utils/debugger.ts
// OAuth 디버깅 전용 유틸리티

export const oauthDebugger = {
  /**
   * OAuth 요청 정보를 콘솔에 정리해서 출력
   */
  logRequest(provider: string, method: string, url: string, data?: any) {
    console.group(`🔐 OAuth ${method} - ${provider}`);
    console.log('📡 Request URL:', url);
    console.log('🎯 Provider:', provider);
    console.log('⏰ Timestamp:', new Date().toISOString());
    
    if (data) {
      console.log('📦 Request Data:', data);
    }
    
    console.log('🌐 Environment:', {
      NODE_ENV: import.meta.env.MODE,
      API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
      REDIRECT_URI: import.meta.env.VITE_OAUTH_REDIRECT_URI
    });
    
    console.groupEnd();
  },

  /**
   * OAuth 응답 정보를 콘솔에 정리해서 출력
   */
  logResponse(provider: string, response: any, isError = false) {
    const emoji = isError ? '❌' : '✅';
    const type = isError ? 'Error' : 'Success';
    
    console.group(`${emoji} OAuth ${type} - ${provider}`);
    console.log('📨 Response:', response);
    
    if (isError && response.response) {
      console.log('🔥 Error Status:', response.response.status);
      console.log('💬 Error Message:', response.response.statusText);
      console.log('📋 Error Data:', response.response.data);
      console.log('🔍 Error Headers:', response.response.headers);
    } else if (!isError) {
      console.log('🎉 Success Data:', response.data);
      console.log('✨ Has URL:', !!(response.data?.url || response.data?.loginUrl));
    }
    
    console.log('⏰ Response Time:', new Date().toISOString());
    console.groupEnd();
  },

  /**
   * 백엔드 상태 확인
   */
  async checkBackendHealth() {
    const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
    
    console.group('🏥 Backend Health Check');
    console.log('🔗 Backend URL:', baseURL);
    
    try {
      const response = await fetch(`${baseURL}/api/health`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      console.log('✅ Backend Status:', response.status, response.statusText);
      
      if (response.ok) {
        const data = await response.json();
        console.log('📊 Health Data:', data);
      } else {
        console.log('⚠️ Backend not healthy');
      }
    } catch (error) {
      console.error('❌ Backend connection failed:', error);
      console.log('💡 Possible issues:');
      console.log('   - Backend server not running');
      console.log('   - CORS configuration issue');
      console.log('   - Network connectivity problem');
      console.log('   - Wrong API base URL');
    }
    
    console.groupEnd();
  },

  /**
   * OAuth 설정 확인
   */
  checkOAuthConfig() {
    console.group('⚙️ OAuth Configuration Check');
    
    const config = {
      API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
      OAUTH_REDIRECT_URI: import.meta.env.VITE_OAUTH_REDIRECT_URI,
      OAUTH_STATE_SECRET: import.meta.env.VITE_OAUTH_STATE_SECRET,
      NODE_ENV: import.meta.env.MODE,
      DEV: import.meta.env.DEV,
      PROD: import.meta.env.PROD,
    };
    
    console.table(config);
    
    // 필수 설정 검사
    const required = ['VITE_API_BASE_URL'];
    const missing = required.filter(key => !import.meta.env[key]);
    
    if (missing.length > 0) {
      console.warn('⚠️ Missing required environment variables:', missing);
    } else {
      console.log('✅ All required config present');
    }
    
    console.groupEnd();
  },

  /**
   * 전체 OAuth 디버깅 정보 출력
   */
  async fullDebug() {
    console.clear();
    console.log('🔍 OAuth Full Debug Mode Started');
    console.log('=====================================');
    
    this.checkOAuthConfig();
    await this.checkBackendHealth();
    
    console.log('=====================================');
    console.log('💡 Debug Tips:');
    console.log('1. Check Network tab for failed requests');
    console.log('2. Verify backend OAuth endpoints are implemented');
    console.log('3. Check CORS configuration on backend');
    console.log('4. Ensure OAuth provider apps are configured correctly');
    console.log('=====================================');
  }
};

// 개발 환경에서만 전역으로 노출
if (import.meta.env.DEV) {
  (window as any).oauthDebugger = oauthDebugger;
  console.log('🔧 OAuth Debugger available at window.oauthDebugger');
}