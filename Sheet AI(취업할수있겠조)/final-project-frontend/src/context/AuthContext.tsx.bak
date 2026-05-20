// src/context/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';

interface AuthContextType {
  isLoggedIn: boolean;
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // ✅ 새로고침해도 localStorage에 토큰 있으면 로그인 상태 유지
  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    if (savedToken) {
      setIsLoggedIn(true);
    }
  }, []);

  const login = () => setIsLoggedIn(true);

  const logout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('token'); // 로그아웃 시 토큰 삭제
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
