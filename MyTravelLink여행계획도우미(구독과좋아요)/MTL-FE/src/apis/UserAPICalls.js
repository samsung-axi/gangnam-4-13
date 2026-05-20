import { loginRequest } from "./Apis";
import { login, showSignUp } from "../modules/UserModule";

/* 로그인 정보 전달 받는 함수 */
export function callLoginAPI(code) {
    console.log('구글 login api calls...');

    return async (dispatch) => {
        try {
            const result = await loginRequest('GET', `/auth/google/callback?code=${code}`);
            console.log('구글 login result : ', result);

            const userInfo = result.data.results.user;
            const token = result.data.results.token;

            if (userInfo) {
                dispatch(login({ token, userInfo })); // 사용자 정보 저장

                localStorage.setItem('token', token);
                return { status: 200, userInfo }; // 로그인 성공
            } else {
                dispatch(showSignUp());
                return { status: 201, userInfo }; // 회원가입 필요
            }
        } catch (error) {
            console.error('Login API error:', error);
            return { status: 500 }; // 로그인 실패
        }
    }
}
