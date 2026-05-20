import React from "react";

export default function EmailVerifyFail() {
  return (
    <div className="max-w-md mx-auto p-4 text-center">
      <h2 className="text-xl font-bold mb-4 text-red-600">인증 실패</h2>
      <p>유효하지 않거나 만료된 인증 링크입니다.</p>
    </div>
  );
}
