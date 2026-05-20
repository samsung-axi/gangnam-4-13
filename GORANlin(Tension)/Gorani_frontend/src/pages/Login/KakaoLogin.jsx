import React from 'react';

const KakaoLogin = () => {
    const handleKakaoLogin = () => {
        const clientId = process.env.REACT_APP_KAKAO_ID;
        const redirectUri = process.env.REACT_APP_KAKAO_REDIRECT_URI;
        const scope = 'profile_nickname,account_email';
        const authUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}`;

        if (!clientId || !redirectUri) {
            console.error("환경 변수 설정 오류: REACT_APP_KAKAO_ID 또는 REACT_APP_KAKAO_REDIRECT_URI가 정의되지 않음.");
            alert("카카오 로그인 설정 오류: 관리자에게 문의하세요.");
            return;
        }

        console.log('KAKAO_ID:', clientId);
        console.log('Redirect URI:', redirectUri);

        // 현재 창 리다이렉트
        window.location.href = authUrl;
    };

    return (
        <button className="login-button kakao" onClick={handleKakaoLogin}>
            <img className='logo' src="/images/kakao.png" alt="kakao" />
            Kakao 계정으로 로그인
        </button>   
    );
};

export default KakaoLogin;
