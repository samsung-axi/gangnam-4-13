import React, { useState } from "react";
import axios from "axios";

export default function RequestPasswordReset() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");

  const handleSendVerificationEmail = async () => {
    console.log("전송할 이메일:", email.trim());
    try {
      const response = await axios.post(
  "http://localhost:8080/api/user/send-verification-email",
  { email },
  { headers: { "Content-Type": "application/json" } }
);
      if (response.status === 200) {
        setStatus("인증 메일이 발송되었습니다. 이메일을 확인해주세요.");
      } else {
        setStatus("인증 메일 발송에 실패했습니다.");
      }
    } catch (error) {
      setStatus("오류가 발생했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">비밀번호 재설정 요청</h2>
      <input
        type="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        placeholder="이메일을 입력하세요"
        className="w-full border rounded p-2 mb-4"
      />
      <button
        onClick={handleSendVerificationEmail}
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
      >
        인증 메일 발송
      </button>
      {status && <p className="mt-4 text-center">{status}</p>}
    </div>
  );
}
