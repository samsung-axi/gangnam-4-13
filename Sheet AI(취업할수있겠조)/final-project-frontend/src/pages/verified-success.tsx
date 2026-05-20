import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function EmailVerifiedSuccess() {
  const navigate = useNavigate();
  const location = useLocation();

  // 쿼리에서 token 가져오기
  const params = new URLSearchParams(location.search);
  const token = params.get("token");

  useEffect(() => {
    const timer = setTimeout(() => {
      // 토큰을 쿼리 파라미터로 넘기기
      navigate(`/reset-password?token=${token}`);
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigate, token]);

  return (
    <div className="max-w-md mx-auto p-4 text-center">
      <h2 className="text-xl font-bold mb-4">이메일 인증 완료!</h2>
      <p>곧 비밀번호 재설정 페이지로 이동합니다...</p>
    </div>
  );
}
