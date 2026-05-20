//작성자: 김병훈
//이미지 등록시 AI추천 및 임베딩
import api from "../axios";

export const recommendFromImage = async (formData) => {
    try {
      const response = await api.post(`/api/recommend/from_image`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true,  // 쿠키 자동 전송
      });
      return response.data;
    } catch (error) {
      console.error("이미지 추천 실패:", error);
      throw error;
    }
  };
  