import type { JSX } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Loading from "./Loading";

const RedirectIfAuthenticated = ({ children }: { children: JSX.Element }) => {
  const { user, loading } = useAuth();

  if (loading) return <Loading />;

  if (user) {
    // 로그인한 상태면 홈이나 대시보드로 리디렉션
    return <Navigate to="/" replace />;
  }

  return children;
};

export default RedirectIfAuthenticated;
