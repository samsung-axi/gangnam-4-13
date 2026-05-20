import styles from './Header.module.scss';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

const Header = () => {
  const navigate = useNavigate();
  const [Buttons, setButtons] = useState(null);

  useEffect(() => {
      // 쿠키에 로그인 정보가 있다면 로그아웃 버튼 표시
      const cookie = document?.cookie;

      // 현재 엔드포인트가 "/chat"이고 쿠키가 없다면 로그인 페이지로 이동
      if (window.location.pathname === "/chat" && !cookie) {
        navigate('/');
      }

      const isLoggedIn = cookie.includes("sjgid") && cookie.includes("sjgpr");
      const provider = cookie.split("; ").find(row => row.startsWith("sjgpr="))?.split("=")[1];
      const isMember = provider != 'none';

      if (isLoggedIn) {
        if (isMember) {
          const handleLogout = () => {
            document.cookie = "sjgid=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            document.cookie = "sjgpr=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            navigate('/');
          }

          setButtons(<button className={styles.logoutButton} onClick={handleLogout}>로그아웃</button>);
        } else {
          setButtons(<button className={styles.loginButton} onClick={() => navigate('/signin')}>로그인</button>);
        }
      }
  }, []);

  return (
    <header className={styles.header}>
      <div className={styles.headerContent}>
        <h1 className={styles.headerLogo}>
          <span onClick={() => navigate('/')}>시니어JobGo</span>
        </h1>
        <div className={styles.headerButtons}>
          {Buttons}
        </div>
      </div>
    </header>
  );
};

export default Header;