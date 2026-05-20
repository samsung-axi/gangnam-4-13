// src/utils/constants.ts
// OAuth 및 앱 전반 상수 정의

export const OAUTH_PROVIDERS = {
  GOOGLE: 'google',
  NAVER: 'naver'
} as const;

export const OAUTH_CONFIG = {
  REDIRECT_URI: import.meta.env.VITE_OAUTH_REDIRECT_URI || 'http://localhost:5173/auth/callback',
  STATE_SECRET: import.meta.env.VITE_OAUTH_STATE_SECRET || 'default_secret',
  TOKEN_REFRESH_BUFFER: 5 * 60 * 1000, // 5분
} as const;

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    SIGNUP: '/auth/signup',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    ME: '/auth/me',
    VALIDATE: '/auth/validate'
  },
  OAUTH: {
    PROVIDERS: '/oauth/providers',
    URL: '/oauth/url'
  },
  USERS: {
    PROFILE: '/users/profile'
  },
  AI: {
    ANALYZE: '/api/v1/analyze',
    SKIN_DIAGNOSIS: '/api/v1/diagnose/skin-lesion-image',
    TEXT_ANALYSIS: '/api/v1/utterance/refine'
  }
} as const;

export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'accessToken',
  REFRESH_TOKEN: 'refreshToken',
  USER_INFO: 'userInfo',
  USER_ID: 'userId',
  TOKEN_EXPIRES_AT: 'tokenExpiresAt',
  OAUTH_STATE: 'oauth_state'
} as const;

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  SIGNUP: '/signup',
  AUTH_CALLBACK: '/auth/callback',
  PROFILE: '/profile'
} as const;
