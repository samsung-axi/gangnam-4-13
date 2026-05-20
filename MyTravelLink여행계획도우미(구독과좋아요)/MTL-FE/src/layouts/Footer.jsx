import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaComments } from "react-icons/fa";
import "../css/layout/Footer.css";
import LINK from "../images/Link.png";
import TRAVEL from "../images/Travel.png";
import MYPAGE from "../images/MyPage.png";
import Wish from "./Wish";
import Wish_icon from "../images/wish_icon.png"; 

const FooterComponent = () => {
  const [isWishOpen, setIsWishOpen] = useState(false);
  const location = useLocation();
  const currentPath = location.pathname.toLowerCase();

  // 모달이 열려있을 때는 Footer를 숨김
  const isModalPath = currentPath.includes("/select-modal");

  if (isModalPath) return null;

  const getClassName = (path) => {
    switch (path) {
      case "/link":
        return `WS-Footer-Item${
          currentPath.startsWith("/link") ? " active" : ""
        }`;
      case "/travel":
        return `WS-Footer-Item${
          currentPath.startsWith("/travel") ? " active" : ""
        }`;
      case "/mypage":
        return `WS-Footer-Item${
          currentPath.startsWith("/mypage") ? " active" : ""
        }`;
      default:
        return "WS-Footer-Item";
    }
  };

  return (
    <>
      <footer className="WS-Main-Footer">
        {/* Link 메뉴 아이템 */}
        <Link to="/link" className={getClassName("/link")}>
          <img src={LINK} alt="Link" className="WS-Footer-Link" />
          <div className="WS-Footer-Text">Link</div>
        </Link>

        {/* Travel 메뉴 아이템 */}
        <Link to="/travel" className={getClassName("/travel")}>
          <img src={TRAVEL} alt="Travel" className="WS-Footer-Travel" />
          <div className="WS-Footer-Text">Travel</div>
        </Link>

        {/* MyPage 메뉴 아이템 */}
        <Link to="/mypage" className={getClassName("/mypage")}>
          <img src={MYPAGE} alt="MyPage" className="WS-Footer-MyPage" />
          <div className="WS-Footer-Text">MyPage</div>
        </Link>

        {/* Wish 버튼 */}
        {/* 위시 이미지로 변경 보류 */}
        <div className="WS-Footer-Item" onClick={() => setIsWishOpen(true)}>
          <img src={Wish_icon} className="WS-Footer-Wish" />
          <div className="WS-Footer-Text">Wish</div>
        </div>
      </footer>
      {isWishOpen && <Wish onClose={() => setIsWishOpen(false)} />}
    </>
  );
};

export default FooterComponent;

// 완료 ==================================================================
