import React from 'react';
import styled from 'styled-components';

interface AlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  confirmText?: string;
}

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(45, 17, 85, 0.6);
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
  padding: 40px 30px;
  width: 90%;
  max-width: 420px;
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

const IconWrapper = styled.div<{ type: 'success' | 'error' | 'warning' | 'info' }>`
  width: 80px;
  height: 80px;
  margin: 0 auto 25px;
  background: ${({ type }) => {
    switch (type) {
      case 'success':
        return 'linear-gradient(135deg, #27ae60, #2ecc71)';
      case 'error':
        return 'linear-gradient(135deg, #e74c3c, #c0392b)';
      case 'warning':
        return 'linear-gradient(135deg, #f39c12, #e67e22)';
      case 'info':
      default:
        return 'linear-gradient(135deg, #3498db, #2980b9)';
    }
  }};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 40px;
  color: white;
  box-shadow: ${({ type }) => {
    switch (type) {
      case 'success':
        return '0 8px 20px rgba(39, 174, 96, 0.3)';
      case 'error':
        return '0 8px 20px rgba(231, 76, 60, 0.3)';
      case 'warning':
        return '0 8px 20px rgba(243, 156, 18, 0.3)';
      case 'info':
      default:
        return '0 8px 20px rgba(52, 152, 219, 0.3)';
    }
  }};
  animation: bounceIn 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);

  @keyframes bounceIn {
    0% {
      transform: scale(0);
    }
    50% {
      transform: scale(1.1);
    }
    100% {
      transform: scale(1);
    }
  }

  &::after {
    content: ${({ type }) => {
      switch (type) {
        case 'success':
          return "'✓'";
        case 'error':
          return "'✕'";
        case 'warning':
          return "'⚠'";
        case 'info':
        default:
          return "'ℹ'";
      }
    }};
    font-weight: 700;
  }
`;

const Title = styled.h3`
  color: #2d1155;
  font-size: 22px;
  font-weight: 700;
  margin-bottom: 15px;
  text-shadow: 0 2px 4px rgba(45, 17, 85, 0.1);
`;

const Message = styled.p`
  color: rgba(45, 17, 85, 0.8);
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 30px;
  line-height: 1.5;
  white-space: pre-line;
`;

const Button = styled.button`
  width: 100%;
  height: 56px;
  border-radius: 15px;
  background: linear-gradient(135deg, #2d1155 0%, #4a1e75 100%);
  color: white;
  font-size: 16px;
  font-weight: 700;
  padding: 0 32px;
  border: none;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 8px 20px rgba(45, 17, 85, 0.3);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: left 0.6s ease;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 25px rgba(45, 17, 85, 0.4);

    &::before {
      left: 100%;
    }
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 6px 15px rgba(45, 17, 85, 0.3);
  }
`;

const AlertModal: React.FC<AlertModalProps> = ({
  isOpen,
  onClose,
  type,
  title,
  message,
  confirmText = '확인'
}) => {
  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <Overlay onClick={handleOverlayClick}>
      <ModalBox>
        <IconWrapper type={type} />
        <Title>{title}</Title>
        <Message>{message}</Message>
        <Button onClick={onClose}>
          {confirmText}
        </Button>
      </ModalBox>
    </Overlay>
  );
};

export default AlertModal; 