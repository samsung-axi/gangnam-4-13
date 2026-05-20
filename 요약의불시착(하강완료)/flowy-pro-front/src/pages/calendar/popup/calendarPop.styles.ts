import styled, { keyframes } from "styled-components";

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
`;

const slideUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

export const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  animation: ${fadeIn} 0.2s ease-out;
`;

export const PopContainer = styled.div`
  background: white;
  border-radius: 20px;
  width: 720px;
  max-height: 80vh;
  min-height: 400px;
  padding: 0;
  box-shadow: 0 20px 40px rgba(45, 17, 85, 0.15);
  border: 1px solid rgba(45, 17, 85, 0.1);
  position: relative;
  overflow: hidden;
  animation: ${slideUp} 0.3s ease-out;
  font-family: 'Rethink Sans', sans-serif;
  display: flex;
  flex-direction: column;
`;

export const PopupHeader = styled.div`
  background: linear-gradient(135deg, #2d1155 0%, #1a0b3d 100%);
  color: white;
  padding: 24px 28px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  flex-shrink: 0;
`;

export const Title = styled.h2`
  font-size: 1.2rem;
  font-weight: 500;
  color: white;
  margin: 0;
  font-family: 'Rethink Sans', sans-serif;
`;

export const DateBadge = styled.div`
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 8px 16px;
  font-size: 0.85rem;
  font-weight: 500;
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

export const PopupBody = styled.div`
  padding: 28px;
  overflow-y: auto;
  flex: 1;
  min-height: 0;
  
  /* 스크롤바 스타일링 */
  &::-webkit-scrollbar {
    width: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: #f1f5f9;
    border-radius: 4px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 4px;
    transition: background 0.2s ease;
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: #94a3b8;
  }
`;

export const Section = styled.div`
  margin-bottom: 28px;

  &:last-child {
    margin-bottom: 0;
  }
`;

export const SectionContent = styled.div<{ isOpen: boolean }>`
  overflow: hidden;
  transition: all 0.3s ease;
  max-height: ${props => props.isOpen ? '2000px' : '0px'};
  opacity: ${props => props.isOpen ? 1 : 0};
  margin-top: ${props => props.isOpen ? '16px' : '0px'};
`;

export const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 16px;
  padding: 12px 16px;
  border-radius: 12px;
  background: #f8fafc;
  border: 1px solid #e5e7eb;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #f1f5f9;
    border-color: #d1d5db;
  }
`;

export const SectionHeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const ToggleIcon = styled.div<{ isOpen: boolean }>`
  width: 24px;
  height: 24px;
  border-radius: 6px;
  background: white;
  border: 1px solid #d1d5db;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 600;
  color: #6b7280;
  transition: all 0.2s ease;
  transform: ${props => props.isOpen ? 'rotate(180deg)' : 'rotate(0deg)'};

  &:hover {
    background: #f9fafb;
    border-color: #9ca3af;
  }
`;

export const SectionIcon = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: 600;
`;

export const MeetingIcon = styled.div`
  font-size: 1.1rem;
  font-weight: 600;
  color: #6b21a8;
`;

export const TodoIcon = styled.div`
  font-size: 1.1rem;
  font-weight: 600;
  color: #b45309;
`;

export const SectionTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 500;
  color: #1f2937;
  margin: 0;
  font-family: 'Rethink Sans', sans-serif;
`;

export const EmptyState = styled.div`
  text-align: center;
  padding: 24px;
  color: #9ca3af;
  font-size: 0.95rem;
  font-weight: 400;
  font-style: italic;
  background: #f8fafc;
  border-radius: 12px;
  border: 2px dashed #e5e7eb;
`;

export const MeetingBox = styled.div`
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  transition: all 0.2s ease;
  cursor: pointer;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
    border-color: #d1d5db;
  }

  &:last-child {
    margin-bottom: 0;
  }
`;

export const MeetingContent = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const MeetingTimeBox = styled.div`
  background: linear-gradient(135deg, #2d1155 0%, #1a0b3d 100%);
  color: white;
  border-radius: 8px;
  padding: 6px 12px;
  font-weight: 500;
  font-size: 0.85rem;
  min-width: 80px;
  text-align: center;
  box-shadow: 0 2px 8px rgba(45, 17, 85, 0.2);
`;

export const MeetingTitle = styled.div`
  font-weight: 500;
  color: #1f2937;
  font-size: 0.95rem;
  flex: 1;
`;

export const TodoBox = styled.div`
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  transition: all 0.2s ease;
  cursor: pointer;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
    border-color: #d1d5db;
  }

  &:last-child {
    margin-bottom: 0;
  }
`;

export const TodoContent = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
`;

export const LargeCheckbox = styled.input.attrs({ type: "checkbox" })`
  width: 20px;
  height: 20px;
  min-width: 20px;
  min-height: 20px;
  border-radius: 6px;
  cursor: pointer;
  accent-color: #6b7280;
  transition: all 0.2s ease;

  &:hover {
    transform: scale(1.1);
  }
`;

export const TodoText = styled.span<{ completed?: boolean }>`
  font-weight: 500;
  color: ${props => props.completed ? '#9ca3af' : '#1f2937'};
  font-size: 0.95rem;
  text-decoration: ${props => props.completed ? 'line-through' : 'none'};
  transition: all 0.2s ease;
  flex: 1;
`;

export const CloseBtn = styled.button`
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  cursor: pointer;
  font-size: 16px;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: scale(1.05);
  }
`;

export const PopupFloatingAddButton = styled.button`
  position: absolute;
  right: 28px;
  bottom: 28px;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: linear-gradient(135deg, #2d1155 0%, #1a0b3d 100%);
  color: white;
  font-size: 24px;
  border: none;
  box-shadow: 0 8px 24px rgba(45, 17, 85, 0.3);
  cursor: pointer;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  font-weight: 600;

  &:hover {
    transform: translateY(-2px) scale(1.05);
    box-shadow: 0 12px 32px rgba(45, 17, 85, 0.4);
    background: linear-gradient(135deg, #1a0b3d 0%, #0f0629 100%);
  }

  &:active {
    transform: translateY(0) scale(1);
  }
`;

export const PopupTooltip = styled.div`
  position: absolute;
  right: 96px;
  bottom: 42px;
  background: #1f2937;
  color: white;
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 400;
  white-space: nowrap;
  z-index: 20;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
  pointer-events: none;
  opacity: 0.95;
  font-family: 'Rethink Sans', sans-serif;

  &:before {
    content: '';
    position: absolute;
    right: -8px;
    top: 50%;
    transform: translateY(-50%);
    width: 0;
    height: 0;
    border-left: 8px solid #1f2937;
    border-top: 8px solid transparent;
    border-bottom: 8px solid transparent;
  }
`;
