import api from "./axios";

/**
 * 🔌 3D 모델 URL 조회 API
 * 작성자: 김태원
 * 
 * @param {string} id - 제품 ID
 * @returns {Promise<string>} - 해당 제품의 3D 모델 URL
 */
export async function fetchModel3DUrl(id) {
  try {
    const response = await api.get(`/api/3d-url/${id}`);
    return response.data;
  } catch (error) {
    console.error("❌ 3D 모델 URL 가져오기 실패:", error);
    throw error;
  }
}
