// src/utils/tokenManager.ts
// 토큰 관리 및 보안 유틸리티

import { logger } from './logger';

export interface TokenInfo {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
  userId: string;
}

class TokenManager {
  private static instance: TokenManager;
  private tokenInfo: TokenInfo | null = null;
  private refreshPromise: Promise<string> | null = null;

  private constructor() {}

  public static getInstance(): TokenManager {
    if (!TokenManager.instance) {
      TokenManager.instance = new TokenManager();
    }
    return TokenManager.instance;
  }

  /**
   * 토큰 저장
   */
  setTokens(accessToken: string, refreshToken: string, userId: string): void {
    try {
      // JWT 페이로드에서 만료 시간 추출
      const payload = this.parseJWT(accessToken);
      const expiresAt = payload.exp * 1000; // 밀리초로 변환

      this.tokenInfo = {
        accessToken,
        refreshToken,
        expiresAt,
        userId
      };

      // localStorage에 저장
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('userId', userId);
      localStorage.setItem('tokenExpiresAt', expiresAt.toString());

      logger.debug('Tokens stored successfully', { 
        userId, 
        expiresAt: new Date(expiresAt).toISOString()
      });
    } catch (error) {
      logger.error('Failed to store tokens', error);
      throw new Error('토큰 저장에 실패했습니다.');
    }
  }

  /**
   * 액세스 토큰 가져오기 (자동 갱신 포함)
   */
  async getAccessToken(): Promise<string | null> {
    try {
      // 메모리에서 먼저 확인
      if (!this.tokenInfo) {
        this.loadTokensFromStorage();
      }

      if (!this.tokenInfo) {
        return null;
      }

      // 토큰이 만료되었는지 확인 (5분 버퍼)
      const now = Date.now();
      const bufferTime = 5 * 60 * 1000; // 5분

      if (this.tokenInfo.expiresAt - now < bufferTime) {
        logger.debug('Token expiring soon, refreshing...');
        return await this.refreshAccessToken();
      }

      return this.tokenInfo.accessToken;
    } catch (error) {
      logger.error('Failed to get access token', error);
      this.clearTokens();
      return null;
    }
  }

  /**
   * 리프레시 토큰으로 액세스 토큰 갱신
   */
  private async refreshAccessToken(): Promise<string> {
    // 중복 요청 방지
    if (this.refreshPromise) {
      return this.refreshPromise;
    }

    this.refreshPromise = this.performRefresh();
    
    try {
      const newAccessToken = await this.refreshPromise;
      return newAccessToken;
    } finally {
      this.refreshPromise = null;
    }
  }

  private async performRefresh(): Promise<string> {
    if (!this.tokenInfo?.refreshToken) {
      throw new Error('No refresh token available');
    }

    try {
      // 실제 토큰 갱신 API 호출
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken: this.tokenInfo.refreshToken }),
      });

      if (!response.ok) {
        throw new Error('Token refresh failed');
      }

      const data = await response.json();
      
      if (data.success && data.data.accessToken) {
        const newAccessToken = data.data.accessToken;
        
        // 새 토큰으로 업데이트
        this.setTokens(
          newAccessToken, 
          this.tokenInfo.refreshToken, 
          this.tokenInfo.userId
        );

        logger.info('Token refreshed successfully');
        return newAccessToken;
      } else {
        throw new Error('Invalid refresh response');
      }
    } catch (error) {
      logger.error('Token refresh failed', error);
      this.clearTokens();
      throw error;
    }
  }

  /**
   * localStorage에서 토큰 정보 로드
   */
  private loadTokensFromStorage(): void {
    try {
      const accessToken = localStorage.getItem('accessToken');
      const refreshToken = localStorage.getItem('refreshToken');
      const userId = localStorage.getItem('userId');
      const expiresAt = localStorage.getItem('tokenExpiresAt');

      if (accessToken && refreshToken && userId && expiresAt) {
        this.tokenInfo = {
          accessToken,
          refreshToken,
          expiresAt: parseInt(expiresAt),
          userId
        };
        
        logger.debug('Tokens loaded from storage');
      }
    } catch (error) {
      logger.error('Failed to load tokens from storage', error);
      this.clearTokens();
    }
  }

  /**
   * 토큰 클리어
   */
  clearTokens(): void {
    this.tokenInfo = null;
    this.refreshPromise = null;
    
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userId');
    localStorage.removeItem('tokenExpiresAt');
    localStorage.removeItem('userInfo');
    
    logger.info('Tokens cleared');
  }

  /**
   * JWT 파싱
   */
  private parseJWT(token: string): any {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      
      return JSON.parse(jsonPayload);
    } catch (error) {
      logger.error('Failed to parse JWT', error);
      throw new Error('Invalid JWT format');
    }
  }

  /**
   * 토큰 유효성 검증
   */
  isTokenValid(): boolean {
    if (!this.tokenInfo) {
      this.loadTokensFromStorage();
    }

    if (!this.tokenInfo) {
      return false;
    }

    const now = Date.now();
    return this.tokenInfo.expiresAt > now;
  }

  /**
   * 현재 사용자 ID 가져오기
   */
  getUserId(): string | null {
    if (!this.tokenInfo) {
      this.loadTokensFromStorage();
    }

    return this.tokenInfo?.userId || null;
  }
}

export const tokenManager = TokenManager.getInstance();