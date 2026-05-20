import React from "react";
import useLogin from "../../hooks/useLogin";
import { Navigate } from "react-router-dom";
import { useToast } from "../../hooks/useToast";
import { useAuth } from "../../components/auth/AuthContext";

const ApprovalPendingPage: React.FC = () => {
  const { handleLogout } = useLogin();
  const { admin, checkAdminStatus } = useAuth();
  const { showToast } = useToast();

  // 승인 대기 중인 사용자가 아닌 경우 처리
  if (!admin || admin.role !== 'WAITING') {
    return <Navigate to="/login" replace />;
  }

  const handleAdminAccess = async () => {
    try {
      await checkAdminStatus();
      if (admin?.role === 'WAITING') {
        showToast("관리자 승인 후 접속이 가능합니다.", "info");
      }
    } catch (error) {
      showToast("상태 확인에 실패했습니다.", "error");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-gray-100"
      style={{
        backgroundImage: `url('/admin-bg.webp')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="bg-white/75 p-8 rounded-lg shadow-md w-full max-w-md backdrop-blur">
        <h1 className="text-2xl font-contents font-bold text-pointer text-center mb-4">
          권한 승인 대기 중
        </h1>
        <p className="text-base font-contents text-center mb-4">
          관리자 권한 승인이 완료될 때까지 기다려 주세요!
        </p>
        <div className="flex gap-2">
          <button
            onClick={handleLogout}
            className="w-1/2 bg-red-500 font-contents text-white py-2 px-4 rounded hover:bg-red-600"
          >
            로그아웃
          </button>
          <button
            onClick={handleAdminAccess}
            className="w-1/2 bg-blue-500 font-contents text-white py-2 px-4 rounded hover:bg-blue-600"
          >
            관리자 페이지
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApprovalPendingPage;