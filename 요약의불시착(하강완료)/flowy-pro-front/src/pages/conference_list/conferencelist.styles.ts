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

export const Breadcrumb = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 32px;
  font-size: 1rem;
  color: #6b7280;
`;

export const BreadcrumbLink = styled.span`
  color: #2d1155;
  cursor: pointer;
  font-weight: 500;
  padding: 4px 8px;
  border-radius: 6px;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #f3f4f6;
  }
`;

export const BreadcrumbSeparator = styled.span`
  color: #9ca3af;
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
  
  &:first-child {
    width: 30%; // 회의명
    border-top-left-radius: 20px;
  }
  
  &:nth-child(2) {
    width: 25%; // 회의 일시
  }
  
  &:nth-child(3) {
    width: 30%; // 참석자
  }
  
  &:nth-child(4) {
    width: 15%; // 상태
    text-align: center;
    border-top-right-radius: 20px;
  }
  
  &.sortable {
    cursor: pointer;
    user-select: none;
    
    &:hover {
      background: rgba(45, 17, 85, 0.05);
      color: #1a0b3d;
    }
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
  
  &.meeting-title {
    font-weight: 600;
    color: #1f2937;
  }
  
  &.date {
    color: #6b7280;
    font-size: 0.875rem;
  }
  
  &.attendees {
    color: #6b7280;
  }
  
  &.status {
    text-align: center;
  }
`;

export const DateBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  color: #6b7280;
  font-size: 0.875rem;
`;

export const AttendeeList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  max-width: 300px;
`;

export const AttendeeChip = styled.span`
  background: #f3f4f6;
  color: #374151;
  padding: 4px 8px;
  border-radius: 8px;
  font-size: 0.75rem;
  font-weight: 500;
  border: 1px solid #e5e7eb;
  white-space: nowrap;
`;

export const AttendeeCount = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  color: #6b7280;
  font-size: 0.875rem;
  margin-bottom: 8px;
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

export const StatusBadge = styled.div<{ status: 'pending' | 'analyzing' | 'completed' }>`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  white-space: nowrap;
  
  ${props => {
    switch(props.status) {
      case 'completed':
        return `
          background: linear-gradient(135deg, #f3e8ff 0%, #e9d5ff 100%);
          color: #6b21a8;
          border: 1px solid #c084fc;
        `;
      case 'analyzing':
        return `
          background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
          color: #92400e;
          border: 1px solid #fbbf24;
        `;
      case 'pending':
        return `
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
          color: #64748b;
          border: 1px solid #cbd5e1;
        `;
      default:
        return '';
    }
  }}
  
  svg {
    font-size: 0.75rem;
  }
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
  }
`;
