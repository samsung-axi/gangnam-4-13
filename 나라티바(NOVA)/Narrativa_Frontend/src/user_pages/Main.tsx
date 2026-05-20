import React, { useState } from "react";
import Lottie from "lottie-react";
import backLottie from "./Animation3.json";
import { getKakaoLoginLink } from "../api/kakaoApi";
import { getGoogleLoginLink } from "../api/googleApi";
import { useMultipleSoundEffects } from "../hooks/useMultipleSoundEffects";

const Main: React.FC = () => {
  const [showLoadingLottie, setShowLoadingLottie] = useState(false);
  const { playSound } = useMultipleSoundEffects(["/audios/button2.mp3"]);

  const handleComplete = () => {
    // 첫 번째 애니메이션이 끝나자마자 상태 변경
    setShowLoadingLottie(true);
  };

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
    <div className="flex flex-col min-h-screen items-center justify-between bg-black">
      <main
        className={`flex-grow w-full h-full max-w-lg overflow-hidden relative ${
          showLoadingLottie ? "bg-custom-violet" : "bg-black"
        }`}
      >
        {/* 첫 번째 애니메이션 */}
        {!showLoadingLottie && (
          <Lottie
            animationData={backLottie}
            onComplete={handleComplete} // 애니메이션이 끝나면 상태를 true로 변경
            loop={false}
            className="relative inset-0 w-full h-full object-cover min-h-screen scale-[1.2]" // 모바일 대응
          />
        )}

        {/* 이미지 섹션 */}
        {showLoadingLottie && (
          <div className="flex flex-col items-center justify-center mt-24 md:mt-24 lg:mt-24 h-[50vh]">
            <img
              src="/images/narrativa_main.webp"
              alt="Header Image"
              className="w-[50vw] sm:w-[50vw] md:w-[50vw] lg:w-[50vw] max-w-[250px] h-auto object-contain"
            />
          </div>
        )}

        {/* 로그인 버튼들 */}
        {showLoadingLottie && (
          <div className="flex flex-col items-center justify-center md:mt-0 lg:mt-0">
            {photos.map((photo, index) => (
              <button
                key={index}
                onClick={() => {
                  playSound(0);
                  const link = photo.onClick();
                  window.location.href = link;
                }}
                className="mb-4 focus:outline-none flex justify-center w-full max-w-[200px]"
              >
                <img
                  src={photo.src}
                  alt={photo.alt}
                  className="w-full h-auto object-contain rounded-md"
                />
              </button>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Main;
