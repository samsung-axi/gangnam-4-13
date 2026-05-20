import React from 'react';
import { useAuth } from './AuthContext';
import LoadingAnimation from '../ui/LoadingAnimation';

export const AuthLoadingGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-pointer2 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <LoadingAnimation />
        </div>
      </div>
    );
  }

  return <>{children}</>;
}