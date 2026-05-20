import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import DatePicker, { registerLocale } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { ko } from 'date-fns/locale';
import {
  FiCalendar,
  FiSearch,
  FiUser,
  // FiChevronDown,
  // FiChevronUp,
} from 'react-icons/fi';

// 한국어 locale 등록
registerLocale('ko', ko);
import {
  FormGroup,
  StyledLabel,
  StyledInput,
  StyledTextarea,
  CreateProjectButton,
  PopupOverlay,
  PopupContent,
} from '../../insert_conference_info/conference_popup/EditProjectPopup.styles';

const PopupHeader = styled.div`
  background: linear-gradient(135deg, #00b4ba 0%, #009ca2 100%);
  color: white;
  padding: 24px 28px;
  display: flex;
  align-items: center;
  gap: 16px;
  border-radius: 20px 20px 0 0;
  position: relative;
`;

const PopupTitle = styled.h2`
  font-size: 1.3rem;
  font-weight: 600;
  color: white;
  margin: 0;
  flex: 1;
  font-family: 'Rethink Sans', sans-serif;
`;

const PopupIcon = styled.div`
  width: 48px;
  height: 48px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
`;

const PopupBody = styled.div`
  padding: 28px;
  background: white;
  border-radius: 0 0 20px 20px;
`;

const StyledCloseButton = styled.button`
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  cursor: pointer;
  font-size: 16px;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: scale(1.05);
  }
`;

// 참석자 선택 관련 스타일
const UserSelectionPanel = styled.div`
  background: linear-gradient(135deg, #e0f7ff, #e6f9fc);
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 16px;
  box-shadow: 0 4px 12px rgba(0, 180, 186, 0.08);
  border: 1px solid rgba(0, 180, 186, 0.1);
`;

// const HostSelectionSection = styled.div`
//   margin-bottom: 24px;
//   padding-bottom: 20px;
//   border-bottom: 2px solid rgba(0, 180, 186, 0.1);
// `;

// const HostSectionTitle = styled.h4`
//   color: #00798d;
//   margin-bottom: 12px;
//   font-size: 1rem;
//   font-weight: 600;
//   display: flex;
//   align-items: center;
//   gap: 8px;
//   cursor: pointer;
//   user-select: none;

//   &:hover {
//     color: #00b4ba;
//   }
// `;

const AttendeesSectionTitle = styled.h4`
  color: #00798d;
  margin-bottom: 12px;
  font-size: 1rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const SearchAndActionsRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
`;

const SearchBox = styled.div`
  position: relative;
  flex: 1;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 10px 12px 10px 40px;
  border: 2px solid rgba(0, 180, 186, 0.2);
  border-radius: 8px;
  font-size: 0.9rem;
  box-sizing: border-box;
  background: rgba(255, 255, 255, 0.9);
  color: #00798d;

  &:focus {
    outline: none;
    border-color: #00b4ba;
    box-shadow: 0 0 0 3px rgba(0, 180, 186, 0.1);
  }

  &::placeholder {
    color: rgba(0, 121, 141, 0.6);
  }
`;

const SearchIcon = styled(FiSearch)`
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: rgba(0, 121, 141, 0.6);
  width: 16px;
  height: 16px;
`;

const ActionButton = styled.button`
  background: #00b4ba;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #009ca2;
    transform: translateY(-1px);
  }
`;

const UserGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 6px;
  max-height: 180px;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(0, 180, 186, 0.1);
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(0, 180, 186, 0.3);
    border-radius: 3px;

    &:hover {
      background: rgba(0, 180, 186, 0.5);
    }
  }
`;

const UserCard = styled.div<{ $selected: boolean; $isHost: boolean }>`
  display: flex;
  align-items: center;
  padding: 8px;
  border: 2px solid
    ${(props) =>
      props.$isHost
        ? '#00798d'
        : props.$selected
        ? '#00b4ba'
        : 'rgba(0, 180, 186, 0.2)'};
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  background: ${(props) =>
    props.$isHost
      ? 'rgba(0, 121, 141, 0.05)'
      : props.$selected
      ? 'rgba(0, 180, 186, 0.05)'
      : 'white'};

  &:hover {
    border-color: ${(props) => (props.$isHost ? '#00798d' : '#00b4ba')};
    background: ${(props) =>
      props.$isHost ? 'rgba(0, 121, 141, 0.08)' : 'rgba(0, 180, 186, 0.08)'};
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 180, 186, 0.15);
  }
`;

const UserCheckbox = styled.input`
  margin-right: 8px;
  width: 16px;
  height: 16px;
  accent-color: #00b4ba;
  cursor: pointer;
`;

const UserInfo = styled.div`
  flex: 1;
`;

const UserName = styled.div`
  font-weight: 600;
  color: #1f2937;
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.9rem;
`;

const UserEmail = styled.span`
  font-size: 0.75rem;
  color: #6b7280;
  font-weight: 400;
  margin-left: 6px;
`;

// const HostBadge = styled.div`
//   background: linear-gradient(135deg, #00b4ba, #009ca2);
//   color: white;
//   font-size: 0.65rem;
//   padding: 2px 4px;
//   border-radius: 3px;
//   font-weight: 500;
//   display: flex;
//   align-items: center;
//   gap: 2px;
// `;

const SelectedCount = styled.div`
  background: rgba(0, 180, 186, 0.1);
  color: #00798d;
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 600;
  border: 1px solid rgba(0, 180, 186, 0.2);
`;

// const AddAttendeeButton = styled.button`
//   background: #00b4ba;
//   color: white;
//   border: none;
//   width: 24px;
//   height: 24px;
//   border-radius: 50%;
//   cursor: pointer;
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   padding: 0;
//   font-size: 16px;
//   margin-left: 8px;
//   transition: all 0.2s ease;

//   &:hover {
//     background: #009ca2;
//     transform: scale(1.1);
//   }
// `;

// DatePicker 커스텀 스타일
const DatePickerWrapper = styled.div`
  .react-datepicker-wrapper {
    width: 100%;
  }

  .react-datepicker__input-container input {
    width: 100%;
    padding: 12px 15px;
    border: none;
    border-radius: 8px;
    background-color: rgba(255, 255, 255, 0.9);
    color: #333;
    font-size: 1rem;
    font-family: inherit;
    box-sizing: border-box;

    &:focus {
      outline: 2px solid #5dd3d9;
      background-color: #fff;
    }

    &::placeholder {
      color: #999;
    }
  }

  .react-datepicker {
    border: none;
    border-radius: 16px;
    box-shadow: 0 20px 40px rgba(93, 211, 217, 0.2);
    overflow: hidden;
    font-family: inherit;
  }

  .react-datepicker__header {
    background: linear-gradient(135deg, #5dd3d9, #4bc5cb);
    border-bottom: none;
    border-radius: 16px 16px 0 0;
    padding: 20px 0;
  }

  .react-datepicker__current-month {
    color: white;
    font-size: 1.1rem;
    font-weight: 600;
    margin-bottom: 10px;
  }

  .react-datepicker__day-names {
    background: rgba(93, 211, 217, 0.15);
    margin: 0;
    padding: 8px 0;
  }

  .react-datepicker__day-name {
    color: #3b9ba0;
    font-weight: 600;
    font-size: 0.85rem;
    width: 2.2rem;
    line-height: 2.2rem;
    margin: 0;
  }

  .react-datepicker__month {
    margin: 0;
    padding: 8px;
    background: white;
  }

  .react-datepicker__day {
    width: 2.2rem;
    height: 2.2rem;
    line-height: 2.2rem;
    margin: 2px;
    border-radius: 8px;
    font-size: 0.9rem;
    font-weight: 500;
    color: #374151;
    transition: all 0.2s ease;

    &:hover {
      background: rgba(93, 211, 217, 0.15);
      color: #3b9ba0;
      transform: scale(1.05);
    }
  }

  .react-datepicker__day--selected {
    background: linear-gradient(135deg, #5dd3d9, #4bc5cb);
    color: white;
    font-weight: 600;

    &:hover {
      background: linear-gradient(135deg, #4bc5cb, #3bb3ba);
      transform: scale(1.05);
    }
  }

  .react-datepicker__day--today {
    background: rgba(93, 211, 217, 0.2);
    color: #3b9ba0;
    font-weight: 600;
    border: 2px solid rgba(93, 211, 217, 0.4);
  }

  .react-datepicker__day--outside-month {
    color: #d1d5db;
  }

  .react-datepicker__navigation {
    top: 22px;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.25);
    transition: all 0.2s ease;

    &:hover {
      background: rgba(255, 255, 255, 0.4);
      transform: scale(1.1);
    }
  }

  .react-datepicker__navigation-icon::before {
    border-color: white;
    border-width: 2px 2px 0 0;
    width: 6px;
    height: 6px;
  }

  .react-datepicker__time-container {
    border-left: 1px solid rgba(93, 211, 217, 0.25);
    width: 120px;
  }

  .react-datepicker__time-container-header {
    display: none;
  }

  .react-datepicker__time-list {
    height: 320px !important;

    &::-webkit-scrollbar {
      width: 6px;
    }

    &::-webkit-scrollbar-track {
      background: #f1f5f9;
      border-radius: 3px;
    }

    &::-webkit-scrollbar-thumb {
      background: rgba(93, 211, 217, 0.4);
      border-radius: 3px;

      &:hover {
        background: rgba(93, 211, 217, 0.6);
      }
    }
  }

  .react-datepicker__time-list-item {
    height: 35px;
    line-height: 35px;
    padding: 0 12px;
    font-size: 0.9rem;
    transition: all 0.2s ease;

    &:hover {
      background: rgba(93, 211, 217, 0.15);
      color: #3b9ba0;
    }

    &--selected {
      background: #5dd3d9;
      color: white;
      font-weight: 600;
    }
  }
`;
// 이제 사용되지 않는 스타일들은 제거됨

interface ProjectUser {
  user_id: string;
  name: string;
  email: string;
  user_jobname: string;
}

interface Attendee {
  user_id: string;
  name: string;
  email: string;
  user_jobname: string;
}

interface NewMeetingPopupProps {
  onClose: () => void;
  onSuccess?: () => void;
  projectName: string;
  projectId: string;
  userId: string;
  projectUsers: ProjectUser[];
}

const ScrollablePopupContent = styled(PopupContent)`
  max-height: 80vh;
  overflow: hidden;
  border-radius: 20px;
  box-shadow: 0 20px 40px rgba(0, 180, 186, 0.15);
  border: 1px solid rgba(0, 180, 186, 0.1);
`;

const ScrollableBody = styled(PopupBody)`
  max-height: 60vh;
  overflow-y: auto;

  /* 스크롤바 스타일링 */
  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f5f9;
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 4px;
    transition: background 0.2s ease;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #94a3b8;
  }
`;

const NewMeetingPopup: React.FC<NewMeetingPopupProps> = ({
  onClose,
  onSuccess,
  projectName,
  projectId,
  projectUsers,
}) => {
  const [subject, setSubject] = useState('');
  const [meetingDate, setMeetingDate] = useState<Date | null>(null);
  const [agenda, setAgenda] = useState('');
  const [attendees, setAttendees] = useState<Attendee[]>([]);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [allSelected, setAllSelected] = useState(false);

  // 검색 관련 상태
  const [searchTerm, setSearchTerm] = useState('');

  // 회의장 선택 토글 상태
  // const [isHostSectionExpanded, setIsHostSectionExpanded] = useState(true);

  // 필터링된 사용자 목록 (검색어 적용)
  const filteredUsers = projectUsers.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 참석자 선택/해제 토글
  const handleAttendeeToggle = (user: ProjectUser) => {
    const isSelected = attendees.some((a) => a.user_id === user.user_id);

    if (isSelected) {
      // 이미 선택된 경우 제거
      setAttendees(attendees.filter((a) => a.user_id !== user.user_id));
    } else {
      // 선택되지 않은 경우 추가
      setAttendees([
        ...attendees,
        {
          user_id: user.user_id,
          name: user.name,
          email: user.email,
          user_jobname: user.user_jobname,
        },
      ]);
    }
  };

  // 전체 선택/해제 핸들러
  const handleSelectAll = () => {
    if (allSelected) {
      // 전체 해제
      setAttendees([]);
      setAllSelected(false);
    } else {
      // 전체 선택: 모든 사용자를 참석자로 선택
      setAttendees(
        projectUsers.map((u) => ({
          user_id: u.user_id,
          name: u.name,
          email: u.email,
          user_jobname: u.user_jobname,
        }))
      );
      setAllSelected(true);
    }
  };

  // 전체 선택 상태 체크
  useEffect(() => {
    const selectedCount = attendees.length;
    setAllSelected(selectedCount > 0 && selectedCount === projectUsers.length);
  }, [attendees, projectUsers]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !meetingDate) {
      setError('필수 항목을 입력해주세요.');
      return;
    }
    // 참석자 유효성 검사
    const invalid = attendees.some((a) => !a.user_id);
    if (invalid) {
      setError('모든 참석자를 선택해주세요.');
      return;
    }
    // 최소 1명의 참석자 확인
    if (attendees.filter((a) => a.user_id).length < 1) {
      setError('최소 1명의 참석자가 필요합니다.');
      return;
    }
    setIsSubmitting(true);
    setError('');
    try {
      // 모든 사용자를 참석자로
      const users = attendees.map((a) => ({
        user_id: a.user_id,
        role_id: 'a55afc22-b4c1-48a4-9513-c66ff6ed3965', // 참석자 role_id
      }));

      const body = {
        project_id: projectId,
        meeting_title: subject,
        meeting_agenda: agenda,
        meeting_date: meetingDate ? meetingDate.toISOString() : '',
        meeting_audio_path: 'app/none',
        users,
      };
      // 실제 API 호출
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/projects/meeting/create`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify(body),
        }
      );
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.detail || '회의 등록 실패');
      }
      alert('회의가 성공적으로 등록되었습니다!');
      onClose();
      if (onSuccess) onSuccess();
    } catch (error) {
      setError('회의 등록 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PopupOverlay>
      <ScrollablePopupContent style={{ minWidth: 420, maxWidth: 520 }}>
        <PopupHeader>
          <PopupIcon>
            <FiCalendar />
          </PopupIcon>
          <PopupTitle>새 회의 일정 등록</PopupTitle>
          <StyledCloseButton onClick={onClose}>×</StyledCloseButton>
        </PopupHeader>
        <ScrollableBody>
          <form onSubmit={handleSubmit}>
            <FormGroup>
              <StyledLabel>프로젝트명</StyledLabel>
              <StyledInput type="text" value={projectName} readOnly />
            </FormGroup>
            <FormGroup>
              <StyledLabel>
                회의 제목 <span style={{ color: '#dc3545' }}>*</span>
              </StyledLabel>
              <StyledInput
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="회의 제목을 입력하세요"
              />
            </FormGroup>
            <FormGroup>
              <StyledLabel>
                회의 일시 <span style={{ color: '#dc3545' }}>*</span>
              </StyledLabel>
              <DatePickerWrapper>
                <DatePicker
                  selected={meetingDate}
                  onChange={(date: Date | null) => setMeetingDate(date)}
                  showTimeSelect
                  timeFormat="HH:mm"
                  timeIntervals={15}
                  dateFormat="yyyy년 MM월 dd일 HH:mm"
                  placeholderText="회의 일시를 선택하세요"
                  withPortal={false}
                  calendarStartDay={0}
                  locale="ko"
                  minDate={new Date()}
                  maxDate={
                    new Date(
                      new Date().setFullYear(new Date().getFullYear() + 1)
                    )
                  }
                  popperClassName="custom-popper"
                  showPopperArrow={false}
                />
              </DatePickerWrapper>
            </FormGroup>
            <FormGroup>
              <StyledLabel>
                회의 안건 <span style={{ color: '#dc3545' }}></span>
              </StyledLabel>
              <StyledTextarea
                value={agenda}
                onChange={(e) => setAgenda(e.target.value)}
                placeholder="회의 안건을 입력하세요"
              />
            </FormGroup>
            <FormGroup>
              <StyledLabel>
                회의 참석자 <span style={{ color: '#dc3545' }}>*</span>
              </StyledLabel>
              <UserSelectionPanel>
                {/* 참석자 선택 섹션 */}
                <div>
                  <AttendeesSectionTitle>
                    <FiUser /> 참석자 선택
                  </AttendeesSectionTitle>

                  <SearchAndActionsRow>
                    <SearchBox>
                      <SearchIcon />
                      <SearchInput
                        type="text"
                        placeholder="참석자 검색..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </SearchBox>
                    <ActionButton type="button" onClick={handleSelectAll}>
                      {allSelected ? '전체 해제' : '전체 선택'}
                    </ActionButton>
                    <SelectedCount>{attendees.length}명 선택</SelectedCount>
                  </SearchAndActionsRow>

                  <UserGrid>
                    {filteredUsers.map((user) => {
                      const isSelected = attendees.some(
                        (a) => a.user_id === user.user_id
                      );
                      return (
                        <UserCard
                          key={user.user_id}
                          $selected={isSelected}
                          $isHost={false}
                          onClick={() => handleAttendeeToggle(user)}
                        >
                          <UserCheckbox
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleAttendeeToggle(user)}
                          />
                          <UserInfo>
                            <UserName>
                              {user.name}
                              <UserEmail>{user.email}</UserEmail>
                            </UserName>
                          </UserInfo>
                        </UserCard>
                      );
                    })}
                  </UserGrid>

                  {filteredUsers.length === 0 && (
                    <div
                      style={{
                        textAlign: 'center',
                        color: '#6b7280',
                        padding: '12px',
                        fontStyle: 'italic',
                        fontSize: '0.85rem',
                      }}
                    >
                      {searchTerm
                        ? '검색 결과가 없습니다.'
                        : '참석 가능한 사용자가 없습니다.'}
                    </div>
                  )}
                </div>
              </UserSelectionPanel>
            </FormGroup>
            {error && (
              <div style={{ color: '#dc3545', marginBottom: 10 }}>{error}</div>
            )}
            <CreateProjectButton type="submit" disabled={isSubmitting}>
              등록
            </CreateProjectButton>
          </form>
        </ScrollableBody>
      </ScrollablePopupContent>
    </PopupOverlay>
  );
};

export default NewMeetingPopup;
