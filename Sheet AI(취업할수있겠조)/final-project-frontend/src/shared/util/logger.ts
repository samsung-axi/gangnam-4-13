/**
 * 개발 환경에서만 로그를 출력하는 유틸리티 함수들
 */

// 개발 환경인지 확인 (Vite에서는 import.meta.env.DEV 사용)
const isDev = import.meta.env.DEV;
/**
 * 개발 환경에서만 로그를 출력합니다.
 * @param message 출력할 메시지
 * @param optionalParams 추가 파라미터들
 */
export const devLog = (message?: any, ...optionalParams: any[]): void => {
  if (isDev) {
    console.log(message, ...optionalParams);
  }
};
/**
 * 개발 환경에서만 경고를 출력합니다.
 * @param message 출력할 경고 메시지
 * @param optionalParams 추가 파라미터들
 */
export const devWarn = (message?: any, ...optionalParams: any[]): void => {
  if (isDev) {
    console.warn(message, ...optionalParams);
  }
};

/**
 * 개발 환경에서만 에러를 출력합니다.
 * @param message 출력할 에러 메시지
 * @param optionalParams 추가 파라미터들
 */
export const devError = (message?: any, ...optionalParams: any[]): void => {
  if (isDev) {
    console.error(message, ...optionalParams);
  }
};

/**
 * 개발 환경에서만 정보를 출력합니다.
 * @param message 출력할 정보 메시지
 * @param optionalParams 추가 파라미터들
 */
export const devInfo = (message?: any, ...optionalParams: any[]): void => {
  if (isDev) {
    console.info(message, ...optionalParams);
  }
};

/**
 * 개발 환경에서만 디버그 정보를 출력합니다.
 * @param message 출력할 디버그 메시지
 * @param optionalParams 추가 파라미터들
 */
export const devDebug = (message?: any, ...optionalParams: any[]): void => {
  if (isDev) {
    console.debug(message, ...optionalParams);
  }
};

/**
 * 항상 로그를 출력합니다. (개발 환경이 아니어도 출력)
 * @param message 출력할 메시지
 * @param optionalParams 추가 파라미터들
 */
export const log = (message?: any, ...optionalParams: any[]): void => {
  console.log(message, ...optionalParams);
};
