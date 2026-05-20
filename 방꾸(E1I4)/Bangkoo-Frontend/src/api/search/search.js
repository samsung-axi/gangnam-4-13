import api from "../axios";

// 텍스트 기반
export const searchByText = async (query, userId = null, autoSave = true) => {
    const formData = new FormData();
    formData.append("query", query);
    formData.append("userId", userId);

    const response = await api.post("/api/search", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      params: {
        autoSave
      }
    });

    return response.data;
  };

// 이미지 기반 통합(파일, URL, 텍스트 조합)
export const searchImageUnified = async ({ imageFile = null, imageUrl = null, query = "", userId = null, autoSave = true }) => {
    const formData = new FormData();

    if (imageFile) formData.append("image", imageFile);
    if (imageUrl) formData.append("image_url", imageUrl);
    if (query) formData.append("query", query);
    formData.append("userId", userId);

    const res = await api.post("/api/search", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
        params: {
          autoSave
        }
    });

    return res.data;
};
  
// 1. 최근 검색어 조회
export const fetchRecentSearches = async (userId, limit = 10) => {
    try {
      const res = await api.get("/api/search-logs/recent", {
        params: { userId, limit },
      });
      return res.data;
    } catch (error) {
      console.error("최근 검색어 조회 실패:", error);
      return [];
    }
  };

  // 2. 인기 검색어 조회
export const fetchPopularSearches = async (limit = 10) => {
    try {
      const res = await api.get("/api/search-logs/popular", {
        params: { limit },
      });
      return res.data;
    } catch (error) {
      console.error("인기 검색어 조회 실패:", error);
      return [];
    }
  };

// 3. 특정 검색어 삭제
export const deleteSearchItem = async (userId, query) => {
    try {
      await api.delete("/api/search-logs/item", {
        params: { userId, query },
      });
    } catch (error) {
      console.error("검색어 개별 삭제 실패:", error);
    }
  };

// 4. 모든 검색어 삭제
export const deleteAllSearchLogs = async (userId) => {
    try {
      await api.delete("/api/search-logs", {
        params: { userId },
      });
    } catch (error) {
      console.error("검색어 전체 삭제 실패:", error);
    }
  };
