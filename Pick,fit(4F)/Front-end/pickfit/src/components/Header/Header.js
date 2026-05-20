import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import LoginModal from "../../modal/LoginModal";
import LogoutModal from "../../modal/LogoutModal";
import HeaderLogo from "./HeaderLogo";
import HeaderIcons from "./HeaderIcons";
import HeaderWelcome from "./HeaderWelcome";

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [remainingTime, setRemainingTime] = useState(3600); // 초기 세션 시간 (1시간)
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isLoginPromptModalOpen, setIsLoginPromptModalOpen] = useState(false);
  const navigate = useNavigate();

  // 환경 변수로 API URL을 가져옵니다.
  const API_URL = process.env.REACT_APP_API_URL;
  // const  = process.env.REACT_Store_API_URL;

  // 데이터 만료 시간 설정 (1시간)
  const expiryTime = 3600 * 1000; // 1시간 (밀리초 단위)

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/user`, { withCredentials: true });

        // 받은 데이터 콘솔 로그로 출력
        console.log("Received user data:", response.data);

        // response.data에서 email을 localStorage에 저장
        const { name, email } = response.data;
        const currentTime = Date.now();

        localStorage.setItem("userEmail", email); // 이메일을 localStorage에 저장
        localStorage.setItem("userName", name);  // 이름을 localStorage에 저장
        localStorage.setItem("userTimestamp", currentTime); // 저장 시각 추가

        setUserName(name);
        setIsLoggedIn(true);
      } catch (error) {
        console.error("Failed to fetch user data:", error.response || error.message);
        setIsLoggedIn(false);
      }
    };

    const validateUserSession = () => {
      const userTimestamp = localStorage.getItem("userTimestamp");

      if (userTimestamp && Date.now() - userTimestamp > expiryTime) {
        // 세션이 만료되었을 경우
        localStorage.removeItem("userEmail");
        localStorage.removeItem("userName");
        localStorage.removeItem("userTimestamp");
        setIsLoggedIn(false);
        setUserName("");
        console.log("Session expired. User data cleared.");
      } else if (userTimestamp) {
        setIsLoggedIn(true);
        setUserName(localStorage.getItem("userName"));
        console.log("Session validated. User is still logged in.");
      }
    };

    fetchUserData();
    validateUserSession();

    const interval = setInterval(() => {
      setRemainingTime((prevTime) => Math.max(prevTime - 1, 0));
    }, 1000);

    return () => clearInterval(interval);
  }, [API_URL]);

  const handleLogoutClick = () => {
    setIsLogoutModalOpen(true);
  };

  const handleLogoutConfirm = () => {
    axios
      .post(`${API_URL}/api/logout`, {}, { withCredentials: true })
      .then(() => {
        localStorage.removeItem("userEmail");
        localStorage.removeItem("userName");
        localStorage.removeItem("userTimestamp");
        setIsLoggedIn(false);
        setUserName("");
        setRemainingTime(0);
        navigate("/login");
      })
      .catch((error) => console.error("Failed to logout:", error))
      .finally(() => setIsLogoutModalOpen(false));
  };

  const handleLogoutCancel = () => {
    setIsLogoutModalOpen(false);
  };

  const handleLoginPromptConfirm = () => {
    setIsLoginPromptModalOpen(false);
    navigate("/login");
  };

  return (
    <header style={styles.header}>
      <HeaderLogo navigate={navigate} />
      <HeaderWelcome
        isLoggedIn={isLoggedIn}
        userName={userName}
        remainingTime={remainingTime}
      />
      <HeaderIcons
        isLoggedIn={isLoggedIn}
        navigate={navigate}
        onLogoutClick={handleLogoutClick}
      />

      <LogoutModal
        isOpen={isLogoutModalOpen}
        onConfirm={handleLogoutConfirm}
        onCancel={handleLogoutCancel}
      />
      <LoginModal isOpen={isLoginPromptModalOpen} onConfirm={handleLoginPromptConfirm} />
    </header>
  );
};

const styles = {
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    backgroundColor: "#333",
    color: "#fff",
    boxShadow: "0 4px 2px -2px gray",
    padding: "8px 16px",
  },
};

export default Header;