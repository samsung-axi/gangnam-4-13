import React, { useEffect } from 'react';
import "./SideBar.css";
import { Link } from "react-router-dom";
import MemberStore from "../../stores/MemberStore";
import { API_BASE_URL, ADMIN_URL } from "../../config";
import axios from "axios";

interface SideBarProps {
  closeSideBar: () => void;
  isSideBarVisible: boolean;
  navigateAndCloseSideBar: (path: string) => void;
  handleMyPlans: () => void;
}

const SideBar: React.FC<SideBarProps> = ({
  isSideBarVisible,
  closeSideBar,
  navigateAndCloseSideBar,
  handleMyPlans,
}) => {
  const isAnonymous = MemberStore((state: any) => state.isAnonymous);
  const initMemberInfo = MemberStore((state: any) => state.initMemberInfo);
  const isAdmin = MemberStore((state: any) => state.isAdmin);

  useEffect(() => {
    console.log("관리자 여부:", isAdmin());
    console.log("회원 정보:", MemberStore.getState().memberInfo);
  }, []);

  const handleLogin = () => {
    navigateAndCloseSideBar("/loginForm");
  };

  const handleLogout = () => {
    try {
      initMemberInfo();
      axios.get(`${API_BASE_URL}/members/logout`, { withCredentials: true });
      navigateAndCloseSideBar("/");
    } catch (error) {
      console.error("로그아웃 오류:", error);
    }
  };

  if (!isSideBarVisible) {
    return null;
  }

  return (
    <aside id="sideBar-container">
      <h2 className="none">sideBar</h2>
      <ul className="sideBar-contents">
        <li>
          <div className="sideBar-header">
            <img
              className="close-btn"
              src="/icons/close.jpg"
              alt="close"
              onClick={closeSideBar}
            />
          </div>
          {isAnonymous() ? (
            <div className="sideBar-1" onClick={handleLogin}>
              로그인
              <img src="/icons/arrow_forward.jpg" alt="login" />
            </div>
          ) : (
            <div className="sideBar-1" onClick={handleLogout}>
              로그아웃
              <img src="/icons/arrow_forward.jpg" alt="logout" />
            </div>
          )}
        </li>
        <li>
          <div className="sideBar-2 border-yellow">
            나의 일정
            <div className="sideBar-3" onClick={handleMyPlans}>
              나의 일정 확인
              <img src="/icons/arrow_forward.jpg" alt="MyPlan" />
            </div>
          </div>
        </li>
        <li>
          <div className="sideBar-2">
            내 정보
            <Link className="sideBar-3" to="/myInfo" onClick={closeSideBar}>
              내 정보 확인
              <img src="/icons/arrow_forward.jpg" alt="MyInfo" />
            </Link>
            <Link className="sideBar-3" to="/editMyInfo" onClick={closeSideBar}>
              개인 정보 수정
              <img src="/icons/arrow_forward.jpg" alt="editMyInfo" />
            </Link>
          </div>
        </li>
        <li>
          <div className="sideBar-2">
            고객 지원
            <Link className="sideBar-3" to="/ask" onClick={closeSideBar}>
              1:1문의
              <img src="/icons/arrow_forward.jpg" alt="ask" />
            </Link>
          </div>
        </li>
        {isAdmin() && (
  <li>
    <div className="sideBar-2">
      관리자
      <a className="sideBar-3" href={`${ADMIN_URL}/admin/chart/agent`} onClick={closeSideBar}>
        관리자 페이지
        <img src="/icons/arrow_forward.jpg" alt="admin" />
      </a>
    </div>
  </li>
)}
        
      </ul>
    </aside>
  );
};

export default SideBar;
