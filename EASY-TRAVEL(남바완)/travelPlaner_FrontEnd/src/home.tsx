import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import jwtDecode, { JwtPayload } from "jwt-decode";

interface DecodedToken extends JwtPayload {
  id?: string;
  email?: string;
  name?: string;
}

const Home = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);

  useEffect(() => {
    const accessToken = document.cookie
      .split("; ")
      .find((row) => row.startsWith("access_token="))
      ?.split("=")[1];

    if (accessToken) {
      try {
        const decoded: DecodedToken = jwtDecode<DecodedToken>(accessToken);

        console.log("Decoded Token:", decoded);

        if (decoded.email && decoded.name) {
          setUser({
            name: decoded.name,
            email: decoded.email,
          });
        } else {
          throw new Error("JWT does not contain required fields.");
        }
      } catch (error) {
        console.error("JWT 디코딩에 실패했습니다:", error);
        navigate("/loginform"); // 디코딩 실패 시 로그인 페이지로 이동
      }
    } else {
      navigate("/loginform"); // 토큰이 없는 경우 로그인 페이지로 이동
    }
  }, [navigate]);

  return (
    <div>
      {user ? (
        <div>
          <h1>안녕하세요, {user.name}님!</h1>
          <p>이메일: {user.email}</p>
        </div>
      ) : (
        <h1>홈 화면입니다.</h1>
      )}
    </div>
  );
};

export default Home;
