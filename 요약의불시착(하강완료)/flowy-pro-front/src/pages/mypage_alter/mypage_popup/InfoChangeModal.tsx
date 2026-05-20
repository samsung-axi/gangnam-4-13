import React from 'react';
import type { ReactNode } from 'react';
import {
  ConfirmButton,
  Description,
  ModalContent,
  ModalOverlay,
  Title,
  IconContainer,
} from './InfoChangeModal.styles';

interface InfoChangeModalProps {
  onClose: () => void;
  title: string;
  description: ReactNode;
  type?: 'success' | 'error';
}

const InfoChangeModal: React.FC<InfoChangeModalProps> = ({
  onClose,
  title,
  description,
  type = 'success',
}) => {
  const getIcon = () => {
    if (type === 'success') {
      return (
        <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20,6 9,17 4,12"></polyline>
        </svg>
      );
    } else {
      return (
        <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
      );
    }
  };

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()} $type={type}>
        <IconContainer $type={type}>
          {getIcon()}
        </IconContainer>
        <Title $type={type}>{title}</Title>
        <Description>{description}</Description>
        <ConfirmButton onClick={onClose} $type={type}>확인</ConfirmButton>
      </ModalContent>
    </ModalOverlay>
  );
};

export default InfoChangeModal;
