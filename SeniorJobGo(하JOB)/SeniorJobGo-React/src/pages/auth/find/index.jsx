// pages/auth/find/index.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './styles/find.module.scss';
import Header from '@components/Header/Header';
import Footer from '@components/Footer/Footer';

const FindAccount = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('id'); // 'id' or 'password'
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    userId: '', // 비밀번호 찾기 시 사용
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // 실제 구현 시 API 호출
    console.log('Form submitted:', formData);
  };

  return (
    <div className={styles.page}>
      <Header />
      <main className={styles.content}>
        <div className={styles.find}>
          <div className={styles.find__title}>
            <i className='bx bx-chevron-left' onClick={() => navigate(-1)}></i>
            <span>계정 찾기</span>
          </div>

          <div className={styles.tabs}>
            <button
              className={`${styles.tabs__button} ${activeTab === 'id' ? styles.active : ''}`}
              onClick={() => setActiveTab('id')}
            >
              아이디 찾기
            </button>
            <button
              className={`${styles.tabs__button} ${activeTab === 'password' ? styles.active : ''}`}
              onClick={() => setActiveTab('password')}
            >
              비밀번호 찾기
            </button>
          </div>

          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.form__content}>
              {activeTab === 'id' ? (
                // 아이디 찾기 폼
                <>
                  <div className={styles.inputGroup}>
                    <label>이름</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="이름을 입력해주세요"
                    />
                  </div>
                  <div className={styles.inputGroup}>
                    <label>이메일</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="이메일을 입력해주세요"
                    />
                  </div>
                </>
              ) : (
                // 비밀번호 찾기 폼
                <>
                  <div className={styles.inputGroup}>
                    <label>아이디</label>
                    <input
                      type="text"
                      name="userId"
                      value={formData.userId}
                      onChange={handleInputChange}
                      placeholder="아이디를 입력해주세요"
                    />
                  </div>
                  <div className={styles.inputGroup}>
                    <label>이메일</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="이메일을 입력해주세요"
                    />
                  </div>
                </>
              )}
            </div>

            <div className={styles.form__footer}>
              <button type="submit" className={styles.submitButton}>
                {activeTab === 'id' ? '아이디 찾기' : '비밀번호 찾기'}
              </button>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default FindAccount;
