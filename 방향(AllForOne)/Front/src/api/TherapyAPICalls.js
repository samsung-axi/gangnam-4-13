import apis from "./Apis";

export const responseTherapy = async (userInput) => {
    try {
        const response = await apis.post("/diffusers", {
            user_input: userInput
        });
        console.log('API Request:', userInput);  // 요청 데이터 확인
        console.log('API Response:', response.data);  // 응답 데이터 확인
        return response.data;
    } catch (error) {
        console.error("Error getting therapy response:", error);
        throw error;
    }
};