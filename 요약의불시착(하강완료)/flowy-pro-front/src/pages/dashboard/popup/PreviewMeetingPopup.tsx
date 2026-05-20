import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { FiX, FiCalendar, FiCheckCircle, FiTrash2 } from 'react-icons/fi';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

interface PreviewMeetingPopupProps {
  meeting: {
    meeting_id: string;
    meeting_title: string;
    meeting_date: string;
    meeting_agenda?: string;
  };
  onConfirm: (data: any) => void;
  onReject: () => void;
  onClose: () => void;
  onLater?: () => void;
}

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

const DatePickerWrapper = styled.div`
  position: relative;
  width: 100%;
  z-index: 1000;

  /* 입력 컨테이너 스타일 */
  .react-datepicker-wrapper {
    width: 100%;
  }
  .react-datepicker__input-container {
    width: 100%;
  }

  /* 입력 필드 스타일 */
  .custom-datepicker {
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
    cursor: pointer;

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
  }

  /* 달력 포털 */
  .react-datepicker__portal {
    position: fixed !important;
    top: 0 !important;
    left: 0 !important;
    right: 0 !important;
    bottom: 0 !important;
    z-index: 2147483647 !important;
    background: rgba(0, 0, 0, 0.6) !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    backdrop-filter: blur(3px) !important;
  }

  .react-datepicker__portal .react-datepicker {
    position: relative !important;
    margin: auto !important;
    transform: none !important;
    z-index: 2147483647 !important;
    box-shadow: 0 25px 50px rgba(0, 0, 0, 0.3) !important;
  }

  /* 달력 팝업 컨테이너 */
  .react-datepicker-popper {
    z-index: 9999 !important;
    position: absolute !important;
  }

  .react-datepicker-popper[data-placement^='bottom'] {
    margin-top: 8px;
  }

  /* 메인 달력 컨테이너 */
  .react-datepicker {
    font-family: 'Rethink Sans', sans-serif !important;
    border: none !important;
    border-radius: 16px !important;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15), 0 10px 20px rgba(0, 0, 0, 0.1) !important;
    background: #fff !important;
    overflow: hidden !important;
    backdrop-filter: blur(10px) !important;
    display: flex !important;
    flex-direction: row !important;
    width: 520px !important;
    min-width: 520px !important;
    max-width: 520px !important;
  }

  /* 달력 헤더 */
  .react-datepicker__header {
    background: linear-gradient(135deg, #e8e0ee, #d4c7e8);
    border-bottom: none;
    border-radius: 16px 16px 0 0;
    padding: 24px 70px 20px 70px;
    color: #351745;
    position: relative;
    min-height: 90px;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  /* 현재 월/년 표시 */
  .react-datepicker__current-month {
    color: #351745 !important;
    font-weight: 700 !important;
    font-size: 1.3rem !important;
    margin-bottom: 12px !important;
    text-align: center !important;
    padding: 0 20px !important;
    line-height: 1 !important;
    position: relative !important;
    z-index: 1 !important;
    word-break: keep-all !important;
    white-space: nowrap !important;
  }

  /* 요일 헤더 */
  .react-datepicker__day-names {
    display: flex !important;
    justify-content: space-between !important;
    margin-bottom: 0px !important;
    padding: 0 !important;
    min-height: 30px !important;
    align-items: center !important;
    width: 110% !important;
  }

  .react-datepicker__day-name {
    color: #351745 !important;
    font-weight: 600 !important;
    font-size: 0.9rem !important;
    width: 2.5rem !important;
    height: 2.5rem !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    opacity: 0.8 !important;
    flex-shrink: 0 !important;
    flex-grow: 0 !important;
    flex-basis: 2.5rem !important;
    margin: 0 !important;
    box-sizing: border-box !important;
  }

  /* 월 컨테이너 */
  .react-datepicker__month-container {
    background: white !important;
    flex: 1 !important;
    display: flex !important;
    flex-direction: column !important;
    min-width: 280px !important;
    max-width: none !important;
  }

  .react-datepicker__month {
    padding: 20px !important;
    margin: 0 !important;
    display: flex !important;
    flex-direction: column !important;
    gap: 2px !important;
  }

  .react-datepicker__week {
    display: flex !important;
    justify-content: space-between !important;
    margin-bottom: 4px !important;
    min-height: 40px !important;
    align-items: center !important;
    width: 100% !important;
  }

  /* 날짜 셀 */
  .react-datepicker__day {
    width: 2.5rem !important;
    height: 2.5rem !important;
    min-width: 2.5rem !important;
    min-height: 2.5rem !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    border-radius: 50% !important;
    color: #333 !important;
    font-weight: 500 !important;
    font-size: 0.95rem !important;
    cursor: pointer !important;
    transition: all 0.2s ease !important;
    margin: 0 !important;
    border: none !important;
    outline: none !important;
    flex-shrink: 0 !important;
    flex-grow: 0 !important;
    flex-basis: 2.5rem !important;
    box-sizing: border-box !important;

    &:hover {
      background: linear-gradient(135deg, #e8e0ee, #d4c7e8) !important;
      color: #351745 !important;
      transform: scale(1.1) !important;
    }
  }

  /* 선택된 날짜 */
  .react-datepicker__day--selected {
    background: linear-gradient(135deg, #480b6a, #351745) !important;
    color: white !important;
    font-weight: 600;
    transform: scale(1.05);
    box-shadow: 0 4px 12px rgba(72, 11, 106, 0.3);

    &:hover {
      background: linear-gradient(135deg, #5c1f7a, #480b6a) !important;
      transform: scale(1.1);
    }
  }

  /* 오늘 날짜 */
  .react-datepicker__day--today {
    background: linear-gradient(135deg, #f8f5ff, #e8e0ee);
    color: #480b6a;
    font-weight: 600;
    border: 2px solid #480b6a;
  }

  /* 다른 달 날짜 */
  .react-datepicker__day--outside-month {
    color: #ccc;

    &:hover {
      background: #f0f0f0;
      color: #999;
    }
  }

  /* 비활성화된 날짜 */
  .react-datepicker__day--disabled {
    color: #ccc !important;
    cursor: not-allowed !important;

    &:hover {
      background: transparent !important;
      transform: none !important;
    }
  }

  /* 네비게이션 버튼 */
  .react-datepicker__navigation {
    top: 30px !important;
    width: 32px !important;
    height: 32px !important;
    border-radius: 0 !important;
    background: transparent !important;
    transition: all 0.2s ease !important;
    border: none !important;
    outline: none !important;
    position: absolute !important;
    z-index: 100 !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    cursor: pointer !important;
    box-shadow: none !important;
    text-indent: -9999px !important;
    overflow: hidden !important;
    font-size: 0 !important;
    color: transparent !important;

    &:hover {
      background: rgba(53, 23, 69, 0.1) !important;
      border-radius: 50% !important;
      transform: scale(1.1) !important;
    }
  }

  .react-datepicker__navigation--previous {
    left: 20px !important;
  }

  .react-datepicker__navigation--next {
    right: 20px !important;
  }

  .react-datepicker__navigation-icon,
  .react-datepicker__navigation-icon::before {
    border-color: #351745 !important;
    border-width: 3px 3px 0 0 !important;
    width: 10px !important;
    height: 10px !important;
    position: relative !important;
    top: 1px !important;
  }

  .react-datepicker__navigation:hover
    .react-datepicker__navigation-icon::before {
    border-color: #2a1238 !important;
  }

  /* 시간 선택 컨테이너 */
  .react-datepicker__time-container {
    border-left: 1px solid #e0e0e0 !important;
    background: #fafafa !important;
    border-radius: 0 16px 16px 0 !important;
    width: 135px !important;
    min-width: 135px !important;
    max-width: 135px !important;
    position: relative !important;
    flex-shrink: 0 !important;
  }

  .react-datepicker__header--time {
    background: linear-gradient(135deg, #e8e0ee, #d4c7e8) !important;
    color: transparent !important;
    font-weight: 700 !important;
    padding: 16px 12px !important;
    border-radius: 0 !important;
    height: 54px !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    box-sizing: border-box !important;
    font-size: 0 !important;
    text-indent: -9999px !important;
    overflow: hidden !important;
  }

  .react-datepicker__time {
    background: #fafafa !important;
    padding: 8px !important;
    height: auto !important;
    overflow-y: auto !important;
  }

  .react-datepicker__time-box {
    width: 100% !important;
    max-width: none !important;
  }

  /* 시간 리스트 */
  .react-datepicker__time-list {
    height: 300px !important;
    max-height: 300px !important;
    min-height: 300px !important;
    overflow-y: auto !important;
    padding: 4px 8px 4px 4px !important;
    margin: 0 !important;
    box-sizing: border-box !important;

    &::-webkit-scrollbar {
      width: 8px !important;
    }

    &::-webkit-scrollbar-track {
      background: #f1f1f1 !important;
      border-radius: 4px !important;
    }

    &::-webkit-scrollbar-thumb {
      background: linear-gradient(135deg, #480b6a, #351745) !important;
      border-radius: 4px !important;

      &:hover {
        background: linear-gradient(135deg, #5c1f7a, #480b6a) !important;
      }
    }
  }

  /* 시간 리스트 아이템 */
  .react-datepicker__time-list-item {
    padding: 8px 12px;
    font-size: 0.9rem;
    color: #333;
    cursor: pointer;
    transition: all 0.2s ease;
    border-radius: 6px;
    margin: 2px 4px;

    &:hover {
      background: linear-gradient(135deg, #e8e0ee, #d4c7e8);
      color: #351745;
    }
  }

  /* 선택된 시간 */
  .react-datepicker__time-list-item--selected {
    background: linear-gradient(135deg, #480b6a, #351745) !important;
    color: white !important;
    font-weight: 600;

    &:hover {
      background: linear-gradient(135deg, #5c1f7a, #480b6a) !important;
    }
  }

  /* 애니메이션 효과 */
  .react-datepicker__tab-loop {
    animation: fadeIn 0.3s ease-in-out;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  height: 120px;
  min-height: 120px;
  max-height: 120px;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  padding: 16px;
  font-size: 16px;
  color: #374151;
  background: white;
  transition: all 0.2s ease;
  box-sizing: border-box;
  font-family: 'Rethink Sans', sans-serif;
  resize: none;

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

  ${(props) => {
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
            background: linear-gradient(135deg, #4b2067 0%, #6b2d7c 100%);
          }
        `;
    }
  }}
`;

// 알림 모달 컴포넌트들
const AlertModal = styled.div`
  display: flex;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(8px);
  justify-content: center;
  align-items: center;
  z-index: 2000;
  animation: ${fadeIn} 0.3s ease-out;
`;

const AlertContent = styled.div`
  background: white;
  border-radius: 24px;
  width: 100%;
  max-width: 420px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(45, 17, 85, 0.15);
  border: 1px solid rgba(45, 17, 85, 0.1);
  animation: ${slideUp} 0.3s ease-out;
`;

const AlertHeader = styled.div<{ variant: 'success' | 'danger' }>`
  background: ${(props) =>
    props.variant === 'success'
      ? 'linear-gradient(135deg, #2d1155 0%, #4b2067 100%)'
      : 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)'};
  color: white;
  padding: 32px 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
`;

const AlertHeaderContent = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  gap: 16px;
`;

const AlertIconWrapper = styled.div`
  font-size: 32px;
  color: white;
`;

const AlertTitle = styled.h2`
  margin: 0;
  font-size: 1.75rem;
  font-weight: 700;
  color: white;
`;

const AlertCloseButton = styled.button`
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

const AlertBody = styled.div`
  padding: 40px;
  text-align: center;
`;

const AlertDescription = styled.p`
  font-size: 16px;
  color: #6b7280;
  line-height: 1.6;
  margin: 0 0 32px 0;
`;

const AlertButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 12px;
`;

const AlertButton = styled.button<{
  variant?: 'success' | 'danger' | 'secondary';
}>`
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
  min-width: 120px;

  ${(props) => {
    switch (props.variant) {
      case 'success':
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
            background: linear-gradient(135deg, #4b2067 0%, #6b2d7c 100%);
          }
        `;
    }
  }}
`;

// 알림 모달 컴포넌트
interface AlertModalProps {
  isOpen: boolean;
  variant: 'success' | 'danger';
  title: string;
  message: string;
  onClose: () => void;
}

const AlertModalComponent: React.FC<AlertModalProps> = ({
  isOpen,
  variant,
  title,
  message,
  onClose,
}) => {
  console.log('AlertModalComponent props:', {
    isOpen,
    variant,
    title,
    message,
  });

  if (!isOpen) return null;

  return (
    <AlertModal onClick={onClose}>
      <AlertContent onClick={(e) => e.stopPropagation()}>
        <AlertHeader variant={variant}>
          <AlertHeaderContent>
            <AlertIconWrapper>
              {variant === 'success' ? <FiCheckCircle /> : <FiTrash2 />}
            </AlertIconWrapper>
            <AlertTitle>{title}</AlertTitle>
          </AlertHeaderContent>
          <AlertCloseButton onClick={onClose}>
            <FiX />
          </AlertCloseButton>
        </AlertHeader>

        <AlertBody>
          <AlertDescription>{message}</AlertDescription>

          <AlertButtonContainer>
            <AlertButton variant={variant} onClick={onClose}>
              확인
            </AlertButton>
          </AlertButtonContainer>
        </AlertBody>
      </AlertContent>
    </AlertModal>
  );
};

const PreviewMeetingPopup: React.FC<PreviewMeetingPopupProps> = ({
  meeting,
  onConfirm,
  onReject,
  onClose,
  onLater,
}) => {
  // 한국 시간대로 변환하여 datetime-local 형식으로 만드는 함수
  // const formatToDatetimeLocal = (dateString: string) => {
  //   const date = new Date(dateString);
  //   // 한국 시간대로 변환
  //   const kstDate = new Date(date.getTime() + (date.getTimezoneOffset() * 60000) + (9 * 3600000));
  //   const year = kstDate.getFullYear();
  //   const month = String(kstDate.getMonth() + 1).padStart(2, '0');
  //   const day = String(kstDate.getDate()).padStart(2, '0');
  //   const hours = String(kstDate.getHours()).padStart(2, '0');
  //   const minutes = String(kstDate.getMinutes()).padStart(2, '0');
  //   return `${year}-${month}-${day}T${hours}:${minutes}`;
  // };

  const [editData, setEditData] = useState({
    meeting_title: meeting.meeting_title,
    meeting_date: new Date(meeting.meeting_date),
    meeting_agenda: meeting.meeting_agenda || '',
  });

  const [alertModal, setAlertModal] = useState<{
    isOpen: boolean;
    variant: 'success' | 'danger';
    title: string;
    message: string;
  }>({
    isOpen: false,
    variant: 'success',
    title: '',
    message: '',
  });

  const handleConfirm = () => {
    // 알림 모달만 표시 (서버 API 호출하지 않음)
    setAlertModal({
      isOpen: true,
      variant: 'success',
      title: '일정 등록 완료',
      message: '회의 일정이 캘린더에 성공적으로 등록되었습니다.',
    });
  };

  const handleReject = () => {
    // 알림 모달만 표시 (서버 API 호출하지 않음)
    setAlertModal({
      isOpen: true,
      variant: 'danger',
      title: '일정 삭제 완료',
      message: '회의 일정이 성공적으로 삭제되었습니다.',
    });
  };

  const closeAlertModal = () => {
    // 알림 모달 닫기
    setAlertModal((prev) => ({ ...prev, isOpen: false }));
    
    // 어떤 액션이었는지에 따라 실제 API 호출
    if (alertModal.variant === 'success') {
      // 일정 등록 - onConfirm 호출
      const confirmData = {
        ...editData,
        meeting_date: editData.meeting_date.toISOString(),
      };
      onConfirm(confirmData);
    } else if (alertModal.variant === 'danger') {
      // 일정 삭제 - onReject 호출
      onReject();
    }
    
    // 메인 팝업도 닫기
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleConfirm();
  };

  return (
    <Modal onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <HeaderContent>
            <IconWrapper>
              <FiCalendar />
            </IconWrapper>
            <Title>예정된 회의</Title>
          </HeaderContent>
          <CloseButton onClick={onClose}>
            <FiX />
          </CloseButton>
        </ModalHeader>

        <ModalBody>
          <Form onSubmit={handleSubmit}>
            <FormGroup>
              <Label>회의 제목</Label>
              <InputContainer>
                <Input
                  type="text"
                  value={editData.meeting_title}
                  onChange={(e) =>
                    setEditData((prev) => ({
                      ...prev,
                      meeting_title: e.target.value,
                    }))
                  }
                  placeholder="회의 제목을 입력하세요"
                />
              </InputContainer>
            </FormGroup>

            <FormGroup>
              <Label>회의 일시</Label>
              <DatePickerWrapper>
                <DatePicker
                  selected={editData.meeting_date}
                  onChange={(date: Date | null) =>
                    setEditData((prev) => ({
                      ...prev,
                      meeting_date: date || new Date(),
                    }))
                  }
                  showTimeSelect
                  timeIntervals={15}
                  timeFormat="HH:mm"
                  dateFormat="yyyy년 MM월 dd일 HH:mm"
                  className="custom-datepicker"
                  withPortal
                  placeholderText="회의 일시를 선택하세요"
                />
              </DatePickerWrapper>
            </FormGroup>

            <FormGroup>
              <Label>회의 안건</Label>
              <TextArea
                value={editData.meeting_agenda}
                onChange={(e) =>
                  setEditData((prev) => ({
                    ...prev,
                    meeting_agenda: e.target.value,
                  }))
                }
                placeholder="회의 안건을 입력하세요..."
              />
            </FormGroup>

            <ButtonContainer>
              <Button variant="primary" type="submit">
                일정 등록
              </Button>
              <Button variant="danger" type="button" onClick={handleReject}>
                일정 삭제
              </Button>
              <Button
                variant="secondary"
                type="button"
                onClick={onLater || onClose}
              >
                나중에 보기
              </Button>
            </ButtonContainer>
          </Form>
        </ModalBody>
      </ModalContent>

      {/* 알림 모달 */}
      <AlertModalComponent
        isOpen={alertModal.isOpen}
        variant={alertModal.variant}
        title={alertModal.title}
        message={alertModal.message}
        onClose={closeAlertModal}
      />
    </Modal>
  );
};

export default PreviewMeetingPopup;
