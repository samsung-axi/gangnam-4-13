import type { JSX } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Loading from "./Loading";

type Role = "user" | "companyAdmin" | "superAdmin";

interface ProtectedRouteProps {
  children: JSX.Element;
  allowedRoles?: Role[]; // 허용된 역할 목록
}

const roleMap: Record<string, Role> = {
  "4864c9d2-7f9c-4862-9139-4e8b0ed117f4": "user",
  "f3d23b8c-6e7b-4f5d-a72d-8a9622f94084": "companyAdmin",
  "c4cb5e53-617e-463f-8ddb-67252f9a9742": "superAdmin",
};

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <Loading />;

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const userRole = roleMap[user.sysrole]; // user.role_id는 실제 권한 id라고 가정

  // 권한 제한 체크
  if (allowedRoles && !allowedRoles.includes(userRole)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
