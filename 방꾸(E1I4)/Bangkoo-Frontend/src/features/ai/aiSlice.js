import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    isAnalyzing: false, // 분석 중 여부
    budget: {
        min: '',
        max: '',
    },
    selectedStyles: [], // 선택된 스타일 목록
};

const aiSlice = createSlice({
    name: 'ai',
    initialState,
    reducers: {
        startAnalysis(state) {
            state.isAnalyzing = true;
        },
        endAnalysis(state) {
            state.isAnalyzing = false;
        },
        setBudget(state, action) {
            state.budget = action.payload; // { min: "100000", max: "300000" }
        },
        setSelectedStyles(state, action) {
            state.selectedStyles = action.payload; // ["모던", "북유럽"]
        },
    },
});

export const {
    startAnalysis,
    endAnalysis,
    setBudget,
    setSelectedStyles,
} = aiSlice.actions;

export default aiSlice.reducer;
