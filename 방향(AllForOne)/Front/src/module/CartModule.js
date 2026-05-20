import { createActions, handleActions } from "redux-actions";
import { 
    addToCart, 
    removeFromCart, 
    clearAllCart, 
    updateCartQuantity,
    getCart 
} from "../api/CartAPICalls";

// 초기 상태
const initialState = {
    cart: [], // 장바구니 목록
    cartCount: 0, // 장바구니 총 아이템 개수 (수량 포함)
    loading: false, // 로딩 상태
    error: null, // 에러 메시지
    memberId: null // 현재 로그인한 회원 ID
};

// 액션 생성
export const {
    cart: {
        // 장바구니 목록 조회
        fetchCartStart,
        fetchCartSuccess,
        fetchCartFail,
        
        // 장바구니 추가
        addToCartStart,
        addToCartSuccess,
        addToCartFail,
        
        // 장바구니 삭제
        removeFromCartStart,
        removeFromCartSuccess,
        removeFromCartFail,
        
        // 장바구니 전체 삭제
        clearAllCartStart,
        clearAllCartSuccess,
        clearAllCartFail,
        
        // 장바구니 수량 수정
        updateCartQuantityStart,
        updateCartQuantitySuccess,
        updateCartQuantityFail,
        
        // 회원 ID 설정
        setMemberId,
        
        // 장바구니 상태 초기화
        resetCart
    },
} = createActions({
    CART: {
        // 장바구니 목록 조회
        FETCH_CART_START: () => ({}),
        FETCH_CART_SUCCESS: (cart) => cart,
        FETCH_CART_FAIL: (error) => error,
        
        // 장바구니 추가
        ADD_TO_CART_START: () => ({}),
        ADD_TO_CART_SUCCESS: (cartItem) => cartItem,
        ADD_TO_CART_FAIL: (error) => error,
        
        // 장바구니 삭제
        REMOVE_FROM_CART_START: () => ({}),
        REMOVE_FROM_CART_SUCCESS: (productId) => productId,
        REMOVE_FROM_CART_FAIL: (error) => error,
        
        // 장바구니 전체 삭제
        CLEAR_ALL_CART_START: () => ({}),
        CLEAR_ALL_CART_SUCCESS: () => ({}),
        CLEAR_ALL_CART_FAIL: (error) => error,
        
        // 장바구니 수량 수정
        UPDATE_CART_QUANTITY_START: () => ({}),
        UPDATE_CART_QUANTITY_SUCCESS: (cartItem) => cartItem,
        UPDATE_CART_QUANTITY_FAIL: (error) => error,
        
        // 회원 ID 설정
        SET_MEMBER_ID: (memberId) => memberId,
        
        // 장바구니 상태 초기화
        RESET_CART: () => ({})
    },
});

/**
 * 장바구니 목록을 가져오는 Redux Thunk
 * @param {number} memberId - 회원 ID
 */
export const fetchCart = (memberId) => async (dispatch) => {
    try {
        console.log('장바구니 목록 조회 시작:', memberId);
        dispatch(fetchCartStart());
        
        const cart = await getCart(memberId);
        
        // 장바구니 총 아이템 개수 계산 (수량 포함)
        const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
        
        dispatch(fetchCartSuccess({ cart, cartCount }));
        
        console.log('장바구니 목록 조회 성공:', cart.length, '개, 총 수량:', cartCount);
    } catch (error) {
        const errorMessage = 
            error.response?.data?.message || 
            error.message || 
            "장바구니 목록 불러오기 실패";
            
        console.error('장바구니 목록 조회 실패:', errorMessage);
        dispatch(fetchCartFail(errorMessage));
    }
};

/**
 * 장바구니 추가 Redux Thunk
 * @param {number} memberId - 회원 ID
 * @param {string} productId - 제품 ID
 * @param {number} quantity - 수량 (기본값: 1)
 */
export const addToCartThunk = (memberId, productId, quantity = 1) => async (dispatch) => {
    try {
        console.log('장바구니 추가 시작:', { memberId, productId, quantity });
        dispatch(addToCartStart());
        
        await addToCart(memberId, productId, quantity);
        
        // 장바구니 목록을 다시 조회하여 최신 상태로 업데이트
        dispatch(fetchCart(memberId));
        
        // 찜 목록도 다시 조회하여 찜 상태 업데이트 (찜에서 장바구니로 이동한 경우)
        const { fetchWishlist } = await import('./WishlistModule');
        dispatch(fetchWishlist(memberId));
        
        console.log('장바구니 추가 성공:', productId);
    } catch (error) {
        const errorMessage = 
            error.response?.data?.message || 
            error.message || 
            "장바구니 추가 실패";
            
        console.error('장바구니 추가 실패:', errorMessage);
        dispatch(addToCartFail(errorMessage));
    }
};

/**
 * 장바구니 삭제 Redux Thunk
 * @param {number} memberId - 회원 ID
 * @param {string} productId - 제품 ID
 */
export const removeFromCartThunk = (memberId, productId) => async (dispatch) => {
    try {
        console.log('장바구니 삭제 시작:', { memberId, productId });
        dispatch(removeFromCartStart());
        
        await removeFromCart(memberId, productId);
        
        // 장바구니 목록을 다시 조회하여 최신 상태로 업데이트
        dispatch(fetchCart(memberId));
        
        // 찜 목록도 다시 조회하여 찜 상태 업데이트
        const { fetchWishlist } = await import('./WishlistModule');
        dispatch(fetchWishlist(memberId));
        
        console.log('장바구니 삭제 성공:', productId);
    } catch (error) {
        const errorMessage = 
            error.response?.data?.message || 
            error.message || 
            "장바구니 삭제 실패";
            
        console.error('장바구니 삭제 실패:', errorMessage);
        dispatch(removeFromCartFail(errorMessage));
    }
};

/**
 * 장바구니 전체 삭제 Redux Thunk
 * @param {number} memberId - 회원 ID
 */
export const clearAllCartThunk = (memberId) => async (dispatch) => {
    try {
        console.log('장바구니 전체 삭제 시작:', memberId);
        dispatch(clearAllCartStart());
        
        await clearAllCart(memberId);
        
        dispatch(clearAllCartSuccess());
        
        // 찜 목록도 다시 조회하여 찜 상태 업데이트
        const { fetchWishlist } = await import('./WishlistModule');
        dispatch(fetchWishlist(memberId));
        
        console.log('장바구니 전체 삭제 성공');
    } catch (error) {
        const errorMessage = 
            error.response?.data?.message || 
            error.message || 
            "장바구니 전체 삭제 실패";
            
        console.error('장바구니 전체 삭제 실패:', errorMessage);
        dispatch(clearAllCartFail(errorMessage));
    }
};

/**
 * 장바구니 수량 수정 Redux Thunk
 * @param {number} memberId - 회원 ID
 * @param {string} productId - 제품 ID
 * @param {number} quantity - 새로운 수량
 */
export const updateCartQuantityThunk = (memberId, productId, quantity) => async (dispatch) => {
    try {
        console.log('장바구니 수량 수정 시작:', { memberId, productId, quantity });
        dispatch(updateCartQuantityStart());
        
        await updateCartQuantity(memberId, productId, quantity);
        
        // 장바구니 목록을 다시 조회하여 최신 상태로 업데이트
        dispatch(fetchCart(memberId));
        
        // 찜 목록도 다시 조회하여 찜 상태 업데이트
        const { fetchWishlist } = await import('./WishlistModule');
        dispatch(fetchWishlist(memberId));
        
        console.log('장바구니 수량 수정 성공:', productId, '수량:', quantity);
    } catch (error) {
        const errorMessage = 
            error.response?.data?.message || 
            error.message || 
            "장바구니 수량 수정 실패";
            
        console.error('장바구니 수량 수정 실패:', errorMessage);
        dispatch(updateCartQuantityFail(errorMessage));
    }
};

// 리듀서
const cartReducer = handleActions(
    {
        // 장바구니 목록 조회
        [fetchCartStart]: (state) => ({
            ...state,
            loading: true,
            error: null,
        }),
        [fetchCartSuccess]: (state, { payload }) => ({
            ...state,
            cart: payload.cart,
            cartCount: payload.cartCount,
            loading: false,
            error: null,
        }),
        [fetchCartFail]: (state, { payload }) => ({
            ...state,
            loading: false,
            error: payload,
        }),
        
        // 장바구니 추가
        [addToCartStart]: (state) => ({
            ...state,
            loading: true,
            error: null,
        }),
        [addToCartSuccess]: (state, { payload }) => ({
            ...state,
            loading: false,
            error: null,
        }),
        [addToCartFail]: (state, { payload }) => ({
            ...state,
            loading: false,
            error: payload,
        }),
        
        // 장바구니 삭제
        [removeFromCartStart]: (state) => ({
            ...state,
            loading: true,
            error: null,
        }),
        [removeFromCartSuccess]: (state, { payload }) => ({
            ...state,
            loading: false,
            error: null,
        }),
        [removeFromCartFail]: (state, { payload }) => ({
            ...state,
            loading: false,
            error: payload,
        }),
        
        // 장바구니 전체 삭제
        [clearAllCartStart]: (state) => ({
            ...state,
            loading: true,
            error: null,
        }),
        [clearAllCartSuccess]: (state) => ({
            ...state,
            cart: [],
            cartCount: 0,
            loading: false,
            error: null,
        }),
        [clearAllCartFail]: (state, { payload }) => ({
            ...state,
            loading: false,
            error: payload,
        }),
        
        // 장바구니 수량 수정
        [updateCartQuantityStart]: (state) => ({
            ...state,
            loading: true,
            error: null,
        }),
        [updateCartQuantitySuccess]: (state, { payload }) => ({
            ...state,
            loading: false,
            error: null,
        }),
        [updateCartQuantityFail]: (state, { payload }) => ({
            ...state,
            loading: false,
            error: payload,
        }),
        
        // 회원 ID 설정
        [setMemberId]: (state, { payload }) => ({
            ...state,
            memberId: payload,
        }),
        
        // 장바구니 상태 초기화
        [resetCart]: (state) => ({
            ...state,
            cart: [],
            cartCount: 0,
            loading: false,
            error: null,
        }),
    },
    initialState
);

// 선택자 함수들
export const selectCart = (state) => state.cart?.cart || [];
export const selectCartCount = (state) => state.cart?.cartCount || 0;
export const selectCartLoading = (state) => state.cart?.loading || false;
export const selectCartError = (state) => state.cart?.error || null;
export const selectCartMemberId = (state) => state.cart?.memberId || null;

export default cartReducer;
