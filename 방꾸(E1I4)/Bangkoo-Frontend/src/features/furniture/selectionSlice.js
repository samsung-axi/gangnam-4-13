import { createSlice } from '@reduxjs/toolkit';

// localStorage에서 초기 체크 상태 불러오기
const stored = localStorage.getItem("checkedItems");
const initialCheckedItems = stored ? JSON.parse(stored) : {};

const initialState = {
    checkedItems: initialCheckedItems, // key: item.id, value: true/false
};

const selectionSlice = createSlice({
    name: 'selection',
    initialState,
    reducers: {
        toggleItem(state, action) {
            const id = action.payload;
            state.checkedItems[id] = !state.checkedItems[id];

            // 저장
            localStorage.setItem("checkedItems", JSON.stringify(state.checkedItems));
        },
        setItemChecked(state, action) {
            const { id, checked } = action.payload;
            state.checkedItems[id] = checked;

            // 저장
            localStorage.setItem("checkedItems", JSON.stringify(state.checkedItems));
        },
        clearAllSelections(state) {
            state.checkedItems = {};

            localStorage.removeItem("checkedItems"); // 삭제
        },
    },
});

export const {
    toggleItem,
    setItemChecked,
    clearAllSelections
} = selectionSlice.actions;
export default selectionSlice.reducer;
