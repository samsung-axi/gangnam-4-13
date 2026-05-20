// features/furniture/interiorSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    list: [],
    explanation: '', // 설명 추가
};

const interiorSlice = createSlice({
    name: 'interior',
    initialState,
    reducers: {
        setInterior: (state, action) => {
            state.list = action.payload;
        },
        removeInterior: (state, action) => {
            state.list = state.list.filter(item => item.id !== action.payload);
        },
        removeAllInterior: (state) => {
            state.list = [];
        },
        setExplanation(state, action) {
            state.explanation = action.payload; // 설명 업데이트
        },
    },
});

export const {
    setInterior,
    removeInterior,
    removeAllInterior,
    setExplanation,
} = interiorSlice.actions;
export default interiorSlice.reducer;