import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    list: [],
};

const furnitureSlice = createSlice({
    name: 'furniture',
    initialState,
    reducers: {
        addFurniture: (state, action) => {
            state.list = [...state.list, action.payload];
        },
        removeFurniture: (state, action) => {
            // 🔥 진짜 삭제하는 버전
            state.list = state.list.filter(item => item.id !== action.payload);
        },
        toggleFurniture: (state, action) => {
            state.list = state.list.map(item =>
                item.id === action.payload
                    ? { ...item, type: item.type === 'hoverMinus' ? 'hoverPlus' : 'hoverMinus' }
                    : item
            );
        },
        setInitialFurniture: (state, action) => {
            state.list = action.payload;
        },
        appendFurniture: (state, action) => {
            const newItem = action.payload;
            const exists = state.list.some(item => item.id === newItem.id);
            if (!exists) {
                state.list = [...state.list, newItem];
            }
        },
    },
});

export const {
    addFurniture,
    removeFurniture,
    toggleFurniture,
    setInitialFurniture,
    appendFurniture
} = furnitureSlice.actions;
export default furnitureSlice.reducer;
