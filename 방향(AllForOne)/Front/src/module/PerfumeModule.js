import { createActions, handleActions } from "redux-actions";
import { getAllPerfumes, modifyPerfumes, deletePerfumes, createPerfumes, getProductDetail } from "../api/PerfumeAPICalls";
import { resetReviews } from "./ReviewModule";

// 초기 상태
const initialState = {
    perfumes: [], // 향수 목록
    currentPerfume: null,  // 현재 선택된 향수 추가
    loading: false, // 로딩 상태
    error: null, //에러 메시지
    lastFetchTime: {},     // 캐시 시간 추적 추가
    cache: {},            // 캐시 데이터 추가
};

// 캐시 유효 시간 (5분)
const CACHE_DURATION = 5 * 60 * 1000;

// 액션 생성 - 캐시 관련 액션 추가
export const {
    perfumes: {
        fetchPerfumeStart,
        fetchPerfumeSuccess,
        fetchPerfumeFail,
        modifyPerfumeStart,
        modifyPerfumeSuccess,
        modifyPerfumeFail,
        deletePerfumeStart,
        deletePerfumeSuccess,
        deletePerfumeFail,
        createPerfumeStart,
        createPerfumeSuccess,
        createPerfumeFail,
        fetchPerfumeByIdStart,
        fetchPerfumeByIdSuccess,
        fetchPerfumeByIdFail,
        setPerfumeCache,          // 캐시 설정 액션 추가
        clearPerfumeCache,        // 캐시 초기화 액션 추가
        setCurrentPerfume         // 현재 향수 설정 액션 추가
    },
} = createActions({
    PERFUMES: {
        FETCH_PERFUME_START: () => { },
        FETCH_PERFUME_SUCCESS: (perfumes) => perfumes,
        FETCH_PERFUME_FAIL: (error) => error,
        MODIFY_PERFUME_START: () => { },
        MODIFY_PERFUME_SUCCESS: (perfume) => perfume,
        MODIFY_PERFUME_FAIL: (error) => error,
        DELETE_PERFUME_START: () => { },
        DELETE_PERFUME_SUCCESS: (perfumeId) => perfumeId,
        DELETE_PERFUME_FAIL: (error) => error,
        CREATE_PERFUME_START: () => { },
        CREATE_PERFUME_SUCCESS: (perfume) => perfume,
        CREATE_PERFUME_FAIL: (error) => error,
        FETCH_PERFUME_BY_ID_START: () => { },
        FETCH_PERFUME_BY_ID_SUCCESS: (perfume) => perfume,
        FETCH_PERFUME_BY_ID_FAIL: (error) => error,
        SET_PERFUME_CACHE: (payload) => payload,
        CLEAR_PERFUME_CACHE: () => {},
        SET_CURRENT_PERFUME: (perfume) => perfume,
    },
});

// 캐시 유효성 검사 함수 추가
const isCacheValid = (state, productId) => {
    const cachedData = state.cache[productId];
    const lastFetch = state.lastFetchTime[productId];
    return (
        cachedData &&
        lastFetch &&
        Date.now() - lastFetch < CACHE_DURATION
    );
};

// redux thunk - 기존 함수들
export const fetchPerfumes = () => async (dispatch) => {
    try {
        dispatch(fetchPerfumeStart());
        const perfumes = await getAllPerfumes();
        dispatch(fetchPerfumeSuccess(perfumes));
    } catch (error) {
        const errorMessage =
            error.response?.data?.message || error.message || "향수 목록 불러오기 실패";
        dispatch(fetchPerfumeFail(errorMessage));
    }
};

export const modifyPerfume = (perfumeData) => async (dispatch) => {
    try {
        dispatch(modifyPerfumeStart());
        const updatedPerfume = await modifyPerfumes(perfumeData);
        dispatch(modifyPerfumeSuccess(updatedPerfume));
        // 캐시 업데이트 추가
        dispatch(setPerfumeCache({
            id: perfumeData.id,
            data: updatedPerfume,
            timestamp: Date.now()
        }));
    } catch (error) {
        dispatch(modifyPerfumeFail(error.message || "향수 수정 실패"));
    }
};

export const deletePerfume = (perfumeId) => async (dispatch) => {
    try {
        dispatch(deletePerfumeStart());
        await deletePerfumes(perfumeId);
        dispatch(deletePerfumeSuccess(perfumeId));
        // 캐시 제거 추가
        dispatch(clearPerfumeCache());
    } catch (error) {
        dispatch(deletePerfumeFail(error.message || "향수 삭제 실패"));
    }
};

export const createPerfume = (perfumeData) => async (dispatch) => {
    try {
        dispatch(createPerfumeStart());
        const newPerfume = await createPerfumes(perfumeData);
        dispatch(createPerfumeSuccess(newPerfume));
        // 캐시 업데이트 추가
        dispatch(setPerfumeCache({
            id: newPerfume.id,
            data: newPerfume,
            timestamp: Date.now()
        }));
    } catch (error) {
        dispatch(createPerfumeFail(error.message || "향수 추가 실패"));
    }
};

// fetchPerfumeById 개선
export const fetchPerfumeById = (productId) => async (dispatch, getState) => {
    try {
        const state = getState().perfumes;
        
        dispatch(fetchPerfumeByIdStart());
        
        // 캐시 확인
        if (isCacheValid(state, productId)) {
            const cachedPerfume = state.cache[productId];
            dispatch(fetchPerfumeByIdSuccess(cachedPerfume));
            dispatch(setCurrentPerfume(cachedPerfume));
            return;
        }

        // 새로운 데이터 가져오기
        const perfume = await getProductDetail(productId);
        
        if (!perfume) {
            throw new Error("향수 데이터를 찾을 수 없습니다.");
        }

        // 캐시 업데이트
        dispatch(setPerfumeCache({
            id: productId,
            data: perfume,
            timestamp: Date.now()
        }));

        // 상태 업데이트 - resetReviews 제거
        dispatch(fetchPerfumeByIdSuccess(perfume));
        dispatch(setCurrentPerfume(perfume));

    } catch (error) {
        console.error("향수 데이터 로드 실패:", error);
        dispatch(fetchPerfumeByIdFail(error.message || "향수 상세 정보 불러오기 실패"));
    }
};

// 리듀서 개선
const perfumeReducer = handleActions(
    {
        [fetchPerfumeStart]: (state) => ({
            ...state,
            loading: true,
            error: null,
        }),
        [fetchPerfumeSuccess]: (state, { payload }) => ({
            ...state,
            perfumes: payload,
            loading: false,
            error: null,
        }),
        [fetchPerfumeFail]: (state, { payload }) => ({
            ...state,
            loading: false,
            error: payload,
        }),
        [modifyPerfumeStart]: (state) => ({
            ...state,
            loading: true,
            error: null,
        }),
        [modifyPerfumeSuccess]: (state, { payload }) => ({
            ...state,
            perfumes: state.perfumes.map((perfume) =>
                perfume.id === payload.id ? payload : perfume
            ),
            currentPerfume: state.currentPerfume?.id === payload.id ? payload : state.currentPerfume,
            loading: false,
            error: null,
        }),
        [modifyPerfumeFail]: (state, { payload }) => ({
            ...state,
            loading: false,
            error: payload,
        }),
        [deletePerfumeStart]: (state) => ({
            ...state,
            loading: true,
            error: null,
        }),
        [deletePerfumeSuccess]: (state, { payload }) => ({
            ...state,
            perfumes: state.perfumes.filter((perfume) => perfume.id !== payload),
            currentPerfume: state.currentPerfume?.id === payload ? null : state.currentPerfume,
            loading: false,
            error: null,
        }),
        [deletePerfumeFail]: (state, { payload }) => ({
            ...state,
            loading: false,
            error: payload,
        }),
        [createPerfumeStart]: (state) => ({
            ...state,
            loading: true,
            error: null,
        }),
        [createPerfumeSuccess]: (state, { payload }) => ({
            ...state,
            perfumes: [...state.perfumes, payload],
            loading: false,
            error: null,
        }),
        [createPerfumeFail]: (state, { payload }) => ({
            ...state,
            loading: false,
            error: payload,
        }),
        [fetchPerfumeByIdStart]: (state) => ({
            ...state,
            loading: true,
            error: null,
        }),
        [fetchPerfumeByIdSuccess]: (state, { payload }) => ({
            ...state,
            perfumes: state.perfumes.some(p => p.id === payload.id)
                ? state.perfumes.map(p => (p.id === payload.id ? payload : p))
                : [...state.perfumes, payload],
            loading: false,
            error: null,
        }),
        [fetchPerfumeByIdFail]: (state, { payload }) => ({
            ...state,
            loading: false,
            error: payload,
        }),
        [setPerfumeCache]: (state, { payload }) => ({
            ...state,
            cache: {
                ...state.cache,
                [payload.id]: payload.data,
            },
            lastFetchTime: {
                ...state.lastFetchTime,
                [payload.id]: payload.timestamp,
            },
        }),
        [clearPerfumeCache]: (state) => ({
            ...state,
            cache: {},
            lastFetchTime: {},
        }),
        [setCurrentPerfume]: (state, { payload }) => ({
            ...state,
            currentPerfume: payload,
        }),
    },
    initialState
);

// 선택자 함수들 개선
export const selectPerfumes = (state) => state.perfumes?.perfumes || [];
export const selectCurrentPerfume = (state) => state.perfumes?.currentPerfume || null;
export const selectLoading = (state) => state.perfumes?.loading || false;
export const selectError = (state) => state.perfumes?.error || null;
export const selectPerfumeCache = (state) => state.perfumes?.cache || {};

export default perfumeReducer;