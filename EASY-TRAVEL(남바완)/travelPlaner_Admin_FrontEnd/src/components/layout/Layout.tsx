import React, { useState, useEffect, useRef } from "react";
import Header from "../header/Header";
import Footer from "../footer/Footer";
import MainContent from "../main/MainContent";
import "./Layout.css";
import SideBar from "../sideBar/SideBar";

interface LayoutProps {
  children: React.ReactNode;
  navigate: (path: string) => void;
  currentPath: string;
}

const Layout: React.FC<LayoutProps> = ({ children, navigate, currentPath }) => {
  const [isSideBarVisible, setIsSideBarVisible] = useState<boolean>(false);
  const sidebarRef = useRef<HTMLDivElement>(null);

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
    const handleClickOutside = (event: MouseEvent) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node) && isSideBarVisible) {
        closeSideBar();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSideBarVisible]);

  const hideFooterPaths = ["/plan/modify"];

  return (
    <div className="layout-container">
      <div className={`overlay ${isSideBarVisible ? 'visible' : ''}`} onClick={closeSideBar}></div>
      <div ref={sidebarRef} className="side-bar-container">
        <SideBar
          isSideBarVisible={isSideBarVisible}
          closeSideBar={closeSideBar}
          navigateAndCloseSideBar={navigateAndCloseSideBar}
        />
      </div>
      <Header 
        toggleSideBar={toggleSideBar} 
        closeSideBar={closeSideBar} 
      />
      <MainContent>{children}</MainContent>
      {!hideFooterPaths.includes(currentPath) && <Footer />}
    </div>
  );
};

export default Layout;
