import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthState } from '@/shared/hooks/useAuthState';

interface ProtectedRouteProps {
  children: ReactNode;
  redirectPath?: string;
}

/**
 * 인증이 필요한 라우트를 보호하는 컴포넌트
 * 로그인되지 않은 사용자는 redirectPath로 리다이렉트됩니다.
 */
const ProtectedRoute = ({ 
  children, 
  redirectPath = '/login' 
}: ProtectedRouteProps) => {
  const { isLoggedIn } = useAuthState();

  if (!isLoggedIn) {
    return <Navigate to={redirectPath} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
