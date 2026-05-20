import React, { useCallback, useState } from 'react';

interface SseSearchOptions {
  url: string;
  onMessage?: (data: any) => void;
  onProgress?: (progress: number) => void;
  onError?: (error: any) => void;
  onComplete?: (result: any) => void;
}

interface SseSearchState {
  isLoading: boolean;
  progress: number;
  result: any | null;
  error: Error | null;
  logs: string[];
}

/**
 * SSE(Server-Sent Events)를 사용하여 검색 결과를 실시간으로 받아오는 커스텀 훅
 */
export const useSseSearch = () => {
  const [state, setState] = useState<SseSearchState>({
    isLoading: false,
    progress: 0,
    result: null,
    error: null,
    logs: [],
  });

  // 연결 종료를 위한 컨트롤러 참조
  const abortControllerRef = React.useRef<AbortController | null>(null);

  // SSE 연결 시작 함수
  const startSseConnection = useCallback(async (requestData: any, options: SseSearchOptions) => {
    // 이전 연결이 있으면 종료
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // 상태 초기화
    setState({
      isLoading: true,
      progress: 0,
      result: null,
      error: null,
      logs: ['검색 요청을 시작합니다.'],
    });

    // 새 AbortController 생성
    abortControllerRef.current = new AbortController();

    try {
      // POST 요청으로 SSE 연결 시작
      const response = await fetch(options.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        throw new Error(`HTTP 오류! 상태: ${response.status}`);
      }

      // 스트림 처리
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error('응답 본문을 읽을 수 없습니다.');
      }

      // 스트림 처리 함수
      const processStream = async () => {
        try {
          while (true) {
            const { done, value } = await reader.read();

            if (done) {
              setState(prev => ({
                ...prev,
                isLoading: false,
                logs: [...prev.logs, '스트림이 종료되었습니다.'],
              }));
              break;
            }

            const chunk = decoder.decode(value, { stream: true });
            const lines = chunk.split('\n');

            let eventData = null;
            let eventName = 'message';

            for (const line of lines) {
              if (line.trim() === '') continue;

              if (line.startsWith('event:')) {
                eventName = line.substring(6).trim();
              } else if (line.startsWith('data:')) {
                try {
                  const dataStr = line.substring(5).trim();
                  // 빈 데이터 체크 추가
                  if (!dataStr) {
                    continue;
                  }
                  
                  try {
                    eventData = JSON.parse(dataStr);
                  } catch (parseError) {
                    console.warn('불완전한 JSON 데이터:', dataStr);
                    continue; // 파싱 실패 시 다음 라인으로 넘어감
                  }

                  // 이벤트 처리
                  if (eventData) {
                    // 로그 추가
                    if (eventData.message) {
                      setState(prev => ({
                        ...prev,
                        logs: [...prev.logs, eventData.message],
                      }));
                    }

                    // 진행률 업데이트
                    if (eventData.progress !== undefined) {
                      setState(prev => ({
                        ...prev,
                        progress: eventData.progress,
                      }));
                      options.onProgress?.(eventData.progress);
                    }

                    // 결과 처리
                    if (
                      eventData.result &&
                      eventData.is_completed === true &&
                      eventData.step === 'report_generation_completed'
                    ) {
                      setState(prev => ({
                        ...prev,
                        result: eventData.result,
                        isLoading: false,
                      }));
                      options.onComplete?.(eventData.result);
                    }

                    // 메시지 콜백
                    options.onMessage?.(eventData);
                  }
                } catch (e) {
                  console.error('SSE 데이터 파싱 오류:', e, line);
                  const error = e instanceof Error ? e : new Error('알 수 없는 오류');
                  setState(prev => ({
                    ...prev,
                    logs: [...prev.logs, `데이터 파싱 오류: ${error.message}`],
                    error,
                  }));
                  options.onError?.(error);
                }
              }
            }
          }
        } catch (error) {
          if (error.name !== 'AbortError') {
            console.error('스트림 처리 오류:', error);
            const err = error instanceof Error ? error : new Error('알 수 없는 오류');
            setState(prev => ({
              ...prev,
              isLoading: false,
              error: err,
              logs: [...prev.logs, `오류 발생: ${err.message}`],
            }));
            options.onError?.(err);
          }
        }
      };

      // 스트림 처리 시작
      processStream();
    } catch (error) {
      console.error('SSE 연결 오류:', error);
      const err = error instanceof Error ? error : new Error('알 수 없는 오류');
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: err,
        logs: [...prev.logs, `연결 오류: ${err.message}`],
      }));
      options.onError?.(err);
    }

    // cleanup 함수 반환
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
        abortControllerRef.current = null;
        setState(prev => ({
          ...prev,
          isLoading: false,
          logs: [...prev.logs, '컴포넌트 언마운트로 연결이 종료되었습니다.'],
        }));
      }
    };
  }, []);

  // 연결 종료 함수
  const stopSseConnection = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
      setState(prev => ({
        ...prev,
        isLoading: false,
        logs: [...prev.logs, '사용자에 의해 연결이 종료되었습니다.'],
      }));
    }
  }, []);

  return {
    ...state,
    startSseConnection,
    stopSseConnection,
  };
};

export default useSseSearch;
