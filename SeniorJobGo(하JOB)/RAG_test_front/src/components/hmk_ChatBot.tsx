import React, { useState, useRef, useEffect } from 'react';
import { Box, Paper, TextField, IconButton, Typography, Avatar, Chip } from '@mui/material';
import { styled } from '@mui/material/styles';
import SendIcon from '@mui/icons-material/Send';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import PersonIcon from '@mui/icons-material/Person';
import { chatService, ChatResponse } from '../services/chatService';

const ChatContainer = styled(Paper)(({ theme }) => ({
  height: '600px',
  display: 'flex',
  flexDirection: 'column',
  padding: theme.spacing(2),
  backgroundColor: theme.palette.background.default,
}));

const MessagesContainer = styled(Box)(({ theme }) => ({
  flex: 1,
  overflow: 'auto',
  marginBottom: theme.spacing(2),
  padding: theme.spacing(1),
}));

const MessageBubble = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'flex-start',
  marginBottom: theme.spacing(2),
  gap: theme.spacing(1),
}));

const MessageContent = styled(Paper, {
  shouldForwardProp: (prop) => prop !== 'isUser'
})<{ isUser: boolean }>(({ theme, isUser }) => ({
  padding: theme.spacing(1.5),
  maxWidth: '70%',
  borderRadius: '12px',
  backgroundColor: isUser ? theme.palette.primary.main : theme.palette.background.paper,
  color: isUser ? theme.palette.primary.contrastText : theme.palette.text.primary,
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
}));

interface Message {
  id: number;
  text: string;
  isUser: boolean;
  keywords?: {
    직무_키워드?: string[];
    기술_자격_키워드?: string[];
    선호도_키워드?: string[];
    제약사항_키워드?: string[];
  };
}

const KeywordChips = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  gap: theme.spacing(0.5),
  marginTop: theme.spacing(1),
}));

const HmkChatBot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: '안녕하세요! 저는 시니어 잡 플랫폼의 AI 상담사입니다. 어떤 도움이 필요하신가요?',
      isUser: false,
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const newMessage: Message = {
      id: messages.length + 1,
      text: input,
      isUser: true,
    };

    setMessages((prev) => [...prev, newMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await chatService.sendMessage(input);
      const botResponse: Message = {
        id: messages.length + 2,
        text: response.message,
        isUser: false,
        keywords: response.keywords,
      };
      setMessages((prev) => [...prev, botResponse]);
    } catch (error) {
      console.error('Error:', error);
      const errorMessage: Message = {
        id: messages.length + 2,
        text: '죄송합니다. 현재 서비스에 문제가 발생했습니다. 잠시 후 다시 시도해주세요.',
        isUser: false,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  const renderKeywords = (keywords: Message['keywords']) => {
    if (!keywords) return null;

    return (
      <KeywordChips>
        {Object.entries(keywords).map(([category, words]) =>
          words?.map((word) => (
            <Chip
              key={`${category}-${word}`}
              label={word}
              size="small"
              color={
                category === '직무_키워드'
                  ? 'primary'
                  : category === '기술_자격_키워드'
                  ? 'secondary'
                  : category === '선호도_키워드'
                  ? 'success'
                  : 'warning'
              }
              variant="outlined"
            />
          ))
        )}
      </KeywordChips>
    );
  };

  return (
    <ChatContainer elevation={3}>
      <MessagesContainer>
        {messages.map((message) => (
          <MessageBubble
            key={message.id}
            sx={{
              flexDirection: message.isUser ? 'row-reverse' : 'row',
            }}
          >
            <Avatar
              sx={{
                bgcolor: message.isUser ? 'primary.main' : 'secondary.main',
              }}
            >
              {message.isUser ? <PersonIcon /> : <SmartToyIcon />}
            </Avatar>
            <Box sx={{ maxWidth: '70%' }}>
              <MessageContent isUser={message.isUser}>
                <Typography variant="body1">{message.text}</Typography>
              </MessageContent>
              {!message.isUser && renderKeywords(message.keywords)}
            </Box>
          </MessageBubble>
        ))}
        <div ref={messagesEndRef} />
      </MessagesContainer>
      <Box sx={{ display: 'flex', gap: 1 }}>
        <TextField
          fullWidth
          multiline
          maxRows={4}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="메시지를 입력하세요..."
          variant="outlined"
          disabled={isLoading}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: '12px',
            },
          }}
        />
        <IconButton
          color="primary"
          onClick={handleSend}
          disabled={!input.trim() || isLoading}
          sx={{
            width: 56,
            height: 56,
            borderRadius: '12px',
          }}
        >
          <SendIcon />
        </IconButton>
      </Box>
    </ChatContainer>
  );
};

export default HmkChatBot; 