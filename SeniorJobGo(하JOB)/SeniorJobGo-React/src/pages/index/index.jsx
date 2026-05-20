import React from 'react'
import Header from '@components/Header/Header';
import Footer from '@components/Footer/Footer';
import styles from './styles/index.module.scss';
import IntroImage from '@assets/images/intro-illust.png';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '@/config';

const Index = () => {
  const navigate = useNavigate();
  const [textIndex, setTextIndex] = useState(0);
  const [subTextIndex, setSubTextIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(true);

  const texts = [
    "활기찬 인생 2막,\n지금 시작하세요.",
    "내 주변,\n내가 원하는 일자리!",
    "이력서,\n작성이 어려우신가요?"
  ]

  const subTexts = [
    "새로운 시작에는 나이 제한이 없습니다.\n당신의 경험이 우리 사회의 보물입니다.",
    "AI 취업도우미와 대화하며 받아보는\n나의 맞춤 채용 정보!",
    "챗봇과 간편하게 이력서 작성!\n빠르고 쉽게 완성하는 나의 이력서"
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(false); // fadeout 시작

      setTimeout(() => {
        setTextIndex((prevIndex) => (prevIndex + 1) % texts.length);
        setSubTextIndex((prevIndex) => (prevIndex + 1) % subTexts.length);
        setIsAnimating(true); // 새 텍스트와 함께 fadein 시작
      }, 500); // fadeout 완료 후 텍스트 변경
    }, 3000); // 2초마다 변경

    return () => clearInterval(interval)
  }, []);

  const GuestLogin = async () => {
    const cookie = document.cookie;
    const sjgpr = cookie.split('; ').find(row => row.startsWith('sjgpr='));

    if (cookie.includes("sjgid") && sjgpr.includes("none")) {
      navigate('/chat');
    } else {
      const response = await fetch(`${API_BASE_URL}/auth/login/guest`, {
        method: 'POST',
        credentials: 'include'
      });

      if (response.ok) {
        navigate('/chat');
      }
    }
  }

  // 쿠키에 로그인 정보가 있다면 채팅 페이지로 이동
  useEffect(() => {
    const cookie = document.cookie;
    const sjgpr = cookie.split('; ').find(row => row.startsWith('sjgpr='));

    if (cookie.includes("sjgid") && !sjgpr.includes("none")) {
      navigate('/chat');
    }
  }, []);

  return (
    <div className={styles.page}>
      <Header />
      <main className={styles.content}>
      <div className={styles.intro}>
          <h2 className={`${styles.intro__title} ${isAnimating ? styles.visible : ''}`}>
            {texts[textIndex].split('\n').map((line, i) => (
              <React.Fragment key={i}>
                {line}
                {i < texts[textIndex].split('\n').length - 1 && <br />}
              </React.Fragment>
            ))}
          </h2>
          <p className={`${styles.intro__subtitle} ${isAnimating ? styles.visible : ''}`}>
            {subTexts[subTextIndex].split('\n').map((line, i) => (
              <React.Fragment key={i}>
                {line}
                {i < subTexts[subTextIndex].split('\n').length - 1 && <br />}
              </React.Fragment>
            ))}
          </p>
          <div className={styles.intro__image}>
            <img src={IntroImage} alt="인트로 일러스트" />
          </div>
        </div>
        <div className={styles.auth}>
          <div className={styles.auth__login}>
            <span>아직 회원이 아니신가요?</span>
            <span className={styles.auth__signupBtn} onClick={() => navigate('/signup')}>
              회원가입
            </span>
          </div>
          <div className={styles.auth__buttons}>
            <button className={styles.auth__signinBtn} onClick={() => navigate('/signin')}>
              로그인하기
            </button>
            <button className={styles.auth__guestBtn} onClick={GuestLogin}>
              비회원으로 시작하기
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Index;



// function index() {
//   return (
//     <div className={styles.page}>
//       {/* 공통 HEADER UI 부분 */}
//       {/* 공통 NAVIGATION UI 부분 */}
//       <div className={styles.page__contents}>
//         <div className={styles.page__contents__introBox}></div>
//       </div>
//     </div>
//   )
// }

// export default index