import React, { useEffect } from "react";
import { getKakaoLoginLink } from "../api/kakaoApi";
import { getGoogleLoginLink } from "../api/googleApi";
import { useNavigate } from "react-router-dom";
import { useMultipleSoundEffects } from "../hooks/useMultipleSoundEffects";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { playSound } = useMultipleSoundEffects(["/audios/button2.mp3"]);

  useEffect(() => {
    // 스크롤 비활성화
    document.body.style.overflow = "hidden";

    // 컴포넌트 언마운트 시 원래 상태로 복원
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const photos = [
    {
      src: "/images/kakaotalk.webp",
      alt: "Kakao Login",
      onClick: getKakaoLoginLink,
    },
    {
      src: "/images/google.webp",
      alt: "Google Login",
      onClick: getGoogleLoginLink,
    },
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      <img src="/images/Group 18317.webp" alt="Login" className="h-20 mb-12" />

      {photos.map((photo, index) => (
        <button
          key={index}
          onClick={() => {
            playSound(0); // 효과음 재생
            const link = photo.onClick();
            window.location.href = link; // 효과음 재생 후 리디렉션
          }}
          className="mb-3 focus:outline-none flex justify-center w-full"
        >
          <img
            src={photo.src}
            alt={photo.alt}
            className="w-64 h-auto object-contain rounded-md mx-auto"
          />
        </button>
      ))}
    </div>
  );
};

export default Login;
