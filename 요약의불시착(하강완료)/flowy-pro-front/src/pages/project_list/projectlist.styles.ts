import styled from "styled-components";

export const Container = styled.div`
  cursor: default;
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
  min-height: calc(100vh - 100px);
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
`;

export const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  color: #2d1155;
  margin: 0;
  background: linear-gradient(135deg, #2d1155 0%, #4b2067 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

export const AddButton = styled.button`
  background: linear-gradient(135deg, #2d1155 0%, #4b2067 100%);
  border: none;
  border-radius: 16px;
  padding: 12px 24px;
  color: white;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 16px rgba(45, 17, 85, 0.2);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(45, 17, 85, 0.3);
    background: linear-gradient(135deg, #351745 0%, #5d2b7a 100%);
  }

  &:active {
    transform: translateY(0);
  }
`;

export const ControlsSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  gap: 16px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

export const SectionTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: #2d1155;
  margin: 0;
`;

export const SearchContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  width: 320px;
  
  svg {
    position: absolute;
    left: 16px;
    z-index: 1;
    pointer-events: none;
  }
`;

export const SearchInput = styled.input`
  padding: 12px 16px 12px 44px;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  font-size: 1rem;
  color: #374151;
  background-color: #fff;
  width: 100%;
  transition: all 0.3s ease;

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

  @media (max-width: 768px) {
    min-width: 100%;
  }
`;

export const SortContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const SortLabel = styled.span`
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  white-space: nowrap;
`;

export const SortSelect = styled.select`
  padding: 8px 12px;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  background: white;
  font-size: 14px;
  color: #374151;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 160px;

  &:hover {
    border-color: #06b6d4;
  }

  &:focus {
    outline: none;
    border-color: #06b6d4;
    box-shadow: 0 0 0 3px rgba(6, 182, 212, 0.1);
  }

  option {
    padding: 8px 12px;
  }
`;

export const ControlsWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }
`;

export const ListWrapper = styled.div`
  background: white;
  border-radius: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid #f1f5f9;
  overflow: hidden;
  margin-bottom: 40px;
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

export const Thead = styled.thead`
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
`;

export const Th = styled.th`
  text-align: left;
  font-size: 1rem;
  color: #2d1155;
  font-weight: 600;
  padding: 20px 24px;
  border-bottom: 2px solid #e5e7eb;
  position: relative;
  transition: all 0.2s ease;
  
  &.sortable {
    cursor: pointer;
    user-select: none;
    
    &:hover {
      background: rgba(45, 17, 85, 0.05);
      color: #1a0b3d;
    }
  }
  
  &:first-child {
    border-top-left-radius: 20px;
  }
  
  &:last-child {
    border-top-right-radius: 20px;
    text-align: center;
  }
`;

export const SortableHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  width: 100%;
`;

export const SortIconContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  opacity: 0.4;
  transition: all 0.2s ease;
  
  &.active {
    opacity: 1;
    color: #2d1155;
  }
  
  &.inactive {
    opacity: 0.2;
  }
`;

export const SortIcon = styled.div`
  font-size: 10px;
  line-height: 1;
  margin: -1px 0;
  color: #9ca3af;
  
  &.active {
    color: #2d1155;
  }
`;

export const Tbody = styled.tbody``;

export const Tr = styled.tr`
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  border-bottom: 1px solid #f1f5f9;

  &:hover {
    background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
    transform: scale(1.01);
    box-shadow: 0 4px 20px rgba(45, 17, 85, 0.1);
  }

  &:last-child {
    border-bottom: none;
  }
`;

export const Td = styled.td`
  font-size: 1rem;
  color: #374151;
  padding: 20px 24px;
  vertical-align: middle;
  
  &.project-name {
    font-weight: 600;
    color: #1f2937;
  }
  
  &.date {
    color: #6b7280;
    font-size: 0.875rem;
  }
  
  &.actions {
    width: 80px;
    text-align: center;
  }
`;

export const ActionButtons = styled.div`
  display: flex;
  gap: 8px;
  justify-content: center;
`;

export const ActionButton = styled.button`
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 8px 12px;
  color: #64748b;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 4px;

  &:hover {
    background: #f1f5f9;
    border-color: #cbd5e1;
    color: #475569;
  }

  &.edit {
    &:hover {
      background: #f3eeff;
      border-color: #8b5cf6;
      color: #8b5cf6;
    }
  }

  &.delete {
    &:hover {
      background: #fef2f2;
      border-color: #ef4444;
      color: #ef4444;
    }
  }
`;

export const DateBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  color: #6b7280;
  font-size: 0.875rem;
`;

export const EmptyState = styled.div`
  text-align: center;
  padding: 80px 20px;
  color: #6b7280;
`;

export const EmptyIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 16px;
  opacity: 0.5;
`;

export const EmptyTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 8px;
`;

export const EmptyDescription = styled.p`
  font-size: 1rem;
  color: #6b7280;
  margin: 0;
`;

export const Pagination = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  margin-top: 40px;
`;

export const PageButton = styled.button<{ $active?: boolean }>`
  width: 40px;
  height: 40px;
  border-radius: 12px;
  border: 1px solid ${props => props.$active ? '#2d1155' : '#e5e7eb'};
  background: ${props => props.$active ? '#2d1155' : 'white'};
  color: ${props => props.$active ? 'white' : '#6b7280'};
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover:not(:disabled) {
    background: ${props => props.$active ? '#351745' : '#f9fafb'};
    border-color: ${props => props.$active ? '#351745' : '#d1d5db'};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const PageNavButton = styled.button`
  padding: 8px 16px;
  height: 40px;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  background: white;
  color: #6b7280;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    background: #f9fafb;
    border-color: #d1d5db;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;
