// api/placement.js
import api from "./axios";

/**
 * 작성자 : 김태원
 * 
 * 🎨 AI 배치 생성 요청 (이미지 업로드 포함)
 *
 * 사용자가 가구 배치를 시도할 때,
 * AI 서버에 배경 이미지와 (필요 시) 참조 이미지를 전송하여
 * base64 형태의 결과 이미지를 받아온다.
 *
 * @param {'remove' | 'add' | 'move'} mode - 작업 모드
 * @param {Blob} backgroundBlob - 배경 이미지
 * @param {Blob=} referenceBlob - add일 때 필요한 참조 이미지
 * @returns {Promise<string>} base64 인코딩된 이미지 결과
 */
export async function requestPlacement(mode, backgroundBlob, referenceBlob = null,width,height) {

  if (typeof backgroundBlob === "string") {
    backgroundBlob = await (await fetch(backgroundBlob)).blob();
  }
  if (referenceBlob && typeof referenceBlob === "string") {
    referenceBlob = await (await fetch(referenceBlob)).blob();
  }


  const formData = new FormData();
  formData.append("mode", mode);
  formData.append("background", backgroundBlob, "bg.png");
  formData.append("width", width);
  formData.append("height", height);

  // reference 이미지는 add 모드일 때만 사용
  // if (mode === "add" && referenceBlob) {
  //   formData.append("reference", referenceBlob, "ref.png");
  // }

  const response = await api.post("/api/placement", formData, {
    headers: {
      "Content-Type": "multipart/form-data"
    },
  });

  return response.data; // base64 문자열
}

/**
 * 💾 배치 결과 저장 요청 (S3 업로드 + MongoDB 저장)
 *
 * - 사용자가 결과를 저장할 때 호출
 * - file, userId, explanation을 포함한 formData 전송
 * - 저장 성공 시 image_url 반환
 *
 * @param {FormData} formData - 저장에 필요한 정보들
 * @returns {Promise<{ image_url: string }>} - 업로드된 이미지 URL
 */
export async function requestPlacementSave(formData) {
  const response = await api.post("/api/placement/save", formData, {
    headers: {
      "Content-Type": "multipart/form-data"
    },
  });

  return response.data;
}

/**
 * 📂 저장된 배치 결과 목록 조회
 *
 * 백엔드에서 해당 유저의 저장된 인테리어 배치 결과들을 가져온다.
 * - JWT에서 userId를 자동으로 추출하므로 별도 파라미터 필요 없음
 *
 * @returns {Promise<Array>} 배치 결과 리스트
 */
export async function requestPlacementResults() {
  const response = await api.get("/api/placement/results");
  return response.data; // [{ imageUrl, explanation, createdAt, userId }, ...]
}
