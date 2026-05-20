import React from "react";
import "../../css/mypage/AccountSettings.css";
import GoogleLogo from "../../images/google_logo.png";
import { useNavigate } from 'react-router-dom';

function AccountSettings( { userInfo, onBack }) {
  const navigate = useNavigate();
  // 나중에 구글 로그아웃 구현을 위한 주석 처리
  const handleLogout = async () => {
    try {
      // 여기에 로컬스토리지에 저장된 모든 데이터 삭제
      localStorage.clear();
      navigate('/');
    } catch (error) {
      console.error('로그아웃 실패:', error);
    }
  };

  return (
    <div className="SJ_account_settings">
      <div className="SJ_settings_header">
        <button onClick={onBack} className="SJ_back_button">
          &lt;
        </button>
        <h1>내 정보 관리</h1>
      </div>

      <div className="SJ_settings_content">
        <div className="SJ_settings_section">
          <p className="SJ_section_label">이름</p>
          <div className="SJ_section_content">
            <p>{userInfo.name}</p>
          </div>
        </div>

        <div className="SJ_settings_section">
          <p className="SJ_section_label">이메일</p>
          <div className="SJ_section_content">
            <p>{userInfo.email}</p>
          </div>
        </div>
      </div>

      <div className="SJ_login_options">
        {/* <div className="SJ_google_login">
          <img src={GoogleLogo} alt="Google" className="SJ_google_icon" />
          구글로그인
        </div> */}
        <button
          className="SJ_logout_button"
          onClick={handleLogout} 
        >
          로그아웃
        </button>
      </div>

      {/* <div className="SJ_withdrawal">
        <button className="SJ_withdrawal_link">회원탈퇴</button>
      </div> */}
    </div>
  );
}

export default AccountSettings;
