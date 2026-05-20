import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { FiX, FiEdit3, FiSettings } from 'react-icons/fi';
import ManagePositionsModal from './ManagePositionsModal';

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

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const PositionButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: scale(1.05);
  }
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

  &:disabled {
    background: #f9fafb;
    color: #6b7280;
    cursor: not-allowed;
  }

  /* Date input 스타일 */
  &[type="date"] {
    font-family: 'Rethink Sans', sans-serif;
    
    &::-webkit-calendar-picker-indicator {
      color: #6b7280;
      font-size: 16px;
      cursor: pointer;
    }
    
    &::-webkit-datetime-edit {
      font-family: 'Rethink Sans', sans-serif;
    }
    
    &::-webkit-datetime-edit-fields-wrapper {
      font-family: 'Rethink Sans', sans-serif;
    }
    
    &::-webkit-datetime-edit-year-field {
      font-family: 'Rethink Sans', sans-serif;
    }
    
    &::-webkit-datetime-edit-month-field {
      font-family: 'Rethink Sans', sans-serif;
    }
    
    &::-webkit-datetime-edit-day-field {
      font-family: 'Rethink Sans', sans-serif;
    }
  }
`;

const CheckboxContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  background: #f9fafb;
  transition: all 0.2s ease;

  &:hover {
    border-color: #2d1155;
  }
`;

const Checkbox = styled.input`
  width: 20px;
  height: 20px;
  accent-color: #2d1155;
  cursor: pointer;
`;

const CheckboxLabel = styled.label`
  font-size: 16px;
  font-weight: 500;
  color: #374151;
  cursor: pointer;
  user-select: none;
`;

const AdminSection = styled.div`
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const AdminHeader = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: #2d1155;
  margin-bottom: 8px;
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
  
  ${props => {
    switch (props.variant) {
      case 'danger':
        return `
          background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
          color: white;
          box-shadow: 0 4px 12px rgba(220, 53, 69, 0.3);
          
          &:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 16px rgba(220, 53, 69, 0.4);
            background: linear-gradient(135deg, #c82333 0%, #a91e2c 100%);
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

interface EditCompanyProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  onDelete?: () => void;
  formData: {
    company_name: string;
    company_scale: string;
    service_startdate: string;
    service_enddate: string;
    service_status: boolean;
    admin_account?: string;
  };
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  adminUser?: { user_name: string; user_email: string } | null;
  companyId: string;
}

// 날짜를 yyyy-MM-dd로 변환하는 함수 (개선된 버전)
const toDateInputValue = (dateString: string) => {
  if (!dateString) return '';
  
  // 이미 yyyy-MM-dd 형식인지 확인
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
    return dateString;
  }
  
  // 다양한 날짜 형식 처리
  let date: Date;
  
  if (dateString.includes('T')) {
    // ISO 8601 형식 (예: 2024-01-01T00:00:00.000Z)
    date = new Date(dateString);
  } else if (dateString.includes('/')) {
    // MM/DD/YYYY 또는 DD/MM/YYYY 형식
    date = new Date(dateString);
  } else if (dateString.includes('.')) {
    // YYYY.MM.DD 형식
    date = new Date(dateString.replace(/\./g, '-'));
  } else {
    // 기타 형식
    date = new Date(dateString);
  }
  
  // 유효한 날짜인지 확인
  if (isNaN(date.getTime())) {
    return '';
  }
  
  // yyyy-MM-dd 형식으로 변환
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}`;
};

const EditCompany: React.FC<EditCompanyProps> = ({ 
  visible, 
  onClose, 
  onSubmit, 
  onDelete, 
  formData, 
  onChange, 
  adminUser, 
  companyId 
}) => {
  const [isPositionModalOpen, setIsPositionModalOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(e);
    onClose();
  };

  return (
    <Modal $isOpen={visible}>
      <ModalContent>
        <ModalHeader>
          <HeaderContent>
            <IconWrapper>
              <FiEdit3 />
            </IconWrapper>
            <Title>회사 정보 수정</Title>
          </HeaderContent>
          <HeaderActions>
            <PositionButton onClick={() => setIsPositionModalOpen(true)}>
              <FiSettings />
              직급 관리
            </PositionButton>
            <CloseButton onClick={onClose}>
              <FiX />
            </CloseButton>
          </HeaderActions>
        </ModalHeader>
        
        <ModalBody>
          <Form onSubmit={handleSubmit}>
            <FormGroup>
              <Label htmlFor="company_name">회사명</Label>
              <InputContainer>
                <Input 
                  type="text" 
                  id="company_name" 
                  name="company_name" 
                  value={formData.company_name} 
                  onChange={onChange} 
                  placeholder="회사명을 입력하세요"
                  required 
                />
              </InputContainer>
            </FormGroup>

            <FormGroup>
              <Label htmlFor="company_scale">기업 규모</Label>
              <InputContainer>
                <Input 
                  type="text" 
                  id="company_scale" 
                  name="company_scale" 
                  value={formData.company_scale} 
                  onChange={onChange} 
                  placeholder="예: 중소기업, 대기업 등"
                  required 
                />
              </InputContainer>
            </FormGroup>

            <FormGroup>
              <Label htmlFor="service_startdate">서비스 시작일</Label>
              <InputContainer>
                <Input 
                  type="date" 
                  id="service_startdate" 
                  name="service_startdate" 
                  value={toDateInputValue(formData.service_startdate)} 
                  onChange={onChange} 
                  required 
                />
              </InputContainer>
            </FormGroup>

            <FormGroup>
              <Label htmlFor="service_enddate">서비스 종료일</Label>
              <InputContainer>
                <Input 
                  type="date" 
                  id="service_enddate" 
                  name="service_enddate" 
                  value={toDateInputValue(formData.service_enddate)} 
                  onChange={onChange} 
                />
              </InputContainer>
            </FormGroup>

            <FormGroup>
              <CheckboxContainer>
                <Checkbox 
                  type="checkbox" 
                  id="service_status" 
                  name="service_status" 
                  checked={formData.service_status} 
                  onChange={onChange} 
                />
                <CheckboxLabel htmlFor="service_status">
                  서비스 활성화
                </CheckboxLabel>
              </CheckboxContainer>
            </FormGroup>

            {adminUser && (
              <AdminSection>
                <AdminHeader>관리자 정보</AdminHeader>
                <FormGroup>
                  <Label>관리자 이름</Label>
                  <InputContainer>
                    <Input 
                      type="text" 
                      value={adminUser.user_name} 
                      disabled 
                    />
                  </InputContainer>
                </FormGroup>
                <FormGroup>
                  <Label>관리자 이메일</Label>
                  <InputContainer>
                    <Input 
                      type="email" 
                      value={adminUser.user_email} 
                      disabled 
                    />
                  </InputContainer>
                </FormGroup>
              </AdminSection>
            )}

            <ButtonContainer>
              <Button type="button" variant="secondary" onClick={onClose}>
                취소
              </Button>
              <Button type="submit">
                수정 완료
              </Button>
              {onDelete && (
                <Button type="button" variant="danger" onClick={onDelete}>
                  삭제
                </Button>
              )}
            </ButtonContainer>
          </Form>
        </ModalBody>

        {/* 직급 관리 모달 */}
        {isPositionModalOpen && (
          <ManagePositionsModal
            companyId={companyId}
            onClose={() => setIsPositionModalOpen(false)}
          />
        )}
      </ModalContent>
    </Modal>
  );
};

export default EditCompany; 