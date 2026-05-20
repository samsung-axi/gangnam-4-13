import { useState } from "react";
import { useMessageManagement } from "./useMessageManagement";

interface UseGameChatProps {
  genre: string;
  currentStage: number;
  initialStory?: string;
  tags: string[];
  image: string;
  gameId: string;
}

export const useGameChat = ({
  genre,
  currentStage,
  initialStory = "",
  tags,
  image,
  gameId,
}: UseGameChatProps) => {
  const [userInput, setUserInput] = useState<string>("");
  const [conversationHistory, setConversationHistory] = useState<string[]>([]);

  // useMessageManagement 호출 시 필요한 모든 props를 전달
  const {
    allMessages,
    currentMessages,
    choices,
    loading,
    fetchOpponentMessage,
    messagesEndRef,
  } = useMessageManagement({
    genre,
    currentStage,
    initialStory,
    userInput,
    previousUserInput: "",
    conversationHistory,
    tags,
    image,
    gameId,
  });

  // 선택한 메시지를 전송하는 함수
  const sendMessage = async (choice: string) => {
    await fetchOpponentMessage(choice);
  };

  return {
    allMessages,
    currentMessages,
    choices,
    loading,
    sendMessage,
    messagesEndRef,
    userInput,
    setUserInput,
    conversationHistory,
  };
};
