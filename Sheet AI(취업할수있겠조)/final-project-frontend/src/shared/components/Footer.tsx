import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthState } from '@/shared/hooks/useAuthState';

interface FooterProps {
  variant?: 'transparent-black' | 'white';
}

const Footer: React.FC<FooterProps> = ({ variant = 'white' }) => {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuthState();

  const handleWithdrawClick = () => {
    navigate('/withdraw');
  };

  // 배경색과 텍스트 색상 설정
  let bgClass = '';
  let textColor = '';

  if (variant === 'transparent-black') {
    bgClass = 'bg-transparent';
    textColor = 'text-black';
  } else {
    bgClass = 'bg-white';
    textColor = 'text-gray-500';
  }

  return (
    <footer className={`w-full relative py-4 ${bgClass} text-xs ${textColor}`}>
      <div className="max-w-screen-xl mx-auto px-4 text-center">
        <p> 2025 SheetAI. All rights reserved.</p>
      </div>

      {isLoggedIn && (
        <button
          onClick={handleWithdrawClick}
          className={`absolute right-4 bottom-4 ${textColor} hover:text-red-500 transition-colors underline`}
        >
          회원 탈퇴
        </button>
      )}
    </footer>
  );
};

export default Footer;
