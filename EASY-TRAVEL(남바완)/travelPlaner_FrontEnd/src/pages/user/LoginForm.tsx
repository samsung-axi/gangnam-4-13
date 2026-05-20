import "./LoginForm.css";
import { v4 as uuidv4 } from "uuid";
import {
  API_BASE_URL,
  GOOGLE_CLIENT_ID,
  NAVER_CLIENT_ID,
  KAKAO_CLIENT_ID,
  CLIENT_CALLBACK_URL,
} from "../../config"; // config.ts에서 API_BASE_URL을 임포트
import { useNavigate } from "react-router-dom";
import { useEffect, useRef } from "react";
import axios from "axios";
import MemberStore from "../../stores/MemberStore";
import { requestPermission } from "../../firebase-config";

// Authorization Code Flow
// 1. 프론트는 각 인증서버에 API키를 이용해 인증 코드를 받고 이를 백엔드로 전송
// 2. 백엔드는 인증 코드를 사용해 액세스 토큰을 요청
// 3. 백엔드는 액세스 토큰을 통해 ID토큰을 받고, JWT토큰을 발행해 프론트에 전송
// 4. 프론트는 JWT토큰을 저장해 인증된 사용자임을 유지
// 5. 백엔드는 JWT토큰을 검증해 사용자 인증(상태는 저장하지 않음)

const LoginForm = () => {
  const navigate = useNavigate();
  const setMemberInfo = MemberStore((state: any) => state.setMemberInfo);
  const state = uuidv4();
  const fcmToken = useRef<string | null>(null);

  const fetchFcmToken = async () => {
    if (fcmToken.current) {
      console.log("fetchFcmToken:fcmToken: ", fcmToken.current);
      axios.post(
        `${API_BASE_URL}/members/fcmToken`,
        {
          fcm_token: fcmToken.current,
        },
        {
          withCredentials: true,
        }
      );
    }
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const authCode = urlParams.get("code");
    const domain = urlParams.get("domain");

    if (authCode) {
      console.log(authCode);
      axios
        .get(
          `${API_BASE_URL}/oauths/${domain}/callback?code=${authCode}&state=${state}`,
          {
            withCredentials: true,
            headers: {
              "Content-Type": "application/json",
            },
            data: {
              code: authCode,
            },
          }
        )
        .then(async (response) => {
          //후처리
          console.log("response: ", response); // 토큰 정보 출력
          console.log("로그인 성공");

          //zustand 스토어에 저장
          setMemberInfo(response.data);
          navigate("/");
          // fcm 토큰 발급
          const token = await requestPermission();
          fcmToken.current = token;
          fetchFcmToken();
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      console.log("인증코드가 없습니다.");
    }
  }, []);

  // 일반 메소드 (로그인 이벤트 핸들러)
  const handleKakaoLogin = () => {
    const kakaoClientId: string = KAKAO_CLIENT_ID;
    const kakaoRedirectUrl = `${CLIENT_CALLBACK_URL}?domain=kakao`;
    const kakaoAuthUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${kakaoClientId}&redirect_uri=${kakaoRedirectUrl}&response_type=code&state=${state}`;

    window.location.href = kakaoAuthUrl;
  };

  // 네이버 로그인 로직
  const handleNaverLogin = async () => {
    const naverClientId: string = NAVER_CLIENT_ID;
    const redirectUri = `${CLIENT_CALLBACK_URL}?domain=naver`;
    const naverAuthUrl = `https://nid.naver.com/oauth2.0/authorize?client_id=${naverClientId}&redirect_uri=${redirectUri}&response_type=code&state=${state}`;

    window.location.href = naverAuthUrl;
  };

  const handleGoogleLogin = async () => {
    const googleClientId: string = GOOGLE_CLIENT_ID;
    const googleRedirectUrl: string = `${CLIENT_CALLBACK_URL}?domain=google`;
    const googleScope = "openid email profile";
    const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${googleClientId}&redirect_uri=${googleRedirectUrl}&scope=${googleScope}&response_type=code&state=${state}`;

    window.location.href = googleAuthUrl;
  };

  return (
    <div id="login-container">
      <div className="login-form">
        <div className="logo-placeholder">
          <img src="/icons/Easy_Travel.png" alt="로고" />
        </div>
        {/* 카카오 로그인 */}
        <div className="kakao-login-button">
          <button onClick={handleKakaoLogin}>
            <img src="/images/kakao-logo.png" alt="카카오 로그인 버튼" />
            <span>카카오 로그인</span>
          </button>
        </div>

        {/* 네이버 로그인 */}
        <div className="naver-login-button">
          <button onClick={handleNaverLogin}>
            <img src="/images/naver-logo.jpg" alt="네이버" />
            <span>네이버 로그인</span>
          </button>
        </div>

        {/* 구글 로그인 */}
        <div className="google-login-button">
          <button onClick={handleGoogleLogin}>
            <img src="/images/google-logo.jpg" alt="구글" />
            <span>Google 계정으로 로그인</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
