//작성자: 김병훈

import { useState, useCallback } from "react";
import { fetchRediskeyForImage } from "../pages/myroom/utils/recommendUtils";

/**
 * 이미지 파일을 받아 AI 추천을 요청하고,
 * 반환된 redisKey를 상태로 관리해 주는 훅
 */
export function useImageRecommend() {
    const [redisKey, setRedisKey] = useState(null);
  
    const recommend = useCallback(
      async (file) => {
        if (!file) {
          alert("이미지를 선택하세요");
          return;
        }
        try {
          const key = await fetchRediskeyForImage(file);
          console.log("훅에서 받은 redisKey:", key);
          setRedisKey(key);
        } catch (err) {
          alert(err.message);
          console.error("추천 요청 실패:", err);
        }
      },
      [] // 의존성으로 fetchRedisKeyForImage만
    );
  
    return { redisKey, recommend };
  }