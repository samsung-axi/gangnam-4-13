// react-big-calendar와 moment가 설치되어 있어야 합니다.
// 설치 명령: npm install react-big-calendar moment
// 타입: npm install --save-dev @types/react-big-calendar @types/moment

import { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import type { CalendarEvent as OriginalCalendarEvent } from './event-utils';
import { isSameDay } from 'date-fns';

import {
  FiChevronLeft,
  FiChevronRight,
  FiSearch,
  FiPlus,
  FiCalendar,
} from 'react-icons/fi';
import CalendarPop from './popup/calendarPop';
import {
  Container,
  Header,
  ControlsSection,
  SectionTitle,
  SearchContainer,
  SearchInput,
  FilterContainer,
  FilterCheckbox,
  FilterSelect,
  ApplyButton,
  CalendarWrapper,
  MonthNav,
  MonthText,
  NavButton,
  TodayButton,
  CalendarLayout,
  CalendarFixedBox,
  UnscheduledPanel,
  TaskList,
  TaskItem,
  TaskCheckbox,
  TaskTitle,
  FloatingAddButton,
  Tooltip,
  EmptyState,
  EmptyIcon,
  EmptyTitle,
} from './Calendar.styles';

import NewMeetingPopup from './popup/new_meeting';
// import { useAuth } from '../../contexts/AuthContext';

type ProjectUser = {
  user_id: string;
  name: string;
  email: string;
  user_jobname: string;
};

type CalendarEvent = OriginalCalendarEvent & {
    meeting_id?: string;
};

function formatYearMonth(date: Date) {
  return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(
    2,
    '0'
  )}`;
}

function YearMonthPicker({
  currentDate,
  onChange,
  onClose,
}: {
  currentDate: Date;
  onChange: (year: number, month: number) => void;
  onClose: () => void;
}) {
  const [year, setYear] = useState(currentDate.getFullYear());
  const [month, setMonth] = useState(currentDate.getMonth() + 1);
  return (
    <div
      style={{
        position: 'absolute',
        top: 60,
        left: '50%',
        transform: 'translateX(-50%)',
        background: '#fff',
        border: '2px solid #e5e7eb',
        borderRadius: 12,
        padding: 20,
        zIndex: 100,
        boxShadow: '0 4px 24px rgba(45, 17, 85, 0.1)',
        width: 320,
        minWidth: 320,
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
          width: '100%',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            width: '100%',
          }}
        >
          <select
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            style={{
              fontSize: '1rem',
              padding: '8px 12px',
              borderRadius: 8,
              border: '1px solid #d1d5db',
              flex: 1,
              minWidth: 80,
            }}
          >
            {Array.from({ length: 20 }, (_, i) => 2015 + i).map((y) => (
              <option key={y} value={y}>
                {y}년
              </option>
            ))}
          </select>
          <select
            value={month}
            onChange={(e) => setMonth(Number(e.target.value))}
            style={{
              fontSize: '1rem',
              padding: '8px 12px',
              borderRadius: 8,
              border: '1px solid #d1d5db',
              flex: 1,
              minWidth: 80,
            }}
          >
            {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
              <option key={m} value={m}>
                {m}월
              </option>
            ))}
          </select>
        </div>
        <div
          style={{
            display: 'flex',
            gap: 8,
            justifyContent: 'flex-end',
          }}
        >
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: '1px solid #d1d5db',
              color: '#6b7280',
              fontWeight: 500,
              fontSize: '0.875rem',
              cursor: 'pointer',
              padding: '8px 16px',
              borderRadius: 8,
              transition: 'all 0.2s ease',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = '#f9fafb';
              e.currentTarget.style.borderColor = '#9ca3af';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'none';
              e.currentTarget.style.borderColor = '#d1d5db';
            }}
          >
            닫기
          </button>
          <ApplyButton
            onClick={() => onChange(year, month)}
            style={{
              padding: '8px 16px',
              fontSize: '0.875rem',
              minWidth: 60,
            }}
          >
            이동
          </ApplyButton>
        </div>
      </div>
    </div>
  );
}

export default function CalendarPage() {
  const [value, setValue] = useState<Date>(new Date(2025, 5, 1));
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [showPicker, setShowPicker] = useState(false);
  const [popupDate, setPopupDate] = useState<Date | null>(null);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(
    null
  );
  const [projects, setProjects] = useState<
    { project_id: string; project_name: string }[]
  >([]);
  const [unscheduledOpen, setUnscheduledOpen] = useState(true);
  const [addBtnHover, setAddBtnHover] = useState(false);
  const [showNewMeeting, setShowNewMeeting] = useState(false);

  // 새로 추가된 상태들
  const [searchTerm, setSearchTerm] = useState('');
  const [showMeetings, setShowMeetings] = useState(true);
  const [showTodos, setShowTodos] = useState(true);

  // const { user } = useAuth();
  const [userDetail, setUserDetail] = useState<{
    user_name: string;
    user_email: string;
    user_jobname: string;
  } | null>(null);
  const [projectUsers, setProjectUsers] = useState<ProjectUser[]>([]);

  console.log(userDetail);

  // 1. 로그인한 사용자의 user_id를 먼저 가져온다
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/v1/users/one`, {
      credentials: 'include',
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.user_id) {
          setUserId(data.user_id);
          // 사용자 상세 정보도 함께 저장
          setUserDetail({
            user_name: data.user_name || '',
            user_email: data.user_email || '',
            user_jobname: data.user_jobname || '',
          });
        }
      })
      .catch((err) => {
        console.error('유저 정보 불러오기 실패:', err);
      });
  }, []);

  useEffect(() => {
    if (!userId) return;
    fetch(`${import.meta.env.VITE_API_URL}/api/v1/projects/user_id/${userId}`, {
      credentials: 'include',
    })
      .then((res) => res.json())
      .then((data) => {
        // 중첩된 구조에서 project_id, project_name만 추출
        const projectList = data.map((item: any) => ({
          project_id: item.project.project_id,
          project_name: item.project.project_name,
        }));
        setProjects(projectList);
        // 기본값을 "전체 프로젝트"로 설정 (null)
        setSelectedProjectId(null);
      });
  }, [userId]);

  useEffect(() => {
    if (!userId) return;

    // 전체 프로젝트 선택 시 모든 프로젝트의 캘린더 데이터를 가져옴
    if (!selectedProjectId) {
      // 모든 프로젝트의 캘린더 데이터를 병합해서 가져오기
      const fetchAllCalendarData = async () => {
        try {
          const allEvents: any[] = [];
          for (const project of projects) {
            const response = await fetch(
              `${import.meta.env.VITE_API_URL}/api/v1/calendar/${userId}/${
                project.project_id
              }`,
              { credentials: 'include' }
            );
            const data = await response.json();
            allEvents.push(...data);
          }

          setEvents(
            allEvents
              .filter((ev: any) => ev.start) // start가 있는 이벤트만 포함
              .map((ev: any) => ({
                id: ev.calendar_id,
                user_id: ev.user_id,
                project_id: ev.project_id,
                title: ev.title,
                start: new Date(ev.start),
                end: ev.end ? new Date(ev.end) : undefined,
                type: ev.calendar_type,
                completed: ev.completed,
                created_at: ev.created_at,
                updated_at: ev.updated_at,
              }))
          );
        } catch (error) {
          console.error('전체 캘린더 데이터 불러오기 실패:', error);
          setEvents([]);
        }
      };

      if (projects.length > 0) {
        fetchAllCalendarData();
      }
      return;
    }

    // 특정 프로젝트 선택 시
    fetch(
      `${
        import.meta.env.VITE_API_URL
      }/api/v1/calendar/${userId}/${selectedProjectId}`,
      {
        credentials: 'include',
      }
    )
      .then((res) => res.json())
      .then((data) => {
        setEvents(
          data.map((ev: any) => ({
            id: ev.calendar_id,
            user_id: ev.user_id,
            project_id: ev.project_id,
            title: ev.title,
            start: ev.start ? new Date(ev.start) : undefined,
            end: ev.end ? new Date(ev.end) : undefined,
            type: ev.calendar_type,
            completed: ev.completed,
            created_at: ev.created_at,
            updated_at: ev.updated_at,
          }))
        );
      })
      .catch((error) => {
        console.error('캘린더 데이터 불러오기 실패:', error);
        setEvents([]);
      });
  }, [userId, selectedProjectId, projects]);

  useEffect(() => {
    if (!selectedProjectId) {
      // 전체 프로젝트 선택 시 모든 프로젝트의 사용자 정보 병합
      const fetchAllProjectUsers = async () => {
        try {
          const allUsers: ProjectUser[] = [];
          const userIds = new Set<string>(); // 중복 제거용

          for (const project of projects) {
            const response = await fetch(
              `${import.meta.env.VITE_API_URL}/api/v1/stt/project-users/${
                project.project_id
              }`,
              { credentials: 'include' }
            );
            const data = await response.json();
            const users = data.users || [];

            // 중복 사용자 제거하면서 추가
            users.forEach((user: ProjectUser) => {
              if (!userIds.has(user.user_id)) {
                userIds.add(user.user_id);
                allUsers.push(user);
              }
            });
          }

          setProjectUsers(allUsers);
        } catch (error) {
          console.error('전체 프로젝트 사용자 불러오기 실패:', error);
          setProjectUsers([]);
        }
      };

      if (projects.length > 0) {
        fetchAllProjectUsers();
      }
      return;
    }

    // 특정 프로젝트 선택 시
    fetch(
      `${
        import.meta.env.VITE_API_URL
      }/api/v1/stt/project-users/${selectedProjectId}`,
      {
        credentials: 'include',
      }
    )
      .then((res) => res.json())
      .then((data) => {
        setProjectUsers(data.users || []);
      })
      .catch((error) => {
        console.error('프로젝트 사용자 불러오기 실패:', error);
        setProjectUsers([]);
      });
  }, [selectedProjectId, projects]);

  // const handleToggleTodo = (id: string) => {
  //   setEvents((prevEvents) =>
  //     prevEvents.map((ev) =>
  //       ev.id === id && ev.type === 'todo'
  //         ? { ...ev, completed: !ev.completed }
  //         : ev
  //     )
  //   );
  // };

  // 월 이동 함수
  // const handlePrevMonth = () => {
  //   setValue((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  // };
  // const handleNextMonth = () => {
  //   setValue((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  // };

  // const handleYearMonthClick = () => setShowPicker(true);
  const handleYearMonthChange = (year: number, month: number) => {
    setValue(new Date(year, month - 1, 1));
    setShowPicker(false);
  };

  // const handleToday = () => {
  //   setValue(new Date());
  //   setShowPicker(false);
  // };

  // completed만 수정하는 간단한 핸들러
  const handleEditCompleted = (id: string, completed: boolean) => {
    // 해당 id로 이벤트 찾기
    const event = events.find(ev => ev.id === id);
    // meeting_id가 있으면 body에 포함
    const body: any = {
        calendar_id: id,
        completed: completed,
    };
    if (event && event.meeting_id) {
        body.meeting_id = event.meeting_id;
    }
    fetch(`${import.meta.env.VITE_API_URL}/api/v1/calendar/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(body),
    })
        .then((res) => res.json())
        .then((data) => {
            setEvents((prev) =>
                prev.map((ev) =>
                    ev.id === id ? { ...ev, completed: data.completed } : ev
                )
            );
        });
  };

  // 팝업 닫기 함수 추가 (팝업이 닫힐 때 포커스 해제)
  // const handleClosePopup = () => {
  //   setPopupDate(null);
  //   if (document.activeElement instanceof HTMLElement) {
  //     document.activeElement.blur();
  //   }
  // };

  // 검색 및 필터 기능
  const filteredEvents = events.filter((event) => {
    // 검색어 필터링
    if (
      searchTerm &&
      !event.title.toLowerCase().includes(searchTerm.toLowerCase())
    ) {
      return false;
    }

    // 유형별 필터링
    if (event.type === 'meeting' && !showMeetings) {
      return false;
    }
    if (event.type === 'todo' && !showTodos) {
      return false;
    }

    return true;
  });

  // 일정 미정 task 필터
  const unscheduledTodos = filteredEvents.filter(
    (ev) => ev.type === 'todo' && !ev.end
  );

  const changeMonth = (direction: number) => {
    const newDate = new Date(value);
    newDate.setMonth(newDate.getMonth() + direction);
    setValue(newDate);
  };

  // 현재 월의 일정만 필터링하는 함수
  const getCurrentMonthEvents = () => {
    return filteredEvents.filter((event) => {
      if (!event.start) return false;
      const eventDate = new Date(event.start);
      return (
        eventDate.getFullYear() === value.getFullYear() &&
        eventDate.getMonth() === value.getMonth()
      );
    });
  };

  // 현재 월의 회의와 할일 개수 계산
  const getCurrentMonthCounts = () => {
    const currentMonthEvents = getCurrentMonthEvents();
    const meetings = currentMonthEvents.filter(
      (event) => event.type === 'meeting'
    );
    const todos = currentMonthEvents.filter((event) => event.type === 'todo');
    return { meetings: meetings.length, todos: todos.length };
  };

  const renderTileContent = (date: Date) => {
    const day = date.getDate();
    const dayTodos = filteredEvents.filter(
      (ev) => ev.type === 'todo' && ev.end && isSameDay(new Date(ev.end), date)
    );
    const dayMeetings = filteredEvents.filter(
      (ev) =>
        ev.type === 'meeting' && ev.start && isSameDay(new Date(ev.start), date)
    );

    const dayOfWeek = date.getDay();
    const isCurrentMonth = date.getMonth() === value.getMonth();
    let dayClass = '';
    if (isCurrentMonth) {
      if (dayOfWeek === 0) dayClass = 'calendar-sunday';
      else if (dayOfWeek === 6) dayClass = 'calendar-saturday';
      else dayClass = 'calendar-weekday';
    } else {
      dayClass = 'calendar-other-month';
    }

    return (
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          minHeight: '100px',
          cursor: 'pointer',
          padding: '8px',
          boxSizing: 'border-box',
        }}
        onClick={(e) => {
          e.stopPropagation();
          setPopupDate(date);
        }}
      >
        <span
          className={dayClass}
          style={{
            position: 'absolute',
            top: 8,
            right: 8,
            fontSize: '1.05rem',
            fontWeight: 500,
            zIndex: 2,
            lineHeight: 1,
          }}
        >
          {day}
        </span>
        <div
          style={{
            width: '100%',
            paddingTop: 32,
            paddingLeft: 4,
            paddingRight: 4,
            display: 'flex',
            flexDirection: 'column',
            gap: 6,
          }}
        >
          {/* 회의 개수 표시 */}
          {dayMeetings.length > 0 && (
            <div
              style={{
                padding: '3px 6px',
                background: 'linear-gradient(135deg, #f3e8ff 0%, #e9d5ff 100%)',
                border: '1px solid #c084fc',
                borderRadius: 6,
                fontSize: '0.7rem',
                fontWeight: 600,
                color: '#6b21a8',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                textAlign: 'center',
                lineHeight: 1.2,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-1px)';
                e.currentTarget.style.boxShadow =
                  '0 2px 8px rgba(107, 33, 168, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              회의 ({dayMeetings.length})
            </div>
          )}

          {/* 할일 개수 표시 */}
          {dayTodos.length > 0 && (
            <div
              style={{
                padding: '3px 6px',
                background: dayTodos.every((t) => t.completed)
                  ? 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)'
                  : 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
                border: dayTodos.every((t) => t.completed)
                  ? '1px solid #86efac'
                  : '1px solid #fbbf24',
                borderRadius: 6,
                fontSize: '0.7rem',
                fontWeight: 600,
                color: dayTodos.every((t) => t.completed)
                  ? '#166534'
                  : '#a16207',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                textAlign: 'center',
                lineHeight: 1.2,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-1px)';
                e.currentTarget.style.boxShadow = dayTodos.every(
                  (t) => t.completed
                )
                  ? '0 2px 8px rgba(22, 101, 52, 0.2)'
                  : '0 2px 8px rgba(161, 98, 7, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              할일 ({dayTodos.filter((t) => t.completed).length}/
              {dayTodos.length})
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <Container>
      <Header></Header>

      <ControlsSection>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginLeft: '50px' }}>
          <SectionTitle style={{ margin: 0 }}>
            {formatYearMonth(value)}
          </SectionTitle>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div
              style={{
                padding: '4px 12px',
                background: 'linear-gradient(135deg, #f3e8ff 0%, #e9d5ff 100%)',
                border: '1px solid #c084fc',
                borderRadius: '20px',
                fontSize: '0.875rem',
                fontWeight: '600',
                color: '#6b21a8',
              }}
            >
              회의 ({getCurrentMonthCounts().meetings})
            </div>
            <div
              style={{
                padding: '4px 12px',
                background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
                border: '1px solid #fbbf24',
                borderRadius: '20px',
                fontSize: '0.875rem',
                fontWeight: '600',
                color: '#a16207',
              }}
            >
              할일 ({getCurrentMonthCounts().todos})
            </div>
          </div>
        </div>

        <FilterContainer>
          <FilterSelect
            value={selectedProjectId || '전체'}
            onChange={(e) => {
              const value = e.target.value;
              setSelectedProjectId(value === '전체' ? null : value);
            }}
          >
            <option value="전체">전체 프로젝트</option>
            {projects.map((proj) => (
              <option key={proj.project_id} value={proj.project_id}>
                {proj.project_name}
              </option>
            ))}
          </FilterSelect>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '20px',
            }}
          >
            <FilterCheckbox>
              <input
                type="checkbox"
                checked={showMeetings}
                onChange={(e) => setShowMeetings(e.target.checked)}
              />
              회의
            </FilterCheckbox>

            <FilterCheckbox>
              <input
                type="checkbox"
                checked={showTodos}
                onChange={(e) => setShowTodos(e.target.checked)}
              />
              할일
            </FilterCheckbox>
          </div>

          <SearchContainer>
            <FiSearch size={18} color="#9ca3af" />
            <SearchInput
              type="text"
              placeholder="검색"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </SearchContainer>
        </FilterContainer>
      </ControlsSection>

      <CalendarLayout>
        <CalendarFixedBox>
          <CalendarWrapper>
            <MonthNav>
              <NavButton onClick={() => changeMonth(-1)}>
                <FiChevronLeft />
              </NavButton>
              <MonthText
                onClick={() => setShowPicker(!showPicker)}
                style={{ cursor: 'pointer' }}
              >
                {formatYearMonth(value)}
              </MonthText>
              <NavButton onClick={() => changeMonth(1)}>
                <FiChevronRight />
              </NavButton>
              <TodayButton onClick={() => setValue(new Date())}>
                오늘
              </TodayButton>
              {showPicker && (
                <YearMonthPicker
                  currentDate={value}
                  onChange={handleYearMonthChange}
                  onClose={() => setShowPicker(false)}
                />
              )}
            </MonthNav>

            <Calendar
              locale="ko-KR"
              value={value}
              onClickDay={(date) => setPopupDate(date)}
              tileContent={({ date }) => <div>{renderTileContent(date)}</div>}
              tileClassName={({ date }) =>
                date.getDay() === 0
                  ? 'calendar-sunday'
                  : date.getDay() === 6
                  ? 'calendar-saturday'
                  : ''
              }
              calendarType="gregory"
              formatShortWeekday={(locale, date) => {
                console.log(locale);
                const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
                return weekdays[date.getDay()];
              }}
            />
          </CalendarWrapper>
        </CalendarFixedBox>

        <UnscheduledPanel
          $open={unscheduledOpen}
          onClick={() => setUnscheduledOpen(!unscheduledOpen)}
        >
          <h3
            style={{
              margin: '0 0 12px 0',
              fontSize: unscheduledOpen ? '1.1rem' : '1.5rem',
              color: '#b45309',
              textAlign: 'center',
              cursor: 'pointer',
              userSelect: 'none',
            }}
          >
            {unscheduledOpen ? '일정 미정 할일' : '📋'}
          </h3>
          {unscheduledOpen && (
            <TaskList>
              {unscheduledTodos.length > 0 ? (
                unscheduledTodos.map((todo) => (
                  <TaskItem
                    key={todo.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditCompleted(todo.id, !todo.completed);
                    }}
                  >
                    <TaskCheckbox
                      checked={todo.completed}
                      onChange={(e) => e.stopPropagation()}
                    />
                    <TaskTitle completed={todo.completed || false}>
                      {todo.title}
                    </TaskTitle>
                  </TaskItem>
                ))
              ) : (
                <EmptyState>
                  <EmptyIcon>📝</EmptyIcon>
                  <EmptyTitle>
                    {searchTerm
                      ? '조건에 맞는 할일이 없습니다'
                      : '일정 미정 할일이 없습니다'}
                  </EmptyTitle>
                </EmptyState>
              )}
            </TaskList>
          )}
        </UnscheduledPanel>
      </CalendarLayout>

      <FloatingAddButton
        onMouseEnter={() => setAddBtnHover(true)}
        onMouseLeave={() => setAddBtnHover(false)}
        onClick={() => setShowNewMeeting(true)}
      >
        <div
          style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <FiCalendar size={20} />
          <FiPlus
            size={12}
            style={{
              position: 'absolute',
              top: '-6px',
              right: '-6px',
              background: '#1a0b3d',
              borderRadius: '50%',
              padding: '2px',
              border: '1px solid white',
            }}
          />
        </div>
      </FloatingAddButton>
      {addBtnHover && <Tooltip>새 일정 등록</Tooltip>}

      {popupDate && (
        <CalendarPop
          date={popupDate}
          todos={filteredEvents.filter(
            (event) =>
              event.type === 'todo' &&
              event.end &&
              isSameDay(new Date(event.end), popupDate)
          )}
          meetings={filteredEvents.filter(
            (event) =>
              event.type === 'meeting' &&
              event.start &&
              isSameDay(new Date(event.start), popupDate)
          )}
          onClose={() => setPopupDate(null)}
          onEdit={(id, completed) => handleEditCompleted(id, completed)}
        />
      )}

      {showNewMeeting && (
        <NewMeetingPopup
          onClose={() => setShowNewMeeting(false)}
          onSuccess={() => {
            setShowNewMeeting(false);
            // 캘린더 데이터 새로고침
            if (userId && selectedProjectId) {
              fetch(
                `${
                  import.meta.env.VITE_API_URL
                }/api/v1/calendar/${userId}/${selectedProjectId}`,
                { credentials: 'include' }
              )
                .then((res) => res.json())
                .then((data) => {
                  setEvents(
                    data.map((ev: any) => ({
                      id: ev.calendar_id,
                      user_id: ev.user_id,
                      project_id: ev.project_id,
                      title: ev.title,
                      start: ev.start ? new Date(ev.start) : undefined,
                      end: ev.end ? new Date(ev.end) : undefined,
                      type: ev.calendar_type,
                      completed: ev.completed,
                      created_at: ev.created_at,
                      updated_at: ev.updated_at,
                    }))
                  );
                });
            }
          }}
          projectName={
            projects.find((p) => p.project_id === selectedProjectId)
              ?.project_name || ''
          }
          projectId={selectedProjectId || ''}
          userId={userId || ''}
          projectUsers={projectUsers}
        />
      )}
    </Container>
  );
}
