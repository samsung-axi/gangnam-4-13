import React, { useState, useRef, useEffect } from "react";
import {
  Container,
  Header,
  Title,
  ChatContainer,
  Messages,
  MessageBubble,
  InputArea,
  Input,
  SendButton,
  LoadingDots,
  LoadingDot,
  MessageText,
} from "./ChatBot.styles";

const LoadingDotsComponent: React.FC = () => {
  return (
    <LoadingDots>
      <LoadingDot />
      <LoadingDot />
      <LoadingDot />
    </LoadingDots>
  );
};

interface Message {
  id: string;
  type: "user" | "bot";
  content: string;
  timestamp: Date;
}

const StreamingChatComponent: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const eventSourceRef = useRef<EventSource | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading || isStreaming) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: inputValue.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    const botMessageId = (Date.now() + 1).toString();
    const botMessage: Message = {
      id: botMessageId,
      type: "bot",
      content: "",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, botMessage]);

    try {
      // EventSource를 사용하여 스트리밍 연결
      const eventSource = new EventSource(
        `${
          import.meta.env.VITE_API_URL
        }/api/v1/chatbot/chat/stream?query=${encodeURIComponent(
          userMessage.content
        )}`
      );

      eventSourceRef.current = eventSource;
      setIsStreaming(true);
      setIsLoading(false);

      eventSource.onmessage = (event) => {
        // 1. 백엔드에서 보낸 종료 신호를 확인합니다.
        if (event.data === "[DONE]") {
          console.log("Streaming finished.");
          eventSource.close(); // EventSource 연결을 스스로 닫습니다.
          setIsStreaming(false); // 스트리밍 상태를 false로 변경합니다.
          return;
        }

        // 2. 종료 신호가 아닐 경우에만 메시지를 화면에 추가합니다.
        const char = event.data;
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === botMessageId
              ? { ...msg, content: msg.content + char }
              : msg
          )
        );
      };

      eventSource.onerror = (error) => {
        console.error("EventSource error:", error);
        eventSource.close();
        setIsStreaming(false);

        // 에러 발생 시 에러 메시지 표시
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === botMessageId
              ? {
                  ...msg,
                  content:
                    msg.content ||
                    "죄송합니다. 응답을 가져오는 중 오류가 발생했습니다.",
                }
              : msg
          )
        );
      };

      eventSource.onopen = () => {
        console.log("EventSource connection opened");
      };

      // 연결이 자동으로 닫힐 때 처리
      const originalClose = eventSource.close;
      eventSource.close = function () {
        setIsStreaming(false);
        originalClose.call(this);
      };
    } catch (error) {
      console.error("Error sending message:", error);
      setIsLoading(false);
      setIsStreaming(false);

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === botMessageId
            ? {
                ...msg,
                content:
                  "죄송합니다. 메시지를 전송하는 중 오류가 발생했습니다.",
              }
            : msg
        )
      );
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleStopStreaming = () => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
    setIsStreaming(false);
    setIsLoading(false);
  };

  // 컴포넌트 언마운트 시 연결 정리
  useEffect(() => {
    const initialBotMessage: Message = {
      id: "initial-bot-message",
      type: "bot",
      content: "안녕하세요, Flowy AI 챗봇이에요. 무엇을 도와드릴까요?",
      timestamp: new Date(),
    };
    setMessages([initialBotMessage]);
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
    };
  }, []);

  return (
    <Container>
      <Header>
        <Title>Flowy pro Chatbot</Title>
      </Header>

      <ChatContainer>
        <Messages>
          {messages.map((message) =>
            message.type === "user" ? (
              <MessageBubble key={message.id} isUser={true}>
                <MessageText>{message.content}</MessageText>
              </MessageBubble>
            ) : (
              <MessageBubble key={message.id} isUser={false}>
                <MessageText>
                  {message.content}
                  {isStreaming &&
                    message.id === messages[messages.length - 1]?.id && (
                      <span style={{ opacity: 0.5 }}>▊</span>
                    )}
                </MessageText>
              </MessageBubble>
            )
          )}

          {isLoading && (
            <MessageBubble isUser={false}>
              <MessageText>
                응답을 기다리는 중
                <LoadingDotsComponent />
              </MessageText>
            </MessageBubble>
          )}

          <div ref={messagesEndRef} />
        </Messages>

        <InputArea
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
        >
          <Input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="메시지를 입력하세요..."
            disabled={isLoading || isStreaming}
          />

          {isStreaming ? (
            <SendButton type="button" onClick={handleStopStreaming}>
              중지
            </SendButton>
          ) : (
            <SendButton
              type="submit"
              disabled={isLoading || !inputValue.trim()}
            >
              전송
            </SendButton>
          )}
        </InputArea>
      </ChatContainer>
    </Container>
  );
};

export default StreamingChatComponent;
