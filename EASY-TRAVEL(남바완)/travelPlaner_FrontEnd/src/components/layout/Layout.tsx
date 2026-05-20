import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../header/Header";
import Footer from "../footer/Footer";
import MainContent from "../main/MainContent";
import "./Layout.css";
import SideBar from "../sideBar/SideBar";
import MemberStore from "../../stores/MemberStore";
import AlertModal from "../modal/AlertModal";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const isAnonymous = MemberStore((state: any) => state.isAnonymous);

  const [isSideBarVisible, setIsSideBarVisible] = useState<boolean>(false);
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  const [alertModalContent, setAlertModalContent] = useState("");

  const toggleSideBar = () => {
    setIsSideBarVisible(!isSideBarVisible);
  };

  const closeSideBar = () => {
    setIsSideBarVisible(false);
  };

  const navigateAndCloseSideBar = (path: string) => {
    navigate(path);
    closeSideBar();
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isAlertModalOpen) {
      timer = setTimeout(() => {
        setIsAlertModalOpen(false);
        navigate("/loginForm");
      }, 2000);
    }
    return () => clearTimeout(timer);
  }, [isAlertModalOpen, navigate]);

  const handleMyPlans = () => {
    if (isAnonymous()) {
      closeSideBar();
      console.log("사이드바 닫힘");
      setAlertModalContent("로그인 후 이용해주세요.");
      setIsAlertModalOpen(true);
      console.log("알랏 오픈");
      navigate("/loginForm")
    } else {
      navigateAndCloseSideBar("/plans/list");
    }
  };

  const hideFooterPaths = ["/plan/modify"];

  return (
    <div className="layout-container">
      <SideBar
        isSideBarVisible={isSideBarVisible}
        closeSideBar={closeSideBar}
        navigateAndCloseSideBar={navigateAndCloseSideBar}
        handleMyPlans={handleMyPlans}
      />
      <Header 
        toggleSideBar={toggleSideBar} 
        closeSideBar={closeSideBar} />
      <MainContent>{children}</MainContent>
      {!hideFooterPaths.includes(location.pathname) && <Footer />}
      <AlertModal
        isOpen={isAlertModalOpen}
        content={alertModalContent}
        onConfirm={() => setIsAlertModalOpen(false)}
      />
    </div>
  );
};

export default Layout;
