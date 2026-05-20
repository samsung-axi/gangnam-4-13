import React, { useEffect, useState } from 'react';
import {
  FiEdit2,
  FiPlus,
  FiCalendar,
  FiSearch,
  FiChevronUp,
  FiChevronDown,
  FiUsers,
} from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { fetchProject } from '../../api/fetchProject';
import type { ProjectUser, ProjectResponse } from '../../types/project';
import { checkAuth } from '../../api/fetchAuthCheck';
import { useAuth } from '../../contexts/AuthContext';
import EditProjectPopup from '../insert_conference_info/conference_popup/EditProjectPopup';
import NewProjectPopup from '../insert_conference_info/conference_popup/NewProjectPopup';
import {
  AddButton,
  Container,
  Header,
  Title,
  ControlsSection,
  SectionTitle,
  SearchContainer,
  SearchInput,
  ListWrapper,
  Table,
  Thead,
  Tbody,
  Th,
  Tr,
  Td,
  ActionButtons,
  ActionButton,
  DateBadge,
  EmptyState,
  EmptyIcon,
  EmptyTitle,
  EmptyDescription,
  Pagination,
  PageButton,
  PageNavButton,
  SortableHeader,
  SortIconContainer,
  SortIcon,
} from './projectlist.styles';

// 정렬 타입 정의
type SortField = 'name' | 'date' | null;
type SortOrder = 'asc' | 'desc';

const ProjectListPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, setUser, setLoading } = useAuth();
  const [projects, setProjects] = useState<ProjectUser[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  // const [editId, setEditId] = useState<string | null>(null);
  // const [editName , setEditName] = useState<string>('');

  // 프로젝트 수정 팝업 상태
  const [showEditProjectPopup, setShowEditProjectPopup] = useState(false);
  const [editingProject, setEditingProject] = useState<ProjectResponse | null>(
    null
  );

  // 새 프로젝트 생성 팝업 상태
  const [showNewProjectPopup, setShowNewProjectPopup] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // 헤더 클릭 시 정렬 토글
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      // 같은 필드 클릭 시 순서 토글
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      // 다른 필드 클릭 시 해당 필드로 정렬
      setSortField(field);
      // 날짜 필드는 최신순(desc)으로, 이름 필드는 오름차순(asc)으로 시작
      setSortOrder(field === 'date' ? 'desc' : 'asc');
    }
  };

  // 정렬 함수
  const sortProjects = (projects: ProjectUser[]) => {
    if (!sortField) return projects;

    const sorted = [...projects];

    return sorted.sort((a, b) => {
      if (sortField === 'name') {
        const aValue: string = a.project.project_name;
        const bValue: string = b.project.project_name;
        const result = aValue.localeCompare(bValue, 'ko', {
          sensitivity: 'base',
        });
        return sortOrder === 'asc' ? result : -result;
      } else if (sortField === 'date') {
        const aValue = new Date(a.project.project_created_date);
        const bValue = new Date(b.project.project_created_date);
        const result = aValue.getTime() - bValue.getTime();
        return sortOrder === 'asc' ? result : -result;
      }

      return 0;
    });
  };

  // 검색어에 따른 프로젝트 필터링 및 정렬
  const filteredAndSortedProjects = sortProjects(
    projects.filter((project) =>
      project.project.project_name
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    )
  );

  // 현재 페이지에 보여줄 프로젝트 계산
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProjects = filteredAndSortedProjects.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredAndSortedProjects.length / itemsPerPage);

  // 페이지네이션 관련
  const pageGroupSize = 5;
  const pageGroup = Math.floor((currentPage - 1) / pageGroupSize);
  const startPage = pageGroup * pageGroupSize + 1;
  const endPage = Math.min(startPage + pageGroupSize - 1, totalPages);
  const pageNumbers = [];
  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  useEffect(() => {
    if (user?.id) {
      fetchProject(user?.id).then((data) => {
        if (data) {
          setProjects(data);
        }
      });
    }
  }, [user]);

  useEffect(() => {
    (async () => {
      const user = await checkAuth();
      if (user) {
        setUser(user);
      }
      setLoading(false);
    })();
  }, []);

  // 검색어나 정렬이 변경되면 첫 페이지로 이동
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, sortField, sortOrder]);

  const handleEdit = (project: ProjectUser) => {
    const projectResponse: ProjectResponse = {
      projectId: project.project.project_id,
      projectName: project.project.project_name,
      projectDetail: project.project.project_detail || '',
      projectCreatedDate: project.project.project_created_date,
    };
    setEditingProject(projectResponse);
    setShowEditProjectPopup(true);
  };

  const closeEditPopup = () => {
    setEditingProject(null);
    setShowEditProjectPopup(false);
    if (user?.id) {
      fetchProject(user.id).then((data) => {
        if (data) {
          setProjects(data);
        }
      });
    }
  };

  // const handleEditSave = async (id: string) => {
  //   try {
  //     await updateProjectName(id, editName);
  //     alert('수정 완료');
  //     setEditId(null);

  //     // 데이터 새로고침
  //     if (user?.id) {
  //       const data = await fetchProject(user.id);
  //       if (data) setProjects(data);
  //     }
  //   } catch (err) {
  //     alert('수정 실패');
  //   }
  // };

  const closeNewProjectPopup = () => {
    setShowNewProjectPopup(false);
    if (user?.id) {
      fetchProject(user.id).then((data) => {
        if (data) {
          setProjects(data);
        }
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString)
      .toLocaleDateString('ko-KR', {
        timeZone: 'Asia/Seoul',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      })
      .replace(/\./g, '-')
      .replace(/-$/, ''); // 마지막 하이픈 제거
  };

  // 정렬 아이콘 렌더링 (엘리베이터 스타일)
  const renderSortIcons = (field: SortField) => {
    const isActive = sortField === field;
    const isAsc = isActive && sortOrder === 'asc';
    const isDesc = isActive && sortOrder === 'desc';

    return (
      <SortIconContainer className={isActive ? 'active' : 'inactive'}>
        <SortIcon className={isAsc ? 'active' : ''}>
          <FiChevronUp />
        </SortIcon>
        <SortIcon className={isDesc ? 'active' : ''}>
          <FiChevronDown />
        </SortIcon>
      </SortIconContainer>
    );
  };

  return (
    <Container>
      <Header>
        <Title>분석결과 조회</Title>
        <AddButton onClick={() => setShowNewProjectPopup(true)}>
          <FiPlus />새 프로젝트
        </AddButton>
      </Header>

      <ControlsSection>
        <SectionTitle>프로젝트 목록</SectionTitle>
        <SearchContainer>
          <FiSearch style={{ color: '#9ca3af' }} />
          <SearchInput
            type="text"
            placeholder="프로젝트명으로 검색..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </SearchContainer>
      </ControlsSection>

      {filteredAndSortedProjects.length === 0 && !searchTerm ? (
        <EmptyState>
          <EmptyIcon>📁</EmptyIcon>
          <EmptyTitle>아직 프로젝트가 없습니다</EmptyTitle>
          <EmptyDescription>
            새 프로젝트 버튼을 클릭하여 첫 번째 프로젝트를 생성해보세요.
          </EmptyDescription>
        </EmptyState>
      ) : filteredAndSortedProjects.length === 0 && searchTerm ? (
        <EmptyState>
          <EmptyIcon>🔍</EmptyIcon>
          <EmptyTitle>검색 결과가 없습니다</EmptyTitle>
          <EmptyDescription>다른 검색어로 다시 시도해보세요.</EmptyDescription>
        </EmptyState>
      ) : (
        <>
          <ListWrapper>
            <Table>
              <Thead>
                <tr>
                  <Th className="sortable" onClick={() => handleSort('name')}>
                    <SortableHeader>
                      <span>프로젝트명</span>
                      {renderSortIcons('name')}
                    </SortableHeader>
                  </Th>
                  <Th className="sortable" onClick={() => handleSort('date')}>
                    <SortableHeader>
                      <span>생성일</span>
                      {renderSortIcons('date')}
                    </SortableHeader>
                  </Th>
                  <Th>참여 인원</Th>
                  <Th>관리</Th>
                </tr>
              </Thead>
              <Tbody>
                {currentProjects.map((project, i) => (
                  <Tr
                    key={i + indexOfFirstItem}
                    onClick={() =>
                      navigate(`/conferencelist/${project.project.project_id}`)
                    }
                  >
                    <Td className="project-name">
                      {project.project.project_name}
                    </Td>
                    <Td className="date">
                      <DateBadge>
                        <FiCalendar />
                        {formatDate(project.project.project_created_date)}
                      </DateBadge>
                    </Td>
                    <Td className="users">
                      <DateBadge>
                        <FiUsers />
                        {project.user_count}명
                      </DateBadge>
                    </Td>
                    <Td className="actions">
                      <ActionButtons>
                        <ActionButton
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEdit(project);
                          }}
                        >
                          <FiEdit2 />
                        </ActionButton>
                      </ActionButtons>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </ListWrapper>

          {totalPages > 1 && (
            <Pagination>
              <PageNavButton
                onClick={() => setCurrentPage(startPage - 1)}
                disabled={startPage <= 1}
              >
                이전
              </PageNavButton>

              {pageNumbers.map((num) => (
                <PageButton
                  key={num}
                  onClick={() => setCurrentPage(num)}
                  $active={currentPage === num}
                >
                  {num}
                </PageButton>
              ))}

              <PageNavButton
                onClick={() => setCurrentPage(endPage + 1)}
                disabled={endPage >= totalPages}
              >
                다음
              </PageNavButton>
            </Pagination>
          )}
        </>
      )}

      {showEditProjectPopup && editingProject && (
        <EditProjectPopup
          projectToEdit={editingProject}
          onClose={closeEditPopup}
        />
      )}

      {showNewProjectPopup && (
        <NewProjectPopup onClose={closeNewProjectPopup} />
      )}
    </Container>
  );
};

export default ProjectListPage;
