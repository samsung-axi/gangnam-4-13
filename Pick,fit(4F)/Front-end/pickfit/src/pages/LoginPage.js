import React from "react";
import googleIcon from "../images/google.png"; // 구글 아이콘 이미지
import mainHeaderLogo from "../images/main_header_logo.png"; // 로고 이미지 경로

const googleOAuthUrl = process.env.REACT_APP_GOOGLE_OAUTH_URL;

const LoginPage = () => {
  const handleGoogleLogin = () => {
    // Home.js에서 사용했던 URL과 동일하게 설정
    window.location.href = googleOAuthUrl;
  };

  return (
    <div>

      {/* 로그인 페이지 컨텐츠 */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: 'calc(100vh - 60px)', // 헤더 높이를 제외한 영역
          marginTop: '60px', // 헤더와 간격 맞춤
        }}
      >
        {/* 로고 이미지 */}
        <img
          src={mainHeaderLogo}
          alt="Main Header Logo"
          style={{ width: '150px', marginBottom: '20px' }} // 로고 스타일
        />

        {/* 로그인 버튼 */}
        <button
          onClick={handleGoogleLogin}
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: '10px 20px',
            fontSize: '16px',
            cursor: 'pointer',
            backgroundColor: '#4285F4',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
          }}
        >
          <img
            src={googleIcon}
            alt="Google Icon"
            style={{ width: '20px', height: '20px', marginRight: '10px' }} // 아이콘 스타일
          />
          Google로 계속하기
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
