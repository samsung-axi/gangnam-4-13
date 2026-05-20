import { useState, useEffect, useRef } from "react";
import axios from "../api/axiosInstance";
import { Cookies } from "react-cookie";
import { parseCookieKeyValue } from "../api/cookie";

interface WorldViewReturn {
  worldView: string;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useWorldView = (
  genre: string,
  tags: string[],
  initialStory: string,
  isLoading: boolean
): WorldViewReturn => {
  const [worldView, setWorldView] = useState<string>(initialStory || "");
  const [loading, setLoading] = useState(!initialStory); // initialStory가 있으면 로딩 생략
  const [error, setError] = useState<string | null>(null);
  const requestSent = useRef(false); // 요청이 이미 실행되었는지 추적
  const cookies = new Cookies();
  const cookieToken = cookies.get("token");
  const userId: number = Number(parseCookieKeyValue(cookieToken)?.id);
  const accessToken = parseCookieKeyValue(cookieToken)?.access_token;

  const fetchWorldView = async () => {
    if (requestSent.current || initialStory) return; // 요청 중복 방지
    requestSent.current = true;

    setLoading(true);
    try {
      // console.log("Sending request:", { genre, tags, userId });
      const response = await axios.post(
        `${process.env.REACT_APP_SPRING_URI}/generate-story/start`,
        {
          genre,
          tags,
          userId,
        },
        {
          headers: {
            "Content-Type": "application/json", // JSON 형식으로 데이터를 보낸다는 헤더
            Authorization: `Bearer ${accessToken}`, // JWT 토큰을 Authorization 헤더에 추가
          },
          withCredentials: true, // 쿠키를 요청에 포함시키기
        }
      );
      // console.log("Response received:", response.data);
      setWorldView(response.data.story);
      setError(null);
    } catch (error) {
      console.error("Error fetching world view:", error);
      setError("세계관을 불러오는데 실패했습니다. 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (genre && !initialStory) {
      fetchWorldView();
    }
  }, [genre, initialStory]);

  return {
    worldView,
    loading,
    error,
    refetch: fetchWorldView,
  };
};
