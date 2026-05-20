import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../../assets/css/registerIntro.css';

const RegisterIntro = () => {
    const navigate = useNavigate();

    return (
        <div className="hmk-form-section">
            <div className="hmk-form-header">
                <button
                    className="hmk-back-button"
                    onClick={() => navigate(-1)}
                >
                    ←
                </button>
            </div>

            <div className="hmk-register-intro-content">
                <div className="hmk-decorative-circles">
                    <div className="circle circle-1"></div>
                    <div className="circle circle-2"></div>
                    <h2 className="hmk-register-intro-title">
                        <span>간편로그인으로</span><br />
                        <span>빠르게 가입하세요</span>
                    </h2>
                    <div className="circle circle-3"></div>
                </div>

                <div className="hmk-social-buttons">
                    <button className="hmk-social-button">
                        <span className="icon">💬</span>
                        카카오로 시작하기
                    </button>
                    <button 
                        className="hmk-social-button"
                        onClick={() => navigate('/register/form')}
                    >
                        JOBGO 아이디로 가입하기
                    </button>
                </div>

                <div className="hmk-login-section">
                    <span>이미 가입하셨나요?</span>
                    <button className="hmk-login-link">로그인하기</button>
                </div>

                <div className="hmk-terms-section">
                    <p>다음으로 이동 시 이용에 동의한 것으로 간주됩니다.</p>
                    <div className="hmk-terms-links">
                        <a href="#">이용약관</a>
                        <span>&</span>
                        <a href="#">개인정보처리방침</a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegisterIntro; 