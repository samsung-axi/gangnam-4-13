import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import axios from "../api/axiosInstance";
import { useDarkMode } from "../Contexts/DarkModeContext";
import { parseCookieKeyValue } from "../api/cookie";
import { useMultipleSoundEffects } from "../hooks/useMultipleSoundEffects";

interface GameHistory {
  gameId: number;
  story: string;
  imageUrl: string | null;
  genre: string;
  createdAt: string | null; // null 가능성 포함
}

const Bookmarks: React.FC = () => {
  const navigate = useNavigate();
  const { isDarkMode } = useDarkMode();
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const [gameHistories, setGameHistories] = useState<GameHistory[]>([]);
  const [sortOrder, setSortOrder] = useState<"latest" | "oldest">("latest");
  const [cookie] = useCookies(["token"]);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const predefinedGenres = ["전체", "생존", "추리", "연애", "성장"];
  const { playSound } = useMultipleSoundEffects(["/audios/button2.mp3"]);

  const genreMapping: { [key: string]: string } = {
    생존: "Survival",
    추리: "Mystery",
    연애: "Romance",
    성장: "Simulation",
  };

  const defaultImages: { [key: string]: string } = {
    Survival: "/images/survival.webp",
    Romance: "/images/romance.webp",
    Simulation: "/images/simulation.webp",
    Mystery: "/images/detective.webp",
  };

  const fetchGameHistories = async (userId: number) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_SPRING_URI}/generate-story/history`,
        { userId },
        {
          headers: {
            Authorization: `Bearer ${
              parseCookieKeyValue(cookie.token)?.access_token
            }`,
          },
          withCredentials: true,
        }
      );

      const transformedHistories: GameHistory[] = response.data.map(
        (item: any) => ({
          ...item,
          imageUrl: item.imageUrl
            ? `data:image/jpeg;base64,${item.imageUrl}`
            : null,
          createdAt: item.createdAt || null, // createdAt이 없을 경우 null 처리
        })
      );

      setGameHistories(transformedHistories);
    } catch (error) {
      console.error("Error fetching game histories:", error);
    }
  };

  useEffect(() => {
    const cookieToken = cookie.token;
    const parsedToken = parseCookieKeyValue(cookieToken);

    if (!parsedToken) {
      console.error("Parsed token is null");
      navigate("/");
      return;
    }

    const userId = parsedToken.id;

    if (!userId) {
      console.error("Missing userId in parsed token");
      navigate("/");
      return;
    }

    fetchGameHistories(userId);
  }, [cookie.token, navigate]);

  // 정렬된 데이터를 계산
  const sortedHistories = [...gameHistories].sort((a, b) => {
    const aDate = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const bDate = b.createdAt ? new Date(b.createdAt).getTime() : 0;

    if (sortOrder === "latest") {
      return bDate - aDate;
    } else {
      return aDate - bDate;
    }
  });

  const filteredHistories = sortedHistories.filter((history) =>
    !selectedGenre ? true : history.genre === genreMapping[selectedGenre]
  );

  const totalPages = Math.ceil(filteredHistories.length / itemsPerPage);
  const displayedHistories = filteredHistories.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      playSound(0);
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="flex flex-col items-center w-full mx-auto pt-5 bg-white text-gray-800 p-2 min-h-screen dark:bg-custom-background">
      <div className="w-full mx-auto mt-20">
        {/* 상단 필터 및 정렬 */}
        <div className="w-full mb-9 flex flex-col gap-4 md:gap-6">
          {/* 장르 필터 버튼 */}
          <div
            className="flex flex-wrap justify-center gap-4"
            style={{ borderRadius: "60px", height: "auto" }}
          >
            {predefinedGenres.map((genre) => (
              <button
                key={genre}
                className={`flex-1 px-2 py-1 text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl text-center rounded-full ${
                  genre === selectedGenre ||
                  (genre === "전체" && !selectedGenre)
                    ? "bg-custom-violet text-white"
                    : "dark:text-white hover:bg-custom-violet hover:text-white"
                }`}
                style={{ borderRadius: "60px" }}
                onClick={() => {
                  playSound(0);
                  setSelectedGenre(genre === "전체" ? null : genre);
                  setCurrentPage(1); // 장르 변경 시 첫 페이지로 초기화
                }}
              >
                {genre}
              </button>
            ))}
          </div>

          {/* 정렬 셀렉트 박스 */}
          <div className="self-end mt-2">
            <select
              value={sortOrder}
              onChange={(e) => {
                playSound(0);
                setSortOrder(e.target.value as "latest" | "oldest");
              }}
              className="block appearance-none bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-white py-1 px-2 rounded-full shadow leading-tight focus:outline-none focus:shadow-outline w-auto"
            >
              <option value="latest">최신순</option>
              <option value="oldest">오래된순</option>
            </select>
          </div>
        </div>

        {/* 게임 히스토리 리스트 */}
        {displayedHistories.length === 0 ? (
          <p className="text-center text-gray-800 dark:text-white mt-10">
            아직 기록된 게임이 없습니다.
          </p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-6 justify-items-center items-center">
            {displayedHistories.map((history) => {
              const imageToUse = history.imageUrl
                ? history.imageUrl
                : defaultImages[history.genre];

              return (
                <div
                  key={history.gameId}
                  className="rounded-lg overflow-hidden cursor-pointer"
                  style={{
                    width: "100%",
                    maxWidth: "250px",
                    height: "350px",
                  }}
                  onClick={() =>
                    navigate(`/game-ending`, {
                      state: {
                        prompt: history.story,
                        genre: history.genre,
                        image: imageToUse,
                      },
                    })
                  }
                >
                  <img
                    src={imageToUse}
                    alt={`${history.genre} Thumbnail`}
                    className="w-full h-4/5 object-cover rounded-t-lg"
                  />
                  <p className="text-center mt-2 text-gray-800 dark:text-white truncate px-2">
                    {history.story}
                  </p>
                </div>
              );
            })}
          </div>
        )}

        {/* 페이지네이션 네비게이션 */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center mt-10 space-x-4">
            <button
              className="px-4 py-2 rounded-full bg-custom-violet text-white hover:bg-custom-dark-violet"
              disabled={currentPage === 1}
              onClick={() => handlePageChange(currentPage - 1)}
            >
              이전
            </button>
            {Array.from({ length: totalPages }, (_, index) => {
              const isSelected = currentPage === index + 1; // 현재 페이지와 비교
              return (
                <button
                  key={index + 1}
                  className={`px-4 py-2 rounded-full ${
                    isSelected
                      ? "bg-custom-violet text-white" // 선택된 페이지: 보라색 배경, 흰 글씨
                      : "bg-white text-black hover:bg-custom-violet hover:text-white" // 선택되지 않은 페이지: 흰 배경, 검정 글씨
                  }`}
                  onClick={() => handlePageChange(index + 1)}
                >
                  {index + 1}
                </button>
              );
            })}
            <button
              className="px-4 py-2 rounded-full bg-custom-violet text-white hover:bg-custom-dark-violet"
              disabled={currentPage === totalPages}
              onClick={() => handlePageChange(currentPage + 1)}
            >
              다음
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Bookmarks;
