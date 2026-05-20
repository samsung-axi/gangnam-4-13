import React, { useState, useMemo, useEffect } from 'react';
import {
  FiChevronUp,
  FiChevronDown,
  FiSearch,
  FiX,
  FiTrash,
} from 'react-icons/fi';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import NewAdmin from './popup/newAdmin';
import AlertModal from './popup/AlertModal';
import ConfirmModal from './popup/ConfirmModal';
import { putAdminUser } from '../../../api/fetchSignupInfos';

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
  width: ${(props) => (props.$isExpanded ? '280px' : '40px')};
  opacity: ${(props) => (props.$isExpanded ? '1' : '0')};
  pointer-events: ${(props) => (props.$isExpanded ? 'auto' : 'none')};

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
    width: ${(props) => (props.$isExpanded ? '100%' : '40px')};
    position: ${(props) => (props.$isExpanded ? 'relative' : 'absolute')};
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

// const Button = styled.button<{ variant?: 'primary' | 'danger' }>`
//   padding: 12px 24px;
//   border-radius: 12px;
//   border: none;
//   cursor: pointer;
//   margin-right: 12px;
//   background: ${(props) =>
//     props.variant === 'danger'
//       ? 'linear-gradient(135deg, #dc3545 0%, #c82333 100%)'
//       : 'linear-gradient(135deg, #351745 0%, #4b2067 100%)'};
//   color: white;
//   font-weight: 600;
//   font-size: 14px;
//   transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
//   box-shadow: ${(props) =>
//     props.variant === 'danger'
//       ? '0 4px 16px rgba(220, 53, 69, 0.2)'
//       : '0 4px 16px rgba(53, 23, 69, 0.2)'};

//   &:hover {
//     transform: translateY(-2px);
//     box-shadow: ${(props) =>
//       props.variant === 'danger'
//         ? '0 8px 24px rgba(220, 53, 69, 0.3)'
//         : '0 8px 24px rgba(53, 23, 69, 0.3)'};
//     background: ${(props) =>
//       props.variant === 'danger'
//         ? 'linear-gradient(135deg, #c82333 0%, #a91e2c 100%)'
//         : 'linear-gradient(135deg, #4b2067 0%, #5d2b7a 100%)'};
//   }

//   &:active {
//     transform: translateY(0);
//   }
// `;

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
  border: 1px solid ${(props) => (props.$active ? '#2d1155' : '#e5e7eb')};
  background: ${(props) =>
    props.$active
      ? 'linear-gradient(135deg, #2d1155 0%, #4b2067 100%)'
      : 'white'};
  color: ${(props) => (props.$active ? 'white' : '#6b7280')};
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover:not(:disabled) {
    background: ${(props) =>
      props.$active
        ? 'linear-gradient(135deg, #351745 0%, #4a1168 100%)'
        : '#f9fafb'};
    border-color: ${(props) => (props.$active ? '#351745' : '#d1d5db')};
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

const IconButton = styled.button<{ variant?: 'danger' }>`
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

  ${(props) =>
    props.variant === 'danger'
      ? `
    background: rgba(255, 255, 255, 0.95);
    color: #8b5a8c;
    
    &:hover {
      background: #f3e8ff;
      color: #7c3aed;
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(139, 90, 140, 0.3);
      border-color: rgba(124, 58, 237, 0.4);
    }
  `
      : `
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
  company_name: string;
}

type SortDirection = 'asc' | 'desc' | null;

interface SortState {
  field: string;
  direction: SortDirection;
}

const AdminAdmin: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  // const [companyList, setCompanyList] = useState<any[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    user_name: '',
    user_id: '',
    user_email: '',
    user_phonenum: '',
    company_name: '',
  });
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

  // 모달 상태
  const [alertModal, setAlertModal] = useState({
    isOpen: false,
    type: 'info' as 'success' | 'error' | 'warning' | 'info',
    title: '',
    message: '',
  });

  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
  });

  const navigate = useNavigate();

  const fetchAdmins = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/admin/users/admin_users`,
        {
          credentials: 'include',
        }
      );
      if (!response.ok) {
        let errorMsg = '관리자 목록 조회에 실패했습니다.';
        try {
          const errorData = await response.json();
          if (errorData.detail) errorMsg = errorData.detail;
        } catch {}
        showAlert('error', '조회 실패', errorMsg);
        navigate('/');
        throw new Error(errorMsg);
      }
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('관리자 목록 조회 실패:', error);
      navigate('/');
    }
  };

  useEffect(() => {
    fetchAdmins();
    // loadCompanyList();
  }, []);

  const handleCreateClick = () => {
    setFormData({
      user_name: '',
      user_id: '',
      user_email: '',
      user_phonenum: '',
      company_name: '',
    });
    setIsCreateModalOpen(true);
  };

  const handleUserSelect = (userData: any) => {
    setFormData({
      user_name: userData.user_name,
      user_id: userData.user_id,
      user_email: userData.user_email,
      user_phonenum: userData.user_phonenum,
      company_name: userData.company_name,
    });
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

  // 필터링된 관리자 목록 계산
  const filteredUsers = useMemo(() => {
    let filtered = [...users];

    // 검색 필터링
    if (searchTerm.trim()) {
      filtered = filtered.filter(
        (user) =>
          user.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.user_login_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.company_name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // 정렬
    if (sortState.direction !== null) {
      filtered.sort((a, b) => {
        const aValue = a[sortState.field as keyof User] || '';
        const bValue = b[sortState.field as keyof User] || '';

        return sortState.direction === 'asc'
          ? String(aValue).localeCompare(String(bValue))
          : String(bValue).localeCompare(String(aValue));
      });
    }

    return filtered;
  }, [users, searchTerm, sortState]);

  // 페이지네이션된 관리자 목록 계산
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

  // 검색어가 변경되면 첫 페이지로 이동
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, sortState]);

  // const loadCompanyList = async () => {
  //   const data = await fetchSignupInfos();
  //   setCompanyList(data.companies);
  // };

  // const loadUserList = async (company_id: string) => {
  //   const users = await fetchUsersByCompany(company_id);
  //   return users;
  // };

  // const handleCompanySelect = (company: any) => {
  //   setFormData({
  //     ...formData,
  //     company_name: company.company_name,
  //   });
  // };

  // const handleSearch = () => {
  //   // 검색 기능은 실시간으로 이미 동작 중
  // };

  // const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
  //   if (e.key === 'Enter') {
  //     handleSearch();
  //   }
  // };

  const handleAdminSubmit = async (
    e: React.FormEvent,
    userDataFromModal?: any
  ) => {
    e.preventDefault();

    // 모달에서 전달된 사용자 데이터가 있으면 우선 사용
    const userData = userDataFromModal || formData;

    if (!userData.user_id) {
      showAlert(
        'warning',
        '선택 필요',
        '관리자로 등록할 사용자를 선택해주세요.'
      );
      return;
    }

    try {
      const result = await putAdminUser(userData.user_id, false);

      if (result.success) {
        showAlert(
          'success',
          '등록 완료',
          '관리자가 성공적으로 등록되었습니다.'
        );
        setIsCreateModalOpen(false);
        setFormData({
          user_name: '',
          user_id: '',
          user_email: '',
          user_phonenum: '',
          company_name: '',
        });
        fetchAdmins();
      } else if (result.already_admin) {
        showConfirm(
          '관리자 변경',
          result.message ||
            '이미 관리자가 있습니다.\n 해당 사용자를 관리자로 변경하시겠습니까?',
          async () => {
            closeConfirm();
            try {
              const forceResult = await putAdminUser(userData.user_id, true);
              if (forceResult.success) {
                showAlert(
                  'success',
                  '변경 완료',
                  '관리자가 성공적으로 변경되었습니다.'
                );
                setIsCreateModalOpen(false);
                setFormData({
                  user_name: '',
                  user_id: '',
                  user_email: '',
                  user_phonenum: '',
                  company_name: '',
                });
                fetchAdmins();
              } else {
                showAlert(
                  'error',
                  '변경 실패',
                  forceResult.message || '관리자 변경에 실패했습니다.'
                );
              }
            } catch (error) {
              console.error('관리자 변경 실패:', error);
              showAlert('error', '변경 실패', '관리자 변경에 실패했습니다.');
            }
          }
        );
      } else {
        showAlert(
          'error',
          '등록 실패',
          result.message || '관리자 등록에 실패했습니다.'
        );
      }
    } catch (error) {
      console.error('관리자 등록 실패:', error);
      showAlert('error', '등록 실패', '관리자 등록에 실패했습니다.');
    }
  };

  const handleDelete = async (userId: string) => {
    showConfirm(
      '관리자 삭제',
      '정말로 이 관리자를 삭제하시겠습니까?',
      async () => {
        closeConfirm();
        try {
          const response = await fetch(
            `${import.meta.env.VITE_API_URL}/api/v1/admin/users/${userId}`,
            {
              method: 'DELETE',
              credentials: 'include',
            }
          );

          if (response.ok) {
            showAlert(
              'success',
              '삭제 완료',
              '관리자가 성공적으로 삭제되었습니다.'
            );
            fetchAdmins();
          } else {
            showAlert('error', '삭제 실패', '관리자 삭제에 실패했습니다.');
          }
        } catch (error) {
          console.error('관리자 삭제 실패:', error);
          showAlert('error', '삭제 실패', '관리자 삭제에 실패했습니다.');
        }
      }
    );
  };

  // 정렬 아이콘 렌더링 함수
  const renderSortIcons = (field: string) => {
    return (
      <SortIconContainer className={sortState.field === field ? 'active' : ''}>
        <NewSortIcon
          className={
            sortState.field === field && sortState.direction === 'asc'
              ? 'active'
              : ''
          }
        >
          <FiChevronUp />
        </NewSortIcon>
        <NewSortIcon
          className={
            sortState.field === field && sortState.direction === 'desc'
              ? 'active'
              : ''
          }
        >
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

  // 모달 헬퍼 함수들
  const showAlert = (
    type: 'success' | 'error' | 'warning' | 'info',
    title: string,
    message: string
  ) => {
    setAlertModal({ isOpen: true, type, title, message });
  };

  const showConfirm = (
    title: string,
    message: string,
    onConfirm: () => void
  ) => {
    setConfirmModal({ isOpen: true, title, message, onConfirm });
  };

  const closeAlert = () => {
    setAlertModal((prev) => ({ ...prev, isOpen: false }));
  };

  const closeConfirm = () => {
    setConfirmModal((prev) => ({ ...prev, isOpen: false }));
  };

  return (
    <Container>
      <MainContent>
        <PageHeader>
          <h1>관리자 계정 관리</h1>
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
              placeholder="이름, 아이디 또는 회사명으로 검색..."
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
            <AddButton onClick={handleCreateClick} title="관리자 추가">
              +
            </AddButton>
          </SearchContainer>
        </FilterContainer>

        <TableContainer>
          <Table>
            <thead>
              <tr>
                <SortableHeader onClick={() => handleSort('user_id')}>
                  관리자 ID
                  {renderSortIcons('user_id')}
                </SortableHeader>
                <SortableHeader onClick={() => handleSort('user_login_id')}>
                  로그인 ID
                  {renderSortIcons('user_login_id')}
                </SortableHeader>
                <SortableHeader onClick={() => handleSort('user_name')}>
                  이름
                  {renderSortIcons('user_name')}
                </SortableHeader>
                <SortableHeader onClick={() => handleSort('user_email')}>
                  이메일
                  {renderSortIcons('user_email')}
                </SortableHeader>
                <SortableHeader onClick={() => handleSort('user_phonenum')}>
                  전화번호
                  {renderSortIcons('user_phonenum')}
                </SortableHeader>
                <SortableHeader onClick={() => handleSort('user_dept_name')}>
                  부서
                  {renderSortIcons('user_dept_name')}
                </SortableHeader>
                <SortableHeader onClick={() => handleSort('company_name')}>
                  회사명
                  {renderSortIcons('company_name')}
                </SortableHeader>
                <th>작업</th>
              </tr>
            </thead>
            <tbody>
              {currentUsers.map((user) => (
                <tr key={user.user_id}>
                  <td>{user.user_id}</td>
                  <td>{user.user_login_id}</td>
                  <td>{user.user_name}</td>
                  <td>{user.user_email}</td>
                  <td>{user.user_phonenum}</td>
                  <td>{user.user_dept_name}</td>
                  <td>{user.company_name}</td>
                  <td onClick={(e) => e.stopPropagation()}>
                    <IconButton
                      variant="danger"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(user.user_id);
                      }}
                      title="관리자 삭제"
                    >
                      <FiTrash />
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
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
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
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
            >
              다음
            </PageNavButton>
          </Pagination>
        )}

        {/* 생성 모달 */}
        <Modal $isOpen={isCreateModalOpen}>
          <NewAdmin
            visible={isCreateModalOpen}
            onClose={() => setIsCreateModalOpen(false)}
            onSubmit={handleAdminSubmit}
            formData={formData}
            onUserSelect={handleUserSelect}
          />
        </Modal>
      </MainContent>

      {/* 모달 컴포넌트들 */}
      <AlertModal
        isOpen={alertModal.isOpen}
        type={alertModal.type}
        title={alertModal.title}
        message={alertModal.message}
        onClose={closeAlert}
      />

      <ConfirmModal
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        message={confirmModal.message}
        onConfirm={confirmModal.onConfirm}
        onCancel={closeConfirm}
      />
    </Container>
  );
};

export default AdminAdmin;
