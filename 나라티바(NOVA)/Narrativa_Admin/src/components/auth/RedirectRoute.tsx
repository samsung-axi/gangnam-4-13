import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { useLocation } from "react-router-dom";

const RedirectRoute = () => {
  const { admin } = useAuth();
  const location = useLocation();

  // 로그인하지 않은 경우 기본 라우트 표시
  if (!admin) {
    return <Outlet />;
  }

  // 현재 경로가 이미 approval-pending인 경우 리다이렉트하지 않음
  if (location.pathname === '/approval-pending') {
    return <Outlet />;
  }

  // 승인 대기 중인 사용자는 approval-pending 페이지로 이동
  if (admin.role === 'WAITING') {
    return <Navigate to="/approval-pending" replace />;
  }

  // 승인된 사용자는 메인 페이지로 리다이렉트
  if (['SUPER_ADMIN', 'SYSTEM_ADMIN', 'CONTENT_ADMIN', 'SUPPORT_ADMIN'].includes(admin.role)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default RedirectRoute;
