// pages/auth/signup/index.jsx
import React, { useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import styles from './styles/signup.module.scss';
import Header from '@components/Header/Header';
import Footer from '@components/Footer/Footer';

const Signup = () => {
  const navigate = useNavigate();
  
  const KAKAO_CLIENT_ID = import.meta.env.VITE_KAKAO_JS_KEY;
  const REDIRECT_URI = import.meta.env.VITE_KAKAO_REDIRECT_URI;

  const handleKakaoLogin = () => {
    window.location.href = `https://kauth.kakao.com/oauth/authorize?client_id=${KAKAO_CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code`;
  };

  // 쿠키에 로그인 정보가 있고 비회원이 아니면 채팅 페이지로 이동
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
          <div className={styles.circles}>
            <div className={styles.circles__item1}></div>
            <div className={styles.circles__item2}></div>
            <h2 className={styles.intro__title}>
              <span>간편로그인으로</span><br />
              <span>빠르게 가입하세요</span>
            </h2>
            <div className={styles.circles__item3}></div>
          </div>
          <div className={styles.buttons}>
            <button className={styles.buttons__social} onClick={handleKakaoLogin}>
              <span className={styles.buttons__icon}>
                <i className='bx bxs-message-rounded'></i>
              </span>
              카카오로 시작하기
            </button>
            <button className={styles.buttons__social} onClick={() => navigate('/signup/id')}>
              간편 아이디로 시작하기
            </button>
          </div>
          <div className={styles.login}>
            <span>이미 가입하셨나요?</span>
            <button className={styles.login__link} onClick={() => navigate('/signin')}>
              로그인하기
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Signup;