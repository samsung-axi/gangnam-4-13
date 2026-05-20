// src/AuthContext.js
import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [remainingTime, setRemainingTime] = useState(0);

  useEffect(() => {
    // 초기 상태 복원
    const accessToken = localStorage.getItem("access_token");
    const userName = localStorage.getItem("userName");
    const userEmail = localStorage.getItem("userEmail");
    const expirationTime = localStorage.getItem("expiration_time");

    if (accessToken && userName && userEmail && expirationTime) {
      const timeLeft = Math.max(0, Math.floor((expirationTime - Date.now()) / 1000));
      if (timeLeft > 0) {
        setIsLoggedIn(true);
        setUserName(userName);
        setUserEmail(userEmail);
        setRemainingTime(timeLeft);
      } else {
        handleLogout();
      }
    }
  }, []);

  useEffect(() => {
    // 남은 시간 업데이트
    const interval = setInterval(() => {
      const expirationTime = localStorage.getItem("expiration_time");
      if (expirationTime) {
        const timeLeft = Math.max(0, Math.floor((expirationTime - Date.now()) / 1000));
        setRemainingTime(timeLeft);

        if (timeLeft === 0) {
          handleLogout(); // 토큰 만료 시 로그아웃
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    setUserName("");
    setUserEmail("");
    setRemainingTime(0);
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        userName,
        userEmail,
        remainingTime,
        handleLogout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
