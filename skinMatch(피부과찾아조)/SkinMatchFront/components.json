// src/components/auth/ProtectedRoute.tsx
import React from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  redirectTo = '/login' 
}) => {
  // 개발/테스트 모드: 모든 사용자에게 접근 허용
  return <>{children}</>;
};

export default ProtectedRoute;
