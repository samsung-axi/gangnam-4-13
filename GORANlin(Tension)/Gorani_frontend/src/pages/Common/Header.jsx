import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./../../assets/css/all.css";
import "./../../assets/css/Common/header.css";

const Header = ({ toggleModal, isLoggedIn, nickname, handleLogout }) => {
  const [showAccountBox, setShowAccountBox] = useState(false);
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const navigate = useNavigate();

  // 텍스트 목록
  const texts = ["GORANI", "TRANSLATION", "WELCOME"];

  useEffect(() => {
    // 텍스트 변경 로직
    const interval = setInterval(() => {
      setCurrentTextIndex((prevIndex) => (prevIndex + 1) % texts.length);
    }, 5000); // 5초마다 텍스트 변경

    return () => clearInterval(interval); // 컴포넌트 언마운트 시 정리
  }, [texts.length]);

  const toggleAccountBox = () => {
    setShowAccountBox((prev) => !prev);
  };

  const goToMyPage = () => {
    navigate("/myPage");
  };

  return (
    <header className="header">
      <div className="left-text">
        <img src="/images/logo_white.png" alt="GORANI Logo" className="logo" />
      </div>
      <div className="changing-title">
        <h1 key={texts[currentTextIndex]}>
          {texts[currentTextIndex].split("").map((char, index) => (
            <span
              key={index}
              className="letter in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {char}
            </span>
          ))}
        </h1>
      </div>
      <div className="non-changing-title">
        GORANI
      </div>
      {isLoggedIn ? (
        <div className="auth-buttons">
          <div
            className="account-button"
            onClick={toggleAccountBox}
            role="button"
          >
            {nickname}
          </div>
          {showAccountBox && (
            <div className="account-box">
              <button
                className="close-button"
                onClick={toggleAccountBox}
              >
                X 
              </button>
              <div className="email">{nickname}</div>
              <div className="version">
                <span>번역기</span>
                <span>무료버전</span>
              </div>
              <button className="myPage" onClick={goToMyPage}>
                계정
              </button>
              <button className="logOut" onClick={handleLogout}>
                로그아웃
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="login" onClick={toggleModal} role="button">
          로그인
        </div>
      )}
    </header>
  );
};

export default Header;
