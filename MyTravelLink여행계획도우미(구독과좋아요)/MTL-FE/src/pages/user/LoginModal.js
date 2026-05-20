import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../../css/login/LoginModal.css';
import googleLogo from '../../images/google_logo.png';
import Logo from '../../images/LOGO.png';
import backArrowIcon from '../../images/backArrow.svg';

const LoginModal = ({ isOpen, onClose }) => {
    const navigate = useNavigate();

    if (!isOpen) {
        console.log("[LoginModal] Modal is not open.");
        return null;
    }

    const handleGoogleLogin = () => {
        console.log("[LoginModal] Google login button clicked");
        const clientId = '493235437055-i3vpr6aqus0mqfarsvfm65j2rkllo97t.apps.googleusercontent.com';
        const redirectUri = 'https://mytravellink.site/auth/google/callback';
        const scope = 'profile email';
        const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}`;
        console.log("[LoginModal] Redirecting to Google auth URL:", authUrl);
        window.location.href = authUrl;
    };

    const handleClose = () => {
        console.log("[LoginModal] Closing modal");
        onClose(); // 모달 닫기
        console.log("[LoginModal] Navigating to landing page");
        navigate('/'); // 랜딩페이지로 이동
    };

    return (
        <div className="WS-login" onClick={handleClose}>
            <div className='WS-login-header-Container'>
                <button className='WS-login-back-button' onClick={handleClose}>
                    <img className='WS-TravelInfo-Header-Left-Back-Btn-Icon'
                        src={backArrowIcon}
                        alt="backArrowIcon"
                    />
                </button>
            </div>

            <div className="WS-login-body-container" onClick={e => {
                e.stopPropagation();
                console.log("[LoginModal] Preventing propagation");
            }}>
                <div className='WS-login-logo'>
                    <img src={Logo} alt="Logo" />
                </div>

                <div className='WS-login-button' onClick={handleGoogleLogin}>
                    <img src={googleLogo} alt="Google Logo" />
                    <span>구글 계정으로 시작하기</span>
                </div>

                <div className='WS-login-message-container'>
                    <div>개인정보방침</div>
                    <div>이용약관</div>
                </div>
            </div>
        </div>
    );
};

export default LoginModal;