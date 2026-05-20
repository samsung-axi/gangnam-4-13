import styled from "styled-components";

// 컨테이너와 헤더
export const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  padding: 40px 24px;
  
  @media (max-width: 1440px) {
    padding: 40px 16px;
  }
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto 24px auto;
`;

export const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: #2d1155;
  margin: 0;
  background: linear-gradient(135deg, #2d1155 0%, #1a0b3d 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

export const ControlsSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1300px;
  margin: 0 auto 32px auto;
  flex-wrap: wrap;
  gap: 32px;
  min-height: 56px;
  padding: 8px 0;
  padding-right: 70px; /* 오른쪽 패널 크기만큼 패딩 추가 */
  
  @media (max-width: 1440px) {
    max-width: 1200px;
  }
  
  @media (max-width: 1200px) {
    max-width: 1000px;
  }
  
  @media (max-width: 1024px) {
    max-width: 900px;
  }
`;

export const SectionTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: #374151;
  margin: 0;
`;

// 검색 및 필터 영역
export const SearchContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  
  svg {
    position: absolute;
    left: 16px;
    z-index: 1;
    pointer-events: none;
    transition: color 0.2s ease;
  }
  
  &:focus-within svg {
    color: #2d1155 !important;
  }
`;

export const SearchInput = styled.input`
  padding: 12px 16px 12px 44px;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  font-size: 0.875rem;
  width: 50px;
  background: white;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  
  &:focus {
    outline: none;
    border-color: #2d1155;
    box-shadow: 0 0 0 3px rgba(45, 17, 85, 0.1);
    width: 200px;
  }
  
  &:not(:placeholder-shown) {
    width: 200px;
  }
  
  &::placeholder {
    color: #9ca3af;
    transition: opacity 0.2s ease;
  }
  
  &:focus::placeholder {
    opacity: 0.7;
  }
`;

export const FilterContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 24px;
  flex-wrap: wrap;
  margin-right: 90px; /* 프로젝트 필터 이동 */
`;

export const FilterCheckbox = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.875rem;
  color: #374151;
  cursor: pointer;
  white-space: nowrap;
  user-select: none;
  padding: 4px 8px;
  border-radius: 8px;
  transition: all 0.2s ease;
  
  input[type="checkbox"] {
    width: 16px;
    height: 16px;
    border: 2px solid #d1d5db;
    border-radius: 4px;
    background: white;
    cursor: pointer;
    position: relative;
    margin: 0;
    transition: all 0.2s ease;
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    
    &:checked {
      background: #2d1155 !important;
      border-color: #2d1155 !important;
    }
    
    &:checked::after {
      content: '✓';
      position: absolute;
      top: -2px;
      left: 2px;
      font-size: 12px;
      color: white;
      font-weight: bold;
    }
    
    &:hover {
      border-color: #9ca3af;
    }
    
    &:checked:hover {
      background: #1a0b3d !important;
      border-color: #1a0b3d !important;
    }
  }
  
  &:hover {
    color: #1f2937;
    background: rgba(45, 17, 85, 0.05);
  }
`;

export const FilterSelect = styled.select`
  padding: 10px 30px 10px 16px;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  font-size: 0.875rem;
  background: white;
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="%232d1155" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg>');
  background-repeat: no-repeat;
  background-position: right 8px center;
  background-size: 16px;
  color: #374151;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 192px;
  max-width: 240px;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  
  &:focus {
    outline: none;
    border-color: #2d1155;
    box-shadow: 0 0 0 3px rgba(45, 17, 85, 0.1);
    background: white;
  }
  
  &:hover {
    border-color: #9ca3af;
    background: white;
  }
`;

// 캘린더 컨테이너
export const CalendarWrapper = styled.div`
  max-width: 100%;
  width: 100%;
  margin: 0 auto;
  background: white;
  border-radius: 20px;
  box-shadow: 0 4px 24px rgba(45, 17, 85, 0.08);
  padding: 32px;
  position: relative;

  .react-calendar {
    width: 100% !important;
    min-width: 700px;
    max-width: 850px;
    font-size: 1.1rem;
    border: none;
    background: #fff;
    
    @media (max-width: 1440px) {
      min-width: 600px;
      max-width: 750px;
    }
    
    @media (max-width: 1200px) {
      min-width: 500px;
      max-width: 650px;
    }
  }
  
  .react-calendar__navigation {
    display: none;
  }
  
  .react-calendar__month-view__days {
    display: grid !important;
    grid-template-rows: repeat(6, 1fr);
    grid-template-columns: repeat(7, 1fr);
    min-height: 600px;
    height: 600px;
    gap: 1px;
    background: #f1f5f9;
    border-radius: 12px;
    overflow: hidden;
  }
  
  .react-calendar__tile {
    width: 100% !important;
    vertical-align: top;
    white-space: normal;
    word-break: keep-all;
    padding: 0;
    text-align: left;
    background: white;
    border: none;
    position: relative;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    cursor: pointer;
    overflow: hidden;
    min-height: 100px;
  }
  
  .react-calendar__tile:hover {
    background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%) !important;
    transform: scale(1.02);
    box-shadow: 0 4px 20px rgba(45, 17, 85, 0.1);
    z-index: 2;
  }
  
  .react-calendar__tile:active {
    transform: scale(0.98);
  }
  
  .react-calendar__tile abbr {
    display: none !important;
  }

  .react-calendar__month-view__days__day--neighboringMonth {
    color: #bbb !important;
    background: #f8fafc !important;
    opacity: 0.5;
  }

  .calendar-event,
  .calendar-todo {
    font-size: 0.75rem;
    margin-top: 4px;
  }
  
  .calendar-event {
    background: linear-gradient(135deg, #f3e8ff 0%, #e9d5ff 100%);
    color: #6b21a8;
    border: 1px solid #c084fc;
    border-radius: 6px;
    font-weight: 600;
    padding: 4px 8px;
    margin-bottom: 4px;
    display: inline-block;
    font-size: 0.75rem;
    box-shadow: 0 2px 8px rgba(45, 17, 85, 0.08);
    transition: all 0.2s ease;
    
    &:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(45, 17, 85, 0.15);
    }
  }
  
  .calendar-todo {
    display: flex;
    align-items: center;
    gap: 4px;
    margin-bottom: 2px;
    font-weight: 600;
    color: #374151;
    padding: 2px 4px;
    border-radius: 4px;
    transition: all 0.2s ease;
    
    &:hover {
      background: rgba(45, 17, 85, 0.05);
    }
  }
  
  .react-calendar__month-view__weekdays {
    font-weight: 700;
    font-size: 0.875rem;
    background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
    border-radius: 12px 12px 0 0;
  }
  
  .react-calendar__month-view__weekdays__weekday {
    color: #2d1155;
    padding: 16px 0;
    border: none;
    background: transparent;
    text-align: center;
  }
  
  .react-calendar__month-view__weekdays__weekday,
  .react-calendar__month-view__weekdays__weekday *,
  .react-calendar__month-view__weekdays__weekday::after,
  .react-calendar__month-view__weekdays__weekday::before {
    text-decoration: none !important;
    content: none !important;
  }
  
  .react-calendar__month-view__weekdays__weekday:first-child {
    color: #dc2626 !important; /* 일요일 - 빨간색 */
  }
  
  .react-calendar__month-view__weekdays__weekday:last-child {
    color: #2563eb !important; /* 토요일 - 파란색 */
  }
  
  .react-calendar__month-view__weekdays__weekday:nth-child(2),
  .react-calendar__month-view__weekdays__weekday:nth-child(3),
  .react-calendar__month-view__weekdays__weekday:nth-child(4),
  .react-calendar__month-view__weekdays__weekday:nth-child(5),
  .react-calendar__month-view__weekdays__weekday:nth-child(6) {
    color: #2d1155 !important; /* 평일 - 기본 색상 */
  }
  
  .react-calendar__tile--now {
    background: linear-gradient(135deg, #f3e8ff 0%, #e9d5ff 100%) !important;
    border-radius: 8px;
    font-weight: 700;
  }
  
  .react-calendar__tile--active {
    background: white !important;
  }

  .calendar-sunday {
    color: #dc2626 !important;
  }
  
  .calendar-saturday {
    color: #2563eb !important;
  }
  
  .calendar-weekday {
    color: #374151 !important;
  }
  
  .calendar-other-month {
    color: #9ca3af !important;
  }
`;

// 네비게이션
export const MonthNav = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 24px;
`;

export const NavButton = styled.button`
  border: 2px solid #e5e7eb;
  background: white;
  color: #2d1155;
  border-radius: 12px;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 600;

  &:hover {
    background: #f3e8ff;
    border-color: #2d1155;
    transform: scale(1.05);
    box-shadow: 0 4px 12px rgba(45, 17, 85, 0.15);
  }

  &:active {
    transform: scale(0.95);
  }
`;

export const MonthText = styled.span`
  font-size: 1.5rem;
  font-weight: 700;
  color: #2d1155;
  min-width: 140px;
  text-align: center;
  user-select: none;
  cursor: pointer;
  padding: 8px 16px;
  border-radius: 12px;
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(45, 17, 85, 0.05);
  }
`;

export const TodayButton = styled.button`
  background: linear-gradient(135deg, #2d1155 0%, #1a0b3d 100%);
  color: white;
  border: none;
  border-radius: 12px;
  padding: 10px 20px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 8px rgba(45, 17, 85, 0.2);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 16px rgba(45, 17, 85, 0.3);
  }

  &:active {
    transform: translateY(0);
  }
`;

// 레이아웃
export const CalendarLayout = styled.div`
  display: flex;
  gap: 40px;
  max-width: 1300px;
  margin: 0 auto;
  position: relative;
  align-items: flex-start;
  justify-content: center;
  
  @media (max-width: 1440px) {
    gap: 32px;
    max-width: 1200px;
  }
  
  @media (max-width: 1200px) {
    gap: 24px;
    max-width: 1000px;
  }
  
  @media (max-width: 1024px) {
    gap: 16px;
    max-width: 900px;
  }
`;

export const CalendarFixedBox = styled.div`
  flex: 1;
  min-width: 0;
  max-width: 850px;
  
  @media (max-width: 1440px) {
    max-width: 750px;
  }
  
  @media (max-width: 1200px) {
    max-width: 650px;
  }
`;

// 우측 패널 (일정 미정 task)
export const UnscheduledPanel = styled.div<{ $open: boolean }>`
  width: ${props => props.$open ? '350px' : '60px'};
  min-width: ${props => props.$open ? '360px' : '60px'};
  background: white;
  border-radius: 20px;
  box-shadow: 0 4px 24px rgba(45, 17, 85, 0.08);
  padding: ${props => props.$open ? '24px' : '0'};
  margin-left: 10px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  height: ${props => props.$open ? 'fit-content' : '60px'};
  position: sticky;
  top: 40px;
  overflow: hidden;
  flex-shrink: 0;
  z-index: 10;
  display: ${props => props.$open ? 'block' : 'flex'};
  justify-content: ${props => props.$open ? 'initial' : 'center'};
  align-items: ${props => props.$open ? 'initial' : 'center'};
`;

export const TaskList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-height: 400px;
  overflow-y: auto;
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: #f1f5f9;
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 3px;
    
    &:hover {
      background: #94a3b8;
    }
  }
`;

export const TaskItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px;
  border-radius: 12px;
  background: #f8fafc;
  border: 1px solid #e5e7eb;
  transition: all 0.2s ease;
  cursor: pointer;

  &:hover {
    background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
    border-color: #2d1155;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(45, 17, 85, 0.1);
  }
`;

export const TaskCheckbox = styled.input.attrs({ type: 'checkbox' })`
  width: 16px;
  height: 16px;
  border: 2px solid #d1d5db;
  border-radius: 4px;
  background: white;
  cursor: pointer;
  position: relative;
  margin: 0;
  transition: all 0.2s ease;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  
  &:checked {
    background: #2d1155;
    border-color: #2d1155;
  }
  
  &:checked::after {
    content: '✓';
    position: absolute;
    top: -2px;
    left: 2px;
    font-size: 12px;
    color: white;
    font-weight: bold;
  }
`;

export const TaskTitle = styled.span<{ completed: boolean }>`
  flex: 1;
  font-size: 0.875rem;
  font-weight: 500;
  color: ${props => props.completed ? '#9ca3af' : '#1f2937'};
  text-decoration: ${props => props.completed ? 'line-through' : 'none'};
  line-height: 1.4;
`;

// 플로팅 버튼
export const FloatingAddButton = styled.button`
  position: fixed;
  right: 32px;
  bottom: 32px;
  width: 68px;
  height: 68px;
  border-radius: 50%;
  background: linear-gradient(135deg, #2d1155 0%, #1a0b3d 100%);
  color: white;
  font-size: 1.75rem;
  border: none;
  box-shadow: 
    0 8px 32px rgba(45, 17, 85, 0.25),
    0 4px 16px rgba(45, 17, 85, 0.15),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  cursor: pointer;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-weight: 400;
  backdrop-filter: blur(10px);
  
  &::before {
    content: '';
    position: absolute;
    top: -2px;
    left: -2px;
    right: -2px;
    bottom: -2px;
    border-radius: 50%;
    background: linear-gradient(135deg, #8b5cf6 0%, #2d1155 50%, #1a0b3d 100%);
    z-index: -1;
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  &:hover {
    transform: translateY(-6px) scale(1.08);
    box-shadow: 
      0 16px 48px rgba(45, 17, 85, 0.35),
      0 8px 24px rgba(45, 17, 85, 0.25),
      inset 0 1px 0 rgba(255, 255, 255, 0.2);
    
    &::before {
      opacity: 1;
    }
  }
  
  &:active {
    transform: translateY(-3px) scale(1.05);
    transition: all 0.1s cubic-bezier(0.4, 0, 0.2, 1);
  }
  
  &:focus {
    outline: none;
    box-shadow: 
      0 8px 32px rgba(45, 17, 85, 0.25),
      0 4px 16px rgba(45, 17, 85, 0.15),
      0 0 0 4px rgba(139, 92, 246, 0.3);
  }
`;

export const Tooltip = styled.div`
  position: fixed;
  right: 116px;
  bottom: 58px;
  background: linear-gradient(135deg, #2d1155 0%, #1a0b3d 100%);
  color: white;
  padding: 10px 16px;
  border-radius: 12px;
  font-size: 0.875rem;
  font-weight: 500;
  white-space: nowrap;
  z-index: 1001;
  box-shadow: 
    0 8px 24px rgba(45, 17, 85, 0.3),
    0 4px 12px rgba(45, 17, 85, 0.2);
  pointer-events: none;
  opacity: 0.95;
  animation: tooltipFadeIn 0.2s ease-out;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  
  &::after {
    content: '';
    position: absolute;
    top: 50%;
    right: -10px;
    transform: translateY(-50%);
    width: 0;
    height: 0;
    border-left: 10px solid #1a0b3d;
    border-top: 10px solid transparent;
    border-bottom: 10px solid transparent;
  }
  
  @keyframes tooltipFadeIn {
    from {
      opacity: 0;
      transform: translateX(-8px);
    }
    to {
      opacity: 0.95;
      transform: translateX(0);
    }
  }
`;

// 빈 상태
export const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: #6b7280;
`;

export const EmptyIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 16px;
  opacity: 0.6;
`;

export const EmptyTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 8px;
`;

export const EmptyDescription = styled.p`
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0;
  line-height: 1.5;
`;

// 기존 스타일 (호환성 유지)
export const HeaderBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 32px;
  flex-wrap: wrap;
`;

export const RightBox = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

export const FilterArea = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const FilterSelectBox = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const ApplyButton = styled.button`
  background: linear-gradient(135deg, #2d1155 0%, #1a0b3d 100%);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 8px 16px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(45, 17, 85, 0.2);
  }
`;

export const CalendarCheckbox = styled.input.attrs({ type: "checkbox" })`
  cursor: pointer;
  accent-color: #351745;
`;
