// src/utils/logger.ts
// 고급 로깅 시스템

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3
}

class Logger {
  private logLevel: LogLevel = LogLevel.INFO;

  constructor() {
    // 개발 환경에서는 DEBUG 레벨 사용
    if (import.meta.env.DEV) {
      this.logLevel = LogLevel.DEBUG;
    }
  }

  private shouldLog(level: LogLevel): boolean {
    return level >= this.logLevel;
  }

  private formatMessage(level: string, message: string, data?: any): void {
    const timestamp = new Date().toISOString();
    const prefix = `[${timestamp}] [${level}]`;
    
    if (data) {
      console.log(`${prefix} ${message}`, data);
    } else {
      console.log(`${prefix} ${message}`);
    }
  }

  debug(message: string, data?: any): void {
    if (this.shouldLog(LogLevel.DEBUG)) {
      this.formatMessage('DEBUG', message, data);
    }
  }

  info(message: string, data?: any): void {
    if (this.shouldLog(LogLevel.INFO)) {
      this.formatMessage('INFO', message, data);
    }
  }

  warn(message: string, data?: any): void {
    if (this.shouldLog(LogLevel.WARN)) {
      this.formatMessage('WARN', message, data);
    }
  }

  error(message: string, error?: any): void {
    if (this.shouldLog(LogLevel.ERROR)) {
      this.formatMessage('ERROR', message, error);
      
      // 프로덕션에서는 에러 리포팅 서비스로 전송
      if (import.meta.env.PROD) {
        this.reportError(message, error);
      }
    }
  }

  private reportError(message: string, error: any): void {
    // 여기에 에러 리포팅 서비스 (Sentry, LogRocket 등) 연동
    // 예: Sentry.captureException(error);
    console.error('Error reported:', { message, error });
  }

  // OAuth 전용 로거
  oauth(action: string, provider: string, data?: any): void {
    this.info(`OAuth ${action} - ${provider}`, data);
  }

  // API 요청 로거
  apiRequest(method: string, url: string, data?: any): void {
    this.debug(`API ${method} ${url}`, data);
  }

  // API 응답 로거
  apiResponse(method: string, url: string, status: number, data?: any): void {
    if (status >= 400) {
      this.error(`API ${method} ${url} - ${status}`, data);
    } else {
      this.debug(`API ${method} ${url} - ${status}`, data);
    }
  }
}

export const logger = new Logger();