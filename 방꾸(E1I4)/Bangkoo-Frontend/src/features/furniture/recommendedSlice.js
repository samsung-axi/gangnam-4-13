import { createSlice } from "@reduxjs/toolkit";

// 추천 가구 상태 초기값
const initialState = {
  list: []
};

const recommendedSlice = createSlice({
  name: "recommended",
  initialState,
  reducers: {
    setRecommendedFurniture(state, action) {
        console.log("4.리듀서,payload:",action.payload);
      state.list = action.payload;
    }
  }
});

// 액션과 리듀서 내보내기
export const { setRecommendedFurniture } = recommendedSlice.actions;
export default recommendedSlice.reducer;
