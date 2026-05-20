import styled from "styled-components";
import type { StyledUploadSectionProps } from "./InsertConferenceInfo.types";

// <editor-fold desc="Layout Components">
export const EditIcon = styled.div`
  cursor: pointer;
  width: 16px;
  height: 16px;
  background-image: url("/images/edit.svg");
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  margin-left: 8px;
  margin-right: 8px;
  opacity: 0.6;
  transition: opacity 0.2s ease;
  
  &:hover {
    opacity: 1;
  }
`;

// const ProjectHeader = styled.div`
//   display: flex;
//   justify-content: space-between;
//   align-items: center;
//   margin-bottom: 20px;
//   position: relative;
// `;

export const StyledErrorMessage = styled.div`
  background: linear-gradient(135deg, #fef2f2, #fee2e2);
  border: 1px solid #fca5a5;
  border-left: 4px solid #ef4444;
  color: #dc2626;
  padding: 15px 16px;
  margin-top: 30px;
  margin-bottom: 20px;
  font-size: 1.05rem;
  font-weight: 600;
  text-align: left;
  width: 100%;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(239, 68, 68, 0.1);
  display: flex;
  align-items: center;
  gap: 8px;
  box-sizing: border-box;
  
  &::before {
    content: '⚠️';
    font-size: 1.1rem;
    flex-shrink: 0;
  }
  
  /* 애니메이션 효과 */
  animation: slideIn 0.3s ease-out, pulse 2s ease-in-out infinite;
  
  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @keyframes pulse {
    0%, 100% {
      border-left-color: #ef4444;
    }
    50% {
      border-left-color: #f87171;
    }
  }
`;

export const ProjectListTitle = styled.h2`
  font-size: 1.6rem;
  font-weight: 600;
  color: #351745;
  margin-bottom: 20px;
  text-align: center;
  width: 100%;
  
  &::before {
    margin-right: 8px;
    font-size: 1.1rem;
  }
`;

export const SortWrapper = styled.div`
  display: flex;
  justify-content: flex-end; /* 우측 정렬 */
  width: 100%; /* 부모 너비에 맞춤 */
  padding-right: 20px; /* 스크롤바 공간 확보 */
  padding-bottom: 20px;
`;

// const ContainerHeader = styled.div`
//   display: flex;
//   justify-content: space-between;
//   align-items: center;
//   margin-bottom: 20px;
//   width: 100%;
// `;

export const SortText = styled.span`
  font-size: 0.9rem;
  color: #666;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`;

export const ProjectListContainer = styled.div`
  background: #fafbfc;
  border-radius: 12px;
  padding: 20px;
  width: 750px;
  min-width: 750px;
  max-width: 750px;
  box-sizing: border-box;
  height: 800px;
  overflow: visible;
  margin-top: 10px;
  
  @media (max-width: 1200px) {
    height: 600px;
    padding: 15px;
    width: 850px;
    min-width: 850px;
    max-width: 850px;
  }
  
  @media (max-width: 768px) {
    height: 500px;
    padding: 10px;
    width: 100%;
    min-width: auto;
    max-width: 100%;
  }
  
  /* Custom scrollbar */
  &::-webkit-scrollbar {
    width: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.05);
    border-radius: 4px;
    margin: 4px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: linear-gradient(135deg, #351745, #480b6a);
    border-radius: 4px;
    
    &:hover {
      background: linear-gradient(135deg, #480b6a, #5c1f7a);
    }
  }
`;

export const SectionTitle = styled.h3`
  font-size: 1rem;
  font-weight: 700;
  color: #351745;
  margin-top: 16px;
  margin-bottom: 12px;
  position: relative;
  padding-left: 16px;
  
  &:first-child {
    margin-top: 0;
  }
  
  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 8px;
    height: 8px;
    background: linear-gradient(135deg, #351745, #480b6a);
    border-radius: 50%;
    box-shadow: 0 0 0 2px rgba(53, 23, 69, 0.2);
  }
`;

export const ExpandedArea = styled.div`
  padding: 20px 24px;
  background-color: #fafafa;
  margin: 0 0 10px 10px;
  font-size: 15px;
  color: #555;
  width: calc(100% - 10px);
  box-sizing: border-box;

  animation: fadeIn 0.3s ease;
  max-height: 250px;
  overflow: visible;

  .user-list {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-bottom: 16px;
    width: 100%;
  }

  .user-name {
    background-color: #ebe8ed;
    padding: 6px 14px;
    border-radius: 16px;
    font-size: 14px;
    color: #333;
    font-weight: 500;
    flex-shrink: 0;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(-5px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

export const ProjectList = styled.ul`
  list-style: none;
  padding-left: 0;
  margin: 0;
`;

export const ProjectListItem = styled.li`
  margin-bottom: 12px;
  padding: 16px 18px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  border: 2px solid transparent;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  width: 100%;
  box-sizing: border-box;

  display: flex;
  justify-content: space-between;
  align-items: center;

  .name {
    text-align: left;
    flex: 1;
    color:rgb(20, 3, 31);
    font-weight: 600;
    font-size: 16px;
    line-height: 1.4;
    margin-right: 12px;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    
    &::before {
      margin-right: 8px;
      font-size: 14px;
    }
  }

  .date {
    text-align: right;
    color: #7f8c8d;
    font-size: 12px;
    font-weight: 500;
    flex-shrink: 0;
    width: 140px;
    line-height: 1.3;
    
    &::before {
      font-size: 10px;
    }
  }

  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    width: 4px;
    height: 100%;
    background: linear-gradient(135deg, #351745, #480b6a);
    transform: scaleY(0);
    transition: transform 0.3s ease;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(53, 23, 69, 0.15);
    border-color: rgba(53, 23, 69, 0.2);
    
    .name {
      color: #351745;
    }
    
    &::before {
      transform: scaleY(1);
    }
  }

  &.selected {
    background: linear-gradient(135deg, #f8f5ff, #e8e0ee);
    border-color: #351745;
    box-shadow: 0 4px 16px rgba(53, 23, 69, 0.2);
    
    .name {
      color: #351745;
      font-weight: 700;
    }
    
    &::before {
      transform: scaleY(1);
      background: linear-gradient(135deg, #351745, #480b6a);
    }
  }
`;

export const NewProjectTextsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1;
`;

export const NewProjectTextTop = styled.span`
  color: #64748b;
  font-size: 10px;
  font-style: normal;
  font-weight: 500;
  line-height: 14px;
  opacity: 0.8;
  
  @media (max-width: 768px) {
    font-size: 9px;
    line-height: 12px;
  }
`;

export const NewProjectTextBottom = styled.span`
  color: #00b4ba;
  font-size: 13px;
  font-style: normal;
  font-weight: 600;
  line-height: 18px;
  
  @media (max-width: 768px) {
    font-size: 12px;
    line-height: 16px;
  }
`;

export const NewProjectWrapper = styled.div`
  position: absolute;
  top: -50px;
  right: 0;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  z-index: 1;
  padding: 8px 12px;
  border-radius: 12px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background: transparent;

  img {
    width: 24px;
    height: 24px;
    transition: transform 0.3s ease;
    filter: drop-shadow(0 1px 2px rgba(0, 180, 186, 0.2));
    
    @media (max-width: 768px) {
      width: 22px;
      height: 22px;
    }
  }

  &:hover {
    background: rgba(255, 255, 255, 0.9);
    box-shadow: 0 4px 12px rgba(0, 180, 186, 0.15);
    transform: translateY(-1px);
    
    img {
      transform: scale(1.05);
      filter: drop-shadow(0 2px 4px rgba(0, 180, 186, 0.3));
    }
  }

  &:active {
    transform: translateY(0);
    background: rgba(255, 255, 255, 0.8);
  }
  
  @media (max-width: 768px) {
    gap: 6px;
    padding: 6px 10px;
  }
`;

export const MeetingList = styled.div`
  .meeting-list {
    margin-top: 10px;
    max-height: 200px;
    overflow-y: auto;
  }

  .meeting-item {
    background: #f8f9fa;
    border: 1px solid #e9ecef;
    border-radius: 8px;
    padding: 12px;
    margin-bottom: 8px;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
      background: #e9ecef;
      border-color: #00b4ba;
    }

    &.selected {
      background: #e3f2fd;
      border-color: #00b4ba;
      border-width: 2px;
    }

    .meeting-title {
      font-weight: 600;
      color: #351745;
      margin-bottom: 4px;
      font-size: 0.95rem;
    }

    .meeting-date {
      color: #6c757d;
      font-size: 0.85rem;
      margin-bottom: 4px;
    }

    .meeting-attendees {
      color: #495057;
      font-size: 0.85rem;
    }
  }
`;

// const TabBtn = styled.button<{ active: boolean }>`
//   flex: 1;
//   height: 56px;
//   background: ${({ active }) => (active ? '#e5e0ee' : 'transparent')};
//   color: ${({ active }) => (active ? '#351745' : '#fff')};
//   border: none;
//   font-size: 1.18rem;
//   font-weight: 700;
//   cursor: pointer;
//   transition: background 0.2s, color 0.2s;
//   margin-right: 2px;
//   outline: none;
//   letter-spacing: -0.5px;
//   z-index: ${({ active }) => (active ? 2 : 1)};
//   &:last-child { margin-right: 0; }
// `;

export const StyledUploadButton = styled.button`
  padding: 16px 0;
  background: linear-gradient(135deg, #00b4ba 0%, #00a0a5 50%, #008b8f 100%);
  color: white;
  border: none;
  border-radius: 30px;
  font-size: 1.15rem;
  font-weight: 700;
  cursor: pointer;
  width: 100%;
  margin-top: 30px;
  margin-bottom: 40px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 12px rgba(0, 180, 186, 0.2);
  
  &:hover {
    background: linear-gradient(135deg, #00c4ca 0%, #00b0b5 50%, #009b9f 100%);
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0, 180, 186, 0.25);
  }
  
  &:active {
    transform: translateY(0);
    transition: transform 0.1s ease;
  }
  
  /* 포커스 상태 */
  &:focus {
    outline: none;
    box-shadow: 0 4px 12px rgba(0, 180, 186, 0.2),
                0 0 0 3px rgba(0, 180, 186, 0.2);
  }
`;

export const PageWrapper = styled.div`
  cursor: default;
  display: flex;
  width: 100%;
  min-height: 100vh;
  padding-top: 30px;
  overflow-x: hidden;
  box-sizing: border-box;
`;

export const ContentWrapper = styled.div`
  display: flex;
  flex: 1;
  width: 100%;
  max-width: 100%;
  overflow-x: hidden;
`;

export const LeftPanel = styled.div`
  flex: 3;
  background-color: #f7f7f7;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  gap: 1rem;
  padding: 40px 20px;
  position: relative;
  min-width: 0;
  box-sizing: border-box;
  
  @media (max-width: 1200px) {
    padding: 30px 15px;
  }
`;

export const RightPanel = styled.div`
  flex: 2;
  min-width: 350px;
  background: #351745;
  padding: 0;
  display: flex;
  flex-direction: column;
  color: white;
  border-radius: 0 0 16px 0;
  box-shadow: 0 2px 16px rgba(53, 23, 69, 0.04);
  box-sizing: border-box;
  
  @media (max-width: 1200px) {
    min-width: 320px;
  }
  
  @media (max-width: 768px) {
    min-width: 300px;
  }
`;

// const TabSectionWrapper = styled.div`
//   /* border-radius: 16px 16px 0 0; */ /* 제거 */
//   overflow: hidden;
//   background: #351745;
//   width: 100%;
//   position: relative;
//   z-index: 1;
// `;

export const TabsWrapper = styled.div`
  display: flex;
  width: 100%;
  height: 56px;
  background: #351745;
  /* border-radius: 16px 16px 0 0; */ /* 제거 */
  overflow: hidden;
  position: relative;
`;

export const TabPanel = styled.div`
  flex: 1;
  background: #351745;
  border-radius: 0 0 16px 16px;
  padding: 36px 36px 32px 36px;
  min-height: 600px;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  box-sizing: border-box;
  
  @media (max-width: 1200px) {
    padding: 24px 24px 24px 24px;
    min-height: 500px;
  }
  
  @media (max-width: 768px) {
    padding: 16px 16px 16px 16px;
    min-height: 400px;
  }
`;

export const StyledAddAttendeeButton = styled.button`
  background-color: transparent; /* 배경색 투명하게 */
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0; /* 패딩 제거 */
  cursor: pointer;
  font-size: 0.9rem;
  margin-left: auto; /* 레이블과 버튼 사이 간격 조절 */

  &:hover {
    background-color: transparent; /* 호버 시에도 배경 투명 유지 */
    opacity: 0.8; /* 호버 시 투명도 조절 */
  }

  img {
    width: 24px; /* 아이콘 크기 조정 */
    height: 24px;
  }
`;

export const LabelButtonWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 8px; /* StyledLabel의 margin-bottom과 동일하게 */
`;

export const PageTitle = styled.h1`
  font-size: 1.8rem;
  margin: 0;
  margin-bottom: 25px;
  text-align: left;
  display: flex; /* 아이콘과 텍스트를 나란히 정렬 */
  align-items: center; /* 세로 중앙 정렬 */

  img {
    width: 28px; /* 아이콘 크기 조정 */
    height: 28px;
    margin-right: 10px; /* 아이콘과 텍스트 사이 간격 */
  }
`;

export const FormGroup = styled.div`
  margin-bottom: 22px;
`;

export const StyledLabel = styled.label`
  display: block;
  margin-bottom: 8px;
  font-size: 1.08rem;
  color: #fff;
  font-weight: 600;
  span {
    color: #ed6e00;
    font-weight: 700;
  }
`;

export const StyledInput = styled.input`
  width: 100%;
  padding: 13px 18px;
  border: none;
  border-radius: 8px;
  background: #f7f7f7;
  color: #351745;
  font-size: 1.05rem;
  font-weight: 500;
  box-sizing: border-box;
  margin-bottom: 2px;
  &::placeholder {
    color: #bdbdbd;
    font-weight: 400;
    font-size: 1.02rem;
  }
`;

export const StyledTextarea = styled.textarea`
  width: 100%;
  padding: 13px 18px;
  border: none;
  border-radius: 8px;
  background: #f7f7f7;
  color: #351745;
  font-size: 1.05rem;
  font-weight: 500;
  font-family: "Rethink Sans", sans-serif; /* 폰트 적용 */
  box-sizing: border-box;
  height: 120px; /* 고정 높이 설정 */
  resize: none; /* 사이즈 조정 비활성화 */
  &::placeholder {
    color: #bdbdbd;
    font-weight: 400;
    font-size: 1.02rem;
  }
`;

export const DatePickerWrapper = styled.div`
  position: relative;
  width: 100%;
  /* 입력 컨테이너 스타일 */
  .react-datepicker-wrapper {
    width: 100%;
  }
  .react-datepicker__input-container {
    width: 100%;
  }
  
  /* 전역 모든 요소보다 달력 우선순위 강화 */
  & * {
    position: relative !important;
  }
  
  /* 전역 스타일로 다른 모든 요소의 z-index 제한 */
  body > div:not([class*="react-datepicker"]),
  body > *:not([class*="react-datepicker"]) {
    z-index: 999 !important;
    max-z-index: 999 !important;
    contain: layout style !important;
  }
  
  /* 입력 필드 스타일 */
  .custom-datepicker {
    width: 100%;
    padding: 13px 18px;
    border: none;
    border-radius: 12px;
    background: #f7f7f7;
    color: #351745;
    font-size: 1.05rem;
    font-weight: 500;
    box-sizing: border-box;
    transition: all 0.3s ease;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    cursor: pointer;
    
    &:hover {
      box-shadow: 0 4px 12px rgba(53, 23, 69, 0.15);
      background: #f0f0f0;
    }
    
    &:focus {
      outline: none;
      box-shadow: 0 0 0 3px rgba(72, 11, 106, 0.2);
      background: #fff;
    }
    
    &::placeholder {
      color: #bdbdbd;
      font-weight: 400;
      font-size: 1.02rem;
    }
  }

  /* 전역 body에 렌더링되는 달력 포털 - 모든 선택자 강화 */
  html .react-datepicker__portal,
  body .react-datepicker__portal,
  body > .react-datepicker__portal,
  body > div .react-datepicker__portal,
  #root ~ .react-datepicker__portal,
  .react-datepicker__portal {
    position: fixed !important;
    top: 0 !important;
    left: 0 !important;
    right: 0 !important;
    bottom: 0 !important;
    z-index: 2147483647 !important; /* 최대 z-index 값 */
    background: rgba(0, 0, 0, 0.6) !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    backdrop-filter: blur(3px) !important;
    /* 새로운 stacking context 생성 방지 */
    transform: translateZ(0) !important;
    isolation: isolate !important;
    pointer-events: auto !important;
    /* 추가 우선순위 강화 */
    visibility: visible !important;
    opacity: 1 !important;
  }
  
  html .react-datepicker__portal .react-datepicker,
  body .react-datepicker__portal .react-datepicker,
  body > .react-datepicker__portal .react-datepicker,
  body > div .react-datepicker__portal .react-datepicker,
  #root ~ .react-datepicker__portal .react-datepicker,
  .react-datepicker__portal .react-datepicker {
    position: relative !important;
    margin: auto !important;
    transform: none !important;
    z-index: 2147483647 !important; /* 최대 z-index 값 */
    box-shadow: 0 25px 50px rgba(0, 0, 0, 0.3) !important;
    pointer-events: auto !important;
    isolation: isolate !important;
    visibility: visible !important;
    opacity: 1 !important;
  }
  
  /* 달력 팝업 컨테이너 (포털 사용 안할 때 백업) */
  .react-datepicker-popper {
    z-index: 9999 !important;
    position: absolute !important;
  }
  
  .react-datepicker-popper[data-placement^="bottom"] {
    margin-top: 8px;
    transform: translate3d(0, 0, 0) !important;
  }
  
  /* 포커스 이벤트 관련 설정 */
  .react-datepicker__input-container input:focus {
    outline: none !important;
  }

  /* 메인 달력 컨테이너 - 레이아웃 안정화 */
  .react-datepicker {
    font-family: "Rethink Sans", sans-serif !important;
    border: none !important;
    border-radius: 16px !important;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15), 0 10px 20px rgba(0, 0, 0, 0.1) !important;
    background: #fff !important;
    overflow: hidden !important;
    backdrop-filter: blur(10px) !important;
    pointer-events: auto !important;
    display: flex !important;
    flex-direction: row !important;
    width: 25% !important;
    min-width: 25% !important;
    max-width: 25% !important;
  }
  
  /* 달력 래퍼에 클릭 이벤트 보호 */
  .react-datepicker-wrapper {
    position: relative;
    z-index: 1;
  }

  /* 달력 헤더 */
  .react-datepicker__header {
    background: linear-gradient(135deg, #e8e0ee, #d4c7e8);
    border-bottom: none;
    border-radius: 16px 16px 0 0;
    padding: 24px 70px 20px 70px; /* 상하 패딩 증가, 좌우 패딩 더 넓게 */
    color: #351745;
    position: relative;
    min-height: 90px; /* 헤더 최소 높이 더 증가 */
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  /* 현재 월/년 표시 - 위치 조정 */
  .react-datepicker__current-month {
    color: #351745 !important;
    font-weight: 700 !important;
    font-size: 1.3rem !important;
    margin-bottom: 12px !important;
    text-align: center !important;
    padding: 0 20px !important; /* 좌우 패딩으로 버튼과 겹침 방지 */
    line-height: 1 !important;
    position: relative !important;
    z-index: 1 !important;
    word-break: keep-all !important; /* 한글 줄바꿈 방지 */
    white-space: nowrap !important;
  }

  /* 요일 헤더 - 날짜와 완전 동일한 정렬 */
  .react-datepicker__day-names {
    display: flex !important;
    justify-content: space-between !important; /* space-around → space-between */
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
    flex-grow: 0 !important; /* 확장 방지 */
    flex-basis: 2.5rem !important; /* 고정 기준 크기 */
    margin: 0 !important;
    box-sizing: border-box !important;
  }

  /* 월 컨테이너 - 레이아웃 안정화 */
  .react-datepicker__month-container {
    background: white !important;
    flex: 1 !important;
    display: flex !important;
    flex-direction: column !important;
    min-width: 280px !important; /* 최소 너비 보장 */
    max-width: none !important;
  }

  .react-datepicker__month {
    padding: 20px !important;
    margin: 0 !important;
    display: flex !important;
    flex-direction: column !important;
    gap: 2px !important; /* 주 간격 일정하게 */
  }

  .react-datepicker__week {
    display: flex !important;
    justify-content: space-between !important; /* space-around → space-between */
    margin-bottom: 4px !important;
    min-height: 40px !important;
    align-items: center !important;
    width: 100% !important;
  }

  /* 날짜 셀 - 요일과 완전 동일한 정렬 */
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
    flex-grow: 0 !important; /* 확장 방지 */
    flex-basis: 2.5rem !important; /* 고정 기준 크기 */
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

  /* 네비게이션 버튼 - 배경 제거 및 텍스트 숨김 */
  .react-datepicker__navigation,
  .react-datepicker__header .react-datepicker__navigation {
    top: 30px !important;
    width: 32px !important;
    height: 32px !important;
    border-radius: 0 !important; /* 원형 제거 */
    background: transparent !important; /* 배경 제거 */
    transition: all 0.2s ease !important;
    border: none !important; /* 테두리 제거 */
    outline: none !important;
    position: absolute !important;
    z-index: 100 !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    cursor: pointer !important;
    box-shadow: none !important; /* 그림자 제거 */
    text-indent: -9999px !important; /* 텍스트 숨김 */
    overflow: hidden !important; /* 텍스트 완전 숨김 */
    font-size: 0 !important; /* 폰트 크기 0 */
    color: transparent !important; /* 색상 투명 */
    
    &:hover {
      background: rgba(53, 23, 69, 0.1) !important; /* 호버 시에만 약간의 배경 */
      border-radius: 50% !important; /* 호버 시에만 원형 */
      transform: scale(1.1) !important;
    }
  }

  .react-datepicker__navigation--previous,
  .react-datepicker__header .react-datepicker__navigation--previous {
    left: 20px !important; /* 더 안쪽으로 */
  }

  .react-datepicker__navigation--next,
  .react-datepicker__header .react-datepicker__navigation--next {
    right: 20px !important; /* 더 안쪽으로 */
  }

  /* 시간 컨테이너가 있을 때 달력 레이아웃 조정 */
  .react-datepicker__time-container {
    position: relative;
    z-index: 1;
  }
  
  /* 월 컨테이너 설정 */
  .react-datepicker__month-container {
    position: relative;
    z-index: 2;
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
  
  /* 화살표 색상 더 진하게 */
  .react-datepicker__navigation:hover .react-datepicker__navigation-icon::before {
    border-color: #2a1238 !important;
  }

  /* 시간 선택 컨테이너 - 안정화 */
  .react-datepicker__time-container {
    border-left: 1px solid #e0e0e0 !important;
    background: #fafafa !important;
    border-radius: 0 16px 16px 0 !important;
    width: 135px !important; /* 고정 너비 */
    min-width: 135px !important;
    max-width: 135px !important;
    position: relative !important;
    flex-shrink: 0 !important; /* 축소 방지 */
  }

  .react-datepicker__header--time {
    background: linear-gradient(135deg, #e8e0ee, #d4c7e8) !important;
    color: transparent !important; /* 글자 색상 투명 */
    font-weight: 700 !important;
    padding: 16px 12px !important; /* 상하 패딩 증가 */
    border-radius: 0 !important;
    height: 54px !important; /* 고정 높이 */
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    box-sizing: border-box !important;
    font-size: 0 !important; /* 폰트 크기 0 */
    text-indent: -9999px !important; /* 텍스트 숨김 */
    overflow: hidden !important; /* 텍스트 완전 숨김 */
  }

  .react-datepicker__time {
    background: #fafafa !important;
    padding: 8px !important;
    height: auto !important;
    overflow-y: auto !important;
  }

  .react-datepicker__time-box {
    width: 100% !important; /* 부모 컨테이너에 맞춤 */
    max-width: none !important;
  }

  /* 시간 리스트 - 스크롤 영역 확대 */
  .react-datepicker__time-list {
    height: 300px !important; /* 200px → 300px로 확대 */
    max-height: 300px !important;
    min-height: 300px !important;
    overflow-y: auto !important;
    padding: 4px 8px 4px 4px !important; /* 우측 패딩으로 스크롤바 공간 확보 */
    margin: 0 !important;
    box-sizing: border-box !important;
    
    /* 커스텀 스크롤바 */
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

export const StyledUploadSection = styled.div<StyledUploadSectionProps>`
  margin-top: 20px;
  margin-bottom: 20px;
  border-radius: 8px;
  background-color: rgba(255, 255, 255, 0.9);
  color: #333;
  padding: 20px;
  position: relative;
  min-height: 50px;
  transition: all 0.2s ease-in-out;
  border: 2px dashed
    ${({ $isDragging }) => ($isDragging ? "#00b4ba" : "transparent")};
  transform: ${({ $isDragging }) => ($isDragging ? "scale(1.02)" : "scale(1)")};

  h2 {
    color: #351745;
  }
`;

export const FileUploadWrapper = styled.div`
  position: absolute;
  bottom: 0px;
  left: 15px;
`;

export const RecordUploadWrapper = styled.div`
  position: absolute;
  bottom: 0px;
  right: 15px;
`;

export const DropZoneMessage = styled.div`
  color: #888;
  font-size: 0.95rem;
  text-align: center;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  pointer-events: none; /* 메시지가 드래그 이벤트를 방해하지 않도록 */
`;

export const FileInfoContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  padding: 12px 16px;
  margin-bottom: 1rem;
`;

export const FileInfo = styled.div`
  display: flex;
  align-items: center;
  flex: 1;
`;

export const FileLabel = styled.span`
  font-weight: 600;
  color: #351745;
  margin-right: 8px;
`;

export const FileName = styled.span`
  color: #351745;
  font-weight: 500;
`;

export const RemoveFileButton = styled.button`
  background: #dc3545;
  color: white;
  border: none;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 12px;
  font-weight: bold;
  transition: background-color 0.2s;

  &:hover {
    background: #c82333;
  }
`;

export const ContainerWrapper = styled.div`
  position: relative;
  margin-top: 60px; /* ProjectListTitle과 버튼 사이 간격 추가 */
`;

export const TabBtn = styled.button<{ active: boolean }>`
  flex: 1;
  height: 56px;
  background: ${({ active }) => (active ? "transparent" : "#e5e0ee")};
  color: ${({ active }) => (active ? "#fff" : "#351745")};
  border: none;
  font-size: 1.18rem;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
  margin-right: 2px;
  outline: none;
  letter-spacing: -0.5px;
  z-index: ${({ active }) => (active ? 1 : 2)};
  user-select: none; /* 텍스트 선택 비활성화 */
  -webkit-user-select: none; /* Safari */
  -moz-user-select: none; /* Firefox */
  -ms-user-select: none; /* IE/Edge */
  &:last-child {
    margin-right: 0;
  }
`;

export const StyledSelect = styled.select`
  padding: 6px 12px;
  margin-left: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: #fff;
  font-size: 0.9rem;
  color: #333;
  cursor: pointer;
  outline: none;
  transition: border-color 0.2s ease;

  &:hover {
    border-color: #888;
  }

  &:focus {
    border-color: #5a2a84;
  }
`;

export const TabSectionWrapper = styled.div`
  border-radius: 0;
  overflow: hidden;
  background: #351745;
  width: 100%;
  position: relative;
  z-index: 1;
`;

