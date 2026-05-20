import React from 'react';
import styled, { keyframes } from 'styled-components';

interface LoadingModalProps {
  isOpen: boolean;
  message?: string;
}

const spin = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

const pulse = keyframes`
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(45, 17, 85, 0.7);
  backdrop-filter: blur(8px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  animation: fadeIn 0.3s ease-out;

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

const ModalBox = styled.div`
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(10px);
  border: 2px solid rgba(45, 17, 85, 0.2);
  border-radius: 25px;
  padding: 50px 40px;
  width: 90%;
  max-width: 350px;
  text-align: center;
  box-shadow: 
    0 25px 50px rgba(45, 17, 85, 0.3),
    0 10px 20px rgba(45, 17, 85, 0.1);
  animation: slideUp 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;

  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(30px) scale(0.95);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #2d1155, #4a1e75, #2d1155);
    border-radius: 25px 25px 0 0;
  }
`;

const LoadingSpinner = styled.div`
  width: 60px;
  height: 60px;
  margin: 0 auto 30px;
  border: 4px solid rgba(45, 17, 85, 0.1);
  border-left: 4px solid #2d1155;
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
`;

const LoadingDots = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  margin-bottom: 20px;
`;

const Dot = styled.div`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: linear-gradient(135deg, #2d1155, #4a1e75);
  animation: ${pulse} 1.4s ease-in-out infinite;

  &:nth-child(1) {
    animation-delay: -0.32s;
  }

  &:nth-child(2) {
    animation-delay: -0.16s;
  }

  &:nth-child(3) {
    animation-delay: 0;
  }
`;

const Message = styled.p`
  color: #2d1155;
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 10px;
`;

const SubMessage = styled.p`
  color: rgba(45, 17, 85, 0.7);
  font-size: 14px;
  font-weight: 500;
  line-height: 1.4;
`;

const LoadingModal: React.FC<LoadingModalProps> = ({
  isOpen,
  message = '처리 중입니다...'
}) => {
  if (!isOpen) return null;

  return (
    <Overlay>
      <ModalBox>
        <LoadingSpinner />
        <LoadingDots>
          <Dot />
          <Dot />
          <Dot />
        </LoadingDots>
        <Message>{message}</Message>
        <SubMessage>잠시만 기다려주세요</SubMessage>
      </ModalBox>
    </Overlay>
  );
};

export default LoadingModal; 