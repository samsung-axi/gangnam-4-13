import { createActions, handleActions } from "redux-actions";
import { 
    addToWishlist, 
    removeFromWishlist, 
    clearAllWishlist, 
    getWishlist, 
    moveWishlistToCart 
} from "../api/WishlistAPICalls";

// 초기 상태
const initialState = {
    wishlist: [], // 찜 목록
    wishlistIds: new Set(), // 찜한 제품 ID들의 Set (빠른 검색을 위해)
    loading: false, // 로딩 상태
    error: null, // 에러 메시지
    memberId: null // 현재 로그인한 회원 ID
};

// 액션 생성
export const {
    wishlist: {
        // 찜 목록 조회
        fetchWishlistStart,
        fetchWishlistSuccess,
        fetchWishlistFail,
        
        // 찜 추가
        addToWishlistStart,
        addToWishlistSuccess,
        addToWishlistFail,
        
        // 찜 삭제
        removeFromWishlistStart,
        removeFromWishlistSuccess,
        removeFromWishlistFail,
        
        // 찜 전체 삭제
        clearAllWishlistStart,
        clearAllWishlistSuccess,
        clearAllWishlistFail,
        
        // 찜 상품 장바구니 추가
        moveWishlistToCartStart,
        moveWishlistToCartSuccess,
        moveWishlistToCartFail,
        
        // 회원 ID 설정
        setMemberId,
        
        // 찜 상태 초기화
        resetWishlist
    },
} = createActions({
    WISHLIST: {
        // 찜 목록 조회
        FETCH_WISHLIST_START: () => ({}),
        FETCH_WISHLIST_SUCCESS: (wishlist) => wishlist,
        FETCH_WISHLIST_FAIL: (error) => error,
        
        // 찜 추가
        ADD_TO_WISHLIST_START: () => ({}),
        ADD_TO_WISHLIST_SUCCESS: (productId) => productId,
        ADD_TO_WISHLIST_FAIL: (error) => error,
        
        // 찜 삭제
        REMOVE_FROM_WISHLIST_START: () => ({}),
        REMOVE_FROM_WISHLIST_SUCCESS: (productId) => productId,
        REMOVE_FROM_WISHLIST_FAIL: (error) => error,
        
        // 찜 전체 삭제
        CLEAR_ALL_WISHLIST_START: () => ({}),
        CLEAR_ALL_WISHLIST_SUCCESS: () => ({}),
        CLEAR_ALL_WISHLIST_FAIL: (error) => error,
        
        // 찜 상품 장바구니 추가
        MOVE_WISHLIST_TO_CART_START: () => ({}),
        MOVE_WISHLIST_TO_CART_SUCCESS: () => ({}),
        MOVE_WISHLIST_TO_CART_FAIL: (error) => error,
        
        // 회원 ID 설정
        SET_MEMBER_ID: (memberId) => memberId,
        
        // 찜 상태 초기화
        RESET_WISHLIST: () => ({})
    },
});

/**
 * 찜 목록을 가져오는 Redux Thunk
 * @param {number} memberId - 회원 ID
 */
export const fetchWishlist = (memberId) => async (dispatch) => {
    try {
        console.log('찜 목록 조회 시작:', memberId);
        dispatch(fetchWishlistStart());
        
        const wishlist = await getWishlist(memberId);
        
        // 찜한 제품 ID들의 Set 생성
        const wishlistIds = new Set(wishlist.map(item => item.id));
        
        dispatch(fetchWishlistSuccess({ wishlist, wishlistIds }));
        
        console.log('찜 목록 조회 성공:', wishlist.length, '개');
    } catch (error) {
        const errorMessage = 
            error.response?.data?.message || 
            error.message || 
            "찜 목록 불러오기 실패";
            
        console.error('찜 목록 조회 실패:', errorMessage);
        dispatch(fetchWishlistFail(errorMessage));
    }
};

/**
 * 찜 추가 Redux Thunk
 * @param {number} memberId - 회원 ID
 * @param {string} productId - 제품 ID
 */
export const addToWishlistThunk = (memberId, productId) => async (dispatch) => {
    try {
        console.log('찜 추가 시작:', { memberId, productId });
        dispatch(addToWishlistStart());
        
        await addToWishlist(memberId, productId);
        
        dispatch(addToWishlistSuccess(productId));
        
        // 찜 목록을 다시 조회하여 최신 상태로 업데이트
        dispatch(fetchWishlist(memberId));
        
        console.log('찜 추가 성공:', productId);
    } catch (error) {
        const errorMessage = 
            error.response?.data?.message || 
            error.message || 
            "찜 추가 실패";
            
        console.error('찜 추가 실패:', errorMessage);
        dispatch(addToWishlistFail(errorMessage));
    }
};

/**
 * 찜 삭제 Redux Thunk
 * @param {number} memberId - 회원 ID
 * @param {string} productId - 제품 ID
 */
export const removeFromWishlistThunk = (memberId, productId) => async (dispatch) => {
    try {
        console.log('찜 삭제 시작:', { memberId, productId });
        dispatch(removeFromWishlistStart());
        
        await removeFromWishlist(memberId, productId);
        
        dispatch(removeFromWishlistSuccess(productId));
        
        // 찜 목록을 다시 조회하여 최신 상태로 업데이트
        dispatch(fetchWishlist(memberId));
        
        console.log('찜 삭제 성공:', productId);
    } catch (error) {
        const errorMessage = 
            error.response?.data?.message || 
            error.message || 
            "찜 삭제 실패";
            
        console.error('찜 삭제 실패:', errorMessage);
        dispatch(removeFromWishlistFail(errorMessage));
    }
};

/**
 * 찜 전체 삭제 Redux Thunk
 * @param {number} memberId - 회원 ID
 */
export const clearAllWishlistThunk = (memberId) => async (dispatch) => {
    try {
        console.log('찜 전체 삭제 시작:', memberId);
        dispatch(clearAllWishlistStart());
        
        await clearAllWishlist(memberId);
        
        dispatch(clearAllWishlistSuccess());
        
        // 찜 목록을 다시 조회하여 최신 상태로 업데이트
        dispatch(fetchWishlist(memberId));
        
        console.log('찜 전체 삭제 성공');
    } catch (error) {
        const errorMessage = 
            error.response?.data?.message || 
            error.message || 
            "찜 전체 삭제 실패";
            
        console.error('찜 전체 삭제 실패:', errorMessage);
        dispatch(clearAllWishlistFail(errorMessage));
    }
};

/**
 * 찜 상품 장바구니 추가 Redux Thunk
 * @param {number} memberId - 회원 ID
 */
export const moveWishlistToCartThunk = (memberId) => async (dispatch) => {
    try {
        console.log('찜 상품 장바구니 추가 시작:', memberId);
        dispatch(moveWishlistToCartStart());
        
        await moveWishlistToCart(memberId);
        
        dispatch(moveWishlistToCartSuccess());
        
        // 장바구니 목록을 다시 가져와서 알림 숫자 업데이트
        const { fetchCart } = await import('./CartModule');
        dispatch(fetchCart(memberId));
        
        console.log('찜 상품 장바구니 추가 성공');
    } catch (error) {
        const errorMessage = 
            error.response?.data?.message || 
            error.message || 
            "찜 상품 장바구니 추가 실패";
            
        console.error('찜 상품 장바구니 추가 실패:', errorMessage);
        dispatch(moveWishlistToCartFail(errorMessage));
    }
};

// 리듀서
const wishlistReducer = handleActions(
    {
        // 찜 목록 조회
        [fetchWishlistStart]: (state) => ({
            ...state,
            loading: true,
            error: null,
        }),
        [fetchWishlistSuccess]: (state, { payload }) => ({
            ...state,
            wishlist: payload.wishlist,
            wishlistIds: payload.wishlistIds,
            loading: false,
            error: null,
        }),
        [fetchWishlistFail]: (state, { payload }) => ({
            ...state,
            loading: false,
            error: payload,
        }),
        
        // 찜 추가
        [addToWishlistStart]: (state) => ({
            ...state,
            loading: true,
            error: null,
        }),
        [addToWishlistSuccess]: (state, { payload }) => ({
            ...state,
            wishlistIds: new Set([...state.wishlistIds, payload]),
            loading: false,
            error: null,
        }),
        [addToWishlistFail]: (state, { payload }) => ({
            ...state,
            loading: false,
            error: payload,
        }),
        
        // 찜 삭제
        [removeFromWishlistStart]: (state) => ({
            ...state,
            loading: true,
            error: null,
        }),
        [removeFromWishlistSuccess]: (state, { payload }) => {
            const newWishlistIds = new Set(state.wishlistIds);
            newWishlistIds.delete(payload);
            return {
                ...state,
                wishlistIds: newWishlistIds,
                wishlist: state.wishlist.filter(item => item.id !== payload),
                loading: false,
                error: null,
            };
        },
        [removeFromWishlistFail]: (state, { payload }) => ({
            ...state,
            loading: false,
            error: payload,
        }),
        
        // 찜 전체 삭제
        [clearAllWishlistStart]: (state) => ({
            ...state,
            loading: true,
            error: null,
        }),
        [clearAllWishlistSuccess]: (state) => ({
            ...state,
            wishlist: [],
            wishlistIds: new Set(),
            loading: false,
            error: null,
        }),
        [clearAllWishlistFail]: (state, { payload }) => ({
            ...state,
            loading: false,
            error: payload,
        }),
        
        // 찜 상품 장바구니 추가
        [moveWishlistToCartStart]: (state) => ({
            ...state,
            loading: true,
            error: null,
        }),
        [moveWishlistToCartSuccess]: (state) => ({
            ...state,
            loading: false,
            error: null,
        }),
        [moveWishlistToCartFail]: (state, { payload }) => ({
            ...state,
            loading: false,
            error: payload,
        }),
        
        // 회원 ID 설정
        [setMemberId]: (state, { payload }) => ({
            ...state,
            memberId: payload,
        }),
        
        // 찜 상태 초기화
        [resetWishlist]: (state) => ({
            ...state,
            wishlist: [],
            wishlistIds: new Set(),
            loading: false,
            error: null,
        }),
    },
    initialState
);

// 선택자 함수들
export const selectWishlist = (state) => state.wishlist?.wishlist || [];
export const selectWishlistIds = (state) => state.wishlist?.wishlistIds || new Set();
export const selectWishlistLoading = (state) => state.wishlist?.loading || false;
export const selectWishlistError = (state) => state.wishlist?.error || null;
export const selectMemberId = (state) => state.wishlist?.memberId || null;

export default wishlistReducer;
