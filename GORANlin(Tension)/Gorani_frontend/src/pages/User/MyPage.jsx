import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../assets/css/User/myPage.css";
import MyPageModal from "./MyPageModal";
import { BsDisplay } from "react-icons/bs";

const MyPage = () => {
  // localStorage에서 userInfo 가져오기 및 초기화
  const parsedUserInfo = JSON.parse(localStorage.getItem("userInfo"));
  const [user, setUser] = useState(parsedUserInfo || {}); // 기본값을 빈 객체로 설정
  const navigate = useNavigate();
  const [isModalOpen, setModalOpen] = useState(false);

  // 메뉴와 콘텐츠 상태 관리
  const [activeMenu, setActiveMenu] = useState("accountInfo");

  // 기업 정보 버튼 클릭 시 모달 열기
  const handleCompanyButtonClick = () => {
    setModalOpen(true); // 모달 열기
  };

  // 모달 닫을 때 처리
  const handleModalClose = (updatedCompany) => {
    if (updatedCompany) {
      const updatedUser = {
        ...user,
        company: updatedCompany,
      };

      setUser(updatedUser);
      localStorage.setItem("userInfo", JSON.stringify(updatedUser)); // 🔹 localStorage 업데이트
    }
    setModalOpen(false); // 모달 닫기
  };

  // 콘텐츠 데이터
  const contentData = {
    accountInfo: (
      <div className="card">
        <h2>계정 정보</h2>
        <p>
          이메일: {user?.email}{" "}
          {user?.provider && (
            <img
              src={`${process.env.PUBLIC_URL}/images/${user.provider}.png`}
              alt={`${user.provider} Logo`}
              className="provider-logo"
            />
          )}
        </p>
        <p>이름: {user?.username}</p>
      </div>
    ),
    companyInfo: (
      <div className="card">
        <h2>기업 정보</h2>
        <p>기업명: {user.company ? user.company.name : "입력되지 않음"}</p>
        <p>
          사업자 등록번호:{" "}
          {user.company ? user.company.registrationNumber : "입력되지 않음"}
        </p>
        <p>
          대표자명:{" "}
          {user.company ? user.company.representativeName : "입력되지 않음"}
        </p>
        <div className="button-container">
          <button className="company-button" onClick={handleCompanyButtonClick}>
            {user.company ? "변경" : "입력"}
          </button>
        </div>
      </div>
    ),
    languageInfo: (
      <div className="card">
        <h2>언어 설정</h2>
        <p>한국어 </p>
        <div className="button-container">
          <button
            className="change-button"
            onClick={() => alert("서비스 준비중 입니다.")}
          >
            변경
          </button>
        </div>
      </div>
    ),
    upgradeInfo: (
      <div className="card">
        <h2>계정 업그레이드</h2>
        <p>Pro로 업그레이드하여 더욱 편리하게 번역할 수 있습니다.</p>
        <div className="button-container">
          <button
            className="compare-button"
            onClick={() => alert("서비스 준비중 입니다.")}
          >
            플랜 비교
          </button>
        </div>
      </div>
    ),
  };

  if (!user) {
    return <div className="card">로딩 중...</div>;
  }

  return (
    <div className="my-page">
      {/* 상단 메뉴 */}
      <div className="left-side"></div>
      <ul className="nav-menu">
        {/* 계정 정보 */}
        <li style={{ "--clr": "#ff253f" }}>
          <button
            onClick={() => setActiveMenu("accountInfo")}
            className={`nav-button ${
              activeMenu === "accountInfo" ? "active" : ""
            }`}
          >
            <i className="fa-solid fa-user"></i>
            <span>Account</span>
          </button>
        </li>

        {/* 기업 정보 */}
        <li style={{ "--clr": "#fff200" }}>
          <button
            onClick={() => setActiveMenu("companyInfo")}
            className={`nav-button ${
              activeMenu === "companyInfo" ? "active" : ""
            }`}
          >
            <i className="fa-solid fa-building"></i>
            <span>Company</span>
          </button>
        </li>

        {/* 언어 설정 */}
        <li style={{ "--clr": "#25d366" }}>
          <button
            onClick={() => setActiveMenu("languageInfo")}
            className={`nav-button ${
              activeMenu === "languageInfo" ? "active" : ""
            }`}
          >
            <i className="fa-solid fa-language"></i>
            <span>Language</span>
          </button>
        </li>

        {/* 계정 업그레이드 */}
        <li style={{ "--clr": "#f32ec8" }}>
          <button
            onClick={() => setActiveMenu("upgradeInfo")}
            className={`nav-button ${
              activeMenu === "upgradeInfo" ? "active" : ""
            }`}
          >
            <i className="fa-solid fa-level-up-alt"></i>
            <span>Upgrade</span>
          </button>
        </li>

        {/* Home 버튼 */}
        <li style={{ "--clr": "#2483ff" }}>
          <button
            onClick={() => navigate("/")}
            className={`nav-button ${activeMenu === "home" ? "active" : ""}`}
          >
            <i className="fa-solid fa-house"></i>
            <span>Home</span>
          </button>
        </li>
      </ul>

      {/* 콘텐츠 */}
      <div className="content">
        {contentData[activeMenu]}
      </div>

      {/* 모달 */}
      {isModalOpen && (
        <MyPageModal company={user.company} onClose={handleModalClose} />
      )}
      <div className="right-side"></div>
    </div>
  );
};

export default MyPage;
