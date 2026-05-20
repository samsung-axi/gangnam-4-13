import apis from "./Apis";

// 특정 향수의 리뷰 목록 조회
export const getReviewsByProductId = async (productId) => {
    try {
        // memberId가 있는 경우 (로그인 상태)
        const auth = JSON.parse(localStorage.getItem('auth'));
        const memberId = auth?.id;

        // QueryParam 방식으로 변경
        const response = await apis.get('/reviews', {
            params: {
                productId: productId,
                memberId: memberId || null
            }
        });
        
        console.log("Reviews response data:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error fetching reviews:", error);
        throw error;
    }
};

// 특정 회원의 리뷰 목록 조회
export const getReviewsByMemberId = async (memberId) => {
    try {
        // memberId 유효성 검사
        if (!memberId) {
            throw new Error('Invalid memberId');
        }

        console.log('Requesting reviews with memberId:', memberId);

        const response = await apis.get(`/reviews/member/${memberId}`);
        console.log("Member reviews response:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error fetching member reviews:", error);
        throw error;
    }
};

// 리뷰 생성
export const createReview = async (reviewData) => {
    try {
        console.log('Creating review with data:', reviewData);
        const response = await apis.post("/reviews", {
            memberId: reviewData.memberId,
            productId: reviewData.productId,
            content: reviewData.content
        });
        console.log("Review creation response:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error creating review:", error);
        throw error;
    }
};

// 리뷰 수정
export const updateReview = async (reviewData) => {
    try {
        console.log('Updating review with data:', reviewData); // 데이터 확인용 로그
        const response = await apis.put(`/reviews`, {
            content: reviewData.content,
            reviewId: reviewData.id
        });
        console.log('Update response:', response.data); // 응답 확인용 로그
        return response.data;
    } catch (error) {
        console.error("Error updating review:", error);
        throw error;
    }
};

// 리뷰 삭제
export const deleteReview = async (reviewId) => {
    try {
        const response = await apis.delete(`/reviews/${reviewId}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting review:", error);
        throw error;
    }
};

// 리뷰 요약 조회
export const getReviewSummary = async (productId) => {
    try {
        // productId 유효성 검사 추가
        if (!productId) {
            throw new Error('Invalid productId');
        }

        // GET 메소드로 변경
        const response = await apis.get(`/reviews/summary/${productId}`);
        
        // 응답 데이터 형식 확인 및 처리
        if (response.data === null || response.data === undefined) {
            return "리뷰 요약 정보가 없습니다.";
        }

        console.log("Review summary response:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error fetching review summary:", error);
        // 에러 발생 시 기본 메시지 반환
        return "리뷰 요약을 불러오는데 실패했습니다.";
    }
};