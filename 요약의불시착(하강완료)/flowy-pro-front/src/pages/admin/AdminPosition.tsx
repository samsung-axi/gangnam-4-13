import React, { useState, useEffect, useMemo } from 'react';
import { FiChevronUp, FiChevronDown, FiPlus } from 'react-icons/fi';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import NewPosition from './popup/newposition';
import EditPosition from './popup/editposition';

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

const CreateButton = styled.button`
  width: 40px;
  height: 40px;
  border-radius: 12px;
  border: none;
  background: linear-gradient(135deg, #2d1155 0%, #4b2067 100%);
  color: white;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 16px rgba(45, 17, 85, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(45, 17, 85, 0.3);
    background: linear-gradient(135deg, #351745 0%, #5d2b7a 100%);
  }

  &:active {
    transform: translateY(0);
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

const PositionTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: transparent;
  font-size: 1.05rem;

  th,
  td {
    padding: 20px 24px;
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
  font-size: 1.08rem;
  color: #351745;
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

interface Position {
  position_id: string;
  position_code: string;
  position_name: string;
  position_detail: string;
  position_company_id: string;
}

interface Company {
  company_id: string;
  company_name: string;
}

type SortDirection = 'asc' | 'desc' | null;

interface SortState {
  field: string;
  direction: SortDirection;
}

const AdminPosition: React.FC = () => {
  const [positions, setPositions] = useState<Position[]>([]);
  const [currentUserCompany, setCurrentUserCompany] = useState<Company | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedPositionId, setSelectedPositionId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    position_company_id: '',
    position_code: '',
    position_name: '',
    position_detail: '',
  });

  // 정렬 상태 추가
  const [sortState, setSortState] = useState<SortState>({
    field: '',
    direction: null,
  });

  const navigate = useNavigate();

  // 현재 로그인한 사용자의 정보 가져오기
  const fetchCurrentUser = async () => {
    try {
      console.log('사용자 정보 요청 시작');
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/users/one`,
        {
          credentials: 'include',
        }
      );
      console.log('사용자 정보 응답:', response.status);
      if (!response.ok) {
        throw new Error('사용자 정보 조회에 실패했습니다.');
      }
      const data = await response.json();
      console.log('받아온 사용자 데이터:', data);
      if (data.company_id) {
        setCurrentUserCompany({
          company_id: data.company_id,
          company_name: data.company_name || '',
        });
        console.log('설정된 회사 정보:', {
          company_id: data.company_id,
          company_name: data.company_name,
        });
      }
    } catch (error) {
      console.error('현재 사용자 정보 조회 실패:', error);
    }
  };

  // 직급 목록 조회
  const fetchPositions = async () => {
    try {
      if (!currentUserCompany) return;
      console.log('직급 목록 요청 시작');
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/admin/companies/${currentUserCompany.company_id}/positions/`,
        {
          credentials: 'include',
        }
      );
      console.log('직급 목록 응답:', response.status);
      if (!response.ok) {
        let errorMsg = '직급 목록 조회에 실패했습니다.';
        try {
          const errorData = await response.json();
          if (errorData.detail) errorMsg = errorData.detail;
        } catch {}
        alert(errorMsg);
        navigate('/');
        throw new Error(errorMsg);
      }
      const data = await response.json();
      console.log('받아온 직급 데이터:', data);
      setPositions(data);
    } catch (error) {
      console.error('직급 목록 조회 실패:', error);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  useEffect(() => {
    if (currentUserCompany) {
      fetchPositions();
    }
  }, [currentUserCompany]);

  // 입력 폼 핸들러
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 직급 생성
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUserCompany) {
      console.error('회사 정보가 없습니다.');
      return;
    }

    try {
      const positionData = {
        ...formData,
        position_company_id: currentUserCompany.company_id,
      };
      console.log('생성할 직급 데이터:', positionData);
      console.log('현재 회사 정보:', currentUserCompany.company_id);

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/admin/positions/`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify(positionData),
        }
      );
      if (response.ok) {
        fetchPositions();
        setFormData({
          position_company_id: '',
          position_code: '',
          position_name: '',
          position_detail: '',
        });
        setIsCreateModalOpen(false);
      }
    } catch (error) {
      console.error('직급 생성 실패:', error);
    }
  };

  // 직급 수정
  const handleUpdate = async (positionId: string) => {
    if (!currentUserCompany) {
      console.error('회사 정보가 없습니다.');
      return;
    }

    try {
      const positionData = {
        ...formData,
        position_company_id: currentUserCompany.company_id,
      };
      console.log('수정할 직급 데이터:', positionData);

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/admin/positions/${positionId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify(positionData),
        }
      );
      if (response.ok) {
        fetchPositions();
        setSelectedPositionId(null);
        setIsEditModalOpen(false);
      }
    } catch (error) {
      console.error('직급 수정 실패:', error);
    }
  };

  // 직급 삭제
  const handleDelete = async (positionId: string) => {
    if (window.confirm('정말로 이 직급을 삭제하시겠습니까?')) {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/v1/admin/positions/${positionId}`,
          {
            method: 'DELETE',
            credentials: 'include',
          }
        );
        if (response.ok) {
          fetchPositions();
        }
      } catch (error) {
        console.error('직급 삭제 실패:', error);
      }
    }
  };

  const handleRowClick = (position: Position) => {
    setSelectedPositionId(position.position_id);
    setFormData({
      position_company_id: '',
      position_code: position.position_code,
      position_name: position.position_name,
      position_detail: position.position_detail,
    });
    setIsEditModalOpen(true);
  };

  // 정렬 핸들러 추가
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

  // 정렬된 직급 목록 계산
  const sortedPositions = useMemo(() => {
    let sorted = [...positions];
    if (sortState.direction !== null) {
      sorted.sort((a, b) => {
        const aValue = String(a[sortState.field as keyof Position] || '');
        const bValue = String(b[sortState.field as keyof Position] || '');
        return sortState.direction === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      });
    }
    return sorted;
  }, [positions, sortState]);

  // 정렬 아이콘 렌더링 함수
  const renderSortIcons = (field: string) => {
    const isActive = sortState.field === field;
    const direction = isActive ? sortState.direction : null;

    return (
      <SortIconContainer className={isActive ? 'active' : 'inactive'}>
        <FiChevronUp
          size={12}
          style={{
            color: direction === 'asc' ? '#2d1155' : '#9ca3af',
            marginBottom: '-2px',
          }}
        />
        <FiChevronDown
          size={12}
          style={{
            color: direction === 'desc' ? '#2d1155' : '#9ca3af',
            marginTop: '-2px',
          }}
        />
      </SortIconContainer>
    );
  };

  // 새 직급 등록 핸들러
  const handleCreatePosition = () => {
    setFormData({
      position_company_id: '',
      position_code: '',
      position_name: '',
      position_detail: '',
    });
    setIsCreateModalOpen(true);
  };

  // 수정 모달 닫기 핸들러
  const handleEditClose = () => {
    setIsEditModalOpen(false);
    setSelectedPositionId(null);
  };

  // 수정 제출 핸들러
  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedPositionId) {
      handleUpdate(selectedPositionId);
    }
  };

  // 삭제 핸들러
  const handleEditDelete = () => {
    if (selectedPositionId) {
      handleDelete(selectedPositionId);
      setIsEditModalOpen(false);
      setSelectedPositionId(null);
    }
  };

  return (
    <Container>
      <MainContent>
        <PageHeader>
          <h1>직급 관리</h1>
          <CreateButton onClick={handleCreatePosition} title="새 직급 등록">
            <FiPlus size={18} />
          </CreateButton>
        </PageHeader>

        <TableContainer>
          <PositionTable>
            <thead>
              <tr>
                <SortableHeader onClick={() => handleSort('position_code')}>
                  직급 코드
                  {renderSortIcons('position_code')}
                </SortableHeader>
                <SortableHeader onClick={() => handleSort('position_name')}>
                  직급명
                  {renderSortIcons('position_name')}
                </SortableHeader>
                <SortableHeader onClick={() => handleSort('position_detail')}>
                  설명
                  {renderSortIcons('position_detail')}
                </SortableHeader>
              </tr>
            </thead>
            <tbody>
              {sortedPositions.map((position) => (
                <tr
                  key={position.position_id}
                  onClick={() => handleRowClick(position)}
                  className={
                    selectedPositionId === position.position_id ? 'selected' : ''
                  }
                >
                  <td>{position.position_code}</td>
                  <td>{position.position_name}</td>
                  <td>{position.position_detail}</td>
                </tr>
              ))}
            </tbody>
          </PositionTable>
        </TableContainer>

        {/* 새 직급 등록 모달 */}
        <NewPosition
          isOpen={isCreateModalOpen}
          formData={formData}
          onChange={handleInputChange}
          onSubmit={handleSubmit}
          onClose={() => setIsCreateModalOpen(false)}
        />

        {/* 직급 수정 모달 */}
        <EditPosition
          visible={isEditModalOpen}
          onClose={handleEditClose}
          onSubmit={handleEditSubmit}
          onDelete={handleEditDelete}
          formData={formData}
          onChange={handleInputChange}
        />
      </MainContent>
    </Container>
  );
};

export default AdminPosition;
