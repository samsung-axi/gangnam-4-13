import apis from "./Apis";
import axios from "axios";

export const getAllMembers = async () => {
    try {
        const response = await apis.get("/members");
        return response.data;
    } catch (error) {
        console.error("Error fetching members:", error);
        throw error;
    }
};

// 멤버 삭제
export const setMemberLeave = async (memberId) => {
    try {
        // 정확한 서버 URL로 요청
        await axios.put(`http://localhost:8080/members/${memberId}`);
        return true;
    } catch (error) {
        console.error("Error deleting member", error);
        return false;
    }
};

