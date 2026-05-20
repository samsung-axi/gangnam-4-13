import { useMutation } from '@tanstack/react-query';
import { devLog } from '@/shared/util/logger';

// 기본 API URL
const API_BASE_URL = import.meta.env.VITE_BACKEND_API_URL || 'http://localhost:8080/';
const AI_SERVER_URL = import.meta.env.VITE_AI_SERVER_URL || 'http://localhost:8000/';

/**
 * 기업 검색 API 요청을 위한 서비스
 */
export const useSearchMutation = () => {
  return useMutation({
    mutationFn: async (searchParams: { prompt: string; top_k?: number }) => {
      const response = await fetch(`${API_BASE_URL}/search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(searchParams),
      });

      if (!response.ok) {
        throw new Error(`검색 요청 실패: ${response.status}`);
      }

      return await response.json();
    },
    onError: error => {
      devLog('검색 오류:', error);
    },
  });
};

/**
 * SSE 기반 기업 검색 API URL
 */
export const SSE_SEARCH_URL = `${AI_SERVER_URL}/api/ai/v1/report/generate-from-financial-data/sse`;
