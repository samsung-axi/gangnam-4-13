import React, { useEffect, useState } from "react";
import Lottie from "lottie-react";
import loadingLottie from "../user_pages/Animation.json"; // 애니메이션 파일 경로
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import AuthGuard from "../api/accessControl";
import { parseCookieKeyValue } from "../api/cookie";

const Loading: React.FC = () => {
  const navigate = useNavigate();
  const [showLoadingLottie, setShowLoadingLottie] = useState(true); // 기본값 true

  const [cookie, setCookie, removeCookie] = useCookies(['token']);  // 쿠키
  const [id, setId] = useState<number>(-1);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  // 유저 유효성 검증
  const checkAuth = async (userId: number, accessToken: string) => {
    if (accessToken == null) {
      alert('accessToken 값이 유효하지 않습니다.')
      navigate('/');  
    } else {
      const isAuthenticated = await AuthGuard (userId, accessToken);
      if (!isAuthenticated) {
        navigate('/');
      }
    }
  };
  
  useEffect(() => {
    const cookieToken = cookie.token;   // 쿠키의 토큰 값
    // console.log('cookie: ', cookie);
    // console.log('cookieToken: ', cookieToken);

    if (cookieToken == null) {
      navigate('/');  // 쿠키 토큰 값 유효x -> main 화면 이동
    } else {  // 쿠키 토큰 값 유효o -> access_token, id 추출 해서 
      const _cookieContent = parseCookieKeyValue(cookieToken);
      if (_cookieContent != null) {
        const _cookieAccessToken = _cookieContent.access_token;
        const _cookieId = _cookieContent.id;

        // 쿠키 토큰 값의 access token 값 유효성 체크
        if (_cookieAccessToken != null) {
          setAccessToken(_cookieAccessToken); 
        }
        // 쿠키 토큰 값의 id 값 유효성 체크
        if (_cookieId != null) {
          setId(_cookieId);
        }
      }

      if (accessToken != null) {
        if (!checkAuth(id, accessToken)) {
          navigate('/');  // 유저 상태코드 유효하지 않으면 접근
        }
      }
    }
  }, []);

  return (
    <div className="flex flex-col items-center justify-center w-full h-screen">
      {showLoadingLottie && (
        <div className="flex flex-col items-center">
          {/* 애니메이션 */}
          <Lottie animationData={loadingLottie} className="w-64" />
          {/* 로딩 멘트 */}
          <p className="mt-4 text-lg text-gray-700">로딩중... 😢</p>
        </div>
      )}
    </div>
  );
};

export default Loading;
