import React, { useState, useEffect } from 'react';
import seniorImage from '../../assets/images/main-removebg.png';
import '../../assets/css/welcome.css';
import { useNavigate } from 'react-router-dom';
import Header from '../Header';
import Footer from '../Footer';


const Welcome = () => {
  const navigate = useNavigate();
  const [textIndex, setTextIndex] = useState(0);
  const [subTextIndex, setSubTextIndex] = useState(0);

  const texts = [
    "활기찬 인생 2막,\n지금 시작하세요.",
    "내 주변,\n내가 원하는 일자리!",
    "이력서,\n작성이 어려우신가요?"
  ]

  const subTexts = [
    "새로운 시작에는 나이 제한이 없습니다.\n당신의 경험이 우리 사회의 보물입니다.",
    "AI와 대화하며 받아보는 나의 맞춤 채용 정보!\n더 쉽게, 더 간편하게!",
    "챗봇과 간편하게 이력서 작성!\n빠르고 쉽게 완성하는 나의 이력서"
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setTextIndex((prevIndex) => (prevIndex + 1) % texts.length);
      setSubTextIndex((prevIndex) => (prevIndex + 1) % subTexts.length);
    }, 3000); // 2초마다 변경

    return () => clearInterval(interval)
  }, []);

  return (
    <>
      <div className="form-section">
        <Header />
        <div className="welcome-content">
          <p className="welcome-text">
            {texts[textIndex].split('\n').map((line, i) => (
              <React.Fragment key={i}>
                {line}
                {i < texts[textIndex].split('\n').length - 1 && <br />}
              </React.Fragment>
            ))}
          </p>
          <p className="welcome-subtext">
            {subTexts[subTextIndex].split('\n').map((line, i) => (
              <React.Fragment key={i}>
                {line}
                {i < subTexts[subTextIndex].split('\n').length - 1 && <br />}
              </React.Fragment>
            ))}
          </p>
          <div className="welcome-image">
            <img src={seniorImage} alt="메인이미지" />
          </div>
        </div>
        {/* 로그인 및 버튼 영역 */}
        <div className="welcome-footer">
          <div className="login-section">
            <span>이미 가입하셨나요?</span>
            <span className="login-link" onClick={() => navigate('/register')}>로그인</span>
          </div>
          <div className="buttons-container">
            <button className="register-button" onClick={() => navigate('/register')}>회원가입</button>
            {/* <button className="guest-link-button" onClick={() => navigate('/intro')}> */}
            <button className="guest-link-button" onClick={() => navigate('/index')}>
              비회원으로 시작하기
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Welcome;
