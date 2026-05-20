import React, { useState, useEffect, useMemo } from 'react';
import { FiChevronUp, FiChevronDown, FiSearch, FiX, FiEdit } from 'react-icons/fi';
import styled from 'styled-components';
import NewCompany from './popup/newCompany';
import EditCompany from './popup/editCompany';
import { useNavigate } from 'react-router-dom';
import { fetchUsersByCompany } from '../../../api/fetchSignupInfos';

const Container = styled.div`
  min-height: 100vh;
  background: #f8fafc;
  padding: 40px 20px;
`;

const MainContent = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
  position: relative;
`;

const PageHeader = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-bottom: 32px;

  h1 {
    font-size: 2.5rem;
    font-weight: 700;
    color: #2d1155;
    margin: 0;
    background: linear-gradient(135deg, #2d1155 0%, #4b2067 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
`;

const AddButton = styled.button`
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: linear-gradient(135deg, #351745 0%, #4a1168 100%);
  color: #fff;
  border: none;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 16px rgba(53, 23, 69, 0.2);
  font-weight: 600;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(53, 23, 69, 0.3);
    background: linear-gradient(135deg, #4b2067 0%, #5d2b7a 100%);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const FilterContainer = styled.div`
  background: white;
  padding: 24px 32px;
  border-radius: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid #f1f5f9;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  gap: 12px;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
    gap: 16px;
  }
`;

const SearchContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  gap: 12px;
  
  @media (max-width: 768px) {
    width: 100%;
  }
`;

const SearchIconButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 12px;
  border: 2px solid #e5e7eb;
  background: white;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #f9fafb;
    border-color: #2d1155;
    color: #2d1155;
  }

  &.active {
    background: linear-gradient(135deg, #2d1155 0%, #4b2067 100%);
    border-color: #2d1155;
    color: white;
  }
`;

const SearchInput = styled.input<{ $isExpanded: boolean }>`
  position: absolute;
  right: 0;
  top: 0;
  height: 40px;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  font-size: 14px;
  padding: 0 16px 0 48px;
  background: white;
  color: #374151;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  width: ${props => props.$isExpanded ? '280px' : '40px'};
  opacity: ${props => props.$isExpanded ? '1' : '0'};
  pointer-events: ${props => props.$isExpanded ? 'auto' : 'none'};

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
    width: ${props => props.$isExpanded ? '100%' : '40px'};
    position: ${props => props.$isExpanded ? 'relative' : 'absolute'};
  }
`;

const ClearButton = styled.button`
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border: none;
  background: none;
  color: #6b7280;
  cursor: pointer;
  border-radius: 50%;
  transition: all 0.2s ease;

  &:hover {
    background: #f3f4f6;
    color: #374151;
  }
`;

const TableContainer = styled.div`
  background: white;
  border-radius: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid #f1f5f9;
  overflow: hidden;
  margin-bottom: 30px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: transparent;
  font-size: 1.05rem;

  th,
  td {
    padding: 20px 16px;
    text-align: left;
    border-bottom: 1px solid #ececec;
    font-size: 1.05rem;
    color: #222;
    font-weight: 400;
  }

  th {
    background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
    color: #351745;
    font-weight: 600;
    border-bottom: 2px solid #e5e7eb;
    font-size: 1.08rem;
    letter-spacing: -0.5px;
  }

  tbody tr {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    cursor: pointer;
    border-bottom: 1px solid #f1f5f9;
    
    &:hover {
      background: linear-gradient(135deg, #fefbff 0%, #f8f5ff 100%);
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(53, 23, 69, 0.08);
    }
    
    &:last-child {
      border-bottom: none;
    }
    
    /* 선택된 상태 */
    &.selected {
      background: linear-gradient(135deg, #f0ebf8 0%, #e5e0ee 100%);
      border-left: 4px solid #4b2067;
    }
    
    &.selected:hover {
      background: linear-gradient(135deg, #e5e0ee 0%, #d4c7e8 100%);
    }
  }
`;

const SortableHeader = styled.th`
  text-align: left;
  font-size: 1rem;
  color: #2d1155;
  font-weight: 600;
  padding: 20px 24px;
  border-bottom: 2px solid #e5e7eb;
  position: relative;
  transition: all 0.2s ease;
  cursor: pointer;
  user-select: none;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);

  &:hover {
    background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
  }
`;

const SortIconContainer = styled.span`
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  margin-left: 8px;
  opacity: 0.4;
  transition: all 0.2s ease;
  vertical-align: middle;
  
  &.active {
    opacity: 1;
    color: #2d1155;
  }
  
  &.inactive {
    opacity: 0.2;
  }
`;

const NewSortIcon = styled.span`
  font-size: 10px;
  line-height: 1;
  margin: -1px 0;
  color: #9ca3af;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  
  &.active {
    color: #2d1155;
  }
`;

const StatusBadge = styled.div<{ $status: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: 12px;
  font-size: 13px;
  font-weight: 600;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  min-width: 80px;
  justify-content: center;

  ${(props) => {
    if (props.$status) {
      return `
        background: rgba(34, 197, 94, 0.1);
        color: #059669;
        border: 1px solid rgba(34, 197, 94, 0.2);
        
        &:hover {
          transform: translateY(-1px);
          background: rgba(34, 197, 94, 0.15);
          border-color: rgba(34, 197, 94, 0.3);
          box-shadow: 0 4px 12px rgba(34, 197, 94, 0.15);
        }
      `;
    } else {
      return `
        background: rgba(239, 68, 68, 0.1);
        color: #dc2626;
        border: 1px solid rgba(239, 68, 68, 0.2);
        
        &:hover {
          transform: translateY(-1px);
          background: rgba(239, 68, 68, 0.15);
          border-color: rgba(239, 68, 68, 0.3);
          box-shadow: 0 4px 12px rgba(239, 68, 68, 0.15);
        }
      `;
    }
  }}

  &::before {
    content: '';
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: ${(props) => (props.$status ? '#059669' : '#dc2626')};
  }

  &:active {
    transform: translateY(0);
  }
`;

const IconButton = styled.button<{ variant?: 'edit' }>`
  width: 36px;
  height: 36px;
  border-radius: 8px;
  border: 1px solid rgba(53, 23, 69, 0.2);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  
  ${props => props.variant === 'edit' ? `
    background: rgba(255, 255, 255, 0.95);
    color: #2d1155;
    
    &:hover {
      background: linear-gradient(135deg, #fefbff 0%, #f8f5ff 100%);
      color: #4b2067;
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(45, 17, 85, 0.3);
      border-color: rgba(45, 17, 85, 0.4);
    }
  ` : `
    background: #f3f4f6;
    color: #6b7280;
    
    &:hover {
      background: #e5e7eb;
      color: #374151;
      transform: translateY(-1px);
    }
  `}
  
  &:active {
    transform: translateY(0);
  }
`;

// 페이지네이션 스타일
const Pagination = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  margin-top: 40px;
`;

const PageButton = styled.button<{ $active?: boolean }>`
  width: 40px;
  height: 40px;
  border-radius: 12px;
  border: 1px solid ${props => props.$active ? '#2d1155' : '#e5e7eb'};
  background: ${props => props.$active ? 'linear-gradient(135deg, #2d1155 0%, #4b2067 100%)' : 'white'};
  color: ${props => props.$active ? 'white' : '#6b7280'};
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover:not(:disabled) {
    background: ${props => props.$active ? 'linear-gradient(135deg, #351745 0%, #4a1168 100%)' : '#f9fafb'};
    border-color: ${props => props.$active ? '#351745' : '#d1d5db'};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const PageNavButton = styled.button`
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

const Modal = styled.div<{ $isOpen: boolean }>`
  display: ${(props) => (props.$isOpen ? 'flex' : 'none')};
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

interface Company {
  company_id: string;
  company_name: string;
  company_scale: string;
  service_startdate: string;
  service_enddate: string;
  service_status: boolean;
}

type SortDirection = "asc" | "desc" | null;

interface SortState {
  field: string;
  direction: SortDirection;
}

const toDateInputValue = (dateString: string) => {
  if (!dateString) return '';
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) return dateString;
  return dateString.split('T')[0];
};

// 날짜를 표시용으로 포맷하는 함수 (YYYY.MM.DD 형식)
const formatDisplayDate = (dateString: string) => {
  if (!dateString) return '';
  
  let date: Date;
  
  if (dateString.includes('T')) {
    // ISO 8601 형식
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
    return dateString; // 원본 문자열 반환
  }
  
  // YYYY.MM.DD 형식으로 변환
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  
  return `${year}.${month}.${day}`;
};

const AdminCompany: React.FC = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(null);
  const [sortState, setSortState] = useState<SortState>({
    field: '',
    direction: null,
  });
  
  // 페이지네이션 상태
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  // 검색 상태
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    company_name: '',
    company_scale: '',
    service_startdate: '',
    service_enddate: '',
    service_status: true,
  });

  const fetchCompanies = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/admin/companies/`,
        {
          credentials: 'include',
        }
      );
      if (!response.ok) {
        let errorMsg = '회사 목록 조회에 실패했습니다.';
        try {
          const errorData = await response.json();
          if (errorData.detail) errorMsg = errorData.detail;
        } catch {}
        alert(errorMsg);
        navigate('/');
        throw new Error(errorMsg);
      }
      const data = await response.json();
      setCompanies(data);
    } catch (error) {
      console.error('회사 목록 조회 실패:', error);
      navigate('/');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/admin/companies/`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify(formData),
        }
      );
      if (!response.ok) {
        let errorMsg = '회사 생성에 실패했습니다.';
        try {
          const errorData = await response.json();
          if (errorData.detail) errorMsg = errorData.detail;
        } catch {}
        alert(errorMsg);
        throw new Error(errorMsg);
      }
      if (response.ok) {
        fetchCompanies();
        setFormData({
          company_name: '',
          company_scale: '',
          service_startdate: '',
          service_enddate: '',
          service_status: true,
        });
      }
    } catch (error) {
      console.error('회사 생성 실패:', error);
      alert('회사 생성 중 오류가 발생했습니다.');
    }
  };

  const handleUpdate = async (companyId: string) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/admin/companies/${companyId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify(formData),
        }
      );
      if (response.ok) {
        fetchCompanies();
        setSelectedCompanyId(null);
      }
    } catch (error) {
      console.error('회사 수정 실패:', error);
    }
  };

  const handleStatusToggle = async (
    companyId: string,
    currentStatus: boolean
  ) => {
    const newStatus = !currentStatus;
    const statusText = newStatus ? "활성화" : "비활성화";
    
    if (window.confirm(`정말로 이 회사를 ${statusText}하시겠습니까?`)) {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/v1/admin/companies/${companyId}/status`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({ service_status: newStatus }),
          }
        );
        if (response.ok) {
          fetchCompanies();
        }
      } catch (error) {
        console.error("회사 상태 변경 실패:", error);
      }
    }
  };

  const handleRowClick = async (company: Company) => {
    setSelectedCompanyId(company.company_id);
    setFormData({
      company_name: company.company_name,
      company_scale: company.company_scale,
      service_startdate: toDateInputValue(company.service_startdate),
      service_enddate: toDateInputValue(company.service_enddate),
      service_status: company.service_status,
    });
    
    try {
      const response = await fetchUsersByCompany(company.company_id);
      console.log('사용자 데이터:', response);
    } catch (error) {
      console.error('사용자 데이터 가져오기 실패:', error);
    }
    
    setIsEditModalOpen(true);
  };

  const handleCreateClick = () => {
    setFormData({
      company_name: '',
      company_scale: '',
      service_startdate: '',
      service_enddate: '',
      service_status: true,
    });
    setIsCreateModalOpen(true);
  };

  const handleSort = (field: string) => {
    setSortState((prev) => ({
      field,
      direction:
        prev.field === field
          ? prev.direction === 'asc'
            ? 'desc'
            : prev.direction === 'desc'
            ? null
            : 'asc'
          : 'asc',
    }));
  };

  // 필터링된 회사 목록 계산
  const filteredCompanies = useMemo(() => {
    let filtered = [...companies];
    
    // 검색 필터링
    if (searchTerm.trim()) {
      filtered = filtered.filter((company) =>
        company.company_name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // 정렬
    if (sortState.direction !== null) {
      filtered.sort((a, b) => {
        const aValue = a[sortState.field as keyof Company] || '';
        const bValue = b[sortState.field as keyof Company] || '';
        
        if (typeof aValue === 'boolean' && typeof bValue === 'boolean') {
          return sortState.direction === 'asc'
            ? (aValue ? 1 : 0) - (bValue ? 1 : 0)
            : (bValue ? 1 : 0) - (aValue ? 1 : 0);
        }
        
        return sortState.direction === 'asc'
          ? String(aValue).localeCompare(String(bValue))
          : String(bValue).localeCompare(String(aValue));
      });
    }
    
    return filtered;
  }, [companies, searchTerm, sortState]);

  // 페이지네이션된 회사 목록 계산
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCompanies = filteredCompanies.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredCompanies.length / itemsPerPage);

  // 페이지네이션 관련
  const pageGroupSize = 5;
  const pageGroup = Math.floor((currentPage - 1) / pageGroupSize);
  const startPage = pageGroup * pageGroupSize + 1;
  const endPage = Math.min(startPage + pageGroupSize - 1, totalPages);
  const pageNumbers = [];
  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  // 검색어가 변경되면 첫 페이지로 이동
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, sortState]);

  useEffect(() => {
    fetchCompanies();
  }, []);

  // 정렬 아이콘 렌더링 함수
  const renderSortIcons = (field: string) => {
    return (
      <SortIconContainer 
        className={sortState.field === field ? 'active' : ''}
      >
        <NewSortIcon className={sortState.field === field && sortState.direction === 'asc' ? 'active' : ''}>
          <FiChevronUp />
        </NewSortIcon>
        <NewSortIcon className={sortState.field === field && sortState.direction === 'desc' ? 'active' : ''}>
          <FiChevronDown />
        </NewSortIcon>
      </SortIconContainer>
    );
  };

  // 검색 핸들러 함수들
  const handleSearchToggle = () => {
    setIsSearchExpanded(!isSearchExpanded);
    if (isSearchExpanded && searchTerm) {
      setSearchTerm('');
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchClear = () => {
    setSearchTerm('');
  };

  const handleSearchBlur = () => {
    // 검색어가 없으면 검색창을 축소
    if (!searchTerm.trim()) {
      setIsSearchExpanded(false);
    }
  };

  const handleSearchFocus = () => {
    // 포커스시 검색창 확장
    setIsSearchExpanded(true);
  };

  return (
    <Container>
      <MainContent>
        <PageHeader>
          <h1>회사 관리</h1>
        </PageHeader>

        <FilterContainer>
          <div></div> {/* 빈 공간 */}
          
          <SearchContainer>
            <SearchIconButton 
              onClick={handleSearchToggle}
              className={isSearchExpanded ? 'active' : ''}
            >
              <FiSearch />
            </SearchIconButton>
            <SearchInput
              $isExpanded={isSearchExpanded}
              type="text"
              placeholder="회사명으로 검색..."
              value={searchTerm}
              onChange={handleSearchChange}
              onBlur={handleSearchBlur}
              onFocus={handleSearchFocus}
              autoFocus={isSearchExpanded}
            />
            {searchTerm && (
              <ClearButton onClick={handleSearchClear}>
                <FiX />
              </ClearButton>
            )}
            <AddButton onClick={handleCreateClick} title="회사 추가">
              +
            </AddButton>
          </SearchContainer>
        </FilterContainer>

        <TableContainer>
          <Table>
            <thead>
              <tr>
                <SortableHeader onClick={() => handleSort('company_id')}>
                  회사 ID
                  {renderSortIcons('company_id')}
                </SortableHeader>
                <SortableHeader onClick={() => handleSort('company_name')}>
                  회사명
                  {renderSortIcons('company_name')}
                </SortableHeader>
                <SortableHeader onClick={() => handleSort('company_scale')}>
                  규모
                  {renderSortIcons('company_scale')}
                </SortableHeader>
                <SortableHeader onClick={() => handleSort('service_startdate')}>
                  서비스 시작일
                  {renderSortIcons('service_startdate')}
                </SortableHeader>
                <SortableHeader onClick={() => handleSort('service_enddate')}>
                  서비스 종료일
                  {renderSortIcons('service_enddate')}
                </SortableHeader>
                <SortableHeader onClick={() => handleSort('service_status')}>
                  서비스 상태
                  {renderSortIcons('service_status')}
                </SortableHeader>
                <th>작업</th>
              </tr>
            </thead>
            <tbody>
              {currentCompanies.map((company) => (
                <tr
                  key={company.company_id}
                  onClick={() => handleRowClick(company)}
                  style={{ cursor: 'pointer' }}
                >
                  <td>{company.company_id}</td>
                  <td>{company.company_name}</td>
                  <td>{company.company_scale}</td>
                  <td>{formatDisplayDate(company.service_startdate)}</td>
                  <td>{formatDisplayDate(company.service_enddate)}</td>
                  <td onClick={(e) => e.stopPropagation()}>
                    <StatusBadge
                      $status={company.service_status}
                      onClick={() => handleStatusToggle(company.company_id, company.service_status)}
                    >
                      {company.service_status ? '활성' : '비활성'}
                    </StatusBadge>
                  </td>
                  <td onClick={(e) => e.stopPropagation()}>
                    <IconButton
                      variant="edit"
                      onClick={() => handleRowClick(company)}
                      title="회사 수정"
                    >
                      <FiEdit />
                    </IconButton>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </TableContainer>

        {/* 페이지네이션 */}
        {totalPages > 1 && (
          <Pagination>
            <PageNavButton 
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              이전
            </PageNavButton>
            
            {pageNumbers.map((number) => (
              <PageButton 
                key={number}
                $active={currentPage === number}
                onClick={() => setCurrentPage(number)}
              >
                {number}
              </PageButton>
            ))}
            
            <PageNavButton 
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              다음
            </PageNavButton>
          </Pagination>
        )}

        {/* 생성 모달 */}
        <Modal $isOpen={isCreateModalOpen}>
          <NewCompany
            visible={isCreateModalOpen}
            onSubmit={handleSubmit}
            onClose={() => setIsCreateModalOpen(false)}
            formData={formData}
            onChange={handleInputChange}
          />
        </Modal>

        {/* 수정 모달 */}
        <Modal $isOpen={isEditModalOpen}>
          <EditCompany
            visible={isEditModalOpen}
            onSubmit={() => {
              if (selectedCompanyId) handleUpdate(selectedCompanyId);
              setIsEditModalOpen(false);
            }}
            onClose={() => setIsEditModalOpen(false)}
            formData={formData}
            onChange={handleInputChange}
            companyId={selectedCompanyId || ''}
          />
        </Modal>
      </MainContent>
    </Container>
  );
};

export default AdminCompany;
