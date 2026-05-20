import { createActions, handleActions } from "redux-actions";
import { 
    createSubscription, 
    getSubscriptionsByMember, 
    cancelSubscription
} from "../api/SubscriptionAPICalls";

// 초기 상태
const initialState = {
    subscriptions: [], // 구독 목록
    currentSubscription: null, // 현재 조회 중인 구독 정보
    loading: false, // 로딩 상태
    error: null // 에러 메시지
};

// 액션 생성
export const {
    subscription: {
        createSubscriptionStart,
        createSubscriptionSuccess,
        createSubscriptionFail,
        fetchSubscriptionsStart,
        fetchSubscriptionsSuccess,
        fetchSubscriptionsFail,
        cancelSubscriptionStart,
        cancelSubscriptionSuccess,
        cancelSubscriptionFail
    },
} = createActions({
    SUBSCRIPTION: {
        CREATE_SUBSCRIPTION_START: () => ({}),
        CREATE_SUBSCRIPTION_SUCCESS: (subscription) => subscription,
        CREATE_SUBSCRIPTION_FAIL: (error) => error,
        FETCH_SUBSCRIPTIONS_START: () => ({}),
        FETCH_SUBSCRIPTIONS_SUCCESS: (subscriptions) => subscriptions,
        FETCH_SUBSCRIPTIONS_FAIL: (error) => error,
        CANCEL_SUBSCRIPTION_START: () => ({}),
        CANCEL_SUBSCRIPTION_SUCCESS: (subscriptionId) => subscriptionId,
        CANCEL_SUBSCRIPTION_FAIL: (error) => error,
    },
});

/**
 * 구독 생성 Redux Thunk
 */
export const createSubscriptionThunk = (memberId, productId) => async (dispatch) => {
    try {
        console.log('구독 생성 시작:', { memberId, productId });
        dispatch(createSubscriptionStart());
        
        const subscription = await createSubscription(memberId, productId);
        
        dispatch(createSubscriptionSuccess(subscription));
        console.log('구독 생성 성공:', subscription);
        
        return subscription;
    } catch (error) {
        // 에러 메시지를 정확히 추출
        let errorMessage = "구독 생성에 실패했습니다.";
        
        if (error.message) {
            errorMessage = error.message;
        }
        
        // "이미 구독" 메시지 체크
        if (errorMessage.includes('이미 구독')) {
            errorMessage = '이미 구독 중인 상품입니다.';
        }
            
        console.error('구독 생성 실패:', errorMessage);
        dispatch(createSubscriptionFail(errorMessage));
        
        // Error 객체가 아닌 메시지 문자열만 throw
        throw new Error(errorMessage);
    }
};

/**
 * 구독 목록 조회 Redux Thunk
 */
export const fetchSubscriptions = (memberId) => async (dispatch) => {
    try {
        console.log('구독 목록 조회 시작, memberId:', memberId);
        dispatch(fetchSubscriptionsStart());
        
        const subscriptions = await getSubscriptionsByMember(memberId);
        
        dispatch(fetchSubscriptionsSuccess(subscriptions));
        console.log('구독 목록 조회 성공:', subscriptions.length, '개');
    } catch (error) {
        const errorMessage = 
            error.response?.data?.message || 
            error.message || 
            "구독 목록 불러오기 실패";
            
        console.error('구독 목록 조회 실패:', errorMessage);
        dispatch(fetchSubscriptionsFail(errorMessage));
    }
};

/**
 * 구독 취소 Redux Thunk
 */
export const cancelSubscriptionThunk = (subscriptionId, memberId) => async (dispatch) => {
    try {
        console.log('구독 취소 시작:', { subscriptionId, memberId });
        dispatch(cancelSubscriptionStart());
        
        await cancelSubscription(subscriptionId, memberId);
        
        dispatch(cancelSubscriptionSuccess(subscriptionId));
        console.log('구독 취소 성공');
    } catch (error) {
        // 에러 메시지를 정확히 추출
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
            
        console.error('구독 취소 실패:', errorMessage);
        dispatch(cancelSubscriptionFail(errorMessage));
        throw new Error(errorMessage);
    }
};


// 리듀서
const subscriptionReducer = handleActions(
    {
        [createSubscriptionStart]: (state) => ({
            ...state,
            loading: true,
            error: null,
        }),
        [createSubscriptionSuccess]: (state, { payload }) => ({
            ...state,
            currentSubscription: payload,
            subscriptions: [...state.subscriptions, payload],
            loading: false,
            error: null,
        }),
        [createSubscriptionFail]: (state, { payload }) => ({
            ...state,
            loading: false,
            error: payload,
        }),
        [fetchSubscriptionsStart]: (state) => ({
            ...state,
            loading: true,
            error: null,
        }),
        [fetchSubscriptionsSuccess]: (state, { payload }) => ({
            ...state,
            subscriptions: payload,
            loading: false,
            error: null,
        }),
        [fetchSubscriptionsFail]: (state, { payload }) => ({
            ...state,
            loading: false,
            error: payload,
        }),
        [cancelSubscriptionStart]: (state) => ({
            ...state,
            loading: true,
            error: null,
        }),
        [cancelSubscriptionSuccess]: (state, { payload }) => ({
            ...state,
            subscriptions: state.subscriptions.filter(sub => sub.subscriptionId !== payload),
            loading: false,
            error: null,
        }),
        [cancelSubscriptionFail]: (state, { payload }) => ({
            ...state,
            loading: false,
            error: payload,
        }),
    },
    initialState
);

// 선택자 함수들
export const selectSubscriptions = (state) => state.subscription?.subscriptions || [];
export const selectCurrentSubscription = (state) => state.subscription?.currentSubscription || null;
export const selectSubscriptionLoading = (state) => state.subscription?.loading || false;
export const selectSubscriptionError = (state) => state.subscription?.error || null;

export default subscriptionReducer;

