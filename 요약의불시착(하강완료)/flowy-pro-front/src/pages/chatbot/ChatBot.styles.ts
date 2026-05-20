import styled, { keyframes } from 'styled-components';

export const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  padding: 40px 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  
  @media (max-width: 768px) {
    padding: 20px 16px;
  }
`;

export const Header = styled.div`
  margin-bottom: 32px;
  text-align: center;
`;

export const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: #2d1155;
  margin: 0 0 12px 0;
  background: linear-gradient(135deg, #2d1155 0%, #1a0b3d 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  
  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

export const Subtitle = styled.p`
  font-size: 1.125rem;
  color: #6b7280;
  margin: 0;
  font-weight: 500;
`;

export const ChatContainer = styled.div`
  max-width: 800px;
  width: 100%;
  background: white;
  border-radius: 24px;
  box-shadow: 0 20px 40px rgba(45, 17, 85, 0.1);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  height: 700px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
  
  &:hover {
    box-shadow: 0 25px 50px rgba(45, 17, 85, 0.15);
    transform: translateY(-2px);
  }
  
  @media (max-width: 768px) {
    height: 600px;
    border-radius: 16px;
  }
`;

export const KeywordContainer = styled.div`
  display: flex;
  gap: 12px;
  padding: 20px 24px;
  border-bottom: 1px solid #f1f5f9;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  flex-wrap: wrap;
  
  @media (max-width: 768px) {
    padding: 16px 20px;
    gap: 8px;
  }
`;

export const KeywordButton = styled.button`
  background: linear-gradient(135deg, #2d1155 0%, #4c1d95 100%);
  border: none;
  border-radius: 16px;
  padding: 10px 16px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  color: white;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(45, 17, 85, 0.2);
  white-space: nowrap;

  &:hover {
    background: linear-gradient(135deg, #1a0b3d 0%, #3b1771 100%);
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(45, 17, 85, 0.3);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

export const Messages = styled.div`
  flex: 1;
  padding: 24px;
  overflow-y: auto;
  background: white;
  display: flex;
  flex-direction: column;
  gap: 16px;
  
  /* 스크롤바 스타일링 */
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: #f1f5f9;
    border-radius: 10px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #2d1155;
    border-radius: 10px;
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: #1a0b3d;
  }
  
  @media (max-width: 768px) {
    padding: 20px;
  }
`;

export const MessageBubble = styled.div<{ isUser?: boolean }>`
  background: ${({ isUser }) => 
    isUser 
      ? 'linear-gradient(135deg, #2d1155 0%, #4c1d95 100%)' 
      : 'white'
  };
  color: ${({ isUser }) => (isUser ? 'white' : '#374151')};
  padding: 16px 20px;
  border-radius: 20px;
  max-width: 75%;
  word-break: break-word;
  white-space: pre-wrap;
  line-height: 1.6;
  font-size: 0.9375rem;
  align-self: ${({ isUser }) => (isUser ? 'flex-end' : 'flex-start')};
  box-shadow: ${({ isUser }) => 
    isUser 
      ? '0 8px 25px rgba(45, 17, 85, 0.3)' 
      : '0 4px 12px rgba(0, 0, 0, 0.08)'
  };
  border: ${({ isUser }) => (isUser ? 'none' : '1px solid #f1f5f9')};
  
  ${({ isUser }) => isUser && `
    border-bottom-right-radius: 8px;
  `}
  
  ${({ isUser }) => !isUser && `
    border-bottom-left-radius: 8px;
  `}
`;

export const LoadingDots = styled.div`
  display: flex;
  gap: 4px;
  align-items: center;
  margin-left: 8px;
`;

const dot = keyframes`
  0%, 80%, 100% {
    transform: scale(0);
  }
  40% {
    transform: scale(1);
  }
`;

export const LoadingDot = styled.div`
  width: 8px;
  height: 8px;
  background: #9ca3af;
  border-radius: 50%;
  animation: ${dot} 1.4s infinite ease-in-out both;
  
  &:nth-child(1) { animation-delay: -0.32s; }
  &:nth-child(2) { animation-delay: -0.16s; }
  &:nth-child(3) { animation-delay: 0s; }
`;

export const LinkButton = styled.button`
  width: 100%;
  margin-top: 16px;
  background: linear-gradient(135deg, #2d1155 0%, #4c1d95 100%);
  color: white;
  border: none;
  padding: 12px 16px;
  border-radius: 12px;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 600;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(45, 17, 85, 0.2);

  &:hover {
    background: linear-gradient(135deg, #1a0b3d 0%, #3b1771 100%);
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(45, 17, 85, 0.3);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

export const InputArea = styled.form`
  display: flex;
  border-top: 1px solid #f1f5f9;
  background: linear-gradient(135deg, #f8fafc 0%, #ffffff 100%);
  padding: 20px 24px;
  gap: 12px;
  
  @media (max-width: 768px) {
    padding: 16px 20px;
  }
`;

export const Input = styled.input`
  flex: 1;
  border: 2px solid #e5e7eb;
  border-radius: 16px;
  padding: 14px 20px;
  font-size: 1rem;
  outline: none;
  background: white;
  transition: all 0.3s ease;
  color: #374151;
  
  &::placeholder {
    color: #9ca3af;
  }
  
  &:focus {
    border-color: #2d1155;
    box-shadow: 0 0 0 3px rgba(45, 17, 85, 0.1);
  }
  
  &:disabled {
    background: #f9fafb;
    color: #9ca3af;
    cursor: not-allowed;
  }
`;

export const SendButton = styled.button`
  padding: 14px 24px;
  background: linear-gradient(135deg, #2d1155 0%, #4c1d95 100%);
  color: white;
  border: none;
  border-radius: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 8px 25px rgba(45, 17, 85, 0.3);
  white-space: nowrap;
  
  &:hover:not(:disabled) {
    background: linear-gradient(135deg, #1a0b3d 0%, #3b1771 100%);
    transform: translateY(-2px);
    box-shadow: 0 12px 35px rgba(45, 17, 85, 0.4);
  }
  
  &:active:not(:disabled) {
    transform: translateY(0);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
    box-shadow: 0 4px 12px rgba(45, 17, 85, 0.2);
  }
`;

export const MessageContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const MessageSection = styled.div`
  &:not(:last-child) {
    margin-bottom: 8px;
  }
`;

export const MessageLabel = styled.div`
  font-weight: 600;
  color: #2d1155;
  margin-bottom: 4px;
  font-size: 0.875rem;
`;

export const MessageText = styled.div`
  line-height: 1.6;
`; 