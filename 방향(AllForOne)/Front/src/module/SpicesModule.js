import { createActions, handleActions } from "redux-actions";
import { getAllSpices, createSpice, modifySpice, deleteSpice } from "../api/SpicesAPICalls";

// 초기 상태
const initialState = {
    spices: [],
    loading: false,
    error: null,
};

// 액션 생성
export const {
    spices: { 
        fetchSpicesStart, fetchSpicesSuccess, fetchSpicesFail,
        createSpicesStart, createSpicesSuccess, createSpicesFail,
        modifySpicesStart, modifySpicesSuccess, modifySpicesFail,
        deleteSpicesStart, deleteSpicesSuccess, deleteSpicesFail
    },
} = createActions({
    SPICES: {
        FETCH_SPICES_START: () => {},
        FETCH_SPICES_SUCCESS: (spices) => spices,
        FETCH_SPICES_FAIL: (error) => error,
        
        CREATE_SPICES_START: () => {},
        CREATE_SPICES_SUCCESS: (spice) => spice,
        CREATE_SPICES_FAIL: (error) => error,
        
        MODIFY_SPICES_START: () => {},
        MODIFY_SPICES_SUCCESS: (spice) => spice,
        MODIFY_SPICES_FAIL: (error) => error,
        
        DELETE_SPICES_START: () => {},
        DELETE_SPICES_SUCCESS: (spiceId) => spiceId,
        DELETE_SPICES_FAIL: (error) => error,
    },
});

// Thunk 액션 생성자
export const fetchSpices = () => async (dispatch) => {
    try {
        dispatch(fetchSpicesStart());
        const spices = await getAllSpices();
        dispatch(fetchSpicesSuccess(spices));
    } catch (error) {
        const errorMessage = error.response?.data?.message || error.message || "향료 목록 불러오기 실패";
        dispatch(fetchSpicesFail(errorMessage));
    }
};

export const createSpices = (spiceData) => async (dispatch) => {
    try {
        dispatch(createSpicesStart());
        const createdSpice = await createSpice(spiceData); // API 호출
        dispatch(createSpicesSuccess(createdSpice));
    } catch (error) {
        dispatch(createSpicesFail(error.message || "향료 추가 실패"));
    }
};

export const modifySpices = (spiceData) => async (dispatch) => {
    try {
        dispatch(modifySpicesStart());
        const modifiedSpice = await modifySpice(spiceData);
        dispatch(modifySpicesSuccess(modifiedSpice));
    } catch (error) {
        dispatch(modifySpicesFail(error.message || "향료 수정 실패"));
    }
};

export const deleteSpices = (spiceId) => async (dispatch) => {
    try {
        dispatch(deleteSpicesStart());
        await deleteSpice(spiceId);
        dispatch(deleteSpicesSuccess(spiceId));
    } catch (error) {
        dispatch(deleteSpicesFail(error.message || "향료 삭제 실패"));
    }
};

// 리듀서
const spiceReducer = handleActions(
    {
        [fetchSpicesStart]: (state) => ({
            ...state,
            loading: true,
            error: null,
        }),
        [fetchSpicesSuccess]: (state, { payload }) => ({
            ...state,
            spices: payload,
            loading: false,
            error: null,
        }),
        [fetchSpicesFail]: (state, { payload }) => ({
            ...state,
            loading: false,
            error: payload,
        }),

        [createSpicesStart]: (state) => ({
            ...state,
            loading: true,
            error: null,
        }),
        [createSpicesSuccess]: (state, { payload }) => ({
            ...state,
            spices: payload,
            loading: false,
            error: null,
        }),
        [createSpicesFail]: (state, { payload }) => ({
            ...state,
            loading: false,
            error: payload,
        }),

        [modifySpicesStart]: (state) => ({
            ...state,
            loading: true,
            error: null,
        }),
        [modifySpicesSuccess]: (state, { payload }) => ({
            ...state,
            spices: payload,
            loading: false,
            error: null,
        }),
        [modifySpicesFail]: (state, { payload }) => ({
            ...state,
            loading: false,
            error: payload,
        }),

        [deleteSpicesStart]: (state) => ({
            ...state,
            loading: true,
            error: null,
        }),
        [deleteSpicesSuccess]: (state, { payload }) => ({
            ...state,
            spices: payload,
            loading: false,
            error: null,
        }),
        [deleteSpicesFail]: (state, { payload }) => ({
            ...state,
            loading: false,
            error: payload,
        }),
    },
    initialState
);

// Selector 함수 사용
// -> 동일한 상태를 여러 컴포넌트에서 사용할 때, Selector 함수로 관리하면 중복 코드 없이 사용 가능
export const selectSpices = (state) => state.spices.spices;
export const selectLoading = (state) => state.spices.loading;
export const selectError = (state) => state.spices.error;

export default spiceReducer;