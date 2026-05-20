import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import useAuth from "../../hooks/login/useAuth";

const KakaoCallback = () => {
  const navigate = useNavigate();
  const {
    handleLoginSuccess,     // Redux 상태 저장용
    setAlertMessage         // Redux 알림용
  } = useAuth();

  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (isProcessing) return;

    const code = new URL(window.location.href).searchParams.get("code");

    if (!code) {
      // console.warn("code 없음: 이미 처리된 콜백 페이지거나 잘못된 접근");
      return;
    }

    setIsProcessing(true);

    axios
        .post(`http://localhost:8080/auth/callback/kakao?code=${code}`, null, {
          withCredentials: true,
        })
        .then((res) => {
          
          const { nickname, email } = res.data;

          if (nickname && email) {
            handleLoginSuccess(nickname, email); // Redux에 로그인 상태 저장
            setAlertMessage("로그인 되었습니다.");
            // navigate("/", { replace: true });

            const redirectPath = sessionStorage.getItem("redirectAfterLogin") || "/";
            navigate(redirectPath, { replace: true });
            sessionStorage.removeItem("redirectAfterLogin"); // 경로 정리

          } else {
            console.error("서버 응답 문제:", res.data);
            setAlertMessage("로그인 실패: 서버 응답 오류");
            navigate("/", { replace: true });
          }
        })
        .catch((err) => {
          console.error("로그인 실패:", err);
          setAlertMessage("로그인 실패. 다시 시도해주세요.");
          navigate("/", { replace: true });
        })
        .finally(() => setIsProcessing(false));
  }, [isProcessing, navigate, handleLoginSuccess, setAlertMessage]);

  return <div>로그인 처리 중입니다...</div>;
};

export default KakaoCallback;
