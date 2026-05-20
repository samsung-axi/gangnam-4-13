import React from "react";
import "./MainContent.module.scss"; // 스타일링 파일

const MainContent: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="main-content">
      {children}
    </div>
  );
};

export default MainContent;