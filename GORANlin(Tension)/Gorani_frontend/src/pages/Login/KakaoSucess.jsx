import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { kakaoLogin } from "../../Apis/UserAPI";

const KakaoSuccessPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const code = params.get("code");

    console.log("Received Kakao code:", code);

    if (!code) {
      setError("카카오 인증 코드가 제공되지 않았습니다.");
      setLoading(false);
      return;
    }

    kakaoLogin(code)
      .then(() => {
        navigate("/");
      })
      .catch((error) => {
        console.error("로그인 실패:", error);
        setError(
          error.response?.data?.message || "로그인 중 문제가 발생했습니다."
        );
      })
      .finally(() => {
        setLoading(false);
      });
  }, [location, navigate]);

  return (
    <div>
      {loading ? (
        <p>로그인 처리 중...</p>
      ) : error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : (
        <p>로그인 성공! 메인 페이지로 이동 중...</p>
      )}
    </div>
  );
};

export default KakaoSuccessPage;
