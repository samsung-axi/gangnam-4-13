// src/pages/insert_conference_info/conference_popup/AnalysisRequestedPopup.tsx
import React from 'react';
import styled, { keyframes } from 'styled-components';
import { FiX, FiCheckCircle } from 'react-icons/fi';

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

const slideUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(30px) scale(0.95);
  }
    
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
`;

const Modal = styled.div`
  display: flex;
  position: fixed;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(8px);
  justify-content: center;
  align-items: center;
  z-index: 1000;
  animation: ${fadeIn} 0.3s ease-out;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 24px;
  width: 100%;
  max-width: 520px;
  max-height: 90vh;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(45, 17, 85, 0.15);
  border: 1px solid rgba(45, 17, 85, 0.1);
  animation: ${slideUp} 0.3s ease-out;
`;

const ModalHeader = styled.div`
  background: linear-gradient(135deg, #2d1155 0%, #4b2067 100%);
  color: white;
  padding: 32px 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
`;

const HeaderContent = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  gap: 16px;
`;

const IconWrapper = styled.div`
  font-size: 32px;
  color: white;
`;

const Title = styled.h2`
  margin: 0;
  font-size: 1.75rem;
  font-weight: 700;
  color: white;
`;

const CloseButton = styled.button`
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: scale(1.05);
  }
`;

const ModalBody = styled.div`
  padding: 40px;
  text-align: center;
`;

const Description = styled.p`
  font-size: 16px;
  color: #6b7280;
  line-height: 1.6;
  margin: 0 0 32px 0;
`;

const Highlight = styled.span`
  color: #2d1155;
  font-weight: 600;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 8px;
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' }>`
  flex: 1;
  padding: 14px 24px;
  border-radius: 12px;
  border: none;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  ${(props) => {
    switch (props.variant) {
      case 'secondary':
        return `
          background: #f8fafc;
          color: #64748b;
          border: 2px solid #e2e8f0;
          
          &:hover {
            background: #f1f5f9;
            border-color: #cbd5e1;
            transform: translateY(-1px);
          }
        `;
      default:
        return `
          background: linear-gradient(135deg, #2d1155 0%, #4b2067 100%);
          color: white;
          box-shadow: 0 4px 12px rgba(45, 17, 85, 0.3);
          
          &:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 16px rgba(45, 17, 85, 0.4);
            background: linear-gradient(135deg, #4b2067 0%, #6b2d7c 100%);
          }
        `;
    }
  }}
`;

interface AnalysisRequestedPopupProps {
  onClose: () => void;
  onLater?: () => void;
  onRegister?: () => void;
  onNotRegister?: () => void;
}

const AnalysisRequestedPopup: React.FC<AnalysisRequestedPopupProps> = ({
  onClose,
  onLater,
  onRegister,
  // onNotRegister
}) => {
  return (
    <Modal>
      <ModalContent>
        <ModalHeader>
          <HeaderContent>
            <IconWrapper>
              <FiCheckCircle />
            </IconWrapper>
            <Title>회의 분석 완료</Title>
          </HeaderContent>
          <CloseButton onClick={onClose}>
            <FiX />
          </CloseButton>
        </ModalHeader>

        <ModalBody>
          <Description>
            회의 분석이 완료되었습니다.
            <br />
            <Highlight>[회의 관리]</Highlight>에서 결과를 확인하실 수 있습니다.
          </Description>

          <ButtonContainer>
            <Button variant="secondary" onClick={onLater || onClose}>
              나중에
            </Button>
            <Button onClick={onRegister || onClose}>확인</Button>
          </ButtonContainer>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default AnalysisRequestedPopup;
