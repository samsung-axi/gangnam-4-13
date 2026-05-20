import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setRecommendedFurniture } from "../../features/furniture/recommendedSlice";
import { getRecommendationList } from "../../api/Recomendation/getRecomendationlist";
import AIFurnitureList from "./AIFurnitureList";

export default function AIFurnitureTab({ redisKey, onPlus }) {
  const dispatch = useDispatch();
  const furnitureList = useSelector((state) => state.recommended.list);

  useEffect(() => {
    if (!redisKey) return; // 키 없으면 호출 안 함

    (async () => {
      try {
        const data = await getRecommendationList(redisKey);
        dispatch(setRecommendedFurniture(data));
      } catch (err) {
        console.error("추천 가구 가져오기 실패:", err);
      }
    })();
  }, [redisKey, dispatch]);

  return <AIFurnitureList furnitureList={furnitureList} onPlus={onPlus} />;
}
