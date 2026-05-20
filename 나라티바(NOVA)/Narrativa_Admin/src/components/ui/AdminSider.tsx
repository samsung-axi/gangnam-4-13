import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { useToast } from "../../hooks/useToast";
import { ReactComponent as Mascot } from "../../assets/images/side-mascot.svg";
import { ChevronDown, ChevronRight } from 'lucide-react';
import packageJson from '../../../package.json';

const Sidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { showToast } = useToast();
  const [isMusicSubmenuOpen, setIsMusicSubmenuOpen] = useState(
    location.pathname.startsWith('/music')
  );

  const isPathActive = (path: string) => location.pathname.startsWith(path);

  const handleLogout = () => {
    logout();
    localStorage.removeItem("admin");
    showToast("로그아웃 완료!\n 안전하게 로그아웃되었습니다.", "success");
    navigate("/login");
  };

  return (
    <div className="h-[calc(90vh)] w-[20%] min-w-[80px] max-w-[300px] bg-main flex flex-col justify-start items-center p-5 gap-12">
      {/* Version */}
      <div className="absolute bottom-12 text-xs sm:text-sm font-title font-bold text-white tracking-widest">
        V {packageJson.version}
      </div>

      {/* Mascot */}
      <div className="absolute bottom-24 hidden lg:block">
        <Mascot className="w-28 h-auto text-gray-800 group-hover:text-white" />
      </div>

      {/* Menu List */}
      <div className="w-full bg-white rounded-lg flex flex-col gap-3 p-2">
        {/* 데이터 및 통계 분석 */}
        <Link
          to="/"
          className={`flex lg:justify-start justify-center items-center w-full h-[36px] rounded-lg p-2 group ${
            location.pathname === "/" ? "bg-pointer text-white" : "bg-white hover:bg-pointer hover:text-white"
          }`}
        >
          <span
            className={`material-icons group-hover:text-white ${
              location.pathname === "/" ? "text-white" : "text-gray-800"
            }`}
          >
            bar_chart
          </span>
          <span className="text-sm font-title font-bold ml-4 hidden lg:block">
            Statistics
          </span>
        </Link>

        {/* 관리자 관리 */}
        <Link
          to="/admins"
          className={`flex lg:justify-start justify-center items-center w-full h-[36px] rounded-lg p-2 group ${
            location.pathname === "/admins" ? "bg-pointer text-white" : "bg-white hover:bg-pointer hover:text-white"
          }`}
        >
          <span
            className={`material-icons group-hover:text-white ${
              location.pathname === "/admins" ? "text-white" : "text-gray-800"
            }`}
          >
            admin_panel_settings
          </span>
          <span className="text-sm font-title font-bold ml-4 hidden lg:block">
            Administrators
          </span>
        </Link>

        {/* 회원 관리 */}
        <Link
          to="/users"
          className={`flex lg:justify-start justify-center items-center w-full h-[36px] rounded-lg p-2 group ${
            location.pathname === "/users" ? "bg-pointer text-white" : "bg-white hover:bg-pointer hover:text-white"
          }`}
        >
          <span
            className={`material-icons group-hover:text-white ${
              location.pathname === "/users" ? "text-white" : "text-gray-800"
            }`}
          >
            person
          </span>
          <span className="text-sm font-title font-bold ml-4 hidden lg:block">
            Users
          </span>
        </Link>

        {/* 공지 관리 */}
        <Link
          to="/notices"
          className={`flex lg:justify-start justify-center items-center w-full h-[36px] rounded-lg p-2 group ${
            isPathActive("/notices") ? "bg-pointer text-white" : "bg-white hover:bg-pointer hover:text-white"
          }`}
        >
          <span
            className={`material-icons group-hover:text-white ${
              isPathActive("/notices") ? "text-white" : "text-gray-800"
            }`}
          >
            campaign
          </span>
          <span className="text-sm font-title font-bold ml-4 hidden lg:block">
            Notices
          </span>
        </Link>

        {/* 공백 */}
        <span className="mb-2"></span>

        {/* 음악 버킷 관리 */}
        <div className="flex flex-col">
          <button
            onClick={() => setIsMusicSubmenuOpen(!isMusicSubmenuOpen)}
            className={`flex lg:justify-start justify-center items-center w-full h-[36px] rounded-lg p-2 group ${
              isPathActive("/music") ? "bg-pointer text-white" : "bg-white hover:bg-pointer hover:text-white"
            }`}
          >
            <div className="flex items-center justify-center w-5 h-5">
              <span className={`material-icons text-xl group-hover:text-white ${
                isPathActive("/music") ? "text-white" : "text-gray-800"
              }`}>
                library_music
              </span>
            </div>
            <div className="hidden lg:flex flex-1 items-center">
              <span className="text-sm font-title font-bold ml-4">
                Musics
              </span>
              {isMusicSubmenuOpen ? (
                <ChevronDown className="w-4 h-4 ml-auto" />
              ) : (
                <ChevronRight className="w-4 h-4 ml-auto" />
              )}
            </div>
          </button>

          {/* 버킷 서브메뉴 */}
          {isMusicSubmenuOpen && (
            <div className="sm:ml-4 mt-2 flex flex-col gap-2">
              <Link
                to="/music/list"
                className={`flex lg:justify-start justify-center items-center w-full h-[32px] rounded-lg p-2 group ${
                  location.pathname === "/music/list" ? "bg-pointer text-white" : "bg-white hover:bg-pointer hover:text-white"
                }`}
              >
                <div className="flex items-center justify-center w-4 h-4">
                  <span className={`material-icons text-lg group-hover:text-white ${
                    location.pathname === "/music/list" ? "text-white" : "text-gray-800"
                  }`}>
                    format_list_bulleted
                  </span>
                </div>
                <span className="text-sm font-title font-bold ml-4 hidden lg:block">
                  Music List
                </span>
              </Link>
              <Link
                to="/music/upload"
                className={`flex lg:justify-start justify-center items-center w-full h-[32px] rounded-lg p-2 group ${
                  location.pathname === "/music/upload" ? "bg-pointer text-white" : "bg-white hover:bg-pointer hover:text-white"
                }`}
              >
                <div className="flex items-center justify-center w-4 h-4">
                  <span className={`material-icons text-lg group-hover:text-white ${
                    location.pathname === "/music/upload" ? "text-white" : "text-gray-800"
                  }`}>
                    upload_file
                  </span>
                </div>
                <span className="text-sm font-title font-bold ml-4 hidden lg:block">
                  Music Upload
                </span>
              </Link>
            </div>
          )}
        </div>
        {/* 프롬프트 관리 */}
        <Link
          to="/prompts"
          className={`flex lg:justify-start justify-center items-center w-full h-[36px] rounded-lg p-2 group ${
            isPathActive("/prompts") ? "bg-pointer text-white" : "bg-white hover:bg-pointer hover:text-white"
          }`}
        >
          <span
            className={`material-icons group-hover:text-white ${
              isPathActive("/prompts") ? "text-white" : "text-gray-800"
            }`}
          >
            psychology_alt
          </span>
          <span className="text-sm font-title font-bold ml-4 hidden lg:block">
            Prompts
          </span>
        </Link>
        {/* 템플릿 관리 */}
        <Link
          to="/templates"
          className={`flex lg:justify-start justify-center items-center w-full h-[36px] rounded-lg p-2 group ${
            isPathActive("/templates") ? "bg-pointer text-white" : "bg-white hover:bg-pointer hover:text-white"
          }`}
        >
          <span
            className={`material-icons w-5 h-5 group-hover:text-white ${
              isPathActive("/templates") ? "text-white" : "text-gray-800"
            }`}
          >
            description
          </span>
          <span className="text-sm font-title font-bold ml-4 hidden lg:block">
            Templates
          </span>
        </Link>
      </div>

      {/* Logout */}
      <div
        className="w-full bg-white rounded-lg flex justify-center items-center p-2 hover:bg-pointer group cursor-pointer"
        onClick={handleLogout}
      >
        <span className="material-icons group-hover:text-white text-gray-800">
          logout
        </span>
        <span className="text-sm font-title font-bold text-gray-800 group-hover:text-white ml-4 hidden lg:block">
          Log out
        </span>
      </div>
    </div>
  );
};

export default Sidebar;