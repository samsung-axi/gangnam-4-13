import React from "react";
import "./Header.css";
import { Link, useNavigate } from "react-router-dom";
import MemberStore from "../../stores/MemberStore";

interface HeaderProps {
  toggleSideBar: () => void;
  closeSideBar: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleSideBar, closeSideBar }) => {
  const navigate = useNavigate();
  const memberInfo = MemberStore((state: any) => state.memberInfo);

  const handleMain = () => {
    navigate("/");
    closeSideBar()
  }

  return (
    <div id="header-container">
      <div className="header-area">
        <div className="logo-container">
          <div onClick={handleMain}>
            <img className="logo" src="/icons/Easy_Travel.png" alt="로고" />
          </div>
        </div>

        <div className="text-container">
          <img
            className="profile_img"
            src={
              memberInfo.profile_url
                ? memberInfo.profile_url
                : "/images/default_profile_img.png"
            }
            alt="프로필 이미지"
          />
          <p className="member-nickname">
            {memberInfo.nickname}
            <span>님</span>
          </p>
          <img
            className="side-menu-btn"
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
