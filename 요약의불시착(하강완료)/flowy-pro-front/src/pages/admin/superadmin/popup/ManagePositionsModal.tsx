import React, { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { FiX, FiSettings, FiPlus, FiEdit3, FiTrash2, FiUsers, FiAlertTriangle } from 'react-icons/fi';
import NewPosition from '../../popup/newposition';
import EditPosition from '../../popup/editposition';

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
`;

const slideUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(30px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
`;

const ModalBg = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  animation: ${fadeIn} 0.3s ease-out;
`;

const ModalBox = styled.div`
  background: white;
  border-radius: 24px;
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(45, 17, 85, 0.15);
  border: 1px solid rgba(45, 17, 85, 0.1);
  animation: ${slideUp} 0.3s ease-out;
  position: relative;
`;

const ModalHeader = styled.div`
  background: linear-gradient(135deg, #2d1155 0%, #4b2067 100%);
  color: white;
  padding: 32px 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
`;

const HeaderContent = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  gap: 16px;
`;

const IconWrapper = styled.div`
  font-size: 32px;
  color: white;
`;

const Title = styled.h2`
  margin: 0;
  font-size: 1.75rem;
  font-weight: 700;
  color: white;
`;

const CloseButton = styled.button`
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: scale(1.05);
  }
`;

const ModalBody = styled.div`
  padding: 40px;
  overflow-y: auto;
  max-height: 60vh;
`;

const ActionBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e5e7eb;
`;

const AddButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  border-radius: 12px;
  background: linear-gradient(135deg, #2d1155 0%, #4b2067 100%);
  color: white;
  border: none;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(45, 17, 85, 0.3);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(45, 17, 85, 0.4);
    background: linear-gradient(135deg, #351745 0%, #5d2b7a 100%);
  }

  &:active {
    transform: translateY(0);
  }
`;

const PositionCount = styled.div`
  font-size: 14px;
  color: #6b7280;
  font-weight: 500;
`;

const PositionList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const PositionCard = styled.div`
  background: white;
  border: 2px solid #f1f5f9;
  border-radius: 16px;
  padding: 20px;
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    border-color: #2d1155;
    box-shadow: 0 4px 12px rgba(45, 17, 85, 0.1);
    transform: translateY(-1px);
  }
`;

const PositionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
`;

const PositionInfo = styled.div`
  flex: 1;
`;

const PositionName = styled.h3`
  margin: 0 0 4px 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: #2d1155;
`;

const PositionCode = styled.span`
  display: inline-block;
  background: #f3f4f6;
  color: #6b7280;
  font-size: 12px;
  font-weight: 500;
  padding: 4px 8px;
  border-radius: 6px;
  letter-spacing: 0.5px;
`;

const PositionDetail = styled.p`
  margin: 8px 0 0 0;
  font-size: 14px;
  color: #6b7280;
  line-height: 1.4;
`;

const ActionGroup = styled.div`
  display: flex;
  gap: 8px;
`;

const ActionBtn = styled.button<{ variant?: 'edit' | 'delete' }>`
  width: 36px;
  height: 36px;
  border-radius: 8px;
  border: 1px solid;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  transition: all 0.3s ease;
  
  ${props => props.variant === 'delete' ? `
    background: rgba(255, 255, 255, 0.95);
    color: #dc3545;
    border-color: rgba(220, 53, 69, 0.2);
    
    &:hover {
      background: #fef2f2;
      color: #b91c1c;
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(220, 53, 69, 0.2);
      border-color: rgba(185, 28, 28, 0.3);
    }
  ` : `
    background: #f3f4f6;
    color: #2d1155;
    border-color: rgba(45, 17, 85, 0.2);
    
    &:hover {
      background: #e5e7eb;
      color: #1f2937;
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(45, 17, 85, 0.1);
    }
  `}
  
  &:active {
    transform: translateY(0);
  }
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
  color: #6b7280;

  svg {
    font-size: 48px;
    margin-bottom: 16px;
    opacity: 0.5;
  }

  h3 {
    margin: 0 0 8px 0;
    font-size: 1.25rem;
    font-weight: 600;
    color: #374151;
  }

  p {
    margin: 0;
    font-size: 14px;
    line-height: 1.5;
  }
`;

// 확인 모달 스타일
const ConfirmModalBg = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 3000;
  animation: ${fadeIn} 0.3s ease-out;
`;

const ConfirmModalBox = styled.div`
  background: white;
  border-radius: 20px;
  width: 100%;
  max-width: 480px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(45, 17, 85, 0.2);
  border: 1px solid rgba(45, 17, 85, 0.1);
  animation: ${slideUp} 0.3s ease-out;
`;

const ConfirmHeader = styled.div`
  background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
  color: white;
  padding: 24px 32px;
  display: flex;
  align-items: center;
  gap: 16px;
`;

const ConfirmIconWrapper = styled.div`
  font-size: 24px;
  color: white;
`;

const ConfirmTitle = styled.h3`
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: white;
`;

const ConfirmBody = styled.div`
  padding: 32px;
  text-align: center;
`;

const ConfirmMessage = styled.p`
  margin: 0 0 24px 0;
  font-size: 16px;
  color: #374151;
  line-height: 1.5;
`;

const ConfirmButtons = styled.div`
  display: flex;
  gap: 12px;
  justify-content: center;
`;

const ConfirmButton = styled.button<{ variant?: 'cancel' | 'delete' }>`
  padding: 12px 24px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  border: none;
  transition: all 0.3s ease;
  min-width: 100px;

  ${props => props.variant === 'delete' ? `
    background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
    color: white;
    box-shadow: 0 4px 12px rgba(220, 38, 38, 0.3);
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(220, 38, 38, 0.4);
      background: linear-gradient(135deg, #b91c1c 0%, #991b1b 100%);
    }
  ` : `
    background: #f3f4f6;
    color: #374151;
    border: 1px solid #d1d5db;
    
    &:hover {
      background: #e5e7eb;
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }
  `}
  
  &:active {
    transform: translateY(0);
  }
`;

interface Position {
  position_id: string;
  position_code: string;
  position_name: string;
  position_detail: string;
  position_company_id: string;
}

interface ManagePositionsModalProps {
  companyId: string;
  onClose: () => void;
}

const ManagePositionsModal: React.FC<ManagePositionsModalProps> = ({ companyId, onClose }) => {
  const [positions, setPositions] = useState<Position[]>([]);
  const [isNewOpen, setIsNewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Position | null>(null);
  const [editTarget, setEditTarget] = useState<Position | null>(null);
  const [formData, setFormData] = useState({
    position_code: '',
    position_name: '',
    position_detail: '',
  });

  // 직급 목록 조회
  const fetchPositions = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/admin/companies/${companyId}/positions/`, {
        credentials: 'include',
      });
      if (res.ok) {
        const data = await res.json();
        setPositions(data);
      }
    } catch (error) {
      console.error('직급 목록 조회 실패:', error);
    }
  };

  useEffect(() => { 
    fetchPositions(); 
  }, [companyId]);

  // 추가
  const handleNew = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/admin/positions/`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, position_company_id: companyId }),
      });
      if (res.ok) {
        setIsNewOpen(false);
        setFormData({ position_code: '', position_name: '', position_detail: '' });
        fetchPositions();
      }
    } catch (error) {
      console.error('직급 추가 실패:', error);
    }
  };

  // 수정
  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editTarget) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/admin/positions/${editTarget.position_id}`, {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, position_company_id: companyId }),
      });
      if (res.ok) {
        setIsEditOpen(false);
        setEditTarget(null);
        setFormData({ position_code: '', position_name: '', position_detail: '' });
        fetchPositions();
      }
    } catch (error) {
      console.error('직급 수정 실패:', error);
    }
  };

  // 삭제 확인 모달 열기
  const handleDeleteConfirm = (position: Position) => {
    setDeleteTarget(position);
    setIsConfirmOpen(true);
  };

  // 삭제 실행
  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/admin/positions/${deleteTarget.position_id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (res.ok) {
        fetchPositions();
        setIsConfirmOpen(false);
        setDeleteTarget(null);
      }
    } catch (error) {
      console.error('직급 삭제 실패:', error);
    }
  };

  // 삭제 취소
  const handleDeleteCancel = () => {
    setIsConfirmOpen(false);
    setDeleteTarget(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditClick = (pos: Position) => {
    setEditTarget(pos);
    setFormData({ 
      position_code: pos.position_code, 
      position_name: pos.position_name, 
      position_detail: pos.position_detail 
    });
    setIsEditOpen(true);
  };

  const handleAddClick = () => {
    setFormData({ position_code: '', position_name: '', position_detail: '' });
    setIsNewOpen(true);
  };

  return (
    <>
      <ModalBg>
        <ModalBox>
          <ModalHeader>
            <HeaderContent>
              <IconWrapper>
                <FiSettings />
              </IconWrapper>
              <Title>직급 관리</Title>
            </HeaderContent>
            <CloseButton onClick={onClose}>
              <FiX />
            </CloseButton>
          </ModalHeader>

          <ModalBody>
            <ActionBar>
              <PositionCount>
                총 {positions.length}개의 직급
              </PositionCount>
              <AddButton onClick={handleAddClick}>
                <FiPlus />
                새 직급 추가
              </AddButton>
            </ActionBar>

            <PositionList>
              {positions.length === 0 ? (
                <EmptyState>
                  <FiUsers />
                  <h3>등록된 직급이 없습니다</h3>
                  <p>새 직급을 추가하여 조직의 직급 체계를 구성해보세요.</p>
                </EmptyState>
              ) : (
                positions.map((pos) => (
                  <PositionCard key={pos.position_id}>
                    <PositionHeader>
                      <PositionInfo>
                        <PositionName>{pos.position_name}</PositionName>
                        <PositionCode>{pos.position_code}</PositionCode>
                        {pos.position_detail && (
                          <PositionDetail>{pos.position_detail}</PositionDetail>
                        )}
                      </PositionInfo>
                      <ActionGroup>
                        <ActionBtn onClick={() => handleEditClick(pos)} title="직급 수정">
                          <FiEdit3 />
                        </ActionBtn>
                        <ActionBtn 
                          variant="delete" 
                          onClick={() => handleDeleteConfirm(pos)}
                          title="직급 삭제"
                        >
                          <FiTrash2 />
                        </ActionBtn>
                      </ActionGroup>
                    </PositionHeader>
                  </PositionCard>
                ))
              )}
            </PositionList>
          </ModalBody>

          {/* 추가 모달 */}
          <NewPosition
            isOpen={isNewOpen}
            formData={formData}
            onChange={handleChange}
            onSubmit={handleNew}
            onClose={() => setIsNewOpen(false)}
          />

          {/* 수정 모달 */}
          <EditPosition
            visible={isEditOpen}
            formData={formData}
            onChange={handleChange}
            onSubmit={handleEdit}
            onDelete={editTarget ? () => { handleDeleteConfirm(editTarget); setIsEditOpen(false); } : undefined}
            onClose={() => { setIsEditOpen(false); setEditTarget(null); }}
          />
        </ModalBox>
      </ModalBg>

      {/* 삭제 확인 모달 */}
      {isConfirmOpen && deleteTarget && (
        <ConfirmModalBg>
          <ConfirmModalBox>
            <ConfirmHeader>
              <ConfirmIconWrapper>
                <FiAlertTriangle />
              </ConfirmIconWrapper>
              <ConfirmTitle>삭제 확인</ConfirmTitle>
            </ConfirmHeader>
            <ConfirmBody>
              <ConfirmMessage>
                <strong>'{deleteTarget.position_name}'</strong> 직급을 정말 삭제하시겠습니까?
                <br />
                삭제된 직급은 복구할 수 없습니다.
              </ConfirmMessage>
              <ConfirmButtons>
                <ConfirmButton variant="cancel" onClick={handleDeleteCancel}>
                  취소
                </ConfirmButton>
                <ConfirmButton variant="delete" onClick={handleDelete}>
                  삭제
                </ConfirmButton>
              </ConfirmButtons>
            </ConfirmBody>
          </ConfirmModalBox>
        </ConfirmModalBg>
      )}
    </>
  );
};

export default ManagePositionsModal; 