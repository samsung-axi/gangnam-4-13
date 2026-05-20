import apis from "./Apis";

// 카카오 로그인 API
export const handleOAuthKakaoAPI = async (code) => {
    try {
        const response = await apis.get(`/kakao/login/callback?code=${code}`);
        return response.data; // API 응답 데이터 반환
    } catch (error) {
        throw new Error(error.response?.data?.message || "카카오 OAuth 요청 실패");
    }
};


