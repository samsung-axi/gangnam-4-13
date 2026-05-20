import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { FiDownload, FiX, FiFileText, FiCheck } from 'react-icons/fi';
import { generateMeetingPDF } from '../../../utils/pdfGenerator';

// 애니메이션
const slideIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const pulse = keyframes`
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
`;

// 메인 모달
const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  animation: ${slideIn} 0.3s ease-out;
`;

const ModalContent = styled.div`
  background: #ffffff;
  border-radius: 24px;
  box-shadow: 0 25px 50px rgba(45, 17, 85, 0.15);
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow: hidden;
  position: relative;
  animation: ${slideIn} 0.4s ease-out;
`;

const ModalHeader = styled.div`
  background: linear-gradient(135deg, #2d1155 0%, #4b2067 100%);
  padding: 24px 32px;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(45deg, rgba(255,255,255,0.1) 0%, transparent 100%);
    pointer-events: none;
  }
`;

const HeaderContent = styled.div`
  display: flex;
  align-items: center;
  position: relative;
  z-index: 1;
`;

const IconWrapper = styled.div`
  width: 48px;
  height: 48px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16px;
  
  svg {
    color: white;
    font-size: 24px;
  }
`;

const Title = styled.h2`
  color: white;
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const CloseButton = styled.button`
  position: absolute;
  top: 24px;
  right: 32px;
  background: rgba(255, 255, 255, 0.2);
  border: none;
  border-radius: 8px;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  z-index: 2;
  
  svg {
    color: white;
    font-size: 20px;
  }
  
  &:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: scale(1.05);
  }
`;

const ModalBody = styled.div`
  padding: 32px;
  max-height: calc(90vh - 120px);
  overflow-y: auto;
`;

const Section = styled.div`
  margin-bottom: 32px;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const SectionTitle = styled.h3`
  color: #2d1155;
  font-size: 1.2rem;
  font-weight: 600;
  margin: 0 0 16px 0;
  display: flex;
  align-items: center;
  gap: 8px;
  
  svg {
    color: #4b2067;
    font-size: 20px;
  }
`;

const ContentBox = styled.div`
  background: #f8f7fb;
  border: 2px solid #e8e0ee;
  border-radius: 16px;
  padding: 24px;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: #d4c4e0;
    box-shadow: 0 4px 12px rgba(45, 17, 85, 0.08);
  }
`;

const CheckboxGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const CheckboxLabel = styled.label<{ $disabled?: boolean }>`
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: ${props => props.$disabled ? 'not-allowed' : 'pointer'};
  padding: 12px;
  border-radius: 12px;
  transition: all 0.2s ease;
  opacity: ${props => props.$disabled ? 0.7 : 1};
  background: ${props => props.$disabled ? 'rgba(45, 17, 85, 0.02)' : 'transparent'};
  
  &:hover {
    background: ${props => props.$disabled ? 'rgba(45, 17, 85, 0.02)' : 'rgba(45, 17, 85, 0.05)'};
  }
`;

const Checkbox = styled.input.attrs({ type: 'checkbox' })`
  width: 20px;
  height: 20px;
  accent-color: #4b2067;
  cursor: pointer;
  
  &[readonly] {
    pointer-events: none;
  }
`;

const CheckboxText = styled.span`
  color: #2d1155;
  font-size: 1rem;
  font-weight: 500;
  flex: 1;
`;

const ActionButton = styled.button<{ variant?: 'primary' | 'secondary' }>`
  width: 100%;
  padding: 16px 24px;
  border: none;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 24px;
  
  ${props => props.variant === 'secondary' ? `
    background: #f8f7fb;
    color: #2d1155;
    border: 2px solid #e8e0ee;
    
    &:hover {
      background: #f0eaf4;
      border-color: #d4c4e0;
      transform: translateY(-1px);
    }
  ` : `
    background: linear-gradient(135deg, #2d1155 0%, #4b2067 100%);
    color: white;
    box-shadow: 0 4px 12px rgba(45, 17, 85, 0.3);
    
    &:hover {
      background: linear-gradient(135deg, #4b2067 0%, #6b2d7c 100%);
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(45, 17, 85, 0.4);
    }
  `}
  
  &:active {
    transform: translateY(0);
  }
  
  &:disabled {
    background: #e0e0e0;
    color: #999;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
    
    &:hover {
      transform: none;
      box-shadow: none;
    }
  }
  
  svg {
    font-size: 20px;
  }
`;

const LoadingSpinner = styled.div`
  animation: ${pulse} 1.5s ease-in-out infinite;
`;

const NoticeText = styled.div`
  background: linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%);
  border: 1px solid #bbdefb;
  border-radius: 12px;
  padding: 12px 16px;
  color: #1976d2;
  font-size: 0.9rem;
  margin-top: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
  
  svg {
    color: #1976d2;
    font-size: 16px;
  }
`;

interface PDFPopupProps {
  onClose: () => void;
  checkedData?: any;
  meetingInfo?: any;
  summary?: any;
  tasks?: any;
  feedback?: any;
}

const PDF_ITEMS = [
  { key: 'all', label: '전체' },
  { key: 'info', label: '회의 기본 정보' },
  { key: 'summary', label: '회의 요약' },
  { key: 'tasks', label: '작업 목록' },
  { key: 'feedback', label: '회의 피드백' },
];

// pdfMake 동적 로드 훅
function usePdfMakeScript() {
  useEffect(() => {
    if (typeof window !== 'undefined' && !window.pdfMake) {
      const script1 = document.createElement('script');
      script1.src = '/libs/pdfmake.min.js';
      script1.type = 'text/javascript';
      script1.onload = () => {
        const script2 = document.createElement('script');
        script2.src = '/libs/vfs_fonts.js';
        script2.type = 'text/javascript';
        document.body.appendChild(script2);
      };
      document.body.appendChild(script1);
    }
  }, []);
}

const PDFPopup: React.FC<PDFPopupProps> = ({ 
  onClose, 
  meetingInfo, 
  summary, 
  tasks, 
  feedback 
}) => {
  usePdfMakeScript();
  const [checked, setChecked] = useState({
    all: false,
    info: true, // 회의 기본 정보는 항상 체크됨
    summary: false,
    tasks: false,
    feedback: false,
  });
  const [isLoading, setIsLoading] = useState(false);

  // pdfMake 상태 확인
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (window.pdfMake) {
        console.log('✅ pdfMake 로드 완료');
        if (window.pdfMake.vfs) {
          console.log('✅ vfs 로드 완료');
        } else {
          console.warn('⚠️ vfs 로드 실패');
        }
      } else {
        console.error('❌ pdfMake 로드 실패');
      }
    }
  }, []);

  const handleCheck = (key: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.checked;
    
    // 회의 기본 정보(info)는 변경할 수 없음
    if (key === 'info') {
      return;
    }
    
    if (key === 'all') {
      setChecked({
        all: value,
        info: true, // 회의 기본 정보는 항상 true
        summary: value,
        tasks: value,
        feedback: value,
      });
      
    } else {
      setChecked(prev => {
        const newChecked = { ...prev, [key]: value };
        const allItemsChecked = ['info', 'summary', 'tasks', 'feedback']
          .every(k => newChecked[k as keyof typeof newChecked]);
        return { ...newChecked, all: allItemsChecked };
      });
    }
  };

  const handleDownload = async () => {
    if (!Object.values(checked).some(Boolean)) {
      alert('다운로드할 항목을 선택해주세요.');
      return;
    }

    setIsLoading(true);
    try {
             await generateMeetingPDF({
         checked,
         meetingInfo,
         summary,
         tasks,
         feedback,
       });
    } catch (error) {
      console.error('PDF 생성 실패:', error);
      alert('PDF 생성에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <HeaderContent>
            <IconWrapper>
              <FiFileText />
            </IconWrapper>
            <Title>PDF 다운로드</Title>
          </HeaderContent>
          <CloseButton onClick={onClose}>
            <FiX />
          </CloseButton>
        </ModalHeader>
        
        <ModalBody>
          <Section>
            <SectionTitle>
              <FiCheck />
              포함할 내용 선택
            </SectionTitle>
            <ContentBox>
              <CheckboxGroup>
                {PDF_ITEMS.map((item) => (
                  <CheckboxLabel key={item.key} $disabled={item.key === 'info'}>
                    <Checkbox
                      checked={checked[item.key as keyof typeof checked]}
                      onChange={handleCheck(item.key)}
                      readOnly={item.key !== 'all' && checked.all}
                      disabled={item.key === 'info'}
                    />
                    <CheckboxText>{item.label}</CheckboxText>
                  </CheckboxLabel>
                ))}
              </CheckboxGroup>
              
              <NoticeText>
                <FiCheck />
                회의 기본 정보는 항상 포함되며, 추가로 선택한 내용이 PDF에 포함됩니다
              </NoticeText>
            </ContentBox>
          </Section>

          <ActionButton 
            onClick={handleDownload}
            disabled={isLoading || !Object.values(checked).some(Boolean)}
          >
            {isLoading ? (
              <LoadingSpinner>
                <FiDownload />
                생성 중...
              </LoadingSpinner>
            ) : (
              <>
                <FiDownload />
                PDF 다운로드
              </>
            )}
          </ActionButton>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default PDFPopup; 