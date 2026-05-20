// src/shared/components/Header.tsx
import React from 'react';
import { HiArrowLeft } from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';
import { useAuthState } from '@/shared/hooks/useAuthState';

interface HeaderProps {
  onBack: () => void;
  transparent?: boolean;
}

const Header: React.FC<HeaderProps> = ({ onBack, transparent = false }) => {
  const navigate = useNavigate();
  const { isLoggedIn, logout } = useAuthState();

  const handleClick = () => {
    if (isLoggedIn) {
      logout();
      // navigate('/login');
      navigate('/');
    } else {
      navigate('/login');
    }
  };

  const containerClass = `w-full flex items-center px-4 py-2`;
  const style = transparent
    ? {
        background: 'linear-gradient(to bottom, rgba(61, 90, 115, 0.85), rgba(61, 90, 115, 0))',
        height: '96px',
        borderBottom: 'none',
      }
    : { height: '96px' };

  return (
    <div className={containerClass} style={style}>
      <img
        src="src/assets/image/logo.png"
        alt="logo"
        className="w-24 h-16 flex-shrink-0 cursor-pointer"
        onClick={() => navigate('/')}
      />
      <div className="m-auto"></div>

      <button
        onClick={handleClick}
        className={`mr-8 text-xl font-bold ${
          transparent ? 'text-white' : 'text-black'
        } hover:opacity-80 transition`}
      >
        {isLoggedIn ? 'log out' : 'log in'}
      </button>

      <button
        onClick={onBack}
        className="w-10 h-10 flex items-center justify-center hover:opacity-80 transition cursor-pointer"
      >
        <HiArrowLeft className={`w-10 h-10 ${transparent ? 'text-white' : ''} flex-shrink-0`} />
      </button>
    </div>
  );
};

export default Header;
