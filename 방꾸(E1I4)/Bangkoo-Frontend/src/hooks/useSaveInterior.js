// hooks/useSaveInterior.js
// ✅ 작성자: 김태원
// ✅ 작성 목적: 실제 캔버스에 렌더링된 내방 이미지를 서버에 저장 요청하는 훅 정의
// - 설명 텍스트와 함께 Blob 형태로 서버로 전송함

import { useSelector } from "react-redux";
import { requestPlacementSave } from "@/api/placement";

export const useSaveInterior = (canvasRef, closeDialog) => {
  // 🔸 Redux 상태에서 인테리어 설명 텍스트 가져오기
  const explanation = useSelector((state) => state.interior.explanation);

  /**
   * ✅ 저장 요청을 처리하는 함수
   * - canvasRef로부터 실제 렌더된 이미지 추출
   * - Blob으로 변환 후, 설명과 함께 서버에 업로드
   */
  const handleSave = async () => {
    try {
      if (closeDialog) closeDialog(); // 다이얼로그 닫기
      // ✅ 1. 캔버스 요소 접근 (ref가 연결되어 있어야 함)
      const canvas = canvasRef?.current;

      if (!canvas) {
        alert("캔버스를 찾을 수 없습니다.");
        return;
      }

      // ✅ 2. canvas → Blob 변환 (파일로 변환)
      canvas.toBlob(async (blob) => {
        if (!blob) {
          alert("Blob 생성 실패");
          return;
        }

        // ✅ 3. 전송할 formData 구성
        const formData = new FormData();
        formData.append("file", blob, "interior.png"); // 이미지 파일로 첨부
        formData.append("explanation", explanation || "설명 없음"); // 설명 텍스트 첨부

        // ✅ 4. 서버에 저장 요청
        await requestPlacementSave(formData);

        // alert("저장 요청 전송 완료!");
      }, "image/png");

    } catch (err) {
      // ✅ 예외 처리
      console.error("저장 실패:", err);
      alert("저장 중 오류가 발생했습니다.");
    }
  };

  // ⬅️ 이 훅을 사용하는 컴포넌트에서 handleSave를 직접 실행 가능
  return handleSave;
};
