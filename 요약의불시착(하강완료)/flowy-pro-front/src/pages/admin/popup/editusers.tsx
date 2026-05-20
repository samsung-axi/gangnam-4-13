import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { FiX, FiEdit3, FiUser } from 'react-icons/fi';

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

const Modal = styled.div<{ $isOpen: boolean }>`
  display: ${(props) => (props.$isOpen ? 'flex' : 'none')};
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

const FormSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const SectionTitle = styled.h3`
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #2d1155;
  padding-bottom: 8px;
  border-bottom: 2px solid #f1f5f9;
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

  &:hover:not(:disabled) {
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

  &:disabled {
    background: #f9fafb;
    color: #6b7280;
    cursor: not-allowed;
    border-color: #e5e7eb;
  }
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

  ${(props) =>
    props.variant === 'secondary'
      ? `
    background: #f8fafc;
    color: #64748b;
    border: 2px solid #e2e8f0;
    
    &:hover {
      background: #f1f5f9;
      border-color: #cbd5e1;
      transform: translateY(-1px);
    }
  `
      : `
    background: linear-gradient(135deg, #2d1155 0%, #4b2067 100%);
    color: white;
    box-shadow: 0 4px 12px rgba(45, 17, 85, 0.3);
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(45, 17, 85, 0.4);
      background: linear-gradient(135deg, #351745 0%, #5d2b7a 100%);
    }
  `}

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

const ConfirmHeader = styled.div`
  background: linear-gradient(135deg, #2d1155 0%, #4b2067 100%);
  color: white;
  padding: 24px 32px;
  display: flex;
  align-items: center;
  gap: 16px;
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

const ConfirmButton = styled.button<{ variant?: 'cancel' | 'confirm' }>`
  padding: 12px 24px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  border: none;
  transition: all 0.3s ease;
  min-width: 100px;

  ${(props) =>
    props.variant === 'confirm'
      ? `
    background: linear-gradient(135deg, #2d1155 0%, #4b2067 100%);
    color: white;
    box-shadow: 0 4px 12px rgba(45, 17, 85, 0.3);
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(45, 17, 85, 0.4);
      background: linear-gradient(135deg, #351745 0%, #5d2b7a 100%);
    }
  `
      : `
    background: #f3f4f6;
    color: #374151;
    border: 1px solid #d1d5db;
    
    &:hover {
      background: #e5e7eb;
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }
  `}

  &:active {
    transform: translateY(0);
  }
`;

interface EditUsersProps {
  isOpen: boolean;
  user: {
    user_id?: string;
    user_name?: string;
    user_login_id?: string;
    user_email?: string;
    user_phonenum?: string;
    user_dept_name?: string;
    user_team_name?: string;
    user_jobname?: string;
  };
  onApprove: () => void;
  onReject: () => void;
  onClose: () => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const EditUsers: React.FC<EditUsersProps> = ({
  isOpen,
  user,
  onApprove,
  onClose,
  onChange,
}) => {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  if (!isOpen) return null;

  // 유효성 검사
  const validateForm = (): string[] => {
    const errors: string[] = [];

    if (!user.user_dept_name || user.user_dept_name.trim() === '') {
      errors.push('부서명을 입력하세요.');
    }
    if (!user.user_team_name || user.user_team_name.trim() === '') {
      errors.push('팀명을 입력하세요.');
    }
    if (!user.user_jobname || user.user_jobname.trim() === '') {
      errors.push('직무를 입력하세요.');
    }

    return errors;
  };

  // 수정 버튼 클릭 핸들러
  const handleEditClick = () => {
    const errors = validateForm();

    if (errors.length > 0) {
      setValidationErrors(errors);
      return;
    }

    setValidationErrors([]);
    setIsConfirmOpen(true);
  };

  // 수정 확인
  const handleConfirmEdit = () => {
    onApprove();
    setIsConfirmOpen(false);
  };

  // 수정 취소
  const handleCancelEdit = () => {
    setIsConfirmOpen(false);
  };

  return (
    <>
      <Modal $isOpen={isOpen}>
        <ModalContent>
          <ModalHeader>
            <HeaderContent>
              <IconWrapper>
                <FiEdit3 />
              </IconWrapper>
              <Title>사용자 정보 수정</Title>
            </HeaderContent>
            <CloseButton onClick={onClose}>
              <FiX />
            </CloseButton>
          </ModalHeader>

          <ModalBody>
            <Form onSubmit={(e) => e.preventDefault()}>
              {/* 기본 정보 섹션 */}
              <FormSection>
                <SectionTitle>기본 정보</SectionTitle>

                <FormGroup>
                  <Label htmlFor="user_name">이름</Label>
                  <InputContainer>
                    <Input
                      type="text"
                      id="user_name"
                      value={user.user_name || ''}
                      disabled
                    />
                  </InputContainer>
                </FormGroup>

                <FormGroup>
                  <Label htmlFor="user_email">이메일</Label>
                  <InputContainer>
                    <Input
                      type="email"
                      id="user_email"
                      value={user.user_email || ''}
                      disabled
                    />
                  </InputContainer>
                </FormGroup>

                <FormGroup>
                  <Label htmlFor="user_login_id">로그인 ID</Label>
                  <InputContainer>
                    <Input
                      type="text"
                      id="user_login_id"
                      value={user.user_login_id || ''}
                      disabled
                    />
                  </InputContainer>
                </FormGroup>

                <FormGroup>
                  <Label htmlFor="user_phonenum">전화번호</Label>
                  <InputContainer>
                    <Input
                      type="tel"
                      id="user_phonenum"
                      value={user.user_phonenum || ''}
                      disabled
                    />
                  </InputContainer>
                </FormGroup>
              </FormSection>

              {/* 조직 정보 섹션 */}
              <FormSection>
                <SectionTitle>조직 정보</SectionTitle>

                <FormGroup>
                  <Label htmlFor="user_dept_name">부서명 *</Label>
                  <InputContainer>
                    <Input
                      type="text"
                      id="user_dept_name"
                      name="user_dept_name"
                      value={user.user_dept_name || ''}
                      onChange={onChange}
                      placeholder="부서명을 입력하세요"
                      required
                    />
                  </InputContainer>
                </FormGroup>

                <FormGroup>
                  <Label htmlFor="user_team_name">팀명 *</Label>
                  <InputContainer>
                    <Input
                      type="text"
                      id="user_team_name"
                      name="user_team_name"
                      value={user.user_team_name || ''}
                      onChange={onChange}
                      placeholder="팀명을 입력하세요"
                      required
                    />
                  </InputContainer>
                </FormGroup>

                <FormGroup>
                  <Label htmlFor="user_jobname">직무 *</Label>
                  <InputContainer>
                    <Input
                      type="text"
                      id="user_jobname"
                      name="user_jobname"
                      value={user.user_jobname || ''}
                      onChange={onChange}
                      placeholder="직무를 입력하세요"
                      required
                    />
                  </InputContainer>
                </FormGroup>
              </FormSection>

              {/* 에러 메시지 표시 */}
              {validationErrors.length > 0 && (
                <div
                  style={{
                    color: '#dc2626',
                    fontSize: '14px',
                    background: '#fef2f2',
                    padding: '12px 16px',
                    borderRadius: '8px',
                    border: '1px solid #fecaca',
                  }}
                >
                  {validationErrors.map((error, index) => (
                    <div key={index}>• {error}</div>
                  ))}
                </div>
              )}

              <ButtonContainer>
                <Button type="button" variant="secondary" onClick={onClose}>
                  취소
                </Button>
                <Button type="button" onClick={handleEditClick}>
                  수정 완료
                </Button>
              </ButtonContainer>
            </Form>
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* 수정 확인 모달 */}
      {isConfirmOpen && (
        <ConfirmModalBg>
          <ConfirmModalBox>
            <ConfirmHeader>
              <ConfirmIconWrapper>
                <FiUser />
              </ConfirmIconWrapper>
              <ConfirmTitle>사용자 정보 수정</ConfirmTitle>
            </ConfirmHeader>
            <ConfirmBody>
              <ConfirmMessage>
                <strong>{user.user_name}</strong>님의 정보를 수정하시겠습니까?
                <br />
                변경된 정보는 즉시 적용됩니다.
              </ConfirmMessage>
              <ConfirmButtons>
                <ConfirmButton variant="cancel" onClick={handleCancelEdit}>
                  취소
                </ConfirmButton>
                <ConfirmButton variant="confirm" onClick={handleConfirmEdit}>
                  수정
                </ConfirmButton>
              </ConfirmButtons>
            </ConfirmBody>
          </ConfirmModalBox>
        </ConfirmModalBg>
      )}
    </>
  );
};

export default EditUsers;
