import apis from "./Apis";

// 향기 카드 생성 API 호출
export const createScentCardAPI = async (chatId) => {
    const response = await apis.post(`/histories`, { chatId });
    console.log("향기 카드 생성 응답 : ", response)
    return response.data; // 응답 데이터 반환
};

// 향기 카드 가져오기 API 호출
export const fetchHistoryAPI = async (memberId) => {
    const response = await apis.get(`/histories/${memberId}`);
    console.log("가져온 향수 히스토리 데이터 : ", response)
    return response.data; // 서버에서 받은 데이터 반환
};