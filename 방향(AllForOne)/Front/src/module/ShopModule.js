import { createActions, handleActions } from "redux-actions";
import { getAllShopPerfumes } from "../api/ShopAPICalls";

// 초기 상태
const initialState = {
    shopPerfumes: [], // 자체제작 향수 목록
    loading: false, // 로딩 상태
    error: null // 에러 메시지
};

// 액션 생성
export const {
    shop: {
        fetchShopPerfumesStart,
        fetchShopPerfumesSuccess,
        fetchShopPerfumesFail
    },
} = createActions({
    SHOP: {
        FETCH_SHOP_PERFUMES_START: () => ({}),
        FETCH_SHOP_PERFUMES_SUCCESS: (shopPerfumes) => shopPerfumes,
        FETCH_SHOP_PERFUMES_FAIL: (error) => error,
    },
});

/**
 * 자체제작 향수 목록을 가져오는 Redux Thunk
 */
export const fetchShopPerfumes = () => async (dispatch) => {
    try {
        console.log('자체제작 향수 목록 조회 시작');
        dispatch(fetchShopPerfumesStart());
        
        const shopPerfumes = await getAllShopPerfumes();
        
        dispatch(fetchShopPerfumesSuccess(shopPerfumes));
        
        console.log('자체제작 향수 목록 조회 성공:', shopPerfumes.length, '개');
    } catch (error) {
        const errorMessage = 
            error.response?.data?.message || 
            error.message || 
            "자체제작 향수 목록 불러오기 실패";
            
        console.error('자체제작 향수 목록 조회 실패:', errorMessage);
        dispatch(fetchShopPerfumesFail(errorMessage));
    }
};

// 리듀서
const shopReducer = handleActions(
    {
        [fetchShopPerfumesStart]: (state) => ({
            ...state,
            loading: true,
            error: null,
        }),
        [fetchShopPerfumesSuccess]: (state, { payload }) => ({
            ...state,
            shopPerfumes: payload,
            loading: false,
            error: null,
        }),
        [fetchShopPerfumesFail]: (state, { payload }) => ({
            ...state,
            loading: false,
            error: payload,
        }),
    },
    initialState
);

// 선택자 함수들
export const selectShopPerfumes = (state) => state.shop?.shopPerfumes || [];
export const selectShopLoading = (state) => state.shop?.loading || false;
export const selectShopError = (state) => state.shop?.error || null;

export default shopReducer;
