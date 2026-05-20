import { useState, useEffect } from 'react';
import { devLog } from '@/shared/util/logger';

interface SseReportState {
  message: string;
  progress: number;
  steps: string[];
  isConnected: boolean;
  error: string | null;
}

interface SseReportOptions {
  onComplete?: (result: any) => void;
}

/**
 * SSE를 통해 보고서 생성 진행 상황을 실시간으로 받아오는 커스텀 훅
 * @param companyData 보고서 생성에 필요한 회사 데이터
 * @param isGenerating 보고서 생성 중인지 여부
 * @param options 추가 옵션 (완료 콜백 등)
 */
export const useSseReport = (
  companyData: any | null,
  isGenerating: boolean,
  options?: SseReportOptions
) => {
  const [state, setState] = useState<SseReportState>({
    message: '기업 데이터를 분석하여 보고서를 생성하고 있습니다.',
    progress: 0,
    steps: ['보고서 생성 준비 중...'],
    isConnected: false,
    error: null,
  });

  useEffect(() => {
    let abortController: AbortController | null = null;

    const connectSse = async () => {
      if (!isGenerating || !companyData) return;

      // 초기 상태 설정
      setState(prev => ({
        ...prev,
        message: '기업 데이터를 분석하여 보고서를 생성하고 있습니다.',
        steps: ['보고서 생성 준비 중...'],
        isConnected: false,
        error: null,
      }));

      try {
        // SSE 연결을 위한 URL 설정
        const apiUrl = `${import.meta.env.VITE_AI_SERVER_URL || 'http://localhost:8000'}/api/ai/v1/report/generate-from-financial-data/sse`;
        
        devLog('SSE 연결 URL:', apiUrl);
        devLog('SSE 요청 데이터:', companyData);

        // 연결 시도 메시지 추가
        setState(prev => ({
          ...prev,
          steps: [...prev.steps, 'AI 서버에 연결 중...'],
        }));

        // AbortController 생성
        abortController = new AbortController();

        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(companyData),
          signal: abortController.signal,
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        devLog('SSE 연결 성공!');
        setState(prev => ({
          ...prev,
          isConnected: true,
          steps: [...prev.steps, 'AI 서버 연결 성공! 데이터 처리 중...'],
        }));

        // SSE 스트림 처리
        const reader = response.body?.getReader();
        const decoder = new TextDecoder();

        if (reader) {
          const processStream = async () => {
            try {
              while (true) {
                const { done, value } = await reader.read();

                if (done) {
                  devLog('SSE 스트림이 종료되었습니다.');
                  setState(prev => ({
                    ...prev,
                    steps: [...prev.steps, 'SSE 스트림 종료됨'],
                  }));
                  break;
                }

                const chunk = decoder.decode(value, { stream: true });
                devLog('Raw SSE chunk:', chunk);

                // SSE 형식 파싱 (data: {...})
                const lines = chunk.split('\n');

                for (const line of lines) {
                  if (line.trim() === '') continue;

                  if (line.startsWith('data:')) {
                    try {
                      const dataStr = line.substring(5).trim();
                      devLog('SSE 데이터 문자열:', dataStr);
                      
                      const eventData = JSON.parse(dataStr);
                      devLog('SSE 이벤트 데이터:', eventData);

                      // 이벤트 처리
                      if (eventData.step) {
                        const newMessage = eventData.message || `단계: ${eventData.step}`;
                        
                        setState(prev => ({
                          ...prev,
                          message: newMessage,
                          steps: [...prev.steps, newMessage],
                        }));

                        // 진행률 업데이트
                        if (eventData.progress !== undefined) {
                          setState(prev => ({
                            ...prev,
                            progress: eventData.progress,
                          }));
                        }

                        // 결과 처리
                        if (eventData.result && (eventData.step === 'completed' || eventData.step === 'report_generation_completed')) {
                          options?.onComplete?.(eventData.result);
                        }
                      }

                      // 오류 처리
                      if (eventData.error) {
                        const errorMsg = `오류: ${eventData.error}`;
                        setState(prev => ({
                          ...prev,
                          message: errorMsg,
                          steps: [...prev.steps, errorMsg],
                          error: errorMsg,
                        }));
                      }
                    } catch (e) {
                      const errorMsg = `SSE 데이터 파싱 오류: ${(e as Error).message}`;
                      devLog(errorMsg, e, line);
                      setState(prev => ({
                        ...prev,
                        steps: [...prev.steps, errorMsg],
                        error: errorMsg,
                      }));
                    }
                  }
                }
              }
            } catch (error) {
              const errorMsg = `SSE 스트림 처리 오류: ${(error as Error).message}`;
              devLog(errorMsg, error);
              setState(prev => ({
                ...prev,
                steps: [...prev.steps, errorMsg],
                error: errorMsg,
              }));
            }
          };

          processStream();
        }
      } catch (error) {
        const errorMsg = `보고서 로딩 중 오류가 발생했습니다: ${(error as Error).message}`;
        devLog('SSE 연결 오류:', error);
        setState(prev => ({
          ...prev,
          message: errorMsg,
          steps: [...prev.steps, errorMsg],
          error: errorMsg,
        }));
      }
    };

    connectSse();

    // 클린업 함수
    return () => {
      if (abortController) {
        abortController.abort();
      }
    };
  }, [companyData, isGenerating, options]);

  return state;
};
