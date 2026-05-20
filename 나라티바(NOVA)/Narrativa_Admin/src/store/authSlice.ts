import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  logoutStartTime: number | null;
}

const initialState: AuthState = {
  logoutStartTime: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setLogoutStartTime(state, action: PayloadAction<number | null>) {
      state.logoutStartTime = action.payload;
    },
  },
});

export const { setLogoutStartTime } = authSlice.actions;
export default authSlice.reducer;