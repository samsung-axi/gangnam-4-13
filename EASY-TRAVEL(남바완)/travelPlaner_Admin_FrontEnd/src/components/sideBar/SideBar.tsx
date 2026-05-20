import React from "react";
import styles from './SideBar.module.scss'
import { Link } from "react-router-dom";
import { API_BASE_URL } from "../../config";
import axios from "axios";

interface SideBarProps {
  closeSideBar: () => void;
  isSideBarVisible: boolean;
  navigateAndCloseSideBar: (path: string) => void;
}

const SideBar: React.FC<SideBarProps> = ({
  isSideBarVisible,
  closeSideBar,
  navigateAndCloseSideBar,
}) => {
  return (
    <aside className={`${styles.sideBarContainer} ${isSideBarVisible ? styles.visible : ''}`}>
      <h2 hidden>sideBar</h2>
      <ul className={styles.sideBarContents}>
        <li onClick={() => navigateAndCloseSideBar("admin/chart/agent")}>
          에이전트 관리
        </li>
        <li onClick={() => navigateAndCloseSideBar("admin/chart/member")}>
          멤버 관리
        </li>
        <li onClick={() => navigateAndCloseSideBar("admin/question")}>
          문의글 관리
        </li>
      </ul>
    </aside>
  );
};

export default SideBar;
