import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useEffect,
} from "react";
import { Cookies } from "react-cookie";
import { parseCookieKeyValue } from "../api/cookie";

interface AudioContextType {
  musicUrl: string | null;
  isPlaying: boolean;
  isLoading: boolean;
  error: string | null;
  initializeMusic: (genre: string, autoPlay?: boolean) => Promise<void>;
  togglePlayPause: () => void;
  stop: () => void;
}

const AudioContext = createContext<AudioContextType | null>(null);

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [musicUrl, setMusicUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement>(new Audio());
  const initializingRef = useRef<boolean>(false);

  const cookies = new Cookies();
  const cookieToken = cookies.get("token");
  const userId = Number(parseCookieKeyValue(cookieToken)?.id);
  const accessToken = parseCookieKeyValue(cookieToken)?.access_token;

  useEffect(() => {
    const audio = audioRef.current;

    const handleEnded = () => setIsPlaying(false);
    const handleError = () => {
      setError("음악 재생 중 오류가 발생했습니다.");
      setIsPlaying(false);
    };

    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("error", handleError);

    return () => {
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("error", handleError);
      audio.pause();
      audio.src = "";
    };
  }, []);

  const initializeMusic = async (genre: string, autoPlay: boolean = false) => {
    if (
      initializingRef.current ||
      (audioRef.current.src && audioRef.current.src.includes(genre))
    ) {
      return; // 이미 해당 장르의 음악이 재생 중이라면 초기화하지 않음
    }
    initializingRef.current = true;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${process.env.REACT_APP_SPRING_URI}/api/music/random?genre=${genre}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          credentials: "include",
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();

      if (audioRef.current.src !== data.url) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        audioRef.current.src = data.url;
        setMusicUrl(data.url);

        if (autoPlay) {
          const playPromise = audioRef.current.play();
          if (playPromise !== undefined) {
            await playPromise;
            setIsPlaying(true);
          }
        }
      }
    } catch (error) {
      setError("음악을 불러오는데 실패했습니다.");
      setMusicUrl(null);
    } finally {
      setIsLoading(false);
      initializingRef.current = false;
    }
  };

  const togglePlayPause = async () => {
    if (!musicUrl) return;

    try {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          await playPromise;
          setIsPlaying(true);
        }
      }
    } catch (error) {
      setIsPlaying(false);
    }
  };

  const stop = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
      setMusicUrl(null);
    }
  };

  return (
    <AudioContext.Provider
      value={{
        musicUrl,
        isPlaying,
        isLoading,
        error,
        initializeMusic,
        togglePlayPause,
        stop,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error("useAudio must be used within an AudioProvider");
  }
  return context;
};
