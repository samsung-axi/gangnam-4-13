import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

export default function ResetPassword() {
  const location = useLocation();
  const navigate = useNavigate();

  // 쿼리 파라미터에서 token 가져오기
  const params = new URLSearchParams(location.search);
  const token = params.get("token") || "";

  // 토큰과 location.search 값 로그 찍기 (디버깅용)
  useEffect(() => {
    console.log("location.search:", location.search);
    console.log("token from query param:", token);
  }, [location.search]);

  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("");

  if (!token) {
    return (
      <div className="max-w-md mx-auto p-4 text-center text-red-600 font-semibold">
        잘못된 접근입니다. <br />
        이메일 인증 링크를 확인해주세요.
      </div>
    );
  }

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password.length < 6) {
      setStatus("비밀번호는 6자 이상이어야 합니다.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8080/api/user/reset-password",
        { token, password }
      );

      if (response.status === 200) {
        setStatus("비밀번호가 성공적으로 재설정되었습니다.");
        setTimeout(() => navigate("/login"), 2000);
      } else {
        setStatus("비밀번호 재설정에 실패했습니다.");
      }
    } catch (error: any) {
      setStatus(error.response?.data || "오류가 발생했습니다.");
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">비밀번호 재설정</h2>
      <form onSubmit={handleResetPassword} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">새 비밀번호</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            className="w-full border rounded p-2"
            placeholder="6자 이상 입력하세요"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          비밀번호 재설정
        </button>
      </form>
      {status && (
        <p
          className={`mt-4 text-center ${
            status.includes("성공") ? "text-green-600" : "text-red-600"
          } font-semibold`}
        >
          {status}
        </p>
      )}
    </div>
  );
}
