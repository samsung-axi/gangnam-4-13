const rest_api_key = process.env.REACT_APP_KAKAO_CLIENT_ID;
const auth_code_path = process.env.REACT_APP_KAKAO_AUTH_CODE_PATH;
const react_app_uri = process.env.REACT_APP_SPRING_URI || '';
const redirect_uri_part = process.env.REACT_APP_KAKAO_REDIRECT_URI || '';
const redirect_uri = react_app_uri + redirect_uri_part;

export const getKakaoLoginLink = (): string => {
    const kakaoURL = `${auth_code_path}?client_id=${rest_api_key}&redirect_uri=${redirect_uri}&response_type=code`;
    return kakaoURL;
}