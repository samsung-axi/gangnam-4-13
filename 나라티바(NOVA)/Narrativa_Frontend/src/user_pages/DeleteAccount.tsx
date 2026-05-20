import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import AuthGuard from "../api/accessControl";
import { parseCookieKeyValue } from "../api/cookie";

const DeleteAccount: React.FC = () => {
  const navigate = useNavigate();
  // 쿠키 이름 배열을 전달하여 쿠키 값을 가져옵니다.
  const [cookie, setCookie, removeCookie] = useCookies(['token']);

  // 유저 유효성 검증
  const checkAuth = async (userId: number, accessToken: string) => {
    if (accessToken == null) {
      navigate('/');
    } else {
      const isAuthenticated = await AuthGuard(userId, accessToken);
      if (!isAuthenticated) {
        navigate('/');
      }
    }
  };

  useEffect(() => {
    const cookieToken = cookie.token;
    console.log('cookie: ', cookie);
    console.log('cookieToken: ', cookieToken);

    cookieToken == null && navigate("/");
    
    const _cookieContent = parseCookieKeyValue(cookieToken);
    console.log('_cookieContent: ', _cookieContent);

    if (_cookieContent == null) {
      navigate("/");
    } else {
      const _cookieContentAccesToken = _cookieContent.access_token;
      const _cookieContentId = _cookieContent.user_id;

      if (_cookieContentAccesToken == null || _cookieContentId == null) {
        navigate("/");
      } else {
        if (!checkAuth(_cookieContentId, _cookieContentAccesToken)) {
          navigate('/');  // 유저 상태코드 유효하지 않으면 접근
        }
      }
    }
  }, []);

  const handleDelete = async () => {
    try {
      const response = await fetch("/api/delete-account", {
        method: "DELETE",
      });

      if (response.ok) {
        alert("탈퇴가 완료되었습니다. 😢");
      } else {
        alert("탈퇴 처리에 실패했습니다. 다시 시도해주세요.");
      }
    } catch (error) {
      console.error("탈퇴 요청 중 오류 발생:", error);
      alert("오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
    }
  };



  return (
    <div className="flex flex-col items-center justify-center h-screen text-center">
      <div className="mb-4 text-lg">탈퇴 하실거에요?🥹</div>
      <button
        onClick={handleDelete}
        className="mt-4 px-6 py-2 text-white bg-custom-purple rounded hover:bg-blue-100"
      >
        YES!!
      </button>
    </div>
  );
};

export default DeleteAccount;
