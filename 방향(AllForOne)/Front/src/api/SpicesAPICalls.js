import apis from "./Apis";

export const getAllSpices = async () => {
    try {
        const response = await apis.get("/spices");
        console.log("API Response:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error fetching spices:", error);
        throw error;
    }
};

export const createSpice = async (spiceData) => {
    try {
        const response = await apis.post(`/spices`, spiceData); // POST 요청
        console.log("향료 추가 요청 데이터:", spiceData);
        return response.data;
    } catch (error) {
        console.error("Error creating spice:", error);
        throw error;
    }
}

export const modifySpice = async (updatedSpiceData) => {
    try {
        const response = await apis.put(`/spices`, updatedSpiceData);
        console.log("Modify Response:", updatedSpiceData);
        console.log("헤하아항허ㅏㅇ", response)
        return response;
    } catch (error) {
        console.error("Error modifying spice:", error);
        throw error;
    }
};

export const deleteSpice = async (spiceId) => {
    try {
        console.log("API 호출 ID:", spiceId);
        const response = await apis.delete(`/spices/${spiceId}`);
        console.log("Delete Response:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error deleting spice:", error);
        throw error;
    }
};