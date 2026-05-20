import apis from "./Apis";

/**
 * 백엔드 응답 데이터를 프론트엔드 구조로 변환하는 함수
 * @param {Object} cartResponse - 백엔드에서 받은 CartResponse 객체
 * @returns {Object} 프론트엔드에서 사용하는 장바구니 아이템 객체
 */
const transformCartResponse = (cartResponse) => {
    return {
        id: cartResponse.productId, // 백엔드와 동일하게 Long 타입 사용
        name: cartResponse.nameKr, // 한글명을 메인 이름으로 사용
        brand: cartResponse.brand,
        price: cartResponse.price || 0, // price가 없으면 0으로 기본값 설정
        image: cartResponse.imageUrls && cartResponse.imageUrls.length > 0 
            ? cartResponse.imageUrls[0] // 첫 번째 이미지를 메인 이미지로 사용
            : '/images/default-perfume.png', // 기본 이미지
        description: cartResponse.content,
        volume: cartResponse.sizeOption,
        grade: cartResponse.grade, // 부향률 정보 추가
        mainAccord: cartResponse.mainAccord, // 메인 어코드 정보 추가
        ingredients: cartResponse.ingredients, // 성분 정보 추가
        quantity: cartResponse.quantity, // 수량 정보
        notes: {
            // 기본 노트 구조 (장바구니에서는 노트 정보가 필요하지 않을 수 있음)
            top: [],
            middle: [],
            base: [],
            single: []
        },
        detailImages: {
            // 백엔드의 이미지 리스트를 프론트엔드 구조로 변환
            ingredients: cartResponse.imageUrls && cartResponse.imageUrls.length > 1 
                ? cartResponse.imageUrls[1] 
                : cartResponse.imageUrls[0] || '/images/default-ingredients.png',
            process: cartResponse.imageUrls && cartResponse.imageUrls.length > 2 
                ? cartResponse.imageUrls[2] 
                : cartResponse.imageUrls[0] || '/images/default-process.png',
            brand: cartResponse.imageUrls && cartResponse.imageUrls.length > 3 
                ? cartResponse.imageUrls[3] 
                : cartResponse.imageUrls[0] || '/images/default-brand.png',
            lifestyle: cartResponse.imageUrls && cartResponse.imageUrls.length > 4 
                ? cartResponse.imageUrls[4] 
                : cartResponse.imageUrls[0] || '/images/default-lifestyle.png'
        }
    };
};

/**
 * 장바구니에 제품 추가 (백엔드 API 연동)
 * @param {number} memberId - 회원 ID
 * @param {string} productId - 제품 ID (문자열)
 * @param {number} quantity - 수량 (기본값: 1)
 * @returns {Promise<Object>} 응답 데이터
 */
export const addToCart = async (memberId, productId, quantity = 1) => {
    try {
        console.log('장바구니 추가 API 요청 시작:', { memberId, productId, quantity });
        
        const requestData = {
            memberId: memberId,
            productId: productId, // Long 타입 그대로 사용
            quantity: quantity
        };
        
        const response = await apis.post("/cart", requestData);
        
        console.log('장바구니 추가 응답:', response.data);
        return response.data;
    } catch (error) {
        console.error("장바구니 추가 실패:", error);
        throw error;
    }
};

/**
 * 장바구니에서 제품 삭제 (백엔드 API 연동)
 * @param {number} memberId - 회원 ID
 * @param {string} productId - 제품 ID (문자열)
 * @returns {Promise<Object>} 응답 데이터
 */
export const removeFromCart = async (memberId, productId) => {
    try {
        console.log('장바구니 삭제 API 요청 시작:', { memberId, productId });
        
        const response = await apis.delete(`/cart/${memberId}/${productId}`);
        
        console.log('장바구니 삭제 응답:', response.data);
        return response.data;
    } catch (error) {
        console.error("장바구니 삭제 실패:", error);
        throw error;
    }
};

/**
 * 장바구니 전체 삭제 (백엔드 API 연동)
 * @param {number} memberId - 회원 ID
 * @returns {Promise<Object>} 응답 데이터
 */
export const clearAllCart = async (memberId) => {
    try {
        console.log('장바구니 전체 삭제 API 요청 시작:', { memberId });
        
        const response = await apis.delete(`/cart/${memberId}`);
        
        console.log('장바구니 전체 삭제 응답:', response.data);
        return response.data;
    } catch (error) {
        console.error("장바구니 전체 삭제 실패:", error);
        throw error;
    }
};

/**
 * 장바구니 수량 수정 (백엔드 API 연동)
 * @param {number} memberId - 회원 ID
 * @param {string} productId - 제품 ID (문자열)
 * @param {number} quantity - 새로운 수량
 * @returns {Promise<Object>} 응답 데이터
 */
export const updateCartQuantity = async (memberId, productId, quantity) => {
    try {
        console.log('장바구니 수량 수정 API 요청 시작:', { memberId, productId, quantity });
        
        const requestData = {
            memberId: memberId,
            productId: productId, // Long 타입 그대로 사용
            quantity: quantity
        };
        
        const response = await apis.put("/cart", requestData);
        
        console.log('장바구니 수량 수정 응답:', response.data);
        return response.data;
    } catch (error) {
        console.error("장바구니 수량 수정 실패:", error);
        throw error;
    }
};

/**
 * 장바구니 목록 조회 (백엔드 API 연동)
 * @param {number} memberId - 회원 ID
 * @returns {Promise<Array>} 변환된 장바구니 목록
 */
export const getCart = async (memberId) => {
    try {
        console.log('장바구니 목록 조회 API 요청 시작:', { memberId });
        
        const response = await apis.get(`/cart/${memberId}`);
        
        console.log('장바구니 목록 조회 응답:', response.data);
        
        // 백엔드 응답 데이터를 프론트엔드 구조로 변환
        const transformedCart = response.data.cart.map(transformCartResponse);
        
        console.log('장바구니 목록 조회 완료:', transformedCart.length, '개');
        return transformedCart;
    } catch (error) {
        console.error("장바구니 목록 조회 실패:", error);
        throw error;
    }
};
