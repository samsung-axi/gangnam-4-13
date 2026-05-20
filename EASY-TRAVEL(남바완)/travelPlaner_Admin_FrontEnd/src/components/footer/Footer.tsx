import React from "react";
import styles from "./Footer.module.scss";

const Footer = () => {
  return (
    <footer className={styles.footerContainer}>
      <div className={styles.footerText1}>
        <a href="/terms">이용약관</a>
        <span> | </span>
        <a href="/privacy">개인정보 처리방침</a>
        <span> | </span>
        <a href="/contact">1:1문의</a>
      </div>
      <div className={styles.footerText2}>
        <p>
          주식회사: <span>남바완</span>
        </p>
        <p>
          대표: <span>조예현</span>
        </p>
        <p>
          주소: <span>서울시 강남구 행복동</span>
        </p>
        <p>
          이메일: <span>contact@nambawan.kr</span>
        </p>
      </div>
      <div className={styles.footerText3}>
        <p>Copyright @ nambawan. All Rights Reserved</p>
      </div>
    </footer>
  );
};

export default Footer;
