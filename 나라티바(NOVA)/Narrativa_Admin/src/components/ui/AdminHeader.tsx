import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import HeaderLogo from "../../assets/images/header-logo.svg";
import { useAuth } from "../auth/AuthContext";

const Header: React.FC = () => {
  const { admin, resetLogoutTimer, logoutStartTime } = useAuth();
  const adminName = admin?.username || "Admin";
  const [remainingTime, setRemainingTime] = useState<number>(1800);

  useEffect(() => {
    if (logoutStartTime) {
      const interval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - logoutStartTime) / 1000);
        setRemainingTime(1800 - elapsed);
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [logoutStartTime]);

  const handleResetTimer = () => {
    resetLogoutTimer();
    setRemainingTime(1800);
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
  };

  return (
    <header className="w-full h-[8vh] flex items-center justify-between px-4 bg-black">
      {/* 왼쪽: 로고 */}
      <Link to="/" className="flex items-center gap-x-2 sm:gap-x-4">
        <img src={HeaderLogo} alt="Header Logo" className="w-4 sm:w-5 h-[20px] sm:h-[26px]" />
        <div className="text-base sm:text-lg md:text-xl font-normal text-white font-title whitespace-nowrap">
          NARRATIVA - ADMIN
        </div>
      </Link>

      {/* 오른쪽: 관리자 정보 */}
      <div className="flex items-center gap-x-2 sm:gap-x-4">
        <span 
          className={`text-xs sm:text-sm font-medium font-contents ${
            remainingTime <= 300 ? 'text-red-500 animate-bounce' : 'text-white'
          }`}
        >
          <span className="hidden md:inline">남은 시간 : </span>
          {formatTime(remainingTime)}
          <span className="hidden md:inline">분</span>
        </span>
        <button 
          onClick={handleResetTimer} 
          className="text-white font-contents bg-pointer2 hover:bg-pointer px-2 sm:px-3 py-1 rounded text-xs sm:text-sm"
        >
          연장
        </button>
        <span className="text-white text-xs sm:text-sm font-medium font-contents">{adminName}</span>
      </div>
    </header>
  );
};

export default Header;