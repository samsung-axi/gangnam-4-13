import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { LocationState } from "../utils/messageTypes";
import { useMultipleSoundEffects } from "../hooks/useMultipleSoundEffects";

const GameIntro: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { genre, tags, image } = (location.state as LocationState) || {};
  const { userId, isAuthenticated, logout } = useAuth();
  const { playSound } = useMultipleSoundEffects(["/audios/button1.mp3"]);

  const handleStart = async () => {
    if (!genre) {
      alert("Genre information is missing!");
      return;
    }

    if (!isAuthenticated) {
      alert("인증이 필요합니다. 다시 로그인해주세요.");
      logout();
      return;
    }

    try {
      navigate("/game-world-view", {
        state: {
          genre,
          tags,
          image,
          initialStory: "",
          isLoading: true,
          userId,
        },
      });
    } catch (error: any) {
      console.error("Error:", error);
      alert("Failed to start the game. Please try again.");
    }
  };

  return (
    <div className="relative w-full h-full text-white overflow-hidden overflow-y-auto">
      {/* <p
          className="text-base leading-relaxed mb-6 p-4 rounded-2xl bg-gray-200
        dark:bg-[rgb(37,42,52)] shadow-sm dark:shadow-gray-900 dark:bg-opacity-80 mb-16"
        >
          매혹적인{" "}
          <span className="text-custom-violet font-semibold">{genre}</span>{" "}
          세계에서
          <br />
          당신만의 <span className="text-red-700 font-extrabold">선택</span>으로
          유일한 이야기를 써내려가세요.
        </p> */}
      {/* Image Container */}
      <div className="relative inset-0 transition-transform duration-700">
        <img
          src={image}
          alt={genre}
          className=" h-auto object-cover shadow-md transform group-hover:scale-[1.01] transition duration-300 rounded-3xl border-[10px] border-white dark:border-[rgb(23,21,21)]"
        />
        {/* 좌측 상단의 작은 이미지 */}
        <div className="absolute top-4 left-4">
          <img
            src="/images/back_white.webp"
            alt="Back Icon"
            className="w-8 h-8 object-contain cursor-pointer hover:scale-110 transition-transform duration-300"
            onClick={() => {
              playSound(0);
              navigate("/home");
            }}
          />
        </div>
      </div>
      {/* Content Container */}
      <div className="text-center text-black dark:text-white w-full max-w-lg mt-4">
        {/* Title */}
        <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white left-0">
          #{genre}
        </h3>

        {/* Description */}
        <p
          className="text-lg leading-relaxed mb-8 px-4
      shadow-sm dark:shadow-gray-900 dark:bg-opacity-100 dark:text-gray-400"
        >
          매혹적인{" "}
          <span className="text-custom-purple dark:text-custom-violet font-extrabold">
            {genre}
          </span>{" "}
          세계에 당신을 초대합니다.
          <br />
          당신의{" "}
          <span className="text-custom-purple dark:text-custom-violet font-extrabold">
            선택
          </span>
          으로 이야기가 달라집니다.
          <br />
          <span className="text-black dark:text-gray-400 font-extrabold">
            당신만의 스토리를
          </span>{" "}
          써내려가세요.
        </p>

        {/* Start Button */}
        <button
          onClick={() => {
            playSound(0);
            handleStart();
          }}
          className="relative px-8 py-4 text-2xl text-white font-extrabold animate-pulse bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl hover:from-purple-700 hover:to-blue-700 transform hover:scale-110 transition-transform duration-300 mb-12"
        >
          Start Game
        </button>
      </div>
    </div>
  );
};

export default GameIntro;
