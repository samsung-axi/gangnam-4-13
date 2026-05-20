import React, { useEffect } from "react";
import { X } from "lucide-react";
import { useMultipleSoundEffects } from "../hooks/useMultipleSoundEffects";

interface InfoProps {
  position: "center" | "left";
  onToggle: () => void; // 모달을 닫는 함수
}

const InfoModal: React.FC<InfoProps> = ({ position, onToggle }) => {
  // ESC 키를 눌렀을 때 모달 닫기
  useEffect(() => {
    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onToggle();
      }
    };

    window.addEventListener("keydown", handleEscapeKey);
    return () => window.removeEventListener("keydown", handleEscapeKey);
  }, [onToggle]);
  const { playSound } = useMultipleSoundEffects(["/audios/button1.mp3"]);

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black bg-opacity-50">
      {/* 모달 박스 */}
      <div
        className={`relative w-full max-w-md p-6  bg-[#020202] rounded-lg shadow-lg ${
          position === "center" ? "mx-auto" : "ml-0"
        }`}
      >
        {/* 닫기 버튼 */}
        <button
          onClick={onToggle}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
        >
          <X size={24} />
        </button>

        {/* 모달 제목 */}
        {/* 사용법 내용 */}
        <h2 className="text-3xl text-center font-extrabold mb-6 bg-clip-text bg-gradient-to-r text-gray-200 ">
          챗봇 사용법 안내
        </h2>

        {/* 사용법 내용 */}
        {/* <div className="relative bg-gray-900 bg-opacity-80 border-2 border-purple-700 rounded-lg p-6 shadow-[0px_4px_10px_rgba(255,0,255,0.5)]"> */}
        {/* 이미지 */}
        <div className="flex justify-center">
          <img
            src="/infomodallogo.webp"
            alt="AI 챗봇 안내 이미지"
            className="w-28 h-28 mb-4 rounded-full  shadow-2xl hover:scale-110 transition-transform duration-300"
          />
        </div>

        {/* 설명 */}
        <p className="text-lg text-white text-center leading-relaxed">
          게임에 대한 설명을 해주는{" "}
          <strong className="text-purple-400">AI 챗봇</strong>이 있습니다.
        </p>
        <p className="mt-4 text-center text-gray-400 font-medium">
          🎮 생존 확률을 높이고 싶다면{" "}
          <span className="text-blue-400">힌트</span>를 확인해 보세요.
        </p>

        {/* 리스트 */}
        <ul className="mt-6 space-y-3 text-gray-300">
          <li className="flex items-center">
            <span className="w-1 h-1 bg-blue-500 rounded-full animate-ping mr-2 "></span>
            선택지에 대한 힌트를 제공합니다.
          </li>
          <li className="flex items-center">
            <span className="w-1 h-1 bg-blue-500 rounded-full animate-ping mr-2"></span>
            힌트를 확인하고 현명한 결정을 내려보세요.
          </li>
        </ul>
        {/* </div> */}
      </div>
    </div>
  );
};

export default InfoModal;
