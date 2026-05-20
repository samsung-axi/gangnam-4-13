import React, { useState, useEffect, useMemo, useRef } from 'react';
import { FiSearch, FiX, FiPlus } from 'react-icons/fi';
import styled from 'styled-components';
import EditTemplateModal from './popup/edittemp';
import NewTemplateModal from './popup/newtemp';
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

const HeaderActions = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 16px;
`;

const AddTemplateBtn = styled.button`
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

const SearchContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
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

const TemplateGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
  margin-top: 24px;

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 16px;
  }
`;

const TemplateCard = styled.div`
  background: white;
  border-radius: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid #f1f5f9;
  position: relative;
  padding: 24px 20px 20px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 240px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  
  /* 호버 시 오버레이 효과 */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.4);
    border-radius: 20px;
    opacity: 0;
    transition: opacity 0.3s ease;
    pointer-events: none;
    z-index: 1;
  }
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 32px rgba(53, 23, 69, 0.15);
    background: linear-gradient(135deg, #fefbff 0%, #f8f5ff 100%);
  }
  
  &:hover::before {
    opacity: 1;
  }
  
  /* 선택된 상태 */
  &.selected {
    background: linear-gradient(135deg, #f0ebf8 0%, #e5e0ee 100%);
    border: 2px solid #4b2067;
    transform: translateY(-2px);
  }
  
  &.selected:hover {
    background: linear-gradient(135deg, #e5e0ee 0%, #d4c7e8 100%);
    transform: translateY(-4px);
  }
`;

const CardActions = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  gap: 12px;
  opacity: 0;
  transition: all 0.3s ease;
  z-index: 2;

  ${TemplateCard}:hover & {
    opacity: 1;
  }
`;

const ActionButton = styled.button`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(53, 23, 69, 0.1);
  border-radius: 10px;
  padding: 12px;
  cursor: pointer;
  color: #351745;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  
  &:hover {
    background: #e5e0ff;
    color: #2d1155;
    transform: scale(1.1);
    box-shadow: 0 6px 16px rgba(53, 23, 69, 0.25);
    border-color: rgba(45, 17, 85, 0.3);
  }
  
  &:active {
    transform: scale(0.95);
  }
`;

const TemplatePreview = styled.div`
  width: 120px;
  height: 120px;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
  border: 2px solid #f1f5f9;
`;

const TemplateInfo = styled.div`
  text-align: center;
  width: 100%;
  
  h3 {
    margin: 0 0 8px 0;
    font-size: 16px;
    color: #2d1155;
    font-weight: 600;
    word-break: break-word;
    line-height: 1.4;
  }
  
  .type {
    font-size: 14px;
    color: #4b2067;
    margin-bottom: 4px;
    font-weight: 500;
  }
  
  .date {
    font-size: 12px;
    color: #64748b;
    font-weight: 400;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 20px;
  right: 24px;
  background: none;
  border: none;
  color: #64748b;
  font-size: 24px;
  cursor: pointer;
  z-index: 10;
  transition: all 0.2s ease;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  
  &:hover {
    color: #351745;
    background: rgba(53, 23, 69, 0.1);
    transform: scale(1.1);
  }
  
  &:active {
    transform: scale(0.95);
  }
`;

const DeleteModal = styled.div<{ $isOpen: boolean }>`
  display: ${(props) => (props.$isOpen ? 'flex' : 'none')};
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  justify-content: center;
  align-items: center;
  z-index: 2000;
`;

const DeleteModalContent = styled.div`
  background: white;
  border-radius: 24px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
  border: 1px solid #f1f5f9;
  padding: 40px 32px 32px 32px;
  min-width: 400px;
  max-width: 90vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
`;

const DeleteTitle = styled.div`
  color: #2d1155;
  font-size: 20px;
  font-weight: 700;
  text-align: center;
  margin-bottom: 12px;
`;

const DeleteDesc = styled.div`
  color: #64748b;
  font-size: 14px;
  text-align: center;
  margin-bottom: 32px;
  line-height: 1.5;
`;

const DeleteButton = styled.button`
  background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
  color: white;
  font-size: 16px;
  font-weight: 600;
  border: none;
  border-radius: 12px;
  padding: 12px 32px;
  min-width: 120px;
  box-shadow: 0 4px 16px rgba(220, 53, 69, 0.2);
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(220, 53, 69, 0.3);
    background: linear-gradient(135deg, #c82333 0%, #a71e2a 100%);
  }

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

interface Template {
  interdocs_id: string;
  interdocs_type_name: string;
  interdocs_filename: string;
  interdocs_contents: string;
  interdocs_path: string;
  interdocs_uploaded_date: string;
  interdocs_updated_date?: string;
  interdocs_update_user_id: string;
}

// 파일 확장자에 따른 이미지 경로를 반환하는 함수
const getFileIcon = (fileName: string) => {
  const extension = fileName.split('.').pop()?.toLowerCase();

  switch (extension) {
    case 'docx':
      return '/images/word.png';
    case 'xlsx':
      return '/images/excel.png';
    case 'pdf':
      return '/images/pdf.png';
    case 'pptx':
      return '/images/ppt.png';
    default:
      return '/images/file.png';
  }
};

const AdminTemplate: React.FC = () => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [createDocType, setCreateDocType] = useState<string>('');
  const [editDocType, setEditDocType] = useState<string>('');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  
  // 검색 관련 상태
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const searchContainerRef = useRef<HTMLDivElement>(null);
  
  // 페이지네이션 상태
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const navigate = useNavigate();

  // 템플릿 목록 조회
  const fetchTemplates = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/docs/`,
        {
          credentials: 'include',
        }
      );
      if (!response.ok) {
        let errorMsg = '템플릿 목록 조회에 실패했습니다.';
        try {
          const errorData = await response.json();
          if (errorData.detail) errorMsg = errorData.detail;
        } catch {}
        alert(errorMsg);
        navigate('/')
        throw new Error(errorMsg);
      }
      const data = await response.json();
      setTemplates(data);
    } catch (error) {
      console.error('템플릿 목록 조회 실패:', error);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  // 외부 클릭 및 ESC 키 감지
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        if (isSearchExpanded && !searchTerm) {
          setIsSearchExpanded(false);
        }
      }
    };

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isSearchExpanded) {
        setIsSearchExpanded(false);
        setSearchTerm('');
      }
    };

    if (isSearchExpanded) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscapeKey);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isSearchExpanded, searchTerm]);

  // 템플릿 생성
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('doc_type', createDocType);
    formData.append('update_user_id', '7f2d2784-b12b-4b8d-a9fc-3857e52f9e96');

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/docs/`,
        {
          credentials: 'include',
          method: 'POST',
          headers: {
            Accept: 'application/json',
          },
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || '템플릿 생성에 실패했습니다.');
      }

      await fetchTemplates();
      setIsCreateModalOpen(false);
      setSelectedFile(null);
    } catch (error) {
      console.error('템플릿 생성 실패:', error);
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert('템플릿 생성에 실패했습니다.');
      }
    }
  };

  // 템플릿 수정
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile || !selectedTemplate) return;

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('doc_type', editDocType);
    formData.append('update_user_id', '7f2d2784-b12b-4b8d-a9fc-3857e52f9e96');

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/docs/${selectedTemplate.interdocs_id}`,
        {
          credentials: 'include',
          method: 'PUT',
          headers: {
            Accept: 'application/json',
          },
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || '템플릿 수정에 실패했습니다.');
      }

      await fetchTemplates();
      setIsEditModalOpen(false);
      setSelectedTemplate(null);
      setSelectedFile(null);
    } catch (error) {
      console.error('템플릿 수정 실패:', error);
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert('템플릿 수정에 실패했습니다.');
      }
    }
  };

  // 템플릿 삭제
  const handleDelete = async (templateId: string) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/docs/${templateId}`,
        {
          credentials: 'include',
          method: 'DELETE',
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || '템플릿 삭제에 실패했습니다.');
      }

      await fetchTemplates();
      setIsEditModalOpen(false);
      setSelectedTemplate(null);
    } catch (error) {
      console.error('템플릿 삭제 실패:', error);
      alert(
        error instanceof Error ? error.message : '템플릿 삭제에 실패했습니다.'
      );
    }
  };

  // 파일 다운로드
  const handleDownload = async (e: React.MouseEvent, interdocs_id: string) => {
    e.stopPropagation();

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/docs/download/${interdocs_id}`, {
        method: 'GET',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('다운로드 링크 요청 실패');
      }

      const { download_url } = await response.json();
      window.open(download_url, '_blank');
    } catch (error) {
      alert('다운로드에 실패했습니다.');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
    }
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedTemplate(null);
    setSelectedFile(null);
    setEditDocType('');
  };

  const closeCreateModal = () => {
    setIsCreateModalOpen(false);
    setSelectedFile(null);
    setCreateDocType('');
  };

  // 검색 관련 함수들
  const handleSearchToggle = () => {
    setIsSearchExpanded(!isSearchExpanded);
    if (isSearchExpanded) {
      setSearchTerm('');
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchClear = () => {
    setSearchTerm('');
  };

  // 검색어에 따른 템플릿 필터링
  const filteredTemplates = useMemo(() => {
    if (!searchTerm.trim()) return templates;
    
    return templates.filter(template =>
      template.interdocs_filename.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.interdocs_type_name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [templates, searchTerm]);

  // 페이지네이션 계산
  const totalPages = Math.ceil(filteredTemplates.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentTemplates = filteredTemplates.slice(startIndex, endIndex);

  // 페이지 변경 시 현재 페이지 초기화
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // 페이지네이션 핸들러
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <PageButton
          key={i}
          $active={currentPage === i}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </PageButton>
      );
    }

    return pageNumbers;
  };

  return (
    <Container>
      <MainContent>
        <PageHeader>
          <h1>템플릿 관리</h1>
          <HeaderActions>
            <SearchContainer ref={searchContainerRef}>
              <SearchIconButton
                className={isSearchExpanded ? 'active' : ''}
                onClick={handleSearchToggle}
              >
                <FiSearch size={18} />
              </SearchIconButton>
              <SearchInput
                $isExpanded={isSearchExpanded}
                type="text"
                placeholder="템플릿 검색..."
                value={searchTerm}
                onChange={handleSearchChange}
                onBlur={() => {
                  // 검색어가 없을 때만 포커스 잃으면 축소
                  if (!searchTerm.trim()) {
                    setTimeout(() => setIsSearchExpanded(false), 150);
                  }
                }}
                onFocus={() => setIsSearchExpanded(true)}
              />
              {searchTerm && (
                <ClearButton onClick={handleSearchClear}>
                  <FiX size={16} />
                </ClearButton>
              )}
            </SearchContainer>
            <AddTemplateBtn onClick={() => setIsCreateModalOpen(true)} title="템플릿 추가">
              <FiPlus size={18} />
            </AddTemplateBtn>
          </HeaderActions>
        </PageHeader>

        <TemplateGrid>
          {currentTemplates.map((template) => (
            <TemplateCard key={template.interdocs_id} onClick={() => setSelectedTemplate(template)}>
              <CardActions>
                <ActionButton
                  title="수정"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedTemplate(template);
                    setEditDocType(template.interdocs_type_name);
                    setIsEditModalOpen(true);
                  }}
                >
                  <img
                    src="/images/edit.svg"
                    alt="edit"
                    style={{ width: 16, height: 16 }}
                  />
                </ActionButton>
                <ActionButton
                  title="다운로드"
                  onClick={(e) => handleDownload(e, template.interdocs_id)}
                >
                  <img
                    src="/images/download.svg"
                    alt="download"
                    style={{ width: 18, height: 18 }}
                  />
                </ActionButton>
                <ActionButton
                  title="삭제"
                  onClick={(e) => {
                    e.stopPropagation();
                    setDeleteTargetId(template.interdocs_id);
                    setIsDeleteModalOpen(true);
                  }}
                >
                  <img
                    src="/images/trash.svg"
                    alt="delete"
                    style={{ width: 16, height: 16 }}
                  />
                </ActionButton>
              </CardActions>
              <TemplatePreview>
                <img
                  src={getFileIcon(template.interdocs_filename)}
                  alt="File icon"
                  style={{
                    width: '60px',
                    height: '60px',
                    objectFit: 'contain',
                  }}
                />
              </TemplatePreview>
              <TemplateInfo>
                <h3>{template.interdocs_filename}</h3>
                <div className="type">{template.interdocs_type_name}</div>
                <div className="date">
                  {new Date(template.interdocs_uploaded_date).toLocaleDateString()}
                </div>
                              </TemplateInfo>
              </TemplateCard>
            ))}
          </TemplateGrid>

        {/* 페이지네이션 */}
        {totalPages > 1 && (
          <Pagination>
            <PageNavButton
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              이전
            </PageNavButton>
            
            {renderPageNumbers()}
            
            <PageNavButton
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              다음
            </PageNavButton>
          </Pagination>
        )}

        {/* 생성 모달 */}
        <NewTemplateModal
          isOpen={isCreateModalOpen}
          onClose={closeCreateModal}
          onCreate={handleCreate}
          createDocType={createDocType}
          setCreateDocType={setCreateDocType}
          handleFileChange={handleFileChange}
        />

        {/* 수정 모달 */}
        <EditTemplateModal
          isOpen={isEditModalOpen}
          onClose={closeEditModal}
          onUpdate={handleUpdate}
          onDelete={() =>
            selectedTemplate && handleDelete(selectedTemplate.interdocs_id)
          }
          selectedTemplate={selectedTemplate}
          editDocType={editDocType}
          setEditDocType={setEditDocType}
          handleFileChange={handleFileChange}
        />

        {/* 삭제 확인 모달 */}
        <DeleteModal $isOpen={isDeleteModalOpen}>
          <DeleteModalContent>
            <CloseButton
              onClick={() => {
                setIsDeleteModalOpen(false);
                setDeleteTargetId(null);
              }}
            >
              ×
            </CloseButton>
            <DeleteTitle>정말 삭제하시겠습니까?</DeleteTitle>
            <DeleteDesc>삭제한 템플릿은 복원할 수 없습니다.</DeleteDesc>
            <DeleteButton
              onClick={async () => {
                if (deleteTargetId) {
                  await handleDelete(deleteTargetId);
                }
                setIsDeleteModalOpen(false);
                setDeleteTargetId(null);
              }}
            >
              삭제
            </DeleteButton>
          </DeleteModalContent>
        </DeleteModal>
      </MainContent>
    </Container>
  );
};

export default AdminTemplate;
