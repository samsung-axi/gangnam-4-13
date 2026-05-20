import React, { useEffect } from "react";
import html2canvas from "html2canvas";
import { FaDownload } from "react-icons/fa";
import { useCookies } from "react-cookie";
import { useNavigate, useLocation } from "react-router-dom";
import AuthGuard from "../api/accessControl";
import { parseCookieKeyValue } from "../api/cookie";

interface LocationState {
  prompt: string;
  genre: string;
  survivalRate: number;
  image: string;
}

const GameEnding: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [cookies] = useCookies(["token"]);

  const { prompt, genre, survivalRate, image } =
    (location.state as LocationState) || {
      prompt: "",
      genre: "",
      survivalRate: 0,
      image: "",
    };

  const handleDownload = async () => {
    const captureArea = document.querySelector(".capture-area");
    const downloadButton = document.querySelector(".download-button");

    if (!captureArea) return;

    if (downloadButton) {
      (downloadButton as HTMLElement).style.visibility = "hidden";
    }

    try {
      const canvas = await html2canvas(captureArea as HTMLElement);
      if (downloadButton) {
        (downloadButton as HTMLElement).style.visibility = "visible";
      }

      const dataUrl = canvas.toDataURL("image/jpeg");
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = "game-result.jpg";
      link.click();
    } catch (error) {
      console.error("Screenshot failed:", error);
      if (downloadButton) {
        (downloadButton as HTMLElement).style.visibility = "visible";
      }
    }
  };

  const handleHome = () => navigate("/home");
  const handleHistory = () => navigate("/bookmarks");

  useEffect(() => {
    const validateAuth = async () => {
      const cookieToken = cookies.token;

      if (!cookieToken) {
        navigate("/");
        return;
      }

      const cookieContent = parseCookieKeyValue(cookieToken);

      if (!cookieContent || !cookieContent.id || !cookieContent.access_token) {
        navigate("/");
        return;
      }

      const isAuthenticated = await AuthGuard(
        cookieContent.id,
        cookieContent.access_token
      );

      if (!isAuthenticated) {
        navigate("/");
      }
    };

    validateAuth();
  }, [cookies.token, navigate]);

  if (!prompt || !genre) {
    navigate("/");
    return null;
  }

  return (
    <div className="h-full w-full flex flex-col justify-center">
      <div
        className="capture-area relative w-full text-black overflow-y-auto rounded-xl 
        shadow-lg shadow-gray-900/50 backdrop-blur-sm transition-all duration-300"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)), url('${image}')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        {/* 다운로드 버튼 */}
        <button
          onClick={handleDownload}
          className="download-button absolute top-6 right-4 bg-gray-800/90 p-3 rounded-full 
          shadow-lg hover:bg-gray-700 hover:shadow-xl transition-all duration-300 
          transform hover:scale-105 active:scale-95 animate-bounce"
          title="Download Result"
        >
          <FaDownload size={20} className="text-gray-200 transition-colors" />
        </button>

        {/* 메인 콘텐츠 */}
        <div className="min-h-[70dvh] max-h-[70dvh] flex flex-col justify-around items-center text-center p-8 gap-6">
          {/* 제목 */}
          <div
            className="w-4/5 flex flex-row justify-center text-center text-gray-100 bg-opacity-70
            bg-gray-900 rounded-xl border border-gray-600/50 shadow-xl p-5"
          >
            <p className="text-2xl font-bold tracking-wider">{genre} Summary</p>
          </div>

          {/* 내용 영역 */}
          <div className="w-full flex-1 relative group">
            <div className="absolute inset-0 rounded-xl" />
            <div
              className="relative h-full min-h-[480px] max-h-[480px] text-gray-200 
              rounded-xl border border-gray-600/50 shadow-xl p-4 bg-gray-900 bg-opacity-70
              scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent 
              overflow-y-auto overflow-x-hidden flex flex-col"
              style={{
                wordBreak: "break-all",
                whiteSpace: "pre-wrap",
              }}
            >
              {/* 스토리 텍스트 */}
              <div className="flex-grow">{prompt}</div>

              {/* 생존률 스탬프 */}
              {survivalRate !== undefined && (
                <div className="flex justify-center mt-6 mb-4">
                  <div className="w-28 h-28 animate-stamp">
                    <div className="relative w-full h-full">
                      <div
                        className="absolute inset-0 border-4 border-red-500 rounded-full 
          flex items-center justify-center transform rotate-[-15deg]"
                      >
                        <div className="text-red-500 font-bold">
                          <div className="text-lg">
                            {genre === "Romance" ? "연예성공률" : "생존률"}
                          </div>
                          <div className="text-3xl">{survivalRate}%</div>
                        </div>
                      </div>
                      {/* 스탬프 테두리 효과 */}
                      <div
                        className="absolute inset-0 border-4 border-red-500 rounded-full opacity-30 
          transform scale-[1.1] rotate-[15deg]"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 하단 버튼 */}
      <div className="my-4 flex flex-row justify-center items-center gap-8">
        <button
          className="px-8 py-4 relative overflow-hidden rounded-lg transition duration-300 focus:outline-none group"
          onClick={handleHome}
        >
          <p
            className="text-gray-700 dark:text-white text-lg font-bold tracking-wide relative z-10
            group-hover:scale-105 transition-transform duration-300"
          >
            HOME
          </p>
        </button>

        <span className="text-bold text-gray-700 opacity-80">|</span>

        <button
          className="px-8 py-4 relative overflow-hidden rounded-lg transition duration-300 group focus:outline-none"
          onClick={handleHistory}
        >
          <p
            className="text-gray-700 dark:text-white text-lg font-bold tracking-wide relative z-10
            group-hover:scale-105 transition-transform duration-300"
          >
            HISTORY
          </p>
        </button>
      </div>
    </div>
  );
};

export default GameEnding;
