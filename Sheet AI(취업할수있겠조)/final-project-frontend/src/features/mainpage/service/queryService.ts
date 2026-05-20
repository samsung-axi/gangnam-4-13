import { useQuery } from "@tanstack/react-query";
import api from "@/shared/config/axios";

// 실제 요청 함수
const fetchQueryResult = async (prompt: string, top_k: number) => {
  const response = await api.post('/api/query/ask', { prompt, top_k });
  return response.data;
};

// React Query 훅으로 감싼 커스텀 훅
export const useQueryResult = (prompt: string, top_k: number = 8) => {
  return useQuery({
    queryKey: ['queryResult', prompt, top_k],
    queryFn: () => fetchQueryResult(prompt, top_k),
    enabled: !!prompt?.trim(), // 빈 문자열이면 실행 안함
  });
};