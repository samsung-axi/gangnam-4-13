import React, { useEffect, useState } from "react";
import { FiCalendar, FiUsers, FiSearch, FiChevronRight, FiChevronUp, FiChevronDown, FiClock, FiCheckCircle } from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";
import { checkAuth } from "../../api/fetchAuthCheck";
import { useAuth } from "../../contexts/AuthContext";
import { fetchMeetingsWithUsers } from "../../api/fetchProject";
import {
  Container,
  Header,
  Title,
  Breadcrumb,
  BreadcrumbLink,
  BreadcrumbSeparator,
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
  DateBadge,
  AttendeeList,
  AttendeeChip,
  AttendeeCount,
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
  StatusBadge,
  FilterCheckbox,
} from "./conferencelist.styles";

// 정렬 타입 정의
type SortField = 'name' | 'date' | null;
type SortOrder = 'asc' | 'desc';

const ConferenceListPage: React.FC = () => {
  const { user, setUser, setLoading } = useAuth();
  const [meetings, setMeetings] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [showCompletedOnly, setShowCompletedOnly] = useState(true);
  const navigate = useNavigate();
  const { projectId } = useParams<{ projectId: string }>();

  // 페이징 상태
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
  const sortMeetings = (meetings: any[]) => {
    if (!sortField) return meetings;
    
    const sorted = [...meetings];
    
    return sorted.sort((a, b) => {
      if (sortField === 'name') {
        const aValue: string = a.meeting_title;
        const bValue: string = b.meeting_title;
        const result = aValue.localeCompare(bValue, 'ko', { sensitivity: 'base' });
        return sortOrder === 'asc' ? result : -result;
      } else if (sortField === 'date') {
        const aValue = new Date(a.meeting_date);
        const bValue = new Date(b.meeting_date);
        const result = aValue.getTime() - bValue.getTime();
        return sortOrder === 'asc' ? result : -result;
      }
      
      return 0;
    });
  };

  // 검색어와 완료 필터에 따른 회의 필터링 및 정렬
  const filteredAndSortedMeetings = sortMeetings(
    meetings.filter((meeting) => {
      const matchesSearch = meeting.meeting_title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = showCompletedOnly ? meeting.analysis_status === 'completed' : true;
      return matchesSearch && matchesFilter;
    })
  );

  // 페이징 계산
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentMeetings = filteredAndSortedMeetings.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredAndSortedMeetings.length / itemsPerPage);

  // 페이지네이션 그룹 계산
  const pageGroupSize = 5;
  const pageGroup = Math.floor((currentPage - 1) / pageGroupSize);
  const startPage = pageGroup * pageGroupSize + 1;
  const endPage = Math.min(startPage + pageGroupSize - 1, totalPages);
  const pageNumbers = [];
  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  useEffect(() => {
    if (projectId) {
      fetchMeetingsWithUsers(projectId).then((data) => {
        if (data) {
          console.log(data);
          setMeetings(data);
        }
      });
    }
  }, [user, projectId]);

  useEffect(() => {
    (async () => {
      const user = await checkAuth();
      if (user) {
        setUser(user);
      }
      setLoading(false);
    })();
  }, []);

  // 검색어나 정렬, 필터가 변경되면 첫 페이지로 이동
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, sortField, sortOrder, showCompletedOnly]);

  const formatDate = (dateString: string) => {
    return new Date(dateString)
      .toLocaleString('sv-SE', { timeZone: 'Asia/Seoul' })
      .replace('T', ' ')
      .slice(0, 16);
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

  // 분석 상태 렌더링
  const renderAnalysisStatus = (status: string) => {
    switch(status) {
      case 'completed':
        return (
          <StatusBadge status="completed">
            <FiCheckCircle />
            분석완료
          </StatusBadge>
        );
      case 'analyzing':
        return (
          <StatusBadge status="analyzing">
            <FiClock />
            분석중
          </StatusBadge>
        );
      case 'pending':
        return (
          <StatusBadge status="pending">
            <FiCalendar />
            분석전
          </StatusBadge>
        );
      default:
        return (
          <StatusBadge status="analyzing">
            <FiClock />
            분석중
          </StatusBadge>
        );
    }
  };

  return (
    <Container>
      <Header>
        <Title>분석결과 조회</Title>
      </Header>

      <Breadcrumb>
        <BreadcrumbLink onClick={() => navigate("/projectlist")}>
          프로젝트 목록
        </BreadcrumbLink>
        <BreadcrumbSeparator>
          <FiChevronRight />
        </BreadcrumbSeparator>
        <span>회의 목록</span>
      </Breadcrumb>

      <ControlsSection>
        <SectionTitle>회의 목록</SectionTitle>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <SearchContainer>
            <FiSearch style={{ color: '#9ca3af' }} />
            <SearchInput
              type="text"
              placeholder="회의명으로 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </SearchContainer>
          <FilterCheckbox>
            <input
              type="checkbox"
              checked={showCompletedOnly}
              onChange={(e) => setShowCompletedOnly(e.target.checked)}
            />
            분석완료만 보기
          </FilterCheckbox>
        </div>
      </ControlsSection>

      {filteredAndSortedMeetings.length === 0 && !searchTerm && !showCompletedOnly ? (
        <EmptyState>
          <EmptyIcon>📋</EmptyIcon>
          <EmptyTitle>아직 회의가 없습니다</EmptyTitle>
          <EmptyDescription>
            프로젝트에 회의를 추가하여 분석 결과를 확인해보세요.
          </EmptyDescription>
        </EmptyState>
      ) : filteredAndSortedMeetings.length === 0 && showCompletedOnly && !searchTerm ? (
        <EmptyState>
          <EmptyIcon>✅</EmptyIcon>
          <EmptyTitle>분석완료된 회의가 없습니다</EmptyTitle>
          <EmptyDescription>
            회의 분석이 완료되면 여기에 표시됩니다.
          </EmptyDescription>
        </EmptyState>
      ) : filteredAndSortedMeetings.length === 0 && searchTerm ? (
        <EmptyState>
          <EmptyIcon>🔍</EmptyIcon>
          <EmptyTitle>검색 결과가 없습니다</EmptyTitle>
          <EmptyDescription>
            다른 검색어로 다시 시도해보세요.
          </EmptyDescription>
        </EmptyState>
      ) : (
        <>
          <ListWrapper>
            <Table>
              <Thead>
                <tr>
                  <Th className="sortable" onClick={() => handleSort('name')}>
                    <SortableHeader>
                      <span>회의명</span>
                      {renderSortIcons('name')}
                    </SortableHeader>
                  </Th>
                  <Th className="sortable" onClick={() => handleSort('date')}>
                    <SortableHeader>
                      <span>회의 일시</span>
                      {renderSortIcons('date')}
                    </SortableHeader>
                  </Th>
                  <Th>참석자</Th>
                  <Th>상태</Th>
                </tr>
              </Thead>
              <Tbody>
                {currentMeetings.map((meeting, i) => (
                  <Tr
                    key={i + indexOfFirstItem}
                    onClick={() => {
                      // 분석완료된 회의만 클릭 가능
                      if (meeting.analysis_status === 'completed') {
                        navigate(`/dashboard/${meeting.meeting_id}`);
                      }
                    }}
                    style={{ 
                      cursor: meeting.analysis_status === 'completed' ? 'pointer' : 'not-allowed',
                      opacity: meeting.analysis_status === 'completed' ? 1 : 0.8
                    }}
                  >
                    <Td className="meeting-title">{meeting.meeting_title}</Td>
                    <Td className="date">
                      <DateBadge>
                        <FiCalendar />
                        {formatDate(meeting.meeting_date)}
                      </DateBadge>
                    </Td>
                    <Td className="attendees">
                      <AttendeeCount>
                        <FiUsers />
                        {meeting.meeting_users.length}명
                      </AttendeeCount>
                      <AttendeeList>
                        {meeting.meeting_users.map((mu: any, index: number) => (
                          <AttendeeChip key={index}>
                            {mu.user.user_name}
                          </AttendeeChip>
                        ))}
                      </AttendeeList>
                    </Td>
                    <Td className="status">
                      {renderAnalysisStatus(meeting.analysis_status)}
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
    </Container>
  );
};

export default ConferenceListPage;
