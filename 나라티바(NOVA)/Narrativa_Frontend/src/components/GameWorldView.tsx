import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Loader2, ArrowBigLeftDash, Volume2, VolumeX } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { useAudio } from "../Contexts/AudioContext";
import { useWorldView } from "../hooks/useWorldView";
import { LocationState } from "../utils/messageTypes";
import { useMultipleSoundEffects } from "../hooks/useMultipleSoundEffects";
import InfoModal from "./InfoModal"; // 모달 컴포넌트 가져오기

const GameWorldView: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { genre, tags, image, initialStory, isLoading } =
    (location.state as LocationState) || {};
  const [bgImage, setBgImage] = useState<string>(image);
  const [musicInitialized, setMusicInitialized] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false); // 모달 표시 상태 추가
  const [isNavigate, setIsNavigate] = useState(false); // 페이지 이동 여부 상태

  const loadingCompleteRef = useRef(false);
  const { playSound } = useMultipleSoundEffects(["/audios/button1.mp3"]);

  const { userId, isAuthenticated } = useAuth();
  const { musicUrl, isPlaying, togglePlayPause, initializeMusic, stop } =
    useAudio();
  const { worldView, loading, error } = useWorldView(
    genre,
    tags,
    initialStory,
    isLoading || false
  );

  // 모달 열기
  const openModal = () => {
    setIsModalVisible(true);
  };

  // 모달 닫기
  const closeModalAndNavigate = () => {
    setIsModalVisible(false);
    setIsNavigate(true); // 페이지 이동 상태 설정
  };
  useEffect(() => {}, [isModalVisible]);

  useEffect(() => {
    if (
      !loading &&
      !error &&
      genre &&
      isAuthenticated &&
      !loadingCompleteRef.current
    ) {
      loadingCompleteRef.current = true;
      const timer = setTimeout(() => {
        if (!musicInitialized) {
          initializeMusic(genre, true);
          setMusicInitialized(true);
        }
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [
    loading,
    error,
    genre,
    isAuthenticated,
    initializeMusic,
    musicInitialized,
  ]);

  useEffect(() => {
    return () => {
      loadingCompleteRef.current = false;
      setMusicInitialized(false);
    };
  }, []);

  const handleNavigateBack = () => {
    togglePlayPause();
    stop();
    navigate(-1);
  };

  const handleStartGame = async () => {
    // 게임 시작 대신 모달 열기
    console.log("게임 시작하기 버튼 클릭됨");
    openModal();

    if (!isAuthenticated) {
      navigate("/");
      return;
    }

    if (!worldView || !genre || !tags || !image) {
      console.error("Required game data is missing");
      return;
    }

    try {
      navigate("/game-page", {
        state: {
          genre,
          tags,
          image,
          initialStory: worldView,
          userId,
          messages: [],
        },
      });
    } catch (error) {
      console.error("Error starting game:", error);
    }
  };

  if (!genre || !isAuthenticated) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-b from-gray-800 to-gray-900">
        <p className="text-white text-xl font-medium animate-pulse">
          Invalid access. Redirecting...
        </p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-screen text-white overflow-hidden">
      {/* 배경 이미지 */}
      <div className="absolute inset-0 transition-transform duration-700">
        <img
          src={bgImage}
          alt="World View Background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-50" />
      </div>
      {/* 상단 네비게이션 */}
      <div className="absolute top-4 flex justify-between w-full px-4 z-30">
        <button
          onClick={() => {
            playSound(0);
            handleNavigateBack();
          }}
          className="bg-custom-background text-white w-10 h-10 rounded-full 
                   hover:bg-custom-violet transition-colors 
                   flex items-center justify-center shadow-2xl"
        >
          <ArrowBigLeftDash size={20} />
        </button>

        <div className="flex items-center space-x-4">
          {musicUrl && (
            <button
              onClick={() => {
                playSound(0);
                togglePlayPause();
              }}
              className="bg-custom-background text-white w-10 h-10 rounded-full 
                       hover:bg-custom-violet transition-colors 
                       flex items-center justify-center shadow-2xl"
            >
              {isPlaying ? <Volume2 size={20} /> : <VolumeX size={20} />}
            </button>
          )}
        </div>
      </div>
      {/* 메인 콘텐츠 */}
      <div className="absolute inset-0 flex flex-col items-center justify-between px-4 font-NanumBarunGothic">
        <div className="flex flex-col justify-center items-center w-full h-full max-w-2xl space-y-6">
          <h1 className="text-4xl font-bold text-center text-white drop-shadow-lg">
            {genre} 세계관
          </h1>

          {/* 세계관 내용 */}
          <div
            className="flex-1 min-h-[50vh] max-h-[60vh] overflow-y-auto
                    scrollbar-thin scrollbar-thumb-custom-violet scrollbar-track-transparent "
          >
            {loading ? (
              <div className="h-full w-full flex flex-col items-center justify-center space-y-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white" />
                <p className="text-xl">당신의 선택에 스토리가 달려있습니다..</p>
              </div>
            ) : error ? (
              <div className="h-full w-full flex flex-col items-center justify-center text-red-500 text-center">
                <p>{error}</p>
                <button
                  onClick={() => {
                    playSound(0);
                    window.location.reload();
                  }}
                  className="mt-4 underline"
                >
                  다시 시도
                </button>
              </div>
            ) : (
              <div className="h-full w-full bg-custom-hover bg-opacity-60 rounded-2xl p-6 shadow-2xl">
                <div className="text-base leading-relaxed whitespace-pre-line">
                  {worldView}
                </div>
              </div>
            )}
          </div>

          {/* 시작 버튼 */}
          <div className="flex justify-center">
            <button
              onClick={() => {
                playSound(0);
                handleStartGame();
              }}
              disabled={loading || !!error}
              className="text-white py-4 px-8 rounded-lg animate-pulse 
              disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="font-bold text-2xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent ">
                {loading ? "" : error ? "" : "게임 시작하기"}
              </span>
            </button>
          </div>
        </div>
      </div>
      {/* 모달 컴포넌트 최상위 추가 */}

      {isModalVisible && (
        <InfoModal position="center" onToggle={closeModalAndNavigate} />
      )}
    </div>
  );
};

export default GameWorldView;
