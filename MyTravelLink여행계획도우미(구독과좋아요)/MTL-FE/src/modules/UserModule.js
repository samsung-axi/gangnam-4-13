



import { createActions, handleActions } from "redux-actions"

// 초기 state 값
const initialState = {
    userInfo: {},
    token: null,
    users: [],
    showSignUp: false,
}

//액션 타입 설정
export const LOGIN = 'user/LOGIN';
export const LOG_OUT = 'user/LOG_OUT';
export const GET_ALL_PROFILE_IMAGE = 'user/GET_ALL_PROFILE_IMAGE';
export const LOAD_USER = 'user/LOAD_USER';
export const SHOW_SIGN_UP = 'user/SHOW_SIGN_UP';
export const HIDE_SIGN_UP = 'usea/HIDE_SIGN_UP';

//유저 관련 액션 함수
export const { user: { login, logOut, getAllProfileImage, loadUser, showSignUp, hideSignUp } } = createActions({
    [LOGIN]: ({ token, userInfo }) => ({ token, userInfo }),
    [LOG_OUT]: ({ token, userInfo }) => ({ token, userInfo }),
    [GET_ALL_PROFILE_IMAGE]: (data) => (data),
    [LOAD_USER]: (data) => (data),
    [SHOW_SIGN_UP]: () => ({}),
    [HIDE_SIGN_UP]: () => ({}),
});

//리듀서 함수
const userReducer = handleActions(
    {
        [LOGIN]: (state, { payload: { token, userInfo } }) => {
            if (!token) {
                console.error('No token received');
                return state;
            }

            // 토큰 저장 시 공백 추가 확인
            localStorage.setItem("token", "Bearer " + token);
            localStorage.setItem("userEmail", userInfo.email);

            return {
                ...state,
                userInfo,
                token,
            };
        },
        [LOG_OUT]: () => {
            localStorage.removeItem('token'); // 로그인 토큰 삭제
            return initialState;
        },
        [GET_ALL_PROFILE_IMAGE]: (state, data) => {

            return {
                ...state,
                image: data.payload, // 상태 업데이트
            };
        },
        [LOAD_USER]: (state, data) => {

            console.log('data : ', data);

            return {
                ...state,
                userInfo: data.payload, // 상태 업데이트
            };
        },
        [SHOW_SIGN_UP]: (state) => {
            return {
                ...state,
                showSignUp: true,
            };
        },
        [HIDE_SIGN_UP]: (state) => {
            return {
                ...state,
                showSignUp: false,
            }
        }
    },
    initialState
);

export default userReducer;