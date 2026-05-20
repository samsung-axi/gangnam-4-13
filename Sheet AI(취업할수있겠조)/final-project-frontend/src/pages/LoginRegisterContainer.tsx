import React, { useState, useEffect } from 'react';
import styles from './LoginRegisterContainer.module.css';
import Header from '../shared/components/Header';
import { useNavigate } from 'react-router-dom';
import { useAuthState } from '@/shared/hooks/useAuthState';
import { dummyUsers } from '@/shared/data/dummyUsers';

const LoginRegisterContainer: React.FC = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const navigate = useNavigate();
  const { login } = useAuthState();

  // 회원가입 input 상태 추가
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupPasswordConfirm, setSignupPasswordConfirm] = useState('');

  // 기존 더미 유저 데이터 - 주석처리
  const [users, setUsers] = useState(dummyUsers);

  // USER 테이블 기준 더미데이터 예시
  // const [users, setUsers] = useState([
  //   {
  //     id: 1,
  //     userId: 'cofl@gmail.com',
  //     password: 'test1234!',
  //     ip: '192.168.1.10',
  //     enabled: true,
  //     dateCreated: '2024-06-01T10:00:00',
  //     dateWithdraw: null,
  //     withdraw: false,
  //   },
  // ]);

  // 더미 로그인 로직 - 주석처리
  // const handleLogin = (e: React.FormEvent) => {
  //   e.preventDefault();
  //   const matchedUser = users.find(
  //     (user) =>
  //       user.userId === emailInput.trim() &&
  //       user.password === passwordInput &&
  //       user.enabled &&
  //       !user.withdraw
  //   );

  //   if (matchedUser) {
  //     login();
  //     navigate('/');
  //   } else {
  //     alert('이메일 또는 비밀번호가 잘못되었거나, 탈퇴된 계정입니다.');
  //   }
  // };

  // 백엔드 연동 로그인
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:8080/api/user/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: emailInput.trim(),  // 변수명은 emailInput이지만 실제로는 userId를 보내고 있음
          password: passwordInput,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        // 토큰 저장 - 이제 login 함수 내에서 처리됨
        login(data.token);  // 토큰을 직접 전달
        navigate('/');
      } else {
        alert(data.error || '로그인 실패! 아이디/비밀번호를 확인해주세요.');
      }
    } catch (error) {
      console.error('로그인 오류:', error);
      alert('로그인 요청 중 오류 발생!');
    }
  };

  // 백엔드 연동 회원가입
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    // 여기부터 검증 로직 추가!
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/;

    if (!emailRegex.test(signupEmail.trim())) {
      alert('유효한 이메일 형식이 아닙니다.');
      return;
    }

    if (!specialCharRegex.test(signupPassword)) {
      alert('비밀번호에 특수문자가 1개 이상 포함되어야 합니다.');
      return;
    }

    if (signupPassword.length < 8 || signupPassword.length > 32) {
      alert('비밀번호는 8자 이상 32자 이하로 입력해주세요.');
      return;
    }

    if (signupPassword !== signupPasswordConfirm) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }

    if (signupPassword !== signupPasswordConfirm) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }

    try {
      const response = await fetch('http://localhost:8080/api/user/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: signupEmail.trim(),
          password: signupPassword,
          isDirectSignup: true,
        }),
      });

      if (response.ok) {
        alert('회원가입 성공! 로그인 해주세요.');
        setIsSignUp(false);
        // 입력 초기화
        setSignupEmail('');
        setSignupPassword('');
        setSignupPasswordConfirm('');
      } else {
        alert('회원가입 실패! 이미 가입된 이메일일 수 있습니다.');
      }
    } catch (error) {
      console.error('회원가입 오류:', error);
      alert('회원가입 요청 중 오류 발생!');
    }
  };

  return (
    <div>
      <Header onBack={() => navigate(-1)} transparent={false} />

      <div className={`${styles.container} ${isSignUp ? styles.rightPanelActive : ''}`}>
        {/* 로그인 폼 */}
        <div className={styles.formContainer + ' ' + styles.signInContainer}>
          <form onSubmit={handleLogin}>
            <img src="src/assets/image/logo.png" alt="logo" className={styles.logo} />
            <input
              type="email"
              placeholder="이메일"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="비밀번호"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              required
            />
            <button type="submit" className={styles.primaryButton}>로그인</button>
            <div className={styles.linkContainer}>
              <button onClick={() => navigate("/request-password-reset")}>비밀번호 찾기</button>
              <a href="#">아이디 찾기</a>
            </div>
            <button
              type="button"
              className={styles.googleButton}
              onClick={() => {
                window.location.href = "http://localhost:8080/oauth2/authorization/google";
              }}
            >
              구글로 시작하기
            </button>
          </form>
        </div>

        {/* 회원가입 폼 */}
        <div className={styles.formContainer + ' ' + styles.signUpContainer}>
          <form onSubmit={handleSignup}>
            <img src="src/assets/image/logo.png" alt="logo" className={styles.logo} />

            <label className={styles.inputLabel}>이메일</label>
            <input
              type="email"
              placeholder="example@inflab.com"
              value={signupEmail}
              onChange={(e) => setSignupEmail(e.target.value)}
              required
            />

            <label className={styles.inputLabel}>비밀번호</label>
            <input
              type="password"
              placeholder="비밀번호"
              value={signupPassword}
              onChange={(e) => setSignupPassword(e.target.value)}
              required
            />
            <div className={styles.passwordHint}>영문/숫자/특수문자 중, 2가지 이상 포함</div>
            <div className={styles.passwordHint}>8자 이상 32자 이하 입력 (공백 제외)</div>

            <label className={styles.inputLabel}>비밀번호 확인</label>
            <input
              type="password"
              placeholder="비밀번호 확인"
              value={signupPasswordConfirm}
              onChange={(e) => setSignupPasswordConfirm(e.target.value)}
              required
            />

            <button type="submit" className={styles.primaryButton}>회원가입</button>
          </form>
        </div>

        {/* 오버레이 */}
        <div className={styles.overlayContainer}>
          <div className={styles.overlay}>
            <video
              autoPlay
              muted
              loop
              playsInline
              className={styles.videoBackground}
            >
              <source src="src/assets/image/small.mp4" type="video/mp4" />
            </video>

            <div className={styles.overlayPanel + ' ' + styles.overlayLeft}>
              <h1>SHEETAI 의 회원이신가요?</h1>
              <button
                className={styles.secondaryButton}
                onClick={() => setIsSignUp(false)}
              >
                로그인
              </button>
            </div>
            <div className={styles.overlayPanel + ' ' + styles.overlayRight}>
              <h1>아직 SHEETAI 의 회원이 아니신가요?</h1>
              <button
                className={styles.secondaryButton}
                onClick={() => setIsSignUp(true)}
              >
                회원가입
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginRegisterContainer;
