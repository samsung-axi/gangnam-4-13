import apis from "./Apis";

/**
 * 구독 생성 API
 * @param {number} memberId - 회원 ID
 * @param {number} productId - 상품 ID
 * @returns {Promise<Object>} 생성된 구독 정보
 */
export const createSubscription = async (memberId, productId) => {
    try {
        console.log('구독 생성 API 요청 시작:', { memberId, productId });
        
        const response = await apis.post("/subscription", {
            memberId,
            productId
        });
        
        console.log('구독 생성 성공:', response.data);
        return response.data;
    } catch (error) {
        console.error("구독 생성 실패:", error);
        
        // 에러 메시지 추출 (백엔드에서 문자열 또는 객체로 올 수 있음)
        let errorMessage = "구독 생성에 실패했습니다.";
        
        if (error.response?.data) {
            // 백엔드 응답이 문자열인 경우
            if (typeof error.response.data === 'string') {
                errorMessage = error.response.data;
            } 
            // 백엔드 응답이 객체인 경우
            else if (error.response.data.message) {
                errorMessage = error.response.data.message;
            }
        } else if (error.message) {
            errorMessage = error.message;
        }
        
        throw new Error(errorMessage);
    }
};

/**
 * 회원의 구독 목록 조회 API (전체 - 활성/취소 모두)
 * @param {number} memberId - 회원 ID
 * @returns {Promise<Array>} 구독 목록
 */
export const getSubscriptionsByMember = async (memberId) => {
    try {
        console.log('구독 목록 조회 API 요청 시작, memberId:', memberId);
        
        const response = await apis.get(`/subscription/${memberId}`);
        
        console.log('구독 목록 조회 성공:', response.data);
        return response.data;
    } catch (error) {
        console.error("구독 목록 조회 실패:", error);
        throw error;
    }
};

/**
 * 구독 취소 API
 * @param {number} subscriptionId - 구독 ID
 * @param {number} memberId - 회원 ID
 * @returns {Promise<Object>} 취소된 구독 정보
 */
export const cancelSubscription = async (subscriptionId, memberId) => {
    try {
        console.log('구독 취소 API 요청 시작:', { subscriptionId, memberId });
        
        const response = await apis.delete(`/subscription/${subscriptionId}/${memberId}`);
        
        console.log('구독 취소 성공:', response.data);
        return response.data;
    } catch (error) {
        console.error("구독 취소 실패:", error);
        
        // 에러 메시지 추출
        let errorMessage = "구독 취소에 실패했습니다.";
        
        if (error.response?.data) {
            if (typeof error.response.data === 'string') {
                errorMessage = error.response.data;
            } else if (error.response.data.message) {
                errorMessage = error.response.data.message;
            }
        } else if (error.message) {
            errorMessage = error.message;
        }
        
        throw new Error(errorMessage);
    }
};

