import React from "react";
import styles from "./Header.module.scss";
import { Link, useNavigate } from "react-router-dom";

interface HeaderProps {
  toggleSideBar: () => void;
  closeSideBar: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleSideBar, closeSideBar }) => {
  const navigate = useNavigate();

  const handleMain = () => {
    navigate("/");
    closeSideBar()
  }

  return (
    <div className={styles.headerContainer}>
      <div className={styles.headerArea}>
        <div className={styles.logoContainer}>
          <div onClick={handleMain}>
            <img className={styles.logo} src="/icons/Easy_Travel.png" alt="로고" />
          </div>
        </div>

        <div className={styles.textContainer}>
          <p className={styles.memberNickname}>
            <span>관리자</span>
          </p>
          <img
            className={styles.sideMenuBtn}
            src="/icons/hamburger_menu.png"
            alt="메뉴"
            onClick={toggleSideBar}
          />
        </div>
      </div>
    </div>
  );
};

export default Header;
