import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { FiX, FiUsers, FiCheckCircle, FiXCircle } from 'react-icons/fi';

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

const Button = styled.button<{ variant?: 'approve' | 'reject' | 'secondary' }>`
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
      case 'approve':
        return `
          background: linear-gradient(135deg, #059669 0%, #047857 100%);
          color: white;
          box-shadow: 0 4px 12px rgba(5, 150, 105, 0.3);
          
          &:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 16px rgba(5, 150, 105, 0.4);
            background: linear-gradient(135deg, #047857 0%, #065f46 100%);
          }
        `;
      case 'reject':
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
          background: #f8fafc;
          color: #64748b;
          border: 2px solid #e2e8f0;
          
          &:hover {
            background: #f1f5f9;
            border-color: #cbd5e1;
            transform: translateY(-1px);
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

const ConfirmHeader = styled.div<{ variant?: 'approve' | 'reject' }>`
  color: white;
  padding: 24px 32px;
  display: flex;
  align-items: center;
  gap: 16px;

  ${(props) =>
    props.variant === 'approve'
      ? `
    background: linear-gradient(135deg, #059669 0%, #047857 100%);
  `
      : `
    background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
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

const ConfirmButton = styled.button<{
  variant?: 'cancel' | 'approve' | 'reject';
}>`
  padding: 12px 24px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  border: none;
  transition: all 0.3s ease;
  min-width: 100px;

  ${(props) => {
    switch (props.variant) {
      case 'approve':
        return `
          background: linear-gradient(135deg, #059669 0%, #047857 100%);
          color: white;
          box-shadow: 0 4px 12px rgba(5, 150, 105, 0.3);
          
          &:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 16px rgba(5, 150, 105, 0.4);
            background: linear-gradient(135deg, #047857 0%, #065f46 100%);
          }
        `;
      case 'reject':
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

interface ManageUsersProps {
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

const ManageUsers: React.FC<ManageUsersProps> = ({
  isOpen,
  user,
  onApprove,
  onReject,
  onClose,
  onChange,
}) => {
  const [confirmType, setConfirmType] = useState<'approve' | 'reject' | null>(
    null
  );
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

  // 승인 버튼 클릭
  const handleApproveClick = () => {
    const errors = validateForm();

    if (errors.length > 0) {
      setValidationErrors(errors);
      return;
    }

    setValidationErrors([]);
    setConfirmType('approve');
  };

  // 반려 버튼 클릭
  const handleRejectClick = () => {
    setValidationErrors([]);
    setConfirmType('reject');
  };

  // 승인 확인
  const handleConfirmApprove = () => {
    onApprove();
    setConfirmType(null);
  };

  // 반려 확인
  const handleConfirmReject = () => {
    onReject();
    setConfirmType(null);
  };

  // 확인 취소
  const handleConfirmCancel = () => {
    setConfirmType(null);
  };

  return (
    <>
      <Modal $isOpen={isOpen}>
        <ModalContent>
          <ModalHeader>
            <HeaderContent>
              <IconWrapper>
                <FiUsers />
              </IconWrapper>
              <Title>대기 사용자 관리</Title>
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
                <SectionTitle>조직 정보 설정</SectionTitle>

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
                <Button
                  type="button"
                  variant="approve"
                  onClick={handleApproveClick}
                >
                  <FiCheckCircle />
                  승인
                </Button>
                <Button
                  type="button"
                  variant="reject"
                  onClick={handleRejectClick}
                >
                  <FiXCircle />
                  반려
                </Button>
              </ButtonContainer>
            </Form>
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* 승인 확인 모달 */}
      {confirmType === 'approve' && (
        <ConfirmModalBg>
          <ConfirmModalBox>
            <ConfirmHeader variant="approve">
              <ConfirmIconWrapper>
                <FiCheckCircle />
              </ConfirmIconWrapper>
              <ConfirmTitle>사용자 승인</ConfirmTitle>
            </ConfirmHeader>
            <ConfirmBody>
              <ConfirmMessage>
                <strong>{user.user_name}</strong>님을 승인하시겠습니까?
                <br />
                승인 후 사용자는 시스템에 정식 등록됩니다.
              </ConfirmMessage>
              <ConfirmButtons>
                <ConfirmButton variant="cancel" onClick={handleConfirmCancel}>
                  취소
                </ConfirmButton>
                <ConfirmButton variant="approve" onClick={handleConfirmApprove}>
                  승인
                </ConfirmButton>
              </ConfirmButtons>
            </ConfirmBody>
          </ConfirmModalBox>
        </ConfirmModalBg>
      )}

      {/* 반려 확인 모달 */}
      {confirmType === 'reject' && (
        <ConfirmModalBg>
          <ConfirmModalBox>
            <ConfirmHeader variant="reject">
              <ConfirmIconWrapper>
                <FiXCircle />
              </ConfirmIconWrapper>
              <ConfirmTitle>사용자 반려</ConfirmTitle>
            </ConfirmHeader>
            <ConfirmBody>
              <ConfirmMessage>
                <strong>{user.user_name}</strong>님의 가입을 반려하시겠습니까?
                <br />
                반려된 사용자는 다시 가입 신청을 해야 합니다.
              </ConfirmMessage>
              <ConfirmButtons>
                <ConfirmButton variant="cancel" onClick={handleConfirmCancel}>
                  취소
                </ConfirmButton>
                <ConfirmButton variant="reject" onClick={handleConfirmReject}>
                  반려
                </ConfirmButton>
              </ConfirmButtons>
            </ConfirmBody>
          </ConfirmModalBox>
        </ConfirmModalBg>
      )}
    </>
  );
};

export default ManageUsers;
