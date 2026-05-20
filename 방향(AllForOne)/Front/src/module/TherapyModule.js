import { createActions, handleActions } from "redux-actions";
import { responseTherapy } from "../api/TherapyAPICalls";

// 초기 상태
const initialState = {
    recommendations: [],
    usageRoutine: "",
    imageUrls: [],
    therapyTitle: "",
    loading: false,
    error: null
};

// 액션 생성
export const {
    therapy: {
        fetchTherapyStart,
        fetchTherapySuccess,
        fetchTherapyFail
    }
} = createActions({
    THERAPY: {
        FETCH_THERAPY_START: () => {},
        FETCH_THERAPY_SUCCESS: (response) => response,
        FETCH_THERAPY_FAIL: (error) => error
    }
});

// 디퓨저 추천 요청
export const fetchTherapyResponse = (userInput) => async (dispatch) => {
    try {
        dispatch(fetchTherapyStart());
        const response = await responseTherapy(userInput);
        dispatch(fetchTherapySuccess(response));
        return response;
    } catch (error) {
        dispatch(fetchTherapyFail(error.message || "디퓨저 추천 요청 중 오류 발생"));
    }
};

// 리듀서
const therapyReducer = handleActions(
    {
        [fetchTherapyStart]: (state) => ({
            ...state,
            loading: true,
            error: null
        }),
        [fetchTherapySuccess]: (state, { payload }) => ({
            ...state,
            loading: false,
            recommendations: payload.recommendations,
            usageRoutine: payload.usageRoutine,
            imageUrls: payload.imageUrls,
            therapyTitle: payload.therapyTitle
        }),
        [fetchTherapyFail]: (state, { payload }) => ({
            ...state,
            loading: false,
            error: payload
        })
    },
    initialState
);

// 셀렉터
export const selectRecommendations = (state) => state.therapy.recommendations;
export const selectUsageRoutine = (state) => state.therapy.usageRoutine;
export const selectImageUrls = (state) => state.therapy.imageUrls;
export const selectTherapyTitle = (state) => state.therapy.therapyTitle;
export const selectLoading = (state) => state.therapy.loading;
export const selectError = (state) => state.therapy.error;

export default therapyReducer;