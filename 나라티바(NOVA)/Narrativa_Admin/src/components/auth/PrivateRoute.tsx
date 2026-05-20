import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";

const PrivateRoute = () => {
  const { admin } = useAuth();
  const location = useLocation();

  // 로그인하지 않은 경우 로그인 페이지로 리다이렉트
  if (!admin) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 승인 대기 중인 사용자는 승인 대기 페이지로 리다이렉트
  if (admin.role === 'WAITING') {
    return <Navigate to="/approval-pending" replace />;
  }

  // 승인된 사용자는 요청한 페이지 표시
  return <Outlet />;
};

export default PrivateRoute;
