import React from 'react';
import { Link } from 'react-router-dom';
import Lottie from 'lottie-react';
import NotFoundPageAnimation from "../../assets/animations/404.json";

const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-pointer">
      <Lottie animationData={NotFoundPageAnimation} loop={true} className="w-64 h-64" />
      <p className="text-lg text-center font-contents text-white mb-8">경로를 찾을수 없습니다!<br/>올바른 페이지로 이동하세요!</p>
      <Link
        to="/"
        className="font-contents bg-white text-black py-2 px-4 rounded hover:bg-main hover:text-white"
      >
        홈으로 돌아가기
      </Link>
    </div>
  );
};

export default NotFoundPage;
