import React, { useState, useEffect, useMemo } from 'react';
import { FiChevronUp, FiChevronDown, FiSearch, FiX } from 'react-icons/fi';
import styled from 'styled-components';
import EditUsers from './popup/editusers';
import ManageUsers from './popup/manageusers';
import { useNavigate } from 'react-router-dom';

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
  justify-content: space-between;
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

const TableContainer = styled.div`
  background: white;
  border-radius: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid #f1f5f9;
  overflow: hidden;
  margin-bottom: 30px;
`;

const UserTable = styled.table`
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

// status 드롭다운바
const StatusBadge = styled.div<{ $status: string }>`
  position: relative;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 600;
  transition: all 0.2s ease;

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  }

  ${(props) => {
    switch (props.$status) {
      case 'Approved':
        return `
                    background-color: rgba(34, 197, 94, 0.1);
                    color: #16a34a;
                    border: 1px solid rgba(34, 197, 94, 0.2);
                `;
      case 'Pending':
        return `
                    background-color: rgba(234, 179, 8, 0.1);
                    color: #b45309;
                    border: 1px solid rgba(234, 179, 8, 0.2);
                `;
      case 'Rejected':
        return `
                    background-color: rgba(239, 68, 68, 0.1);
                    color: #dc2626;
                    border: 1px solid rgba(239, 68, 68, 0.2);
                `;
      default:
        return `
                    background-color: rgba(148, 163, 184, 0.1);
                    color: #64748b;
                    border: 1px solid rgba(148, 163, 184, 0.2);
                `;
    }
  }}

  &::before {
    content: '';
    width: 8px;
    height: 8px;
    border-radius: 50%;

    ${(props) => {
      switch (props.$status) {
        case 'Approved':
          return `background-color: #16a34a;`;
        case 'Pending':
          return `background-color: #b45309;`;
        case 'Rejected':
          return `background-color: #dc2626;`;
        default:
          return `background-color: #64748b;`;
      }
    }}
  }
`;

const StatusDropdown = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  min-width: 150px;
  margin-top: 4px;
  border: 1px solid #e5e0ee;
`;

const StatusOption = styled.div<{ $status: string }>`
  padding: 8px 12px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: #f8f5ff;
    transform: translateX(2px);
  }

  &:first-child {
    border-radius: 8px 8px 0 0;
  }

  &:last-child {
    border-radius: 0 0 8px 8px;
  }

  ${(props) => {
    switch (props.$status) {
      case 'Approved':
        return `color: #16a34a;`;
      case 'Pending':
        return `color: #b45309;`;
      case 'Rejected':
        return `color: #dc2626;`;
      default:
        return `color: #64748b;`;
    }
  }}
`;

const Form = styled.form`
  background: transparent;
  padding: 0;
  border-radius: 0;
  box-shadow: none;
  margin-bottom: 0;
`;

const FormGroup = styled.div`
  margin-bottom: 20px;

  label {
    display: block;
    margin-bottom: 8px;
    font-weight: 600;
    color: #351745;
    font-size: 14px;
  }

  input {
    width: 100%;
    padding: 12px 16px;
    border: 2px solid #e5e7eb;
    border-radius: 12px;
    font-size: 14px;
    transition: all 0.3s ease;
    background: rgba(255, 255, 255, 0.8);

    &:hover {
      border-color: #351745;
    }

    &:focus {
      outline: none;
      border-color: #351745;
      box-shadow: 0 0 0 3px rgba(53, 23, 69, 0.1);
      background: white;
    }

    &::placeholder {
      color: #9ca3af;
    }
  }
`;

const Button = styled.button<{ variant?: 'primary' | 'danger' }>`
  padding: 12px 24px;
  border-radius: 12px;
  border: none;
  cursor: pointer;
  margin-right: 12px;
  background: ${(props) =>
    props.variant === 'danger' 
      ? 'linear-gradient(135deg, #dc3545 0%, #c82333 100%)'
      : 'linear-gradient(135deg, #351745 0%, #4b2067 100%)'};
  color: white;
  font-weight: 600;
  font-size: 14px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: ${(props) =>
    props.variant === 'danger' 
      ? '0 4px 16px rgba(220, 53, 69, 0.2)'
      : '0 4px 16px rgba(53, 23, 69, 0.2)'};
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: ${(props) =>
      props.variant === 'danger' 
        ? '0 8px 24px rgba(220, 53, 69, 0.3)'
        : '0 8px 24px rgba(53, 23, 69, 0.3)'};
    background: ${(props) =>
      props.variant === 'danger' 
        ? 'linear-gradient(135deg, #c82333 0%, #a91e2c 100%)'
        : 'linear-gradient(135deg, #4b2067 0%, #5d2b7a 100%)'};
  }
  
  &:active {
    transform: translateY(0);
  }
`;

interface User {
  user_id: string;
  user_login_id: string;
  user_email: string;
  user_name: string;
  user_phonenum: string;
  user_dept_name: string;
  user_team_name: string;
  user_jobname: string;
  user_company_id: string;
  user_position_id: string;
  user_sysrole_id: string;
  signup_completed_status: string;
  company_name: string;
  position_name: string;
  sysrole_name: string;
}

interface Company {
  company_id: string;
  company_name: string;
}

interface Position {
  position_id: string;
  position_name: string;
}

// const CreateButton = styled.button`
//   padding: 0.5rem 1rem;
//   background-color: #480B6A;
//   color: white;
//   border: none;
//   border-radius: 4px;
//   cursor: pointer;
//   font-weight: 500;
//   display: flex;
//   align-items: center;
//   gap: 0.5rem;

//   &:hover {
//     background-color: #480B6A;
//   }
// `;

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

const ModalContent = styled.div`
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(10px);
  padding: 40px;
  border-radius: 20px;
  width: 100%;
  max-width: 600px;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 
    0 20px 60px rgba(0, 0, 0, 0.15),
    0 8px 32px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;

  h2 {
    margin: 0;
    font-size: 1.5rem;
  }
`;

// 정렬 방향을 위한 타입
type SortDirection = 'asc' | 'desc' | null;

// 정렬 상태를 위한 인터페이스
interface SortState {
  field: string;
  direction: SortDirection;
}



// 필터 버튼 스타일
const FilterButton = styled.button<{ $isActive: boolean }>`
  padding: 12px 24px;
  border-radius: 12px;
  border: 2px solid #e5e7eb;
  background: ${(props) => 
    props.$isActive 
      ? 'linear-gradient(135deg, #351745 0%, #4b2067 100%)'
      : 'white'};
  color: ${(props) => (props.$isActive ? 'white' : '#351745')};
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: ${(props) => 
    props.$isActive 
      ? '0 4px 16px rgba(53, 23, 69, 0.2)'
      : '0 2px 8px rgba(0, 0, 0, 0.05)'};

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${(props) => 
      props.$isActive 
        ? '0 8px 24px rgba(53, 23, 69, 0.3)'
        : '0 4px 16px rgba(53, 23, 69, 0.15)'};
    background: ${(props) => 
      props.$isActive 
        ? 'linear-gradient(135deg, #4b2067 0%, #5d2b7a 100%)'
        : '#f8f5ff'};
    border-color: ${(props) => (props.$isActive ? 'transparent' : '#351745')};
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

const FilterButtons = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    justify-content: center;
    order: 2;
  }
`;

const SearchContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  
  @media (max-width: 768px) {
    order: 1;
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

const Select = styled.select`
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  font-size: 14px;
  transition: all 0.3s ease;
  background: rgba(255, 255, 255, 0.8);
  cursor: pointer;

  &:hover {
    border-color: #351745;
  }

  &:focus {
    outline: none;
    border-color: #351745;
    box-shadow: 0 0 0 3px rgba(53, 23, 69, 0.1);
    background: white;
  }

  &:disabled {
    background: #f3f4f6;
    color: #9ca3af;
    cursor: not-allowed;
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

// 정렬 관련 스타일
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

const AdminUser: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);

  const [companies/*, setCompanies*/] = useState<Company[]>([]);

  // const [positions, setPositions] = useState<Position[]>([]);
  const [companyPositions, setCompanyPositions] = useState<{
    [key: string]: Position[];
  }>({});
  const [currentUserCompany, setCurrentUserCompany] = useState<Company | null>(
    null
  );

  const navigate = useNavigate();

  // 모달 상태 관리
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isManageModalOpen, setIsManageModalOpen] = useState(false);

  // 폼 데이터 초기 상태
  const initialFormData = {
    user_name: '',
    user_email: '',
    user_login_id: '',
    user_password: '',
    user_phonenum: '',
    user_dept_name: '',
    user_team_name: '',
    user_jobname: '',
    user_company_id: '',
    user_position_id: '',
    user_sysrole_id: '',
    signup_completed_status: '',
    company_name: '',
    position_name: '',
    sysrole_name: '',
  };

  const [formData, setFormData] = useState(initialFormData);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [activeStatusDropdown, setActiveStatusDropdown] = useState<
    string | null
  >(null);
  const [sortState, setSortState] = useState<SortState>({
    field: '',
    direction: null,
  });
  const [showPendingOnly, setShowPendingOnly] = useState(false);
  const [showRejectedOnly, setShowRejectedOnly] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  
  // 페이지네이션 상태
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  // 검색 상태
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);

  // API 호출 함수
  const fetchUsers = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/admin/users/`,
        {
          credentials: 'include',
        }
      );
      if (!response.ok) {
        let errorMsg = '사용자 목록 조회에 실패했습니다.';
        try {
          const errorData = await response.json();
          if (errorData.detail) errorMsg = errorData.detail;
        } catch {}
        alert(errorMsg);
        navigate('/');
        throw new Error(errorMsg);
      }
      const data = await response.json();
      // console.log('API 응답 데이터:', data); // 데이터 확인용 로그
      setUsers(data);
    } catch (error) {
      console.error('사용자 목록 조회 실패:', error);
      navigate('/');
    }
  };

  // // 회사, 직급, 역할 데이터 가져오기
  // const fetchCompanies = async () => {
  //   try {
  //     const response = await fetch(
  //       `${import.meta.env.VITE_API_URL}/api/v1/admin/companies/`,
  //       {
  //         credentials: 'include',
  //       }
  //     );
  //     const data = await response.json();
  //     setCompanies(data);
  //   } catch (error) {
  //     console.error('회사 목록 조회 실패:', error);
  //   }
  // };

  // const fetchPositions = async () => {
  //   try {
  //     const response = await fetch(
  //       `${import.meta.env.VITE_API_URL}/api/v1/admin/positions/`,
  //       {
  //         credentials: 'include',
  //       }
  //     );
  //     const data = await response.json();
  //     setPositions(data);
  //     console.log(positions);
  //   } catch (error) {
  //     console.error('직급 목록 조회 실패:', error);
  //   }
  // };

  // 회사별 직급 데이터 가져오기
  const fetchCompanyPositions = async (companyId: string) => {
    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_API_URL
        }/api/v1/admin/companies/${companyId}/positions/`,
        {
          credentials: 'include',
        }
      );
      if (!response.ok) {
        let errorMsg = '회사별 직급 목록 조회에 실패했습니다.';
        try {
          const errorData = await response.json();
          if (errorData.detail) errorMsg = errorData.detail;
        } catch {}
        alert(errorMsg);
        navigate('/');
        throw new Error(errorMsg);
      }
      const data = await response.json();
      setCompanyPositions((prev) => ({
        ...prev,
        [companyId]: data,
      }));
    } catch (error) {
      console.error('회사별 직급 목록 조회 실패:', error);
      alert('회사별 직급 목록 조회 중 오류가 발생했습니다.');
      navigate('/');
    }
  };

  // 현재 로그인한 사용자의 정보 가져오기
  const fetchCurrentUser = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/users/one`,
        {
          credentials: 'include',
        }
      );
      if (!response.ok) {
        let errorMsg = '사용자 정보 조회에 실패했습니다.';
        try {
          const errorData = await response.json();
          if (errorData.detail) errorMsg = errorData.detail;
        } catch {}
        alert(errorMsg);
        navigate('/');
        throw new Error(errorMsg);
      }
      const data = await response.json();
      console.log("로그인 사용자 정보",data);

      if (data.company_id) {
        setCurrentUserCompany({
          company_id: data.company_id,
          company_name: data.company_name || ''
        });
        fetchCompanyPositions(data.company_id);
        console.log('설정된 회사 정보:', {
          company_id: data.company_id,
          company_name: data.company_name
        });
      }
    } catch (error) {
      console.error('현재 사용자 정보 조회 실패:', error);
      alert('현재 사용자 정보 조회 중 오류가 발생했습니다.');
      navigate('/');
    }
  };

  // 컴포넌트 마운트 시 데이터 가져오기
  useEffect(() => {
    fetchUsers();
    // fetchCompanies();
    // fetchPositions();
    fetchCurrentUser();
  }, []);

  // companies가 변경될 때 현재 사용자의 회사 정보 업데이트
  useEffect(() => {
    if (companies.length > 0) {
      fetchCurrentUser();
    }
  }, [companies]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 회사 선택 시 해당 회사의 직급 목록 가져오기
  const handleCompanyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const companyId = e.target.value;
    handleInputChange(e);

    // 회사가 선택되었을 때만 직급 목록 가져오기
    if (companyId) {
      fetchCompanyPositions(companyId);
      // 직급 초기화
      setFormData((prev) => ({
        ...prev,
        user_position_id: '',
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/admin/users/`,
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
        let errorMsg = '사용자 생성에 실패했습니다.';
        try {
          const errorData = await response.json();
          if (errorData.detail) errorMsg = errorData.detail;
        } catch {}
        alert(errorMsg);
        // navigate(-1); // 생성 실패 시 이전 페이지로 돌아가는 것이 적절하지 않을 수 있음
        throw new Error(errorMsg);
      }
      if (response.ok) {
        fetchUsers();
        setFormData(initialFormData);
      }
    } catch (error) {
      console.error('사용자 생성 실패:', error);
      alert('사용자 생성 중 오류가 발생했습니다.');
      // navigate(-1); // 생성 실패 시 이전 페이지로 돌아가는 것이 적절하지 않을 수 있음
    }
  };

  const handleUpdate = async (userId: string) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/admin/users/${userId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify(formData),
        }
      );
      if (!response.ok) {
        let errorMsg = '사용자 수정에 실패했습니다.';
        try {
          const errorData = await response.json();
          if (errorData.detail) errorMsg = errorData.detail;
        } catch {}
        alert(errorMsg);
        // navigate(-1); // 수정 실패 시 이전 페이지로 돌아가는 것이 적절하지 않을 수 있음
        throw new Error(errorMsg);
      }
      if (response.ok) {
        fetchUsers();
        setSelectedUserId(null);
      }
    } catch (error) {
      console.error('사용자 수정 실패:', error);
      alert('사용자 수정 중 오류가 발생했습니다.');
      // navigate(-1); // 수정 실패 시 이전 페이지로 돌아가는 것이 적절하지 않을 수 있음
    }
  };

  // const handleDelete = async (userId: string) => {
  //   if (window.confirm("정말로 이 사용자를 삭제하시겠습니까?")) {
  //     try {
  //       const response = await fetch(
  //         `${import.meta.env.VITE_API_URL}/api/v1/admin/users/${userId}`,
  //         {
  //           method: "DELETE",
  //           credentials: "include",
  //         }
  //       );
  //       if (response.ok) {
  //         fetchUsers();
  //       }
  //     } catch (error) {
  //       console.error("사용자 삭제 실패:", error);
  //     }
  //   }
  // };

  // const handleCreateClick = () => {
  //   setFormData({
  //     ...initialFormData,
  //     user_company_id: currentUserCompany?.company_id || "",
  //   });
  //   setIsCreateModalOpen(true);
  // };

  const handleRowClick = (user: User) => {
    if (showRejectedOnly) return; // 반려 목록에서는 팝업 없음
    setSelectedUserId(user.user_id);
    setFormData({
      user_name: user.user_name,
      user_email: user.user_email,
      user_login_id: user.user_login_id,
      user_password: '',
      user_phonenum: user.user_phonenum,
      user_dept_name: user.user_dept_name || '',
      user_team_name: user.user_team_name || '',
      user_jobname: user.user_jobname || '',
      user_company_id: currentUserCompany?.company_id || '',
      user_position_id: user.user_position_id || '',
      user_sysrole_id: '4864c9d2-7f9c-4862-9139-4e8b0ed117f4',
      signup_completed_status: user.signup_completed_status || '',
      company_name: user.company_name || '',
      position_name: user.position_name || '',
      sysrole_name: user.sysrole_name || '',
    });
    if (currentUserCompany?.company_id) {
      fetchCompanyPositions(currentUserCompany.company_id);
    }
    if (showPendingOnly) {
      setIsManageModalOpen(true);
    } else {
      setIsEditModalOpen(true);
    }
  };

  // 상태 변경 핸들러
  const handleStatusChange = async (userId: string, newStatus: string) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/admin/users/${userId}/status`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (!response.ok) {
        let errorMsg = '상태 변경에 실패했습니다.';
        try {
          const errorData = await response.json();
          if (errorData.detail) errorMsg = errorData.detail;
        } catch {}
        alert(errorMsg);
        // navigate(-1); // 상태 변경 실패 시 이전 페이지로 돌아가는 것이 적절하지 않을 수 있음
        throw new Error(errorMsg);
      }

      if (response.ok) {
        fetchUsers(); // 목록 새로고침
      }
    } catch (error) {
      console.error('상태 변경 실패:', error);
      alert('상태 변경 중 오류가 발생했습니다.');
      // navigate(-1); // 상태 변경 실패 시 이전 페이지로 돌아가는 것이 적절하지 않을 수 있음
    }
    setActiveStatusDropdown(null); // 드롭다운 닫기
  };

  // 정렬 핸들러
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

  // 필터링된 사용자 목록 계산
  const filteredUsers = useMemo(() => {
    let filtered = [...users];
    if (currentUserCompany) {
      filtered = filtered.filter(
        (user) => user.user_company_id === currentUserCompany.company_id
      );
    }
    if (showPendingOnly) {
      filtered = filtered.filter(
        (user) => user.signup_completed_status === 'Pending'
      );
    } else if (showRejectedOnly) {
      filtered = filtered.filter(
        (user) => user.signup_completed_status === 'Rejected'
      );
    } else {
      filtered = filtered.filter(
        (user) => user.signup_completed_status === 'Approved'
      );
    }
    
    // 검색 필터링 (이름과 아이디로)
    if (searchTerm.trim()) {
      filtered = filtered.filter((user) =>
        user.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.user_login_id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (sortState.direction !== null) {
      filtered.sort((a, b) => {
        const aValue = a[sortState.field as keyof User] || '';
        const bValue = b[sortState.field as keyof User] || '';
        return sortState.direction === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      });
    }
    return filtered;
  }, [users, showPendingOnly, showRejectedOnly, sortState, currentUserCompany, searchTerm]);

  // 페이지네이션된 사용자 목록 계산
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  // 페이지네이션 관련
  const pageGroupSize = 5;
  const pageGroup = Math.floor((currentPage - 1) / pageGroupSize);
  const startPage = pageGroup * pageGroupSize + 1;
  const endPage = Math.min(startPage + pageGroupSize - 1, totalPages);
  const pageNumbers = [];
  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  // 필터나 검색어가 변경되면 첫 페이지로 이동
  useEffect(() => {
    setCurrentPage(1);
  }, [showPendingOnly, showRejectedOnly, sortState, searchTerm]);

  // 초기 로드 시 승인 대기중인 사용자가 있으면 해당 탭을 기본으로 설정
  useEffect(() => {
    if (isInitialLoad && users.length > 0 && currentUserCompany) {
      // 현재 회사의 사용자만 필터링
      const companyUsers = users.filter(
        (user) => user.user_company_id === currentUserCompany.company_id
      );
      
      // 승인 대기중인 사용자가 있는지 확인
      const hasPendingUsers = companyUsers.some(
        (user) => user.signup_completed_status === 'Pending'
      );
      
      if (hasPendingUsers) {
        setShowPendingOnly(true);
        setShowRejectedOnly(false);
      } else {
        setShowPendingOnly(false);
        setShowRejectedOnly(false);
      }
      
      setIsInitialLoad(false);
    }
  }, [users, currentUserCompany, isInitialLoad]);

  const handleManageInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

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

  return (
    <Container>
      <MainContent>
        <PageHeader>
          <h1>사용자 관리</h1>
        </PageHeader>

        <FilterContainer>
          <FilterButtons>
            <FilterButton
              $isActive={!showPendingOnly && !showRejectedOnly}
              onClick={() => {
                setShowPendingOnly(false);
                setShowRejectedOnly(false);
              }}
            >
              승인된 사용자 목록
            </FilterButton>
            <FilterButton
              $isActive={showPendingOnly}
              onClick={() => {
                setShowPendingOnly(true);
                setShowRejectedOnly(false);
              }}
            >
              승인 대기 중인 사용자 목록
            </FilterButton>
            <FilterButton
              $isActive={showRejectedOnly}
              onClick={() => {
                setShowPendingOnly(false);
                setShowRejectedOnly(true);
              }}
            >
              반려된 사용자 목록
            </FilterButton>
          </FilterButtons>
          
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
              placeholder="이름 또는 아이디로 검색..."
              value={searchTerm}
              onChange={handleSearchChange}
              autoFocus={isSearchExpanded}
            />
            {searchTerm && (
              <ClearButton onClick={handleSearchClear}>
                <FiX />
              </ClearButton>
            )}
          </SearchContainer>
        </FilterContainer>

        <TableContainer>
          <UserTable>
            <thead>
              <tr>
                <SortableHeader onClick={() => handleSort('user_id')}>
                  Requested ID
                  {renderSortIcons('user_id')}
                </SortableHeader>
                <SortableHeader onClick={() => handleSort('user_login_id')}>
                  아이디
                  {renderSortIcons('user_login_id')}
                </SortableHeader>
                <SortableHeader onClick={() => handleSort('user_name')}>
                  이름
                  {renderSortIcons('user_name')}
                </SortableHeader>
                <SortableHeader onClick={() => handleSort('user_dept_name')}>
                  소속 부서명
                  {renderSortIcons('user_dept_name')}
                </SortableHeader>
                <SortableHeader onClick={() => handleSort('user_team_name')}>
                  소속 팀명
                  {renderSortIcons('user_team_name')}
                </SortableHeader>
                <SortableHeader onClick={() => handleSort('signup_completed_status')}>
                  가입 상태
                  {renderSortIcons('signup_completed_status')}
                </SortableHeader>
              </tr>
            </thead>
            <tbody>
              {currentUsers.map((user) => (
                <tr
                  key={user.user_id}
                  onClick={() => handleRowClick(user)}
                  style={{ cursor: 'pointer' }}
                >
                  <td>{user.user_id}</td>
                  <td>{user.user_login_id}</td>
                  <td>{user.user_name}</td>
                  <td>{user.user_dept_name}</td>
                  <td>{user.user_team_name}</td>
                  <td onClick={(e) => e.stopPropagation()}>
                    {/* 행 클릭 이벤트와 분리 */}
                    <StatusBadge
                      $status={user.signup_completed_status}
                      onClick={
                        showRejectedOnly || user.signup_completed_status === 'Approved'
                          ? undefined
                          : () =>
                              setActiveStatusDropdown(
                                activeStatusDropdown === user.user_id
                                  ? null
                                  : user.user_id
                              )
                      }
                      style={
                        showRejectedOnly || user.signup_completed_status === 'Approved' 
                          ? { cursor: 'default' } 
                          : {}
                      }
                    >
                      {user.signup_completed_status || 'Unknown'}
                      {!showRejectedOnly && !showPendingOnly &&
                        user.signup_completed_status !== 'Approved' &&
                        activeStatusDropdown === user.user_id && (
                          <StatusDropdown>
                            <StatusOption
                              $status="Approved"
                              onClick={() =>
                                handleStatusChange(user.user_id, 'Approved')
                              }
                            >
                              승인
                            </StatusOption>
                            <StatusOption
                              $status="Rejected"
                              onClick={() =>
                                handleStatusChange(user.user_id, 'Rejected')
                              }
                            >
                              반려
                            </StatusOption>
                          </StatusDropdown>
                        )}
                    </StatusBadge>
                  </td>
                </tr>
              ))}
            </tbody>
          </UserTable>
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
          <ModalContent>
            <ModalHeader>
              <h2>새 사용자 생성</h2>
              <button onClick={() => setIsCreateModalOpen(false)}>×</button>
            </ModalHeader>
            <Form
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmit(e);
                setIsCreateModalOpen(false);
              }}
            >
              <FormGroup>
                <label>이름</label>
                <input
                  type="text"
                  name="user_name"
                  value={formData.user_name}
                  onChange={handleInputChange}
                  required
                />
              </FormGroup>
              <FormGroup>
                <label>이메일</label>
                <input
                  type="email"
                  name="user_email"
                  value={formData.user_email}
                  onChange={handleInputChange}
                  required
                />
              </FormGroup>
              <FormGroup>
                <label>로그인 ID</label>
                <input
                  type="text"
                  name="user_login_id"
                  value={formData.user_login_id}
                  onChange={handleInputChange}
                  required
                />
              </FormGroup>
              <FormGroup>
                <label>비밀번호</label>
                <input
                  type="password"
                  name="user_password"
                  value={formData.user_password}
                  onChange={handleInputChange}
                  required
                />
              </FormGroup>
              <FormGroup>
                <label>전화번호</label>
                <input
                  type="tel"
                  name="user_phonenum"
                  value={formData.user_phonenum}
                  onChange={handleInputChange}
                  required
                />
              </FormGroup>
              <FormGroup>
                <label>회사</label>
                <Select
                  name="user_company_id"
                  value={currentUserCompany?.company_id || ''}
                  onChange={handleCompanyChange}
                  required
                  disabled
                >
                  <option value="">회사 선택</option>
                  {currentUserCompany && (
                    <option value={currentUserCompany.company_id}>
                      {currentUserCompany.company_name}
                    </option>
                  )}
                </Select>
              </FormGroup>
              <FormGroup>
                <label>직급</label>
                <Select
                  name="user_position_id"
                  value={formData.user_position_id}
                  onChange={handleInputChange}
                  required
                  disabled={!formData.user_company_id}
                >
                  <option value="">직급 선택</option>
                  {formData.user_company_id &&
                    companyPositions[formData.user_company_id]?.map(
                      (position) => (
                        <option
                          key={position.position_id}
                          value={position.position_id}
                        >
                          {position.position_name}
                        </option>
                      )
                    )}
                </Select>
              </FormGroup>
              <FormGroup>
                <label>부서명</label>
                <input
                  type="text"
                  name="user_dept_name"
                  value={formData.user_dept_name}
                  onChange={handleInputChange}
                />
              </FormGroup>
              <FormGroup>
                <label>팀명</label>
                <input
                  type="text"
                  name="user_team_name"
                  value={formData.user_team_name}
                  onChange={handleInputChange}
                />
              </FormGroup>
              <FormGroup>
                <label>직무</label>
                <input
                  type="text"
                  name="user_jobname"
                  value={formData.user_jobname}
                  onChange={handleInputChange}
                />
              </FormGroup>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <Button type="submit">생성</Button>
                <Button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                >
                  취소
                </Button>
              </div>
            </Form>
          </ModalContent>
        </Modal>

        {/* 수정 모달 */}
        {!showPendingOnly && (
          <Modal $isOpen={isEditModalOpen}>
            <EditUsers
              isOpen={isEditModalOpen}
              user={formData}
              onApprove={() => {
                if (selectedUserId) handleUpdate(selectedUserId);
                setIsEditModalOpen(false);
              }}
              onReject={() => {
                if (selectedUserId)
                  handleStatusChange(selectedUserId, 'Rejected');
                setIsEditModalOpen(false);
              }}
              onClose={() => setIsEditModalOpen(false)}
              onChange={handleManageInputChange}
            />
          </Modal>
        )}

        {/* 대기 사용자 관리 모달 */}
        {showPendingOnly && (
          <Modal $isOpen={isManageModalOpen}>
            <ManageUsers
              isOpen={isManageModalOpen}
              user={formData}
              onApprove={() => {
                if (selectedUserId) {
                  handleUpdate(selectedUserId); // 변경된 정보 저장
                  handleStatusChange(selectedUserId, 'Approved');
                }
                setIsManageModalOpen(false);
              }}
              onReject={() => {
                if (selectedUserId)
                  handleStatusChange(selectedUserId, 'Rejected');
                setIsManageModalOpen(false);
              }}
              onClose={() => setIsManageModalOpen(false)}
              onChange={handleManageInputChange}
            />
          </Modal>
        )}
      </MainContent>
    </Container>
  );
};

export default AdminUser;
