//작성자: 김병훈
//AI추천 가구 redis에서 추출

import axios from 'axios';

export const getRecommendations = async (redisKey) => {
  try {
    const response = await axios.get(`/api/recommend/from_image/{redisKey}`);
    console.log("백엔드 redis에서 보낸 정보:",response);
    return response.data;
  } catch (error) {
    console.error('추천 목록 조회 실패:', {
      message : error.message,
      response: error.response?.data,
    });
    return [];
  }
};


 