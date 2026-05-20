import apis from "./Apis";

// 채팅 추천 요청
export const requestRecommendations = async (userInput, imageFile = null, userId = null) => {
    console.log('ChatAPICalls에서 받은 데이터:', { userInput, imageFile, userId });

    try {
        if (!imageFile && (!userInput || !userInput.trim())) {
            throw new Error("이미지 또는 사용자 입력 중 하나는 필수입니다.");
        }

        const formData = new FormData();
        formData.append("content", userInput || "");
        
        // 이미지 파일 처리 개선
        if (imageFile) {
            // Blob URL인 경우 실제 파일로 변환
            if (typeof imageFile === 'string' && imageFile.startsWith('blob:')) {
                const response = await fetch(imageFile);
                const blob = await response.blob();
                formData.append("image", blob, "image.jpg"); // 적절한 파일명 지정
            }
            // File 객체인 경우 직접 추가
            else if (imageFile instanceof File) {
                formData.append("image", imageFile);
            }
            // 그 외의 경우 에러 처리
            else {
                console.error("지원하지 않는 이미지 형식:", imageFile);
                throw new Error("지원하지 않는 이미지 형식입니다.");
            }
        }

        if (userId) formData.append("memberId", userId);

        // FormData 내용 로깅 (디버깅용)
        console.log("전송할 FormData:");
        for (let [key, value] of formData.entries()) {
            console.log(`${key}:`, value);
        }

        const response = await apis.post("/chats", formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });

        console.log('채팅 추천 요청 응답:', response.data);
        return response.data;
    } catch (error) {
        console.error("추천 요청 중 오류 발생:", error);
        throw new Error(error.response?.data?.message || "추천 요청 중 오류가 발생했습니다.");
    }
};

// 로그인한 회원의 채팅 내역 가져오기
export const getChatHistory = async (memberId) => {
    try {
        const response = await apis.get(`/chats/${memberId}`);
        return response.data; // 응답 데이터 반환
    } catch (error) {
        // 채팅 내역 가져오기 오류 처리
        console.error("채팅 내역 가져오기 오류:", error);
        throw new Error(error.response?.data?.message || "채팅 내역을 가져오는 중 오류가 발생했습니다.");
    }
};