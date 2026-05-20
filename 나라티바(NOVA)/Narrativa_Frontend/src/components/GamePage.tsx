// src/components/GamePage.tsx

import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useAudio } from "../Contexts/AudioContext";
import { LocationState } from "../utils/messageTypes";
import { ArrowBigLeftDash, Volume2, VolumeX } from "lucide-react";
import { useBackgroundImage } from "../hooks/useBackgroundImage";
import { useGameStage } from "../hooks/useGameStage";
import GameStageIndicator from "./GameStageIndicator";
import axios from "../api/axiosInstance";
import { Cookies } from "react-cookie";
import { parseCookieKeyValue } from "../api/cookie";
import ChatBot from "./ChatBot";
import PuzzleModal from "../components/PuzzleModal"; // PuzzleModal로 변경
import { useMultipleSoundEffects } from "../hooks/useMultipleSoundEffects";
import InfoModal from "./InfoModal";

interface GameState {
  mainMessage: string;
  choices: string[];
  gameId?: string;
}

const GamePage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { genre, tags, image, userId, initialStory } =
    location.state as LocationState;
  const cookies = new Cookies();
  const cookieToken = cookies.get("token");
  const accessToken = parseCookieKeyValue(cookieToken)?.access_token;
  const { playSound } = useMultipleSoundEffects(["/audios/button1.mp3"]);
  const [gameState, setGameState] = useState<GameState>({
    mainMessage: "",
    choices: [],
    gameId: undefined,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isChatBotVisible, setIsChatBotVisible] = useState(false);
  const [isChoicesVisible, setIsChoicesVisible] = useState(false);
  const [isStoryComplete, setIsStoryComplete] = useState(false);
  const [isPuzzleModalOpen, setIsPuzzleModalOpen] = useState(false); // 퍼즐 모달 상태
  const [isImageLoading, setIsImageLoading] = useState(false); // 이미지 로딩 상태

  const [isInfoModalOpen, setIsInfoModalOpen] = useState<boolean>(false);

  // 모달을 닫는 함수
  const handleInfoModalClose = () => {
    setIsInfoModalOpen(false);
  };

  const { isAuthenticated } = useAuth();
  const { isPlaying, togglePlayPause, initializeMusic } = useAudio();
  const { bgImage, generateImage } = useBackgroundImage(image, genre);
  const { currentStage, goToNextStage } = useGameStage({
    maxStages: 5,
    onStageChange: () => {
      if (genre) initializeMusic(genre, true); // 스테이지 변경 시 음악 재생 유지
    },
  });
  const [isChatBotActive, setIsChatBotActive] = useState(false);
  const [chatBotPosition, setChatBotPosition] = useState<"center" | "left">(
    "center"
  );

  useEffect(() => {
    // console.log("isStoryComplete:", isStoryComplete);
    // console.log("isChatBotVisible:", isChatBotVisible);
  }, [isStoryComplete, isChatBotVisible]);

  useEffect(() => {
    const startGame = async () => {
      if (currentStage === 0) {
        setIsInfoModalOpen(true);
      }
      setIsLoading(true);
      setError(null);
      try {
        setGameState({
          mainMessage: "",
          choices: [], // 초기 선택지는 빈 배열로 시작
          gameId: undefined, // gameId는 아직 없음
        });
        const words = initialStory.split(" ");
        updateStoryTextByWord(initialStory, words, 0);

        // gameId만 따로 받아오기 위한 API 호출
        const response = await axios.post(
          "/generate-story/start",
          { genre, tags, userId },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
            withCredentials: true,
          }
        );

        // gameId만 업데이트
        setGameState((prev) => ({
          ...prev,
          gameId: response.data.gameId,
          choices: response.data.choices || [],
        }));
      } catch (err) {
        console.error("Error starting game:", err);
        setError("게임을 시작하는 중 오류가 발생했습니다.");
      } finally {
        setIsLoading(false);
      }
    };
    startGame();
  }, [genre, tags, userId, accessToken, isAuthenticated, initialStory]);

  const updateStoryTextByWord = (
    story: string,
    words: string[],
    index: number
  ) => {
    if (index < words.length) {
      setGameState((prevState) => ({
        ...prevState,
        mainMessage: prevState.mainMessage + " " + words[index],
      }));
      setTimeout(() => updateStoryTextByWord(story, words, index + 1), 100);
    } else {
      setIsStoryComplete(true);
      setTimeout(() => {
        setIsChoicesVisible(true);
        setTimeout(() => {
          setIsChatBotActive(true);
        }, 500);
      }, 300);
    }
  };

  const handleChoice = async (choiceText: string) => {
    if (!gameState.gameId) {
      setError("게임 ID가 없습니다.");
      return;
    }

    setIsChoicesVisible(false);
    setChatBotPosition("center");
    setIsChatBotActive(false);
    setIsStoryComplete(false);

    try {
      const payload = {
        genre,
        userSelect: choiceText,
        gameId: gameState.gameId,
      };

      if (currentStage < 4) {
        if (currentStage === 2) {
          setIsPuzzleModalOpen(true); // 퍼즐 모달을 열기
        }

        setIsImageLoading(true); // 이미지 로딩 시작

        const generatedImageResult = await generateImage(
          choiceText,
          genre,
          gameState.gameId,
          currentStage
        );

        // 이미지 생성 실패 시 처리
        if (!generatedImageResult) {
          throw new Error("이미지 생성에 실패했습니다.");
        }

        setIsImageLoading(false); // 이미지 로딩 끝

        const response = await axios.post("/generate-story/chat", payload, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          withCredentials: true,
        });

        setGameState({
          mainMessage: "",
          choices: response.data.choices || [],
          gameId: gameState.gameId,
        });

        const words = response.data.story.split(" ");
        updateStoryTextByWord(response.data.story, words, 0);
        goToNextStage();
      } else {
        // 엔딩 처리
        const endPayload = {
          genre,
          userChoice: choiceText,
          gameId: gameState.gameId,
        };

        const [generatedImageResult, endResponse] = await Promise.all([
          generateImage(choiceText, genre, gameState.gameId, currentStage),
          axios.post("/generate-story/end", endPayload, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
            withCredentials: true,
          }),
        ]);

        if (!generatedImageResult) {
          throw new Error("엔딩 이미지 생성에 실패했습니다.");
        }

        // 엔딩페이지로 넘어갈 때 음악 정지
        togglePlayPause();
        console.log(endResponse.data);
        navigate("/game-ending", {
          state: {
            image: generatedImageResult.imageData,
            prompt: endResponse.data.story,
            genre,
            survivalRate: endResponse.data.survival_rate,
          },
        });
        return;
      }
    } catch (err) {
      console.error("Error processing choice:", err);
      setError("선택 처리 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePuzzleModalClose = () => {
    setIsPuzzleModalOpen(false); // 퍼즐 모달 닫기
  };

  const handleGameComplete = () => {
    setIsPuzzleModalOpen(false); // 퍼즐 게임 완료 후 모달 닫기
  };

  if (!isAuthenticated) {
    navigate("/");
    return null;
  }

  const handleChatBotToggle = () => {
    if (isChatBotActive) {
      setChatBotPosition((prev) => (prev === "center" ? "left" : "center"));
    }
  };

  return (
    <div className="relative w-full h-[100svh] text-white overflow-hidden">
      {/* 배경 이미지 */}
      <div className="absolute inset-0">
        <img
          src={bgImage}
          alt={`Stage ${currentStage + 1}`}
          className="w-full h-full object-cover brightness-50"
        />
      </div>

      {/* 상단 네비게이션 */}
      <div className="absolute top-4 flex justify-between w-full px-4 z-20">
        <button
          onClick={() => {
            playSound(0);
            navigate("/game-intro", { state: { genre, tags, image } });
          }}
          className="bg-gray-800 p-2 rounded-full hover:bg-gray-700 transition-colors"
        >
          <ArrowBigLeftDash size={20} />
        </button>
        <GameStageIndicator currentStage={currentStage} maxStages={5} />
        <button
          onClick={() => {
            togglePlayPause();
            playSound(0);
          }}
          className="bg-gray-800 p-2 rounded-full hover:bg-gray-700 transition-colors"
        >
          {isPlaying ? <Volume2 size={20} /> : <VolumeX size={20} />}
        </button>
      </div>

      {/* 메인 컨텐츠 영역 */}
      <div className="absolute inset-x-0 top-24 px-4 z-10">
        <div className="mx-auto max-w-4xl">
          <div className="bg-gray-800/50 p-6 rounded-lg backdrop-blur-sm">
            {gameState.mainMessage}
          </div>
          {isStoryComplete && isChoicesVisible && (
            <div
              className={`mt-6 ${
                chatBotPosition === "left" ? "mb-32" : "mb-4"
              }`}
            >
              {isLoading ? (
                <div className="text-center">Loading...</div>
              ) : error ? (
                <div className="text-center text-red-500">{error}</div>
              ) : (
                <div className="space-y-4">
                  {gameState.choices.map((choice, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        playSound(0);
                        handleChoice(choice);
                      }}
                      className="w-full bg-gray-800/70 text-white p-4 rounded-lg opacity-0 animate-fadeIn transition-all duration-300 hover:bg-gray-700/90 hover:scale-[1.02] border border-purple-500/20 backdrop-blur-sm"
                      style={{ animationDelay: `${index * 0.2}s` }}
                    >
                      {choice}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* 이미지 로딩 중 표시 */}
      {isImageLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-30">
          <div className="text-white">다음스토리 생성 중...</div>
        </div>
      )}

      {/* 퍼즐 모달 */}
      <PuzzleModal
        isOpen={isPuzzleModalOpen}
        onClose={() => {
          playSound(0);
          handlePuzzleModalClose();
        }}
        bgImage={bgImage}
      />

      {/* ChatBot */}
      {isStoryComplete && isChatBotActive && (
        <ChatBot
          gameId={gameState.gameId}
          position={chatBotPosition}
          onToggle={() => {
            playSound(0);
            handleChatBotToggle();
          }}
        />
      )}

      {/* 챗봇 소개 모달 */}
      {isInfoModalOpen && (
        <InfoModal position="center" onToggle={handleInfoModalClose} />
      )}
    </div>
  );
};

export default GamePage;
