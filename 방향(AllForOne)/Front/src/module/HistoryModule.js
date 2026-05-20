import { createActions, handleActions } from "redux-actions";
import { createScentCardAPI, fetchHistoryAPI } from "../api/HistoryAPICalls"; // 향기 카드 API

// 초기 상태
const initialState = {
    scentCard: null, // 생성된 향기 카드 데이터
    historyData: [],      // 히스토리 데이터
    loading: false,  // 로딩 상태
    error: null,     // 에러 메시지
};

// 액션 생성
export const {
    history: {
        createScentCardStart,
        createScentCardSuccess,
        createScentCardFail,
        fetchHistoryStart,
        fetchHistorySuccess,
        fetchHistoryFail,
    },
} = createActions({
    HISTORY: {
        CREATE_SCENT_CARD_START: () => { },
        CREATE_SCENT_CARD_SUCCESS: (scentCard) => scentCard,
        CREATE_SCENT_CARD_FAIL: (error) => error,
        FETCH_HISTORY_START: () => { },
        FETCH_HISTORY_SUCCESS: (historyData) => historyData,
        FETCH_HISTORY_FAIL: (error) => error,
    },
});

// 향기 카드 생성
export const createScentCard = (chatId) => async (dispatch) => {
    try {
        dispatch(createScentCardStart());

        const scentCard = await createScentCardAPI(chatId); // HistoryAPICalls.js API 호출
        dispatch(createScentCardSuccess(scentCard));
        return scentCard;
    } catch (error) {
        dispatch(createScentCardFail(error.message || "향기 카드 생성 중 오류 발생"));
        throw error;
    }
};

// 향기 카드 조회
export const fetchHistory = (memberId) => async (dispatch) => {
    try {
        dispatch(fetchHistoryStart());
        const historyData = await fetchHistoryAPI(memberId); // HistoryAPICalls.js API 호출
        dispatch(fetchHistorySuccess(historyData));
        return historyData;
    } catch (error) {
        dispatch(fetchHistoryFail(error.message || "히스토리 데이터를 불러오는 중 오류 발생"));
        throw error;
    }
};

const historyReducer = handleActions(
    {
        [createScentCardStart]: (state) => ({
            ...state,
            loading: true,
            error: null,
        }),
        [createScentCardSuccess]: (state, { payload }) => ({
            ...state,
            loading: false,
            scentCard: payload,
        }),
        [createScentCardFail]: (state, { payload }) => ({
            ...state,
            loading: false,
            error: payload,
        }),
        // 향기 카드 관리
        [fetchHistoryStart]: (state) => ({
            ...state,
            loading: true,
            error: null,
        }),
        [fetchHistorySuccess]: (state, { payload }) => ({
            ...state,
            loading: false,
            historyData: payload,
        }),
        [fetchHistoryFail]: (state, { payload }) => ({
            ...state,
            loading: false,
            error: payload,
        }),
    },
    initialState
);

export default historyReducer;


