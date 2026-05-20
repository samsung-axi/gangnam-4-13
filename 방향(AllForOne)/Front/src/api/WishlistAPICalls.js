import apis from "./Apis";

/**
 * 백엔드 응답 데이터를 프론트엔드 구조로 변환하는 함수
 * @param {Object} wishlistResponse - 백엔드에서 받은 WishlistResponse 객체
 * @returns {Object} 프론트엔드에서 사용하는 향수 객체
 */
const transformWishlistResponse = (wishlistResponse) => {
    return {
        id: wishlistResponse.productId, // 백엔드와 동일하게 Long 타입 사용
        name: wishlistResponse.nameKr, // 한글명을 메인 이름으로 사용
        brand: wishlistResponse.brand,
        price: wishlistResponse.price || 0, // price가 없으면 0으로 기본값 설정
        image: wishlistResponse.imageUrls && wishlistResponse.imageUrls.length > 0 
            ? wishlistResponse.imageUrls[0] // 첫 번째 이미지를 메인 이미지로 사용
            : '/images/default-perfume.png', // 기본 이미지
        description: wishlistResponse.content,
        volume: wishlistResponse.sizeOption,
        grade: wishlistResponse.grade, // 부향률 정보 추가
        mainAccord: wishlistResponse.mainAccord, // 메인 어코드 정보 추가
        ingredients: wishlistResponse.ingredients, // 성분 정보 추가
        notes: {
            // 백엔드의 노트 구조를 프론트엔드 구조로 변환
            top: wishlistResponse.topNote ? wishlistResponse.topNote.split(', ').filter(note => note.trim()) : [],
            middle: wishlistResponse.middleNote ? wishlistResponse.middleNote.split(', ').filter(note => note.trim()) : [],
            base: wishlistResponse.baseNote ? wishlistResponse.baseNote.split(', ').filter(note => note.trim()) : [],
            single: wishlistResponse.singleNote ? wishlistResponse.singleNote.split(', ').filter(note => note.trim()) : []
        },
        detailImages: {
            // 백엔드의 이미지 리스트를 프론트엔드 구조로 변환
            ingredients: wishlistResponse.imageUrls && wishlistResponse.imageUrls.length > 1 
                ? wishlistResponse.imageUrls[1] 
                : wishlistResponse.imageUrls[0] || '/images/default-ingredients.png',
            process: wishlistResponse.imageUrls && wishlistResponse.imageUrls.length > 2 
                ? wishlistResponse.imageUrls[2] 
                : wishlistResponse.imageUrls[0] || '/images/default-process.png',
            brand: wishlistResponse.imageUrls && wishlistResponse.imageUrls.length > 3 
                ? wishlistResponse.imageUrls[3] 
                : wishlistResponse.imageUrls[0] || '/images/default-brand.png',
            lifestyle: wishlistResponse.imageUrls && wishlistResponse.imageUrls.length > 4 
                ? wishlistResponse.imageUrls[4] 
                : wishlistResponse.imageUrls[0] || '/images/default-lifestyle.png'
        }
    };
};

/**
 * 찜 추가 (백엔드 API 연동)
 * @param {number} memberId - 회원 ID
 * @param {string} productId - 제품 ID (문자열)
 * @returns {Promise<Object>} 응답 데이터
 */
export const addToWishlist = async (memberId, productId) => {
    try {
        console.log('찜 추가 API 요청 시작:', { memberId, productId });
        
        const requestData = {
            memberId: memberId,
            productId: productId // Long 타입 그대로 사용
        };
        
        const response = await apis.post("/wishlist", requestData);
        
        console.log('찜 추가 응답:', response.data);
        return response.data;
    } catch (error) {
        console.error("찜 추가 실패:", error);
        throw error;
    }
};

/**
 * 찜 삭제 (백엔드 API 연동)
 * @param {number} memberId - 회원 ID
 * @param {string} productId - 제품 ID (문자열)
 * @returns {Promise<Object>} 응답 데이터
 */
export const removeFromWishlist = async (memberId, productId) => {
    try {
        console.log('찜 삭제 API 요청 시작:', { memberId, productId });
        
        const response = await apis.delete(`/wishlist/${memberId}/${productId}`);
        
        console.log('찜 삭제 응답:', response.data);
        return response.data;
    } catch (error) {
        console.error("찜 삭제 실패:", error);
        throw error;
    }
};

/**
 * 찜 전체 삭제 (백엔드 API 연동)
 * @param {number} memberId - 회원 ID
 * @returns {Promise<Object>} 응답 데이터
 */
export const clearAllWishlist = async (memberId) => {
    try {
        console.log('찜 전체 삭제 API 요청 시작:', { memberId });
        
        const response = await apis.delete(`/wishlist/${memberId}`);
        
        console.log('찜 전체 삭제 응답:', response.data);
        return response.data;
    } catch (error) {
        console.error("찜 전체 삭제 실패:", error);
        throw error;
    }
};

/**
 * 찜 목록 조회 (백엔드 API 연동)
 * @param {number} memberId - 회원 ID
 * @returns {Promise<Array>} 변환된 찜 목록
 */
export const getWishlist = async (memberId) => {
    try {
        console.log('찜 목록 조회 API 요청 시작:', { memberId });
        
        const response = await apis.get(`/wishlist/${memberId}`);
        
        console.log('찜 목록 조회 응답:', response.data);
        
        // 백엔드 응답 데이터를 프론트엔드 구조로 변환
        const transformedWishlist = response.data.wishlist.map(transformWishlistResponse);
        
        console.log('찜 목록 조회 완료:', transformedWishlist.length, '개');
        return transformedWishlist;
    } catch (error) {
        console.error("찜 목록 조회 실패:", error);
        throw error;
    }
};

/**
 * 찜한 상품 전체를 장바구니에 추가 (백엔드 API 연동)
 * @param {number} memberId - 회원 ID
 * @returns {Promise<Object>} 응답 데이터
 */
export const moveWishlistToCart = async (memberId) => {
    try {
        console.log('찜 상품 장바구니 추가 API 요청 시작:', { memberId });
        
        const requestData = {
            memberId: memberId
        };
        
        const response = await apis.post("/wishlist/cart", requestData);
        
        console.log('찜 상품 장바구니 추가 응답:', response.data);
        return response.data;
    } catch (error) {
        console.error("찜 상품 장바구니 추가 실패:", error);
        throw error;
    }
};
