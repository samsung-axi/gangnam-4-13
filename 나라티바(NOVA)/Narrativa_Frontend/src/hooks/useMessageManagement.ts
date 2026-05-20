import { useState, useEffect, useRef } from "react";
import { Message, MessageManagementProps } from "../utils/messageTypes";
import axios from "../api/axiosInstance";
import { useBackgroundImage } from "./useBackgroundImage";

export const useMessageManagement = ({
  genre,
  currentStage,
  initialStory,
  conversationHistory,
}: MessageManagementProps) => {
  const [allMessages, setAllMessages] = useState<{ [key: number]: Message[] }>(
    {}
  );
  const [currentMessages, setCurrentMessages] = useState<Message[]>([]);
  const [choices, setChoices] = useState<string[]>([]); // AI가 생성한 선택지 상태 추가
  const [gameId, setGameId] = useState<string | null>(null); // game ID 상태 추가
  const [loading, setLoading] = useState<boolean>(false);
  const [responses, setResponses] = useState<any[]>([]);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const { generateImage, bgImage } = useBackgroundImage("/images/main.png", genre);

  // 메시지를 추가하는 함수
  const addMessage = (message: Message, stage: number) => {
    setCurrentMessages((prev) => [...prev, message]);
    setAllMessages((prev) => ({
      ...prev,
      [stage]: [...(prev[stage] || []), message],
    }));
  };

  // AI 선택지와 메시지 요청 처리 함수
  const fetchOpponentMessage = async (userChoice: string) => {
    setLoading(true);
    try {
      const requestBody = {
        genre,
        user_choice: userChoice || "",
        game_id: gameId || "",
      };

      console.log("Sending request to /generate-story/chat:", requestBody);

      const response = await axios.post("/generate-story/chat", requestBody);
      setResponses((prevResponses) => [...prevResponses, response.data]);

      if (response.data) {
        const newMessage: Message = {
          sender: "opponent",
          text: response.data.story,
        };
        addMessage(newMessage, currentStage);
        setChoices(response.data.choices || []); // 새로운 선택지 설정
      }
    } catch (error) {
      console.error("Error in fetchOpponentMessage:", error);
      const errorMessage: Message = {
        sender: "opponent",
        text: "오류가 발생했습니다. 다시 시도해주세요.",
      };
      addMessage(errorMessage, currentStage);
    } finally {
      setLoading(false);
    }
  };

  // 초기 스토리 설정
  useEffect(() => {
    const initializeGame = async () => {
      if (initialStory && !gameId) {
        setLoading(true);
        try {
          const response = await axios.post("/generate-story/start", { genre });

          const gameId = response.data.game_id;
          const initialChoices = response.data.choices || [];

          setGameId(gameId);
          setChoices(initialChoices);

          const initialMessage: Message = {
            sender: "opponent",
            text: response.data.story,
          };
          setAllMessages((prev) => ({
            ...prev,
            [currentStage]: [initialMessage],
          }));
          setCurrentMessages([initialMessage]);

          //alert(response.data.story);

          await generateImage(response.data.story, genre, gameId, currentStage); // gameId와 currentStage를 추가
        } catch (error) {
          console.error("Error initializing game:", error);
          const errorMessage: Message = {
            sender: "opponent",
            text: "게임 초기화에 실패했습니다. 다시 시도해주세요.",
          };
          setAllMessages((prev) => ({
            ...prev,
            [currentStage]: [errorMessage],
          }));
          setCurrentMessages([errorMessage]);
        } finally {
          setLoading(false);
        }
      }
    };

    initializeGame();
  }, [genre, initialStory, gameId, currentStage]);

  // 스테이지 변경 시 메시지 동기화
  useEffect(() => {
    const savedMessages = allMessages[currentStage] || [];
    setCurrentMessages(savedMessages);
  }, [currentStage, allMessages]);

  // 메시지 변경 시 스크롤 동작
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [currentMessages]);

  return {
    allMessages,
    currentMessages,
    choices, // 선택지 반환
    loading,
    responses,
    fetchOpponentMessage,
    messagesEndRef,
    gameId,
    setGameId,
  };
};
