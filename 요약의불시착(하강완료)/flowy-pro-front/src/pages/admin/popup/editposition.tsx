import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { FiX, FiEdit3, FiTrash2, FiAlertTriangle, FiUser } from 'react-icons/fi';

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

const Modal = styled.div<{ $visible: boolean }>`
  display: ${(props) => (props.$visible ? 'flex' : 'none')};
  position: fixed;
  top: 0;
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
  overflow-y: auto;
  max-height: 60vh;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-size: 14px;
  font-weight: 600;
  color: #374151;
`;

const InputContainer = styled.div`
  position: relative;
  width: 100%;
`;

const Input = styled.input`
  width: 100%;
  height: 48px;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  padding: 0 16px;
  font-size: 16px;
  color: #374151;
  background: white;
  transition: all 0.2s ease;
  box-sizing: border-box;
  font-family: 'Rethink Sans', sans-serif;

  &:hover {
    border-color: #2d1155;
  }

  &:focus {
    outline: none;
    border-color: #2d1155;
    box-shadow: 0 0 0 3px rgba(45, 17, 85, 0.1);
  }

  &::placeholder {
    color: #9ca3af;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 8px;
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' | 'danger' }>`
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
  
  ${props => {
    switch (props.variant) {
      case 'danger':
        return `
          background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
          color: white;
          box-shadow: 0 4px 12px rgba(220, 38, 38, 0.3);
          
          &:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 16px rgba(220, 38, 38, 0.4);
            background: linear-gradient(135deg, #b91c1c 0%, #991b1b 100%);
          }
        `;
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
            background: linear-gradient(135deg, #351745 0%, #5d2b7a 100%);
          }
        `;
    }
  }}

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none !important;
  }
`;

// 확인 모달 스타일
const ConfirmModalBg = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 3000;
  animation: ${fadeIn} 0.3s ease-out;
`;

const ConfirmModalBox = styled.div`
  background: white;
  border-radius: 20px;
  width: 100%;
  max-width: 480px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(45, 17, 85, 0.2);
  border: 1px solid rgba(45, 17, 85, 0.1);
  animation: ${slideUp} 0.3s ease-out;
`;

const ConfirmHeader = styled.div<{ variant?: 'update' | 'delete' }>`
  color: white;
  padding: 24px 32px;
  display: flex;
  align-items: center;
  gap: 16px;
  
  ${props => props.variant === 'delete' ? `
    background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
  ` : `
    background: linear-gradient(135deg, #2d1155 0%, #4b2067 100%);
  `}
`;

const ConfirmIconWrapper = styled.div`
  font-size: 24px;
  color: white;
`;

const ConfirmTitle = styled.h3`
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: white;
`;

const ConfirmBody = styled.div`
  padding: 32px;
  text-align: center;
`;

const ConfirmMessage = styled.p`
  margin: 0 0 24px 0;
  font-size: 16px;
  color: #374151;
  line-height: 1.5;
`;

const ConfirmButtons = styled.div`
  display: flex;
  gap: 12px;
  justify-content: center;
`;

const ConfirmButton = styled.button<{ variant?: 'cancel' | 'update' | 'delete' }>`
  padding: 12px 24px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  border: none;
  transition: all 0.3s ease;
  min-width: 100px;

  ${props => {
    switch (props.variant) {
      case 'update':
        return `
          background: linear-gradient(135deg, #2d1155 0%, #4b2067 100%);
          color: white;
          box-shadow: 0 4px 12px rgba(45, 17, 85, 0.3);
          
          &:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 16px rgba(45, 17, 85, 0.4);
            background: linear-gradient(135deg, #351745 0%, #5d2b7a 100%);
          }
        `;
      case 'delete':
        return `
          background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
          color: white;
          box-shadow: 0 4px 12px rgba(220, 38, 38, 0.3);
          
          &:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 16px rgba(220, 38, 38, 0.4);
            background: linear-gradient(135deg, #b91c1c 0%, #991b1b 100%);
          }
        `;
      default:
        return `
          background: #f3f4f6;
          color: #374151;
          border: 1px solid #d1d5db;
          
          &:hover {
            background: #e5e7eb;
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          }
        `;
    }
  }}
  
  &:active {
    transform: translateY(0);
  }
`;

interface EditPositionProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  onDelete?: () => void;
  formData: { 
    position_code: string; 
    position_name: string; 
    position_detail: string; 
  };
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const EditPosition: React.FC<EditPositionProps> = ({ 
  visible, 
  onClose, 
  onSubmit, 
  onDelete, 
  formData, 
  onChange 
}) => {
  const [confirmType, setConfirmType] = useState<'update' | 'delete' | null>(null);

  const handleUpdateClick = (e: React.FormEvent) => {
    e.preventDefault();
    setConfirmType('update');
  };

  const handleDeleteClick = () => {
    setConfirmType('delete');
  };

  const handleConfirmUpdate = () => {
    const fakeEvent = { preventDefault: () => {} } as React.FormEvent;
    onSubmit(fakeEvent);
    setConfirmType(null);
  };

  const handleConfirmDelete = () => {
    if (onDelete) {
      onDelete();
    }
    setConfirmType(null);
  };

  const handleConfirmCancel = () => {
    setConfirmType(null);
  };

  return (
    <>
      <Modal $visible={visible}>
        <ModalContent>
          <ModalHeader>
            <HeaderContent>
              <IconWrapper>
                <FiUser />
              </IconWrapper>
              <Title>직급 정보 수정</Title>
            </HeaderContent>
            <CloseButton onClick={onClose}>
              <FiX />
            </CloseButton>
          </ModalHeader>
          
          <ModalBody>
            <Form onSubmit={handleUpdateClick}>
              <FormGroup>
                <Label htmlFor="position_code">직급 코드</Label>
                <InputContainer>
                  <Input
                    type="text"
                    id="position_code"
                    name="position_code"
                    value={formData.position_code}
                    onChange={onChange}
                    placeholder="직급 코드를 입력하세요"
                    required
                  />
                </InputContainer>
              </FormGroup>

              <FormGroup>
                <Label htmlFor="position_name">직급명</Label>
                <InputContainer>
                  <Input
                    type="text"
                    id="position_name"
                    name="position_name"
                    value={formData.position_name}
                    onChange={onChange}
                    placeholder="직급명을 입력하세요"
                    required
                  />
                </InputContainer>
              </FormGroup>

              <FormGroup>
                <Label htmlFor="position_detail">직급 설명</Label>
                <InputContainer>
                  <Input
                    type="text"
                    id="position_detail"
                    name="position_detail"
                    value={formData.position_detail}
                    onChange={onChange}
                    placeholder="직급 설명을 입력하세요"
                    required
                  />
                </InputContainer>
              </FormGroup>

              <ButtonContainer>
                <Button type="button" variant="secondary" onClick={onClose}>
                  취소
                </Button>
                <Button type="submit">
                  <FiEdit3 />
                  수정
                </Button>
                {onDelete && (
                  <Button type="button" variant="danger" onClick={handleDeleteClick}>
                    <FiTrash2 />
                    삭제
                  </Button>
                )}
              </ButtonContainer>
            </Form>
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* 수정 확인 모달 */}
      {confirmType === 'update' && (
        <ConfirmModalBg>
          <ConfirmModalBox>
            <ConfirmHeader variant="update">
              <ConfirmIconWrapper>
                <FiEdit3 />
              </ConfirmIconWrapper>
              <ConfirmTitle>직급 수정</ConfirmTitle>
            </ConfirmHeader>
            <ConfirmBody>
              <ConfirmMessage>
                <strong>{formData.position_name}</strong> 직급 정보를 수정하시겠습니까?
                <br />
                직급 코드: <strong>{formData.position_code}</strong>
              </ConfirmMessage>
              <ConfirmButtons>
                <ConfirmButton variant="cancel" onClick={handleConfirmCancel}>
                  취소
                </ConfirmButton>
                <ConfirmButton variant="update" onClick={handleConfirmUpdate}>
                  수정
                </ConfirmButton>
              </ConfirmButtons>
            </ConfirmBody>
          </ConfirmModalBox>
        </ConfirmModalBg>
      )}

      {/* 삭제 확인 모달 */}
      {confirmType === 'delete' && (
        <ConfirmModalBg>
          <ConfirmModalBox>
            <ConfirmHeader variant="delete">
              <ConfirmIconWrapper>
                <FiAlertTriangle />
              </ConfirmIconWrapper>
              <ConfirmTitle>직급 삭제</ConfirmTitle>
            </ConfirmHeader>
            <ConfirmBody>
              <ConfirmMessage>
                <strong>{formData.position_name}</strong> 직급을 정말 삭제하시겠습니까?
                <br />
                삭제된 직급은 복구할 수 없습니다.
              </ConfirmMessage>
              <ConfirmButtons>
                <ConfirmButton variant="cancel" onClick={handleConfirmCancel}>
                  취소
                </ConfirmButton>
                <ConfirmButton variant="delete" onClick={handleConfirmDelete}>
                  삭제
                </ConfirmButton>
              </ConfirmButtons>
            </ConfirmBody>
          </ConfirmModalBox>
        </ConfirmModalBg>
      )}
    </>
  );
};

export default EditPosition; 