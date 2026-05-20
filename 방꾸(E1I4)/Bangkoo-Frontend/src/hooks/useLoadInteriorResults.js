import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { requestPlacementResults } from "@/api/placement";
import { setInterior } from "@/features/furniture/interiorSlice";

export function useLoadInteriorResults() {
  const dispatch = useDispatch();

  useEffect(() => {
    async function fetchData() {
      try {
        const results = await requestPlacementResults();
        const mapped = results.map((item) => ({
            imageUrl: item.imageUrl,
            explanation: item.explanation || "설명 없음",
            id: item.imageUrl,
            type: "basic",
        }))
        dispatch(setInterior(mapped)); // 리덕스에 저장
      } catch (err) {
        console.error("인테리어 결과 불러오기 실패:", err);
      }
    }

    fetchData();
  }, [dispatch]);
}
