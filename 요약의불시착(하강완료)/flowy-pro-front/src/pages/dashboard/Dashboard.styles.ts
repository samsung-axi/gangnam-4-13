import styled, { keyframes } from 'styled-components';

export const Container = styled.div`
  cursor: default;
  min-height: 100vh;
  position: relative;
  background-color: #f8f9fa;
`;

export const MainContent = styled.div`
  padding: 24px;
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
  min-height: 100vh;
  @media (max-width: 768px) {
    padding: 16px;
  }
`;

export const MeetingAnalysisHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(135deg, #fff 0%, #f8f9ff 100%);
  border-radius: 16px;
  padding: 24px 28px;
  margin-bottom: 32px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(53, 23, 69, 0.05);
  transition: all 0.2s ease;

  &:hover {
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
    transform: translateY(-2px);
  }

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 20px;
    align-items: flex-start;
    border-radius: 12px;
    padding: 20px 24px;
  }
`;

export const MeetingAnalysisTitle = styled.h2`
  font-size: 1.75rem;
  color: #351745;
  margin: 0;
  font-weight: 700;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

export const Section = styled.div`
  background: #fff;
  border-radius: 16px;
  margin-bottom: 32px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  border: 1px solid rgba(53, 23, 69, 0.05);
  transition: all 0.2s ease;

  &:hover {
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
    transform: translateY(-2px);
  }
`;

export const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(135deg, #351745 0%, #4a1d5a 100%);
  padding: 20px 28px;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      45deg,
      rgba(255, 255, 255, 0.1) 0%,
      rgba(255, 255, 255, 0.05) 100%
    );
    pointer-events: none;
  }
`;

export const SectionTitle = styled.h3`
  font-size: 1.375rem;
  color: white;
  margin: 0;
  font-weight: 600;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  position: relative;
  z-index: 1;
`;

export const SectionBody = styled.div`
  padding: 32px 28px;
  background: #fff;

  @media (max-width: 768px) {
    padding: 24px 20px;
  }
`;

export const EditButton = styled.button`
  background: rgba(255, 255, 255, 0.95);
  border: 1px solid rgba(53, 23, 69, 0.15);
  border-radius: 50px;
  padding: 10px 20px;
  margin-left: 16px;
  font-size: 0.875rem;
  font-weight: 500;
  color: #351745;
  cursor: pointer;
  transition: all 0.2s ease;
  backdrop-filter: blur(10px);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  white-space: nowrap;
  display: flex;
  align-items: center;
  gap: 8px;

  &:hover {
    background: #b19cd9; /* 연한 보라색 */
    color: #351745;
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(177, 156, 217, 0.3);
  }

  &:active {
    transform: translateY(-1px) scale(0.98);
  }
`;

export const BasicInfoGrid = styled.div`
  display: grid;
  grid-template-columns: 150px 1fr;
  gap: 20px 32px;

  @media (max-width: 768px) {
    grid-template-columns: 120px 1fr;
    gap: 16px 24px;
  }

  @media (max-width: 576px) {
    grid-template-columns: 1fr;
    gap: 12px;
  }
`;

export const InfoLabel = styled.div`
  font-weight: 600;
  color: #351745;
  font-size: 0.9375rem;

  @media (max-width: 576px) {
    margin-bottom: 4px;
  }
`;

export const InfoContent = styled.div`
  color: #333;
  font-size: 0.9375rem;
  line-height: 1.6;
`;

export const SummaryContent = styled.div`
  padding: 0;
`;

export const SummarySection = styled.div`
  margin-bottom: 24px;

  &:last-child {
    margin-bottom: 0;
  }
`;

export const SummarySectionHeader = styled.h4`
  color: #351745;
  font-size: 1.125rem;
  margin-bottom: 12px;
  font-weight: 600;
`;

export const SummaryList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

export const SummaryListItem = styled.li`
  margin-bottom: 12px;
  color: #333;
  line-height: 1.6;
  font-size: 0.9375rem;
  padding-left: 20px;
  position: relative;

  &:before {
    content: '•';
    color: #351745;
    position: absolute;
    left: 0;
    font-size: 1.2em;
  }

  &:last-child {
    margin-bottom: 0;
  }
`;

export const TaskGridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 28px;
  max-height: 650px;
  overflow-y: auto;
  padding: 24px;

  &::-webkit-scrollbar {
    width: 10px;
  }
  &::-webkit-scrollbar-track {
    background: linear-gradient(135deg, #f8f9ff 0%, #f0f4ff 100%);
    border-radius: 8px;
  }
  &::-webkit-scrollbar-thumb {
    background: linear-gradient(135deg, #351745 0%, #4a1d5a 100%);
    border-radius: 8px;
    border: 2px solid #f8f9ff;
  }
  &::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(135deg, #4a1d5a 0%, #5d2470 100%);
  }

  @media (max-width: 992px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
  }
  @media (max-width: 576px) {
    grid-template-columns: 1fr;
    gap: 16px;
    padding: 16px;
  }
`;

export const TaskCard = styled.div<{ $isUnassigned?: boolean }>`
  border-radius: 16px;
  border: 2px solid
    ${(props) =>
      props.$isUnassigned ? 'rgba(210, 0, 0, 0.3)' : 'rgba(53, 23, 69, 0.1)'};
  background: ${(props) =>
    props.$isUnassigned
      ? 'rgba(210, 0, 0, 0.02)'
      : 'linear-gradient(135deg, #fff 0%, #f8f9ff 100%)'};
  padding: 24px;
  min-height: 220px;
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  cursor: ${(props) => (props.draggable ? 'grab' : 'default')};

  &:hover {
    transform: translateY(-4px);
    box-shadow: ${(props) =>
      props.$isUnassigned
        ? '0 8px 30px rgba(210, 0, 0, 0.15)'
        : '0 8px 30px rgba(53, 23, 69, 0.15)'};
    border-color: ${(props) =>
      props.$isUnassigned ? 'rgba(210, 0, 0, 0.4)' : 'rgba(53, 23, 69, 0.2)'};
  }

  &:active {
    cursor: ${(props) => (props.draggable ? 'grabbing' : 'default')};
  }
`;

export const TaskCardHeader = styled.div<{ $isUnassigned?: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 2px solid
    ${(props) =>
      props.$isUnassigned ? 'rgba(210, 0, 0, 0.1)' : 'rgba(53, 23, 69, 0.1)'};
`;

export const TaskCardTitle = styled.h4<{ $isUnassigned?: boolean }>`
  font-size: 1.25rem;
  margin: 0;
  color: ${(props) => (props.$isUnassigned ? '#d20000' : '#351745')};
  font-weight: 700;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
`;

export const TaskCardList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  flex-grow: 1;
`;

export const TaskCardListItem = styled.li`
  margin-bottom: 12px;
  color: #333;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  line-height: 1.5;
  font-size: 0.9375rem;
  padding-left: 20px;
  position: relative;

  &:before {
    content: '•';
    color: #351745;
    position: absolute;
    left: 0;
    font-size: 1.2em;
  }

  &:last-child {
    margin-bottom: 0;
  }
`;

export const TaskCardDate = styled.span`
  color: #666;
  font-size: 0.8125rem;
  font-weight: 500;
  margin-left: 12px;
  white-space: nowrap;
  padding: 6px 12px;
  background: linear-gradient(135deg, #f0f4ff 0%, #e8f0ff 100%);
  border-radius: 20px;
  border: 1px solid rgba(53, 23, 69, 0.1);
  transition: all 0.2s ease;
  cursor: pointer;

  &:hover {
    background: linear-gradient(135deg, #e8f0ff 0%, #dce7ff 100%);
    border-color: rgba(53, 23, 69, 0.2);
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(53, 23, 69, 0.1);
  }
`;

export const RecommendFilesList = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
`;

export const RecommendFileCard = styled.div`
  display: flex;
  align-items: flex-start;
  padding: 20px;
  background: linear-gradient(135deg, #f8f9ff 0%, #f0f4ff 100%);
  border-radius: 12px;
  border-left: 4px solid #351745;
  transition: all 0.2s ease;

  &:hover {
    background: linear-gradient(135deg, #f0f4ff 0%, #e8f0ff 100%);
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(53, 23, 69, 0.1);
  }
`;

export const RecommendFileIcon = styled.div`
  margin-right: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #351745 0%, #4a1d5a 100%);
  border-radius: 8px;
  flex-shrink: 0;
`;

export const RecommendFileContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const RecommendFileReason = styled.div`
  color: #666;
  font-size: 0.875rem;
  line-height: 1.5;
`;

export const RecommendFileLink = styled.a`
  color: #351745;
  text-decoration: none;
  font-weight: 600;
  font-size: 0.9375rem;
  transition: color 0.2s ease;

  &:hover {
    color: #4a1d5a;
    text-decoration: underline;
  }
`;

export const EmptyRecommendFiles = styled.div`
  text-align: center;
  padding: 40px 20px;
  color: #666;
  font-style: italic;
`;

// 회의 피드백 타이틀
export const FeedbackTitle = styled.h3`
  color: #351745;
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 12px;
  margin-top: 0;
`;

export const SpeechBubbleButton = styled.button`
  position: relative;
  background: rgba(255, 255, 255, 0.95);
  border: 1px solid rgba(53, 23, 69, 0.15);
  border-radius: 50px;
  padding: 10px 20px;
  margin-left: 12px;
  font-size: 0.875rem;
  font-weight: 500;
  color: #351745;
  cursor: pointer;
  transition: all 0.2s ease;
  backdrop-filter: blur(10px);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  white-space: nowrap;
  display: flex;
  align-items: center;
  gap: 8px;

  &:hover {
    background: #b19cd9; /* 연한 보라색 */
    color: #351745;
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(177, 156, 217, 0.3);
  }

  &:active {
    transform: translateY(-1px) scale(0.98);
  }
`;

// const RectButton = styled.button`
//   background: #f3eef8;
//   border: none;
//   border-radius: 4px;
//   padding: 8px 20px 8px 18px;
//   margin-left: 8px;
//   font-weight: 500;
//   color: #351745;
//   font-size: 15px;
//   box-shadow: none;
//   cursor: pointer;
//   display: flex;
//   align-items: center;
//   transition: box-shadow 0.15s;
//   &:hover {
//     box-shadow: 0 2px 8px rgba(53, 23, 69, 0.08);
//   }
// `;

export const InputWrapper = styled.div`
  display: flex;
  gap: 16px;
  margin-top: 32px;
  padding: 24px 28px;
  background: linear-gradient(135deg, #f8f9ff 0%, #f0f4ff 100%);
  border-radius: 16px;
  border: 1px solid rgba(53, 23, 69, 0.05);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 12px;
    padding: 20px 24px;
  }
`;

export const StyledInput = styled.input`
  flex: 1;
  padding: 14px 18px;
  border: 2px solid transparent;
  background: linear-gradient(135deg, #fff 0%, #f8f9ff 100%);
  border-radius: 12px;
  font-size: 0.9375rem;
  color: #333;
  transition: all 0.2s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);

  &:focus {
    outline: none;
    border-color: #351745;
    background: #fff;
    box-shadow: 0 4px 15px rgba(53, 23, 69, 0.15);
    transform: translateY(-1px);
  }

  &::placeholder {
    color: #9ca3af;
  }
`;

export const AddButton = styled.button`
  background: linear-gradient(135deg, #b19cd9 0%, #e0c6f7 100%);
  color: white;
  padding: 14px 24px;
  font-size: 1rem;
  font-weight: 600;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 8px rgba(53, 23, 69, 0.2);

  &:hover {
    background: linear-gradient(135deg, #e0c6f7 0%, rgb(202, 186, 231) 100%);
    color: #351745;
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(177, 156, 217, 0.3);
  }

  &:active {
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
    box-shadow: 0 2px 8px rgba(53, 23, 69, 0.1);
  }
`;

// const RoleContainer = styled.div`
//   display: grid;
//   grid-template-columns: repeat(3, 1fr);
//   gap: 16px;
//   padding: 16px;
// `;

// const Card = styled.div<{ highlight?: boolean }>`
//   border: 1px solid ${({ highlight }) => (highlight ? 'red' : '#ccc')};
//   padding: 16px;
//   border-radius: 8px;
//   background-color: ${({ highlight }) => (highlight ? '#fff6f6' : '#fff')};
// `;

// const Title = styled.h3`
//   font-size: 16px;
//   font-weight: bold;
// `;

// const TaskItem = styled.div`
//   margin-top: 8px;
//   font-size: 14px;
// `;

const moveGlow = keyframes`
  0% { box-shadow: 0 0 0 0 #b19cd9, 0 0 12px 2px #b19cd9; }
  50% { box-shadow: 0 0 0 4px #b19cd9, 0 0 24px 8px #b19cd9; }
  100% { box-shadow: 0 0 0 0 #b19cd9, 0 0 12px 2px #b19cd9; }
`;

export const RedSection = styled.div<{ isEditing?: boolean }>`
  padding: 1rem;
  border-radius: 0.5rem;
  position: relative;
  z-index: 1;
  border: 2px solid
    ${({ isEditing }) => (isEditing ? '#b19cd9' : 'transparent')};
  animation: ${({ isEditing }) => (isEditing ? moveGlow : 'none')} 2s infinite;
  background: ${({ isEditing }) =>
    isEditing
      ? 'linear-gradient(135deg, #f8f9ff 60%, #e8e0ee 100%)'
      : 'inherit'};
  transition: border 0.3s, background 0.3s;
`;

// Floating 버튼들을 위한 스타일
export const FloatingButtonContainer = styled.div<{ $isVisible: boolean }>`
  position: fixed;
  top: 50%;
  right: 20px;
  transform: translateY(-50%);
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: 12px;
  opacity: ${({ $isVisible }) => ($isVisible ? 1 : 0)};
  visibility: ${({ $isVisible }) => ($isVisible ? 'visible' : 'hidden')};
  transition: all 0.3s ease-in-out;

  @media (max-width: 768px) {
    right: 16px;
    gap: 8px;
  }
`;

export const FloatingButton = styled.button`
  background: rgba(255, 255, 255, 0.95);
  border: 1px solid rgba(53, 23, 69, 0.15);
  border-radius: 50px;
  padding: 12px 20px;
  font-size: 0.875rem;
  font-weight: 500;
  color: #351745;
  cursor: pointer;
  transition: all 0.2s ease;
  backdrop-filter: blur(20px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  white-space: nowrap;
  display: flex;
  align-items: center;
  gap: 8px;

  &:hover {
    background: #b19cd9;
    color: #351745;
    transform: translateX(-5px);
    box-shadow: 0 6px 25px rgba(177, 156, 217, 0.3);
  }

  &:active {
    transform: translateX(-3px) scale(0.98);
  }

  @media (max-width: 768px) {
    padding: 10px 16px;
    font-size: 0.8125rem;
  }
`;

// PDF 다운로드와 메일 발송용 연한 보라색 호버 버튼
export const FloatingButtonLight = styled.button`
  background: rgba(255, 255, 255, 0.95);
  border: 1px solid rgba(53, 23, 69, 0.15);
  border-radius: 50px;
  padding: 12px 20px;
  font-size: 0.875rem;
  font-weight: 500;
  color: #351745;
  cursor: pointer;
  transition: all 0.2s ease;
  backdrop-filter: blur(20px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  white-space: nowrap;
  display: flex;
  align-items: center;
  gap: 8px;

  &:hover {
    background: #b19cd9; /* 연한 보라색 */
    color: #351745;
    transform: translateX(-5px);
    box-shadow: 0 6px 25px rgba(177, 156, 217, 0.3);
  }

  &:active {
    transform: translateX(-3px) scale(0.98);
  }

  @media (max-width: 768px) {
    padding: 10px 16px;
    font-size: 0.8125rem;
  }
`;

// 편집 모드용 Input 스타일
export const EditModeInput = styled.input`
  width: calc(100% - 40px);
  max-width: 100%;
  min-width: 200px;
  padding: 14px 18px;
  border: 2px solid #351745;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 10px;
  font-size: 0.9375rem;
  color: #333;
  transition: all 0.2s ease;
  box-shadow: inset 0 2px 4px rgba(53, 23, 69, 0.1),
    0 2px 8px rgba(53, 23, 69, 0.15);
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: #4a1d5a;
    background: #fff;
    box-shadow: inset 0 2px 6px rgba(53, 23, 69, 0.15),
      0 4px 20px rgba(53, 23, 69, 0.25);
    transform: scale(1.02);
  }

  &::placeholder {
    color: #9ca3af;
    font-style: italic;
    opacity: 0.7;
  }

  /* 사용자가 입력할 수 있음을 강조하는 깜빡이는 애니메이션 */
  animation: subtle-pulse 2s ease-in-out infinite;

  @keyframes subtle-pulse {
    0%,
    100% {
      border-color: #351745;
    }
    50% {
      border-color: #4a1d5a;
    }
  }
`;

export const TaskDatePickerWrapper = styled.div`
  width: 25% !important;
  min-width: 200px !important;
  max-width: 300px !important;
  .react-datepicker {
    width: 100% !important;
    min-width: 100% !important;
    max-width: 100% !important;
  }
`;
