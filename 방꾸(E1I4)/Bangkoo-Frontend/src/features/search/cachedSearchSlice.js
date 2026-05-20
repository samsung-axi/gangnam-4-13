import { createSlice } from '@reduxjs/toolkit';

const LOCAL_STORAGE_KEY = "cachedSearchResults";

// localStorage 저장 함수
const saveCacheToLocalStorage = (cache) => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(cache));
};

// localStorage 불러오기 함수
const loadCacheFromLocalStorage = () => {
    const data = localStorage.getItem(LOCAL_STORAGE_KEY);
    return data ? JSON.parse(data) : {};
};

// 초기 상태: localStorage에서 불러오기
const initialState = {
    cache: loadCacheFromLocalStorage()
};

const cachedSearchSlice = createSlice({
    name: 'cachedSearch',
    initialState,
    reducers: {
        // 검색 결과 저장 + localStorage에도 저장
        setCachedResults: (state, action) => {
            const { keyword, results } = action.payload;
            if (!keyword) return;
            if (!state.cache[keyword]) {
                state.cache[keyword] = {};
            }
            state.cache[keyword].results = results;
            saveCacheToLocalStorage(state.cache);
        },

        // 체크 상태 저장 + localStorage 저장
        setCachedCheckedIds: (state, action) => {
            const { keyword, checkedIds } = action.payload;
            if (!keyword) return;
            if (!state.cache[keyword]) {
                state.cache[keyword] = {};
            }
            state.cache[keyword].checkedIds = checkedIds;
            saveCacheToLocalStorage(state.cache);
        },

        // 키워드에 해당하는 캐시 전체 제거
        clearCachedKeyword: (state, action) => {
            const keyword = action.payload;
            if (state.cache[keyword]) {
                delete state.cache[keyword];
                saveCacheToLocalStorage(state.cache);
            }
        },

        // 전체 캐시 초기화
        clearAllCachedSearch: (state) => {
            state.cache = {};
            localStorage.removeItem(LOCAL_STORAGE_KEY);
        },
    }
});

export const {
    setCachedResults,
    setCachedCheckedIds,
    clearCachedKeyword,
    clearAllCachedSearch
} = cachedSearchSlice.actions;

export default cachedSearchSlice.reducer;

// 선택적 비동기 사용을 위해 thunk 형식 제공
export const cacheSearchResult = (keyword, results) => (dispatch) => {
    dispatch(setCachedResults({ keyword, results }));
};

export const clearCachedResult = (keyword) => (dispatch) => {
    dispatch(clearCachedKeyword(keyword));
};
