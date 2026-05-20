//import 라이브러리
import React from "react";
import "./Footer.css";

const Footer = () => {
  /*---라우터 관련-------------------------------*/

  /*---상태관리 변수들(값이 변화면 화면 랜더링 )---*/

  /*---일반 변수--------------------------------*/

  /*---일반 메소드 -----------------------------*/

  /*---훅(useEffect)+이벤트(handle)메소드-------*/

  return (
    <footer id="footer-container">
      <div className="footer-text-1">
        <a href="/terms">이용약관</a>
        <span> | </span>
        <a href="/privacy">개인정보 처리방침</a>
        <span> | </span>
        <a href="/contact">1:1문의</a>
      </div>
      <div className="footer-text-2">
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
      <div className="footer-text-3">
        <p>Copyright @ nambawan. All Rights Reserved</p>
      </div>
    </footer>
  );
};

export default Footer;
