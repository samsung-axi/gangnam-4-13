// src/api/Admin.js

import api from "./axios";

// 전체 조회 (페이징 포함)
export async function fetchProducts(page = 0, size = 10, searchTerm = "") {
  try {
    const res = await api.get("/api/admin/product", {
      params: { 
        page, 
        size,
        search: searchTerm, // searchTerm을 쿼리 파라미터로 추가
      },
    });
    console.log("응답 성공:", res);
    return {
      content: res.data, // 배열을 content로 래핑
      totalPages: 1,     // 현재 API에 페이지 정보 없으므로 1로 임시 설정
      search: searchTerm,
    };
  } catch (error) {
    console.error("가구 목록 조회 실패:", error.response || error.message);
    throw error;
  }
}

// 등록
export async function createAdminProducts(productData) {
  try {
    const response = await api.post("/api/admin/product/save", productData, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  } catch (error) {
    console.error("가구 등록 실패:", error);
    throw error;
  }
}

// 삭제
export async function deleteAdminProducts(id) {
  try {
    const response = await api.delete(`/api/admin/product/${id}`);
    return response.data;
  } catch (error) {
    console.error("가구 삭제 실패:", error);
    throw error;
  }
}

// 수정
export async function updateAdminProducts(id, updateData) {
  try {
    const response = await api.put(`/api/admin/product/${id}`, updateData, {
      headers: { "Content-Type": "application/json" },
    });
    console.log("업데이트된 객체:", JSON.stringify(updateData, null, 2));
    console.log("*******", updateData);
    return response.data;
  } catch (error) {
    console.error("가구 수정 실패:", error);
    throw error;
  }
}

// 검색
export async function searchProducts(searchTerm, currentPage = 0, pageSize = 10) {
  try {
    const params = {
      page: currentPage || 0,
      size: pageSize,
      searchTerm: searchTerm,
    };

    console.log("searchTerm:", searchTerm);
    console.log("API 호출 params:", params);

    const response = await api.get('/api/admin/products', { params });

    console.log("*****응답 데이터:", response.data);
    return response.data;

  } catch (error) {
    console.error("검색 요청 실패:", error);
    throw error;
    
  }
}

// CSV 업로드
export async function handleCSVUpload(file) {
  try {
    const formData = new FormData();
    formData.append("file", file);  // file은 파일 입력 필드에서 가져온 파일 객체

    const response = await api.post('/api/admin/CSVupload', formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    console.log("CSV 업로드 성공:", response.data);
    return response.data; // 업로드된 제품 정보 반환
  } catch (error) {
    console.error("CSV 업로드 실패:", error);
    throw error;
  }
}

