import React from "react";

const GoogleLoginComponent = () => {
  const handleGoogleLogin = () => {
    const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;
    const redirectUri = process.env.REACT_APP_GOOGLE_REDIRECT_URI;

    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&scope=openid%20profile%20email`;

    console.log("Google Auth URL:", authUrl); // 디버깅용
    window.location.href = authUrl; // 구글 로그인 페이지로 리다이렉션
  };

  return (

    <button className="login-button google" onClick={handleGoogleLogin}>
      <img className="logo" src="../../images/google.png" alt="google" />
      Google 계정으로 로그인
    </button>

  );
};

export default GoogleLoginComponent;
