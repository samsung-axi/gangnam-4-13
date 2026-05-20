import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios";
import { getByRole } from "@testing-library/dom";
import Cookies from "js-cookie";
import { useEffect } from "react";

export const logoutThunk = createAsyncThunk(
    "auth/logout",
    async (_, thunkAPI) => {
      try {
        await api.post("/auth/logout"); // 로그아웃 API 호출
        // 쿠키 삭제
        document.cookie = "nickname=; Max-Age=0; path=/;";
        document.cookie = "role=; Max-Age=0; path=/;";
        // 로그아웃 후 상태 업데이트
      } catch (err) {
        return thunkAPI.rejectWithValue("로그아웃 실패. 다시 시도해주세요.");
      }
    }
  );

const authSlice = createSlice({
    name: "auth",
    initialState: {
        isLoggedIn: false,
        user: {
            nickname: null,
            role: null,
            userId: null,
        },
        alertMessage: null,
    },
    reducers: {
        checkLoginFromCookie: (state) => {
            const cookie = document.cookie;
            const nicknameMatch = cookie.match(/nickname=([^;]+)/);
            // const roleMatch = cookie.match(/role=([^;]+)/);  // role 쿠키 추가
            const roleMatch = Cookies.get("role")
            const userIdMatch = cookie.match(/userId=([^;]+)/);

            const nickname = nicknameMatch ? decodeURIComponent(nicknameMatch[1]) : null;
            // 쿠키에서 role을 읽어오지 못하면 기본값 'user'를 설정
            // const role = roleMatch ? decodeURIComponent(roleMatch[1]) : 'user';  // 기본값 'user'로 설정
            const role = roleMatch
            const userId = userIdMatch ? decodeURIComponent(userIdMatch[1]) : null;

            // 쿠키에서 role을 읽어오고, user 상태와 일치하면 상태 업데이트 안 함
            if (nickname && role && state.user?.nickname === nickname && state.user?.role === role) return;
            if (!nickname && !state.user) return;

            if (nickname && role && userId) {
                state.isLoggedIn = true;
                state.user = { nickname, role, userId };  // 상태에 role 추가
            } else {
                state.isLoggedIn = false;
                state.user = null;
            }
        },
        setLoginInfo: (state, action) => {
            const { nickname, role, userId } = action.payload;


            // nickname 또는 role이 누락되었을 경우 로그를 출력하고 처리
            if (!nickname || !role || !userId) {
    
                return;
            }

            // 쿠키에 nickname과 role을 저장
            document.cookie = `nickname=${encodeURIComponent(nickname)}; path=/;`;
            document.cookie = `role=${encodeURIComponent(role)}; path=/;`;  // role 쿠키 저장 추가
            document.cookie = `userId=${encodeURIComponent(userId)}; path=/;`;

      
            state.isLoggedIn = true;

            state.user = { nickname, role, userId };
            // state.user = {    nickname: action.payload.nickname,
            //     role: action.payload.role };  // 상태에 role 추가
        },
        setAlertMessage: (state, action) => {
            state.alertMessage = action.payload;
        },
        clearAlertMessage: (state) => {
            state.alertMessage = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(logoutThunk.fulfilled, (state) => {
                state.isLoggedIn = false;
                state.user = null;
                state.alertMessage = "로그아웃 되었습니다.";
            })
            .addCase(logoutThunk.rejected, (state, action) => {
                state.alertMessage = action.payload;
            });
    },
});

export const {
    checkLoginFromCookie,
    setLoginInfo,
    setAlertMessage,
    clearAlertMessage,
} = authSlice.actions;
export default authSlice.reducer;
