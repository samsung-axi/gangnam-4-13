import React from 'react';
import styled, { keyframes } from 'styled-components';
import { FiAlertTriangle, FiX } from 'react-icons/fi';

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

const ModalHeader = styled.div`
  padding: 32px 32px 24px 32px;
  text-align: center;
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
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
  white-space: pre-wrap;
`;

const ModalBody = styled.div`
  padding: 32px;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 12px;
`;

const Button = styled.button<{ $variant: 'confirm' | 'cancel' }>`
  flex: 1;
  padding: 14px 24px;
  border-radius: 12px;
  border: none;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  
  ${props => props.$variant === 'confirm' ? `
    background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
    color: white;
    box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(245, 158, 11, 0.4);
    }
  ` : `
    background: #f8fafc;
    color: #64748b;
    border: 2px solid #e2e8f0;
    
    &:hover {
      background: #f1f5f9;
      border-color: #cbd5e1;
      transform: translateY(-1px);
    }
  `}

  &:active {
    transform: translateY(0);
  }
`;

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({ 
  isOpen, 
  title, 
  message, 
  confirmText = '확인', 
  cancelText = '취소',
  onConfirm, 
  onCancel 
}) => {
  return (
    <Overlay $isOpen={isOpen} onClick={onCancel}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <CloseButton onClick={onCancel}>
            <FiX />
          </CloseButton>
          <IconWrapper>
            <FiAlertTriangle />
          </IconWrapper>
          <Title>{title}</Title>
          <Message>{message}</Message>
        </ModalHeader>
        
        <ModalBody>
          <ButtonContainer>
            <Button $variant="cancel" onClick={onCancel}>
              {cancelText}
            </Button>
            <Button $variant="confirm" onClick={onConfirm}>
              {confirmText}
            </Button>
          </ButtonContainer>
        </ModalBody>
      </ModalContainer>
    </Overlay>
  );
};

export default ConfirmModal; 