import React from 'react';
import styled, { keyframes } from 'styled-components';
import { FiCheckCircle, FiXCircle, FiAlertTriangle, FiInfo, FiX } from 'react-icons/fi';

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
`;

const bounceIn = keyframes`
  0% {
    opacity: 0;
    transform: scale(0.3);
  }
  50% {
    opacity: 1;
    transform: scale(1.05);
  }
  70% {
    transform: scale(0.9);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
`;

const Overlay = styled.div<{ $isOpen: boolean }>`
  display: ${props => props.$isOpen ? 'flex' : 'none'};
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(8px);
  justify-content: center;
  align-items: center;
  z-index: 2000;
  animation: ${fadeIn} 0.3s ease-out;
`;

const ModalContainer = styled.div`
  background: white;
  border-radius: 20px;
  padding: 0;
  width: 100%;
  max-width: 420px;
  box-shadow: 0 20px 60px rgba(45, 17, 85, 0.15);
  border: 1px solid rgba(45, 17, 85, 0.1);
  overflow: hidden;
  animation: ${bounceIn} 0.5s ease-out;
`;

const ModalHeader = styled.div<{ $type: 'success' | 'error' | 'warning' | 'info' }>`
  padding: 32px 32px 24px 32px;
  text-align: center;
  background: ${props => {
    switch (props.$type) {
      case 'success':
        return 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
      case 'error':
        return 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)';
      case 'warning':
        return 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)';
      case 'info':
        return 'linear-gradient(135deg, #2d1155 0%, #4b2067 100%)';
      default:
        return 'linear-gradient(135deg, #2d1155 0%, #4b2067 100%)';
    }
  }};
  color: white;
  position: relative;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 16px;
  right: 16px;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: scale(1.05);
  }
`;

const IconWrapper = styled.div`
  font-size: 48px;
  margin-bottom: 16px;
  animation: ${bounceIn} 0.6s ease-out 0.2s both;
`;

const Title = styled.h3`
  margin: 0 0 8px 0;
  font-size: 1.5rem;
  font-weight: 700;
  color: white;
`;

const Message = styled.p`
  margin: 0;
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.9);
  line-height: 1.5;
`;

const ModalBody = styled.div`
  padding: 32px;
  text-align: center;
`;

const Button = styled.button<{ $type: 'success' | 'error' | 'warning' | 'info' }>`
  width: 100%;
  padding: 14px 24px;
  border-radius: 12px;
  border: none;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  background: ${props => {
    switch (props.$type) {
      case 'success':
        return 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
      case 'error':
        return 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)';
      case 'warning':
        return 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)';
      case 'info':
        return 'linear-gradient(135deg, #2d1155 0%, #4b2067 100%)';
      default:
        return 'linear-gradient(135deg, #2d1155 0%, #4b2067 100%)';
    }
  }};
  color: white;
  box-shadow: 0 4px 12px ${props => {
    switch (props.$type) {
      case 'success':
        return 'rgba(16, 185, 129, 0.3)';
      case 'error':
        return 'rgba(239, 68, 68, 0.3)';
      case 'warning':
        return 'rgba(245, 158, 11, 0.3)';
      case 'info':
        return 'rgba(45, 17, 85, 0.3)';
      default:
        return 'rgba(45, 17, 85, 0.3)';
    }
  }};

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px ${props => {
      switch (props.$type) {
        case 'success':
          return 'rgba(16, 185, 129, 0.4)';
        case 'error':
          return 'rgba(239, 68, 68, 0.4)';
        case 'warning':
          return 'rgba(245, 158, 11, 0.4)';
        case 'info':
          return 'rgba(45, 17, 85, 0.4)';
        default:
          return 'rgba(45, 17, 85, 0.4)';
      }
    }};
  }

  &:active {
    transform: translateY(0);
  }
`;

interface AlertModalProps {
  isOpen: boolean;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  onClose: () => void;
}

const getIcon = (type: string) => {
  switch (type) {
    case 'success':
      return <FiCheckCircle />;
    case 'error':
      return <FiXCircle />;
    case 'warning':
      return <FiAlertTriangle />;
    case 'info':
      return <FiInfo />;
    default:
      return <FiInfo />;
  }
};

const getButtonText = (type: string) => {
  switch (type) {
    case 'success':
      return '확인';
    case 'error':
      return '확인';
    case 'warning':
      return '확인';
    case 'info':
      return '확인';
    default:
      return '확인';
  }
};

const AlertModal: React.FC<AlertModalProps> = ({ isOpen, type, title, message, onClose }) => {
  return (
    <Overlay $isOpen={isOpen} onClick={onClose}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <ModalHeader $type={type}>
          <CloseButton onClick={onClose}>
            <FiX />
          </CloseButton>
          <IconWrapper>
            {getIcon(type)}
          </IconWrapper>
          <Title>{title}</Title>
          <Message>{message}</Message>
        </ModalHeader>
        
        <ModalBody>
          <Button $type={type} onClick={onClose}>
            {getButtonText(type)}
          </Button>
        </ModalBody>
      </ModalContainer>
    </Overlay>
  );
};

export default AlertModal; 