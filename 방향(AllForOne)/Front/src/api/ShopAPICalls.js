import apis from "./Apis";

/**
 * 백엔드 응답 데이터를 프론트엔드 구조로 변환하는 함수
 * @param {Object} perfumeResponse - 백엔드에서 받은 PerfumeResponse 객체
 * @returns {Object} 프론트엔드에서 사용하는 향수 객체
 */
const transformPerfumeResponse = (perfumeResponse) => {
    return {
        id: perfumeResponse.id, // 백엔드와 동일하게 Long 타입 사용
        name: perfumeResponse.nameKr, // 한글명을 메인 이름으로 사용
        brand: perfumeResponse.brand,
        price: perfumeResponse.price || 0, // price가 없으면 0으로 기본값 설정
        image: (perfumeResponse.imageUrlList && perfumeResponse.imageUrlList.length > 0) || (perfumeResponse.imageUrls && perfumeResponse.imageUrls.length > 0)
            ? (perfumeResponse.imageUrlList ? perfumeResponse.imageUrlList[0] : perfumeResponse.imageUrls[0]) // 첫 번째 이미지를 메인 이미지로 사용
            : '/images/default-perfume.png', // 기본 이미지
        description: perfumeResponse.content,
        volume: perfumeResponse.sizeOption,
        grade: perfumeResponse.grade, // 부향률 정보 추가
        mainAccord: perfumeResponse.mainAccord, // 메인 어코드 정보 추가
        ingredients: perfumeResponse.ingredients, // 성분 정보 추가
        notes: {
            // 백엔드의 노트 구조를 프론트엔드 구조로 변환
            top: perfumeResponse.topNote ? perfumeResponse.topNote.split(', ').filter(note => note.trim()) : [],
            middle: perfumeResponse.middleNote ? perfumeResponse.middleNote.split(', ').filter(note => note.trim()) : [],
            base: perfumeResponse.baseNote ? perfumeResponse.baseNote.split(', ').filter(note => note.trim()) : [],
            single: perfumeResponse.singleNote ? perfumeResponse.singleNote.split(', ').filter(note => note.trim()) : []
        },
        detailImages: {
            // 백엔드의 이미지 리스트를 프론트엔드 구조로 변환
            ingredients: (perfumeResponse.imageUrlList && perfumeResponse.imageUrlList.length > 1) || (perfumeResponse.imageUrls && perfumeResponse.imageUrls.length > 1)
                ? (perfumeResponse.imageUrlList ? perfumeResponse.imageUrlList[1] : perfumeResponse.imageUrls[1])
                : (perfumeResponse.imageUrlList ? perfumeResponse.imageUrlList[0] : perfumeResponse.imageUrls?.[0]) || '/images/default-ingredients.png',
            process: (perfumeResponse.imageUrlList && perfumeResponse.imageUrlList.length > 2) || (perfumeResponse.imageUrls && perfumeResponse.imageUrls.length > 2)
                ? (perfumeResponse.imageUrlList ? perfumeResponse.imageUrlList[2] : perfumeResponse.imageUrls[2])
                : (perfumeResponse.imageUrlList ? perfumeResponse.imageUrlList[0] : perfumeResponse.imageUrls?.[0]) || '/images/default-process.png',
            brand: (perfumeResponse.imageUrlList && perfumeResponse.imageUrlList.length > 3) || (perfumeResponse.imageUrls && perfumeResponse.imageUrls.length > 3)
                ? (perfumeResponse.imageUrlList ? perfumeResponse.imageUrlList[3] : perfumeResponse.imageUrls[3])
                : (perfumeResponse.imageUrlList ? perfumeResponse.imageUrlList[0] : perfumeResponse.imageUrls?.[0]) || '/images/default-brand.png',
            lifestyle: (perfumeResponse.imageUrlList && perfumeResponse.imageUrlList.length > 4) || (perfumeResponse.imageUrls && perfumeResponse.imageUrls.length > 4)
                ? (perfumeResponse.imageUrlList ? perfumeResponse.imageUrlList[4] : perfumeResponse.imageUrls[4])
                : (perfumeResponse.imageUrlList ? perfumeResponse.imageUrlList[0] : perfumeResponse.imageUrls?.[0]) || '/images/default-lifestyle.png'
        }
    };
};

/**
 * 자체제작 향수 목록 조회 (백엔드 API 연동)
 * @returns {Promise<Array>} 변환된 향수 목록
 */
export const getAllShopPerfumes = async () => {
    try {
        console.log('자체제작 향수 목록 API 요청 시작');
        
        // 백엔드 API 호출 (자체제작 향수 전용 엔드포인트)
        const response = await apis.get("/products/product");
        
        console.log('자체제작 향수 응답 데이터:', response.data);
        console.log('자체제작 향수 개수:', response.data.length);
        
        // 백엔드 응답 데이터를 프론트엔드 구조로 변환
        const transformedPerfumes = response.data.map(transformPerfumeResponse);

        console.log('자체제작 향수 목록 조회 완료:', transformedPerfumes.length, '개');
        return transformedPerfumes;
    } catch (error) {
        console.error("자체제작 향수 목록 조회 실패:", error);
        throw error;
    }
};

/**
 * 개별 향수 상세 정보 조회 (백엔드 API 연동)
 * @param {number} productId - 향수 ID
 * @returns {Promise<Object>} 변환된 향수 상세 정보
 */
export const getPerfumeById = async (productId) => {
    try {
        console.log('향수 상세 정보 API 요청 시작, ID:', productId);
        
        // 백엔드 API 호출 (개별 향수 상세 정보)
        const response = await apis.get(`/products/product?id=${productId}`);
        
        console.log('향수 상세 정보 응답 데이터:', response.data);
        
        // 원본 데이터 그대로 반환 (ShopPerfumeDetail.js에서 직접 변환)
        console.log('향수 상세 정보 조회 완료:', response.data);
        return response.data;
    } catch (error) {
        console.error("향수 상세 정보 조회 실패:", error);
        throw error;
    }
};

