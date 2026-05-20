// pages/auth/signup/components/SignupWithId.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from '../styles/signupWithId.module.scss';
import Header from '@components/Header/Header';
import Footer from '@components/Footer/Footer';
import { API_BASE_URL } from '@/config';

const SignupWithId = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    userId: '',
    password: '',
    passwordConfirm: '',
  });

  const [agreements, setAgreements] = useState({
    terms: false,
    privacy: false,
    all: false,
  });

  const [isFormValid, setIsFormValid] = useState(false);
  const [isIdChecked, setIsIdChecked] = useState(false);

  const handleInputChange = (e) => {
    const { name, value }= e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (name === 'userId') {
      idCheckMessage('', '');
      setIsIdChecked(false);
    }
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    if (name === 'all') {
      setAgreements({ terms: checked, privacy: checked, all: checked });
    } else {
      setAgreements(prev => ({
        ...prev,
        [name]: checked
      }));
    }
  };

  const handleSubmit = async () => {
    console.log(formData);
    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: 'POST',
      body: JSON.stringify(formData),
      credentials: 'include'
    });

    if (response.ok) {
      navigate('/chat');
    } else {
      const data = await response.json();
      alert(data.detail);
    }
  };

  function idCheckMessage(message, color) {
    const messageElement = document.getElementById('userId').querySelector('p');
    messageElement.textContent = message;
    messageElement.style.color = color;
    messageElement.style.display = 'block';
  }

  const handleCheckId = async () => {
    if (formData.userId.length < 5 || formData.userId.length > 20) {
      idCheckMessage('아이디는 5~20자 이어야 합니다.', 'red');
      return;
    }

    const response = await fetch(`${API_BASE_URL}/auth/check-id`, {
      method: 'POST',
      body: JSON.stringify({ id: formData.userId }),
      credentials: 'include'
    });
    const data = await response.json();
    if (data.is_duplicate) {
      idCheckMessage('중복된 아이디입니다.', 'red');
    } else {
      setIsIdChecked(true);
      idCheckMessage('사용 가능한 아이디입니다.', 'green');
    }
  };

  // 쿠키에 로그인 정보가 있고 비회원이 아니면 채팅 페이지로 이동
  useEffect(() => {
    const cookie = document.cookie;
    const sjgpr = cookie.split('; ').find(row => row.startsWith('sjgpr='));

    if (cookie.includes("sjgid") && !sjgpr.includes("none")) {
      navigate('/chat');
    }
  }, []);

  useEffect(() => {
    const isValid =
      formData.userId.length >= 5 &&
      formData.password.length >= 8 &&
      formData.password === formData.passwordConfirm &&
      agreements.terms &&
      agreements.privacy &&
      isIdChecked;

    setIsFormValid(isValid);
  }, [formData, agreements, isIdChecked]);

  return (
    <div className={styles.page}>
      <Header />
      <main className={styles.content}>
        <div className={styles.form}>
          <div className={styles.form__title}>
            <i className='bx bx-chevron-left' onClick={() => navigate(-1)}></i>
            <span>회원가입</span>
          </div>

          <div className={styles.form__content}>
            <div id="userId" className={styles.inputGroup}>
              <label>아이디<span className={styles.required}>*</span></label>
              <div className={styles.inputWithButton}>
                <input type="text" name="userId" value={formData.userId} onChange={handleInputChange} placeholder="5~20자 영문 혹은 영문+숫자 조합" />
                <button type="button" onClick={handleCheckId}>중복확인</button>
              </div>
              <p className={styles.errorMessage}>중복된 아이디입니다.</p>
            </div>

            <div className={styles.inputGroup}>
              <label>비밀번호<span className={styles.required}>*</span></label>
              <input type="password" name="password" value={formData.password} onChange={handleInputChange} placeholder="비밀번호를 입력해주세요" />
            </div>

            <div className={styles.inputGroup}>
              <label>비밀번호 확인<span className={styles.required}>*</span></label>
              <input type="password" name="passwordConfirm" value={formData.passwordConfirm} onChange={handleInputChange} placeholder="비밀번호를 다시 입력해주세요" />
              <p className={styles.inputHint}>비밀번호는 8자 이상, 2개 이상 문자를 조합해주세요.</p>
            </div>

            <div className={styles.agreement}>
              <h2 className={styles.agreement__title}>
                시니어잡고 이용을 위한<br />
                약관에 <span>동의</span>해주세요.
              </h2>
              <div className={styles.agreement__items}>
                <div className={styles.agreement__item}>
                  <label htmlFor="all">
                    전체 동의
                  </label>
                  <input type="checkbox" id="all" name="all" checked={agreements.all} onChange={handleCheckboxChange} />
                </div>
                <div className={styles.agreement__item}>
                  <label htmlFor="terms">
                    플랫폼 이용약관 
                    <span className={styles.required}>&#91;필수&#93;</span>
                  </label>
                  <input type="checkbox" id="terms" name="terms" checked={agreements.terms} onChange={handleCheckboxChange} />
                </div>
                <div className={styles.agreement__item}>
                  <label htmlFor="privacy">
                    개인정보 수집 및 이용 동의
                    <span className={styles.required}>&#91;필수&#93;</span>
                  </label>
                  <input type="checkbox" id="privacy" name="privacy" checked={agreements.privacy} onChange={handleCheckboxChange} />
                </div>
              </div>
            </div>
          </div>
          <div className={styles.form__footer}>
            <button type="submit" className={styles.submitButton} disabled={!isFormValid} onClick={handleSubmit}>
              가입하기
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SignupWithId;