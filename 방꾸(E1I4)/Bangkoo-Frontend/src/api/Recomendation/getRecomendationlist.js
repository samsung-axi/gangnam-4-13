//작성자: 김병훈
//추천된 가구 가져오는 함수
import api from "../axios";

export const getRecommendationList = async (redisKey) => {
    try {
      const response = await api.get(`/api/recommend/from_image/${redisKey}`, {
        withCredentials: true,
      });
      console.log("추천 가구 리스트 정보:",response.data);
      return response.data; // 🔥 실제 추천 가구 리스트
    } catch (error) {
      console.error("Redis 추천 리스트 가져오기 실패:", error);
      throw error;
    }
  };