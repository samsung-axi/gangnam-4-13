import { useMutation } from "@tanstack/react-query";
import api from "@/shared/config/axios";

// 실제로 백엔드에 POST 요청을 보내는 함수
const sendFinancialData = async (financialData: Record<string, any>) => {
  const response = await api.post("/api/query/financial", { financialData });
  return response.data;
};

// useMutation을 사용하는 커스텀 훅
export const useFinancialMutation = () => {
  return useMutation({
    mutationFn: sendFinancialData,
  });
};