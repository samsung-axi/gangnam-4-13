import { createSlice } from '@reduxjs/toolkit';

const storedKeywords = JSON.parse(localStorage.getItem("recentKeywords") || "[]");

const initialState = {
    keyword: '',         // 사용자가 입력한 검색어
    confirmedKeyword: '',
    uploadedImage: null, // 업로드한 이미지 (URL or File)
    recentKeywords: storedKeywords, // 검색 히스토리 추가
    autoSave: true, // 자동 저장 on/off
    resultList: [],
    isLoading: false,
};


const searchSlice = createSlice({
    name: 'search',
    initialState,
    reducers: {
        setRecentKeywords: (state, action) => {
            state.recentKeywords = action.payload;
            localStorage.setItem("recentKeywords", JSON.stringify(action.payload));
        },    
        setKeyword: (state, action) => {
            state.keyword = action.payload;
        },
        setUploadedImage: (state, action) => {
            state.uploadedImage = action.payload;
        },

        // 비로그인 사용자만 호출
        addRecentKeyword: (state, action) => {
            const keyword = action.payload.trim();
            if (!keyword) return;

            // 중복 제거
            state.recentKeywords = state.recentKeywords.filter(k => k !== keyword);
            state.recentKeywords.unshift(keyword); // 앞에 추가

            // 최대 10개 유지
            if (state.recentKeywords.length > 10) {
                state.recentKeywords.pop();
            }

            // localStorage에도 저장
            localStorage.setItem("recentKeywords", JSON.stringify(state.recentKeywords));
        },

        removeRecentKeyword: (state, action) => {
            const keyword = action.payload;
            state.recentKeywords = state.recentKeywords.filter(k => k !== keyword);
            localStorage.setItem("recentKeywords", JSON.stringify(state.recentKeywords));
        },

        clearRecentKeywords: (state) => {
            state.recentKeywords = [];
            localStorage.removeItem("recentKeywords"); // localStorage도 삭제
        },
        clearSearch: (state) => {
            state.keyword = '';
            state.uploadedImage = null;
        },
        toggleAutoSave: (state) => {
            state.autoSave = !state.autoSave;
        },
        setSearchResults: (state, action) => {
            state.resultList = action.payload; // 검색 결과 저장
        },
        setConfirmedKeyword: (state, action) => {
            state.confirmedKeyword = action.payload;
        },
        setLoading: (state, action) => {
            state.isLoading = action.payload;
        },
    },
});

export const {
    setRecentKeywords,
    setKeyword,
    setUploadedImage,
    clearSearch,
    addRecentKeyword,
    removeRecentKeyword,
    clearRecentKeywords,
    toggleAutoSave,
    setSearchResults,
    setConfirmedKeyword,
    setLoading,
} = searchSlice.actions;
export default searchSlice.reducer;
