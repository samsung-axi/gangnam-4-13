import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthContext } from '@/contexts/AuthContext';

const Header = () => {
  const { user, isAuthenticated, logout } = useAuthContext();
  const location = useLocation();
  const navigate = useNavigate();
  
  const isDarkPage = ['/camera', '/analysis', '/profile', '/login', '/signup'].includes(location.pathname);
  const isMainPage = location.pathname === '/';

  // 메인페이지에서는 항상 흰색, 나머지는 기존 로직 적용
  const textColor = isMainPage 
    ? 'text-white' 
    : isDarkPage 
      ? 'text-black' 
      : 'text-white/80';

  const hoverColor = isMainPage 
    ? 'hover:text-white' 
    : isDarkPage 
      ? 'hover:text-black/80' 
      : 'hover:text-white';
  
  // 메인페이지(/)가 아닐 때만 반투명 배경 적용
  const headerBackground = isMainPage ? '' : 'bg-white/80 backdrop-blur-sm shadow-sm';

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/', { replace: true });
    } catch (error) {
      console.error('로그아웃 실패:', error);
      navigate('/', { replace: true });
    }
  };

  // 공통 클래스: 글씨 애니메이션 + bold 효과 추가
  const linkClasses = `text-center transition-colors transform transition-transform duration-200 ease-in-out hover:scale-105 hover:font-bold`;

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 ${headerBackground}`}>
      <div className="container mx-auto px-4">
        {/* grid-cols-4로 변경: 버튼 4개 균등 배치 */}
        <div className={`grid grid-cols-4 items-center py-4 text-sm ${textColor}`}>
          <Link to="/" className={`${linkClasses} ${hoverColor}`}>
            Home
          </Link>
          <Link to="/camera" className={`${linkClasses} ${hoverColor}`}>
            Analysis
          </Link>

          {/* 관리자 계정이면 Admin, 일반 계정이면 My Page */}
          {isAuthenticated && user?.role === 'admin' ? (
            <Link to="/admin" className={`${linkClasses} ${hoverColor}`}>
              Admin
            </Link>
          ) : (
            <Link to="/profile" className={`${linkClasses} ${hoverColor}`}>
              My Page
            </Link>
          )}

          {isAuthenticated ? (
            <button 
              onClick={handleLogout} 
              className={`${linkClasses} ${hoverColor}`}
            >
              Logout
            </button>
          ) : (
            <Link to="/login" className={`${linkClasses} ${hoverColor}`}>
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
