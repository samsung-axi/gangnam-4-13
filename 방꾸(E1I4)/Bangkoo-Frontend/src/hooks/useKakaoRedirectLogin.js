/*
 카카오 로그인 관련 훅
*/
const useKakaoLogin = () => {
  const kakaoLogin = () => {
    const REST_API_KEY = process.env.REACT_APP_KAKAO_CLIENT_ID;
    const REDIRECT_URI = process.env.REACT_APP_KAKAO_REDIRECT_URI;
    const kakaoAuthURL = `https://kauth.kakao.com/oauth/authorize?client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}&response_type=code`;

    window.location.href = kakaoAuthURL;
  };

  return { kakaoLogin };
};

export default useKakaoLogin;
