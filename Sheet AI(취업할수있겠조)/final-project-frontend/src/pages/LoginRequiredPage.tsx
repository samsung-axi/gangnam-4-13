import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/shared/components/Header';

const LoginRequiredPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* 🔹 헤더 */}
      <Header />

      {/* 🔹 본문 영역 */}
      <div className="flex flex-col items-center justify-center flex-1 text-center px-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          로그인이 필요한 서비스입니다
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          이 기능을 사용하시려면 로그인해주세요.
        </p>
        <button
          onClick={() => navigate('/login')}
          className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          로그인 하러가기
        </button>
      </div>
    </div>
  );
};

export default LoginRequiredPage;
