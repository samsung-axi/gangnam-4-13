import { createActions, handleActions } from "redux-actions";
import { handleOAuthKakaoAPI } from "../api/AuthAPICalls";

// 초기 상태
const initialState = {
    auth: null, // { user: { oauthId, email, name }, token }
    isLoggedIn: false,
    loading: false,
    error: null,
};

// 액션 생성
export const {
    auth: { loginSuccess, loginFail, logout, setLoading },
} = createActions({
    AUTH: {
        LOGIN_SUCCESS: (authData) => authData,    // 로그인 성공
        LOGIN_FAIL: (error) => error,    // 로그인 실패
        LOGOUT: () => { },                // 로그아웃
        SET_LOADING: (status) => status, // 로딩 상태 업데이트
    },
});

// Thunk 함수: 카카오 OAuth 로그인 처리
export const handleOAuthKakao = (code) => async (dispatch) => {
    try {
        dispatch(setLoading(true));
        const authData = await handleOAuthKakaoAPI(code);

        // role이 LEAVE인 경우 처리
        if (authData.role === "LEAVE") {
            throw new Error("탈퇴한 계정입니다. 로그인이 불가능합니다.");
        }

        localStorage.setItem("auth", JSON.stringify(authData)); // 로컬 저장
        dispatch(loginSuccess(authData));
    } catch (error) {
        const errorMessage =
            error.response?.data?.message || error.message || "카카오 로그인 실패";
        dispatch(loginFail(errorMessage));
    } finally {
        dispatch(setLoading(false));
    }
};

// Thunk 액션: 초기화
export const initializeAuth = () => (dispatch) => {
    const authData = JSON.parse(localStorage.getItem("auth"));
    if (authData) {
        dispatch(loginSuccess(authData));
    }
};

export const logoutUser = () => (dispatch) => {
    localStorage.removeItem("auth"); // 로컬 스토리지 데이터 삭제
    dispatch(logout());
};

// 리듀서
const authReducer = handleActions(
    {
        [loginSuccess]: (state, { payload }) => ({
            ...state,
            auth: payload, // { user: { oauthId, email, name }, token }
            isLoggedIn: true,
            loading: false,
            error: null,
        }),
        [loginFail]: (state, { payload }) => ({
            ...state,
            loading: false,
            error: payload,
        }),
        [logout]: () => ({
            auth: null,
            isLoggedIn: false,
            loading: false,
            error: null,
        }),
        [setLoading]: (state, { payload }) => ({
            ...state,
            loading: payload,
        }),
    },
    initialState
);

export default authReducer;
