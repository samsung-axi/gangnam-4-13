import apis from "./Apis";

// 북마크 토글 (추가/삭제)
export const toggleBookmark = async (productId, memberId) => {
    try {
        const response = await apis.post(`/bookmarks/${productId}/${memberId}`);
        console.log("response.data : " , response.data);
        return response.data;
    } catch (error) {
        console.error("Error toggling bookmark:", error);
        throw error;
    }
};

// 북마크된 향수 목록 조회
export const getBookmarkedPerfumes = async (memberId) => {
    try {
        const response = await apis.get(`/bookmarks/${memberId}`);
        console.log("response.data : " , response.data);
        return response.data;
    } catch (error) {
        console.error("Error fetching bookmarked perfumes:", error);
        throw error;
    }
};

// 북마크 삭제
export const deleteBookmark = async (productId, memberId) => {
    try {
        const response = await apis.delete(`/bookmarks/${productId}/${memberId}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting bookmark:", error);
        throw error;
    }
};