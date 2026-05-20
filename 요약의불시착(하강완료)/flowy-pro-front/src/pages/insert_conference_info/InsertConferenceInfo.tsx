import React, { useEffect, useState } from 'react';
import FileUpload from './FileUpload';
import AttendInfo from './AttendInfo';
import Loading from '../../components/Loading';
import RecordInfoUpload from './RecordInfoUpload';
import DatePicker, { registerLocale } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { ko } from 'date-fns/locale';
import ResultContents from '../result/ResultContents';

// 한국어 locale 등록
registerLocale('ko', ko);
import NewMeetingIcon from '/images/newmeetingicon.svg'; // newmeetingicon.svg 임포트
import AddProjectIcon from '/images/addprojecticon.svg'; // addprojecticon.svg 임포트
import NewProjectPopup from './conference_popup/NewProjectPopup'; // Popup 컴포넌트 임포트
import { useAuth } from '../../contexts/AuthContext';

// import { checkAuth } from "../../api/fetchAuthCheck";
import PreviewMeetingBanner from '../dashboard/popup/PreviewMeetingBanner.tsx';
import AnalysisRequestedPopup from './conference_popup/AnalysisRequestedPopup';
import type { ProjectResponse } from '../../types/project';
import { fetchMeetingsWithUsers } from '../../api/fetchProject';
import EditProjectPopup from './conference_popup/EditProjectPopup.tsx';

import {
  ContainerWrapper,
  ContentWrapper,
  DatePickerWrapper,
  DropZoneMessage,
  EditIcon,
  ExpandedArea,
  FileInfo,
  FileInfoContainer,
  FileLabel,
  FileName,
  FileUploadWrapper,
  FormGroup,
  LeftPanel,
  MeetingList,
  NewProjectTextBottom,
  NewProjectTextsContainer,
  NewProjectTextTop,
  NewProjectWrapper,
  PageTitle,
  PageWrapper,
  ProjectList,
  ProjectListContainer,
  ProjectListItem,
  ProjectListTitle,
  RecordUploadWrapper,
  RemoveFileButton,
  RightPanel,
  SectionTitle,
  SortText,
  SortWrapper,
  StyledErrorMessage,
  StyledInput,
  StyledLabel,
  StyledSelect,
  StyledTextarea,
  StyledUploadButton,
  StyledUploadSection,
  TabBtn,
  TabPanel,
  TabSectionWrapper,
  TabsWrapper,
} from './InsertConferenceInfo.styles.ts';
import { checkAuth } from '../../api/fetchAuthCheck.ts';

// 날짜를 'YYYY-MM-DD HH:mm:ss' 형식으로 변환하는 함수
function formatDateToKST(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

// 파일 상단에 타입 정의가 없다면 추가
type Attendee = {
  user_id: string;
  name: string;
  email: string;
  user_jobname: string;
};

// 허용된 오디오 파일 형식
const ALLOWED_AUDIO_FORMATS = [
  'flac',
  'm4a',
  'mp3',
  'mp4',
  'mpeg',
  'mpga',
  'oga',
  'ogg',
  'wav',
  'webm',
];

// 파일 형식 검증 함수
const isValidAudioFile = (file: File): boolean => {
  const fileName = file.name.toLowerCase();
  const fileExtension = fileName.split('.').pop();
  return fileExtension ? ALLOWED_AUDIO_FORMATS.includes(fileExtension) : false;
};

const InsertConferenceInfo: React.FC = () => {
  const { user, setUser, setLoading } = useAuth();
  // const navigate = useNavigate();
  const [isCompleted /*, setIsCompleted*/] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [subject, setSubject] = React.useState('');
  const [attendees, setAttendees] = React.useState<Attendee[]>([]);
  const [file, setFile] = React.useState<File | null>(null);
  const [error, setError] = React.useState<string>('');
  const [agenda, setAgenda] = React.useState('');
  const [meetingDate, setMeetingDate] = React.useState<Date | null>(null);
  const [result /*, setResult*/] = React.useState<any>(null);
  const [projectName, setProjectName] = React.useState<string>('');
  const [projectId, setProjectId] = React.useState<string>('');
  const [meetingId, setMeetingId] = React.useState<string>('');
  const [username, setUsername] = React.useState<string>('');

  // const [showPopup, setShowPopup] = React.useState<boolean>(false); // 팝업 표시 상태 추가

  const [projects, setProjects] = React.useState<ProjectResponse[]>([]); // projectId 필드 추가
  const [projectUsers, setProjectUsers] = React.useState<
    { user_id: string; name: string; email: string; user_jobname: string }[]
  >([]); // 프로젝트 참여자 목록 상태 추가

  const [projectMeetings, setProjectMeetings] = React.useState<any[]>([]); // 프로젝트 회의 목록 상태 추가
  const [selectedMeeting, setSelectedMeeting] = React.useState<any>(null); // 선택된 회의 상태 추가
  const [hostId, setHostId] = React.useState('');
  // const [showAnalysisRequestedPopup, setShowAnalysisRequestedPopup] =
  //   React.useState(false);

  // const [hostEmail, setHostEmail] = useState('');
  const [hostJobname, setHostJobname] = useState('');
  const [expandedIndex, setExpandedIndex] = React.useState<number | null>(null);
  const [sortOrder, setSortOrder] = useState<'latest' | 'oldest'>('latest');

  // 정렬 함수
  const sortedProjects = [...projects].sort((a, b) => {
    const dateA = new Date(a.projectCreatedDate).getTime();
    const dateB = new Date(b.projectCreatedDate).getTime();
    return sortOrder === 'latest' ? dateB - dateA : dateA - dateB;
  });

  // const [isSortedByLatest, setIsSortedByLatest] = useState(false);

  const [activeTab, setActiveTab] = useState<'new' | 'load'>('new');
  const [isDragging, setIsDragging] = useState(false); // 드래그 상태 추가
  const [editingProject, setEditingProject] = useState<ProjectResponse | null>(
    null
  );

  const [showNewProjectPopup, setShowNewProjectPopup] = useState(false);
  // const [selectedProjectId, setSelectedProjectId] = useState<string | null>(
  //   null
  // );

  const [showEditProjectPopup, setShowEditProjectPopup] = useState(false);
  const [showBanner /*, setShowBanner*/] = React.useState(false);
  const [showPopup, setShowPopup] = React.useState(false);

  const toggleExpanded = (index: number) => {
    setExpandedIndex((prev) => (prev === index ? null : index));
  };

  // const handleAddAttendee = () => {
  //   setAttendees([
  //     ...attendees,
  //     { user_id: '', name: '', email: '', user_jobname: '' },
  //   ]);
  // };

  const validateForm = (): boolean => {
    if (!projectName.trim() || !projectId.trim()) {
      setError('프로젝트를 선택해주세요.');
      return false;
    }

    if (!subject.trim()) {
      setError('입력하지 않은 필수 항목이 있습니다.');
      return false;
    }

    const hasEmptyFields = attendees.some(
      (attendee) =>
        !attendee.name.trim() ||
        !attendee.email.trim() ||
        !attendee.user_jobname.trim()
    );

    if (hasEmptyFields) {
      setError('입력하지 않은 필수 항목이 있습니다.');
      return false;
    }

    if (!meetingDate) {
      // const md: any = meetingDate;
      setError('입력하지 않은 필수 항목이 있습니다.');
      return false;
    }

    setError('');
    return true;
  };

  const handleUpload = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    console.log('함수 실행중...');

    if (file) {
      // host 정보
      const hostUser = projectUsers.find((u) => u.user_id === hostId);
      const hostName = hostUser?.name || '';
      const hostEmail = hostUser?.email || '';
      const hostJobname = hostUser?.user_jobname || '';

      // 참석자 정보(회의장 제외)
      const filteredAttendees = attendees.filter(
        (a) => a.user_id && a.user_id !== hostId
      );
      const attendeesUserId = filteredAttendees.map((a) => a.user_id);
      const attendeesName = filteredAttendees.map((a) => a.name);
      const attendeesEmail = filteredAttendees.map((a) => a.email);
      const attendeesRole = filteredAttendees.map((a) => a.user_jobname);

      // 통합 FormData 준비
      const formData = new FormData();
      formData.append('file', file, file.name);
      formData.append('project_id', projectId);
      formData.append('meeting_title', subject); // subject가 회의 제목
      formData.append('meeting_agenda', agenda);
      formData.append(
        'meeting_date',
        meetingDate ? formatDateToKST(meetingDate) : ''
      );
      formData.append('host_id', hostId);
      formData.append('host_name', hostName);
      formData.append('host_email', hostEmail);
      formData.append('host_role', hostJobname);
      console.log("미팅아이디ㅣㅣㅣㅣㅣㅣㅣㅣㅣㅣㅣㅣㅣㅣㅣㅣㅣㅣㅣ", meetingId)
      formData.append('meeting_id', meetingId || '')
      attendeesUserId.forEach((id) => formData.append('attendees_ids', id));
      attendeesName.forEach((name) => formData.append('attendees_name', name));
      attendeesEmail.forEach((email) =>
        formData.append('attendees_email', email)
      );
      attendeesRole.forEach((role) => formData.append('attendees_role', role));
      formData.append('subject', subject);

      // 콘솔로 값 확인
      console.log('hostId:', hostId);
      console.log('hostName:', hostName);
      console.log('hostEmail:', hostEmail);
      console.log('hostJobname:', hostJobname);
      console.log('attendeesName:', attendeesName);
      console.log('attendeesEmail:', attendeesEmail);
      console.log('attendeesRole:', attendeesRole);

      try {
        // 통합 STT API 한 번만 호출
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/v1/stt/`,
          {
            method: 'POST',
            body: formData,
            credentials: 'include',
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        );
        if (!response.ok) {
          const errorData = await response.json().catch(() => null);
          throw new Error(errorData?.detail || '업로드에 실패했습니다.');
        }
        const result = await response.json();
        console.log('통합 STT 서버 응답:', result);

        // 성공 시 바로 분석 완료 팝업 띄우기
        setShowPopup(true);

        // 입력값 초기화
        setSubject('');
        setAttendees([]);
        setFile(null);
        setAgenda('');
        setMeetingDate(null);
        // setHostEmail('');
        setHostJobname('');
        setHostId('');
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : '업로드 중 오류가 발생했습니다.'
        );
      } finally {
        setIsLoading(false);
      }
    }
  };

  // 프로젝트 선택 핸들러 함수
  const handleProjectSelect = async (
    projectId: string,
    projectName: string
  ) => {
    console.log('프로젝트 선택됨:', { projectId, projectName }); // 디버깅 로그
    setProjectId(projectId);
    setProjectName(projectName);

    // 참여자 목록 불러오기
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/stt/project-users/${projectId}`,
        {
          credentials: 'include',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      const data = await res.json();
      console.log('API 응답 데이터:', data); // 디버깅을 위한 로그

      const projectUsersData = data.users.map((u: any) => ({
        user_id: u.user_id,
        name: u.name,
        email: u.email,
        user_jobname: u.user_jobname,
      }));

      setProjectUsers(projectUsersData);

      // 현재 로그인된 사용자를 기본 회의장으로 설정
      if (user?.id) {
        // 현재 사용자가 프로젝트 참가자 목록에 있는지 확인
        const currentUserInProject = projectUsersData.find(
          (u: any) => u.user_id === user.id
        );
        if (currentUserInProject) {
          setHostId(user.id);
          setHostJobname(currentUserInProject.user_jobname || '회의장');
        } else {
          // 현재 사용자가 프로젝트 참가자 목록에 없다면 목록에 추가
          const currentUserData = {
            user_id: user.id,
            name: user.name || '현재 사용자',
            email: user.email || '',
            user_jobname: '회의장',
          };
          setProjectUsers([...projectUsersData, currentUserData]);
          setHostId(user.id);
          setHostJobname('회의장');
        }
      }

      setAttendees([]);
    } catch (e) {
      console.error('프로젝트 사용자 정보를 가져오는데 실패했습니다:', e);
      setProjectUsers([]);
      setAttendees([]);

      // 에러가 발생해도 현재 사용자는 회의장으로 설정
      if (user?.id) {
        const currentUserData = {
          user_id: user.id,
          name: user.name || '현재 사용자',
          email: user.email || '',
          user_jobname: '회의장',
        };
        setProjectUsers([currentUserData]);
        setHostId(user.id);
        setHostJobname('회의장');
      }
    }

    // 기존 회의 불러오기 탭일 때 회의 목록도 불러오기
    if (activeTab === 'load') {
      try {
        const meetingsData = await fetchMeetingsWithUsers(projectId);
        if (meetingsData) {
          setProjectMeetings(meetingsData);
        } else {
          setProjectMeetings([]);
        }
      } catch (e) {
        console.error('프로젝트 회의 목록을 가져오는데 실패했습니다:', e);
        setProjectMeetings([]);
      }
    }
  };

  React.useEffect(() => {
    setUsername(user?.name || '');
  }, [user]);

  // user.id로 프로젝트 목록과 사용자 이름 불러오기
  React.useEffect(() => {
    if (!user?.id) return;
    fetch(`${import.meta.env.VITE_API_URL}/api/v1/users/projects/${user.id}`, {
      credentials: 'include',
      // headers: {
      //   Authorization: `Bearer ${localStorage.getItem('token')}`,
      // },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log('전체 응답 데이터:', data);
        console.log('프로젝트 목록 데이터:', data.projects);
        if (data.projects && data.projects.length > 0) {
          console.log('첫 번째 프로젝트 데이터:', data.projects[0]);
        }
        setProjects(data.projects);
        // projects에서 첫 번째 userName을 username으로 저장
        // if (data.projects && data.projects.length > 0) {

        //   setUsername(data.projects[0].userName || data.projects[0][0] || '알 수 없음');

        // } else {
        //   setUsername('알 수 없음');
        // }
      });
  }, [user?.id, showNewProjectPopup]);

  // 탭 변경 시 회의 목록 업데이트
  React.useEffect(() => {
    if (activeTab === 'load' && projectId) {
      fetchMeetingsWithUsers(projectId)
        .then((meetingsData) => {
          if (meetingsData) {
            setProjectMeetings(meetingsData);
          } else {
            setProjectMeetings([]);
          }
        })
        .catch((e) => {
          console.error('프로젝트 회의 목록을 가져오는데 실패했습니다:', e);
          setProjectMeetings([]);
        });
    } else if (activeTab === 'new') {
      setProjectMeetings([]);
      setSelectedMeeting(null);
      // 새 회의 만들기 탭으로 돌아갈 때 폼 초기화 (회의장 정보는 유지)
      setSubject('');
      setAgenda('');
      setMeetingDate(null);
      setAttendees([]);
      setFile(null);
      // hostId, hostJobname은 유지 (현재 사용자가 기본 회의장으로 계속 설정됨)
      // 프로젝트 선택 상태는 유지 (사용자가 다시 선택할 필요 없도록)
    }
  }, [activeTab]); // projectId 의존성 제거

  // 회의 선택 시 폼에 정보 자동 입력
  const handleMeetingSelect = (meeting: any) => {
    setSelectedMeeting(meeting);
    setMeetingId(meeting.meeting_id);
    console.log("미팅아이디ㅣㅣㅣㅣㅣㅣㅣㅣㅣㅣㅣㅣㅣㅣㅣㅣㅣㅣㅣㅣㅣ",meeting.meeting_id);
    setSubject(meeting.meeting_title || '');
    setAgenda(meeting.meeting_agenda || '');
    setMeetingDate(
      meeting.meeting_date ? new Date(meeting.meeting_date) : null
    );

    // 참석자 정보 설정
    if (meeting.meeting_users && meeting.meeting_users.length > 0) {
      const attendeesData = meeting.meeting_users.map((mu: any) => ({
        user_id: mu.user.user_id || '',
        name: mu.user.user_name || '',
        email: mu.user.user_email || '',
        user_jobname: mu.user.user_jobname || '',
      }));
      setAttendees(attendeesData);
    } else {
      setAttendees([]);
    }

    // 파일 상태 초기화 (새로운 음성 파일을 업로드할 수 있도록)
    setFile(null);
  };

  // --- 드래그 앤 드롭 핸들러 ---
  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];

      // 파일 형식 검증
      if (!isValidAudioFile(droppedFile)) {
        setError('파일형식이 알맞지 않습니다');
        return;
      }

      setFile(droppedFile);
      setError(''); // 성공 시 에러 메시지 초기화
      e.dataTransfer.clearData();
    }
  };

  const openEditPopup = (project: ProjectResponse) => {
    setEditingProject(project);
    setShowEditProjectPopup(true);
  };

  const closeEditPopup = () => {
    setEditingProject(null);
    setShowEditProjectPopup(false);
    fetchProjects(); // 수정 후 목록 새로고침
  };

  const fetchProjects = async () => {
    // ... existing code ...
  };

  useEffect(() => {
    (async () => {
      const user = await checkAuth();
      if (user) {
        setUser(user);
      }
      setLoading(false);
    })();
  }, []);

  console.log('attendees:', attendees);

  return (
    <PageWrapper>
      <ContentWrapper>
        <LeftPanel>
          <ProjectListTitle>
            [ {username} ] 님이 참여 중인 프로젝트 목록
          </ProjectListTitle>

          <ContainerWrapper>
            <NewProjectWrapper onClick={() => setShowNewProjectPopup(true)}>
              <img src={AddProjectIcon} alt="신규 프로젝트 추가" />
              <NewProjectTextsContainer>
                <NewProjectTextTop>찾는 프로젝트가 없나요?</NewProjectTextTop>
                <NewProjectTextBottom>
                  신규 프로젝트 추가하기
                </NewProjectTextBottom>
              </NewProjectTextsContainer>
            </NewProjectWrapper>
            <ProjectListContainer>
              <SortWrapper>
                정렬 기준:
                <SortText>
                  <StyledSelect
                    value={sortOrder}
                    onChange={(e) =>
                      setSortOrder(e.target.value as 'latest' | 'oldest')
                    }
                    style={{ marginLeft: '0.5rem' }}
                  >
                    <option value="latest">최신순</option>
                    <option value="oldest">오래된순</option>
                  </StyledSelect>
                </SortText>
              </SortWrapper>
              <ProjectList>
                {sortedProjects.length > 0 ? (
                  sortedProjects.map((proj, index) => (
                    <div key={index}>
                      <ProjectListItem
                        className={
                          projectId === proj.projectId ? 'selected' : ''
                        }
                        onClick={() => {
                          handleProjectSelect(proj.projectId, proj.projectName);
                          toggleExpanded(index);
                        }}
                      >
                        <span className="name">• {proj.projectName}</span>
                        <EditIcon
                          onClick={(e) => {
                            e.stopPropagation(); // 이벤트 버블링 방지
                            openEditPopup(proj);
                          }}
                        />
                        <span className="date">
                          {new Date(proj.projectCreatedDate).toLocaleDateString(
                            'sv-SE',
                            { timeZone: 'Asia/Seoul' }
                          )}
                        </span>
                      </ProjectListItem>

                      {expandedIndex === index && (
                        <ExpandedArea>
                          {activeTab === 'new' ? (
                            <>
                              <SectionTitle>프로젝트 참여자</SectionTitle>
                              <div className="user-list">
                                {projectUsers.length > 0 ? (
                                  projectUsers.map((user) => (
                                    <span
                                      key={user.user_id}
                                      className="user-name"
                                    >
                                      {user.name}
                                    </span>
                                  ))
                                ) : (
                                  <span>참여자가 없습니다.</span>
                                )}
                              </div>
                              <SectionTitle>프로젝트 내용</SectionTitle>
                              {proj.projectDetail ? (
                                <span style={{ lineHeight: 1.6 }}>
                                  {proj.projectDetail}
                                </span>
                              ) : (
                                <span style={{ color: '#888' }}>
                                  상세 내용이 없습니다.
                                </span>
                              )}
                            </>
                          ) : (
                            <MeetingList>
                              <SectionTitle>회의 목록</SectionTitle>
                              <div className="meeting-list">
                                {projectMeetings.length > 0 ? (
                                  projectMeetings
                                    .filter(
                                      (meeting) =>
                                        meeting.analysis_status !== 'completed' &&
                                        meeting.analysis_status !== 'analyzing'
                                    )
                                    .map((meeting, meetingIndex) => (
                                      <div
                                        key={meetingIndex}
                                        className={`meeting-item ${
                                          selectedMeeting?.meeting_id ===
                                          meeting.meeting_id
                                            ? 'selected'
                                            : ''
                                        }`}
                                        onClick={() =>
                                          handleMeetingSelect(meeting)
                                        }
                                      >
                                        <div className="meeting-title">
                                          {meeting.meeting_title}
                                        </div>
                                        <div className="meeting-date">
                                          {new Date(
                                            meeting.meeting_date
                                          ).toLocaleDateString('sv-SE', {
                                            timeZone: 'Asia/Seoul',
                                          })}
                                        </div>
                                        <div className="meeting-attendees">
                                          참석자:{' '}
                                          {meeting.meeting_users
                                            ?.map(
                                              (mu: any) => mu.user.user_name
                                            )
                                            .join(', ') || '없음'}
                                        </div>
                                      </div>
                                    ))
                                ) : (
                                  <span>회의가 없습니다.</span>
                                )}
                              </div>
                            </MeetingList>
                          )}
                        </ExpandedArea>
                      )}
                    </div>
                  ))
                ) : (
                  <ProjectListItem>프로젝트가 없습니다.</ProjectListItem>
                )}
              </ProjectList>
            </ProjectListContainer>
          </ContainerWrapper>

          <NewProjectWrapper>
            <img src={AddProjectIcon} alt="신규 프로젝트 추가" />
            <NewProjectTextsContainer>
              <NewProjectTextTop>찾는 프로젝트가 없나요?</NewProjectTextTop>
              <NewProjectTextBottom>
                신규 프로젝트 추가하기
              </NewProjectTextBottom>
            </NewProjectTextsContainer>
          </NewProjectWrapper>
        </LeftPanel>
        <RightPanel>
          <TabSectionWrapper>
            <TabsWrapper>
              <TabBtn
                active={activeTab === 'new'}
                onClick={() => setActiveTab('new')}
              >
                새 회의 만들기
              </TabBtn>
              <TabBtn
                active={activeTab === 'load'}
                onClick={() => setActiveTab('load')}
              >
                기존 회의 불러오기
              </TabBtn>
            </TabsWrapper>
            <TabPanel>
              {activeTab === 'new' ? (
                <>
                  <PageTitle>
                    <img src={NewMeetingIcon} alt="새 회의" />새 회의 정보
                    입력하기
                  </PageTitle>
                  {!projectId ? (
                    <div
                      style={{
                        color: '#fff',
                        marginTop: 40,
                        fontSize: '1.1rem',
                        textAlign: 'center',
                      }}
                    >
                      좌측 프로젝트 목록에서 프로젝트를 선택해주세요.
                    </div>
                  ) : isCompleted ? (
                    <ResultContents result={result} />
                  ) : isLoading ? (
                    <Loading />
                  ) : (
                    <>
                      {/* 회의 등록 폼 */}
                      {/* 프로젝트명 */}
                      <FormGroup>
                        <StyledLabel htmlFor="project-name">
                          프로젝트명 <span>*</span>
                        </StyledLabel>
                        <StyledInput
                          type="text"
                          id="project-name"
                          value={projectName}
                          readOnly
                          placeholder=""
                        />
                      </FormGroup>

                      {/* 회의 제목 */}
                      <FormGroup>
                        <StyledLabel htmlFor="meeting-subject">
                          회의 제목 <span>*</span>
                        </StyledLabel>
                        <StyledInput
                          type="text"
                          id="meeting-subject"
                          value={subject}
                          onChange={(e) => setSubject(e.target.value)}
                          placeholder="회의 제목을 입력해주세요."
                        />
                      </FormGroup>

                      {/* 회의 일시 */}
                      <FormGroup>
                        <StyledLabel htmlFor="meeting-date">
                          회의 일시 <span>*</span>
                        </StyledLabel>
                        <DatePickerWrapper>
                          <DatePicker
                            selected={meetingDate}
                            onChange={(date: Date | null) =>
                              setMeetingDate(date)
                            }
                            showTimeSelect
                            timeFormat="HH:mm"
                            timeIntervals={15}
                            dateFormat="yyyy-MM-dd HH:mm"
                            placeholderText="회의 일시를 선택하세요."
                            className="custom-datepicker"
                            withPortal={true}
                            calendarStartDay={0}
                            locale="ko"
                            showMonthDropdown={false}
                            showYearDropdown={false}
                            renderCustomHeader={undefined}
                          />
                        </DatePickerWrapper>
                      </FormGroup>

                      {/* 회의 안건 */}
                      <FormGroup>
                        <StyledLabel htmlFor="meeting-agenda">
                          회의 안건
                        </StyledLabel>
                        <StyledTextarea
                          id="meeting-agenda"
                          value={agenda}
                          onChange={(e) => setAgenda(e.target.value)}
                          placeholder="회의 안건을 입력하세요."
                        />
                      </FormGroup>

                      {/* 참석자 */}
                      <FormGroup>
                        <StyledLabel>
                          회의 참석자 <span>*</span>
                        </StyledLabel>
                        <AttendInfo
                          attendees={attendees}
                          setAttendees={setAttendees}
                          projectUsers={projectUsers}
                          hostId={hostId}
                          setHostId={setHostId}
                          hostJobname={hostJobname}
                          setHostJobname={setHostJobname}
                          currentUser={user}
                        />
                      </FormGroup>

                      {/* 파일 업로드 */}
                      <FormGroup>
                        <StyledLabel>
                          회의 음성 <span>*</span>
                        </StyledLabel>
                        <StyledUploadSection
                          onDragEnter={handleDragEnter}
                          onDragLeave={handleDragLeave}
                          onDragOver={handleDragOver}
                          onDrop={handleDrop}
                          $isDragging={isDragging}
                        >
                          {file ? (
                            <FileInfoContainer>
                              <FileInfo>
                                <FileLabel>파일명:</FileLabel>
                                <FileName>{file.name}</FileName>
                              </FileInfo>
                              <RemoveFileButton onClick={() => setFile(null)}>
                                ✕
                              </RemoveFileButton>
                            </FileInfoContainer>
                          ) : (
                            <>
                              <DropZoneMessage>
                                이곳에 파일을 드래그하거나 아이콘을 클릭하세요.
                              </DropZoneMessage>
                              <FileUploadWrapper>
                                <FileUpload
                                  setFile={setFile}
                                  setError={setError}
                                />
                              </FileUploadWrapper>
                              <RecordUploadWrapper>
                                <RecordInfoUpload setFile={setFile} />
                              </RecordUploadWrapper>
                            </>
                          )}
                        </StyledUploadSection>
                      </FormGroup>

                      <StyledUploadButton onClick={handleUpload}>
                        회의 분석하기
                      </StyledUploadButton>
                      {error && (
                        <StyledErrorMessage>{error}</StyledErrorMessage>
                      )}
                    </>
                  )}
                </>
              ) : activeTab === 'load' ? (
                <>
                  <PageTitle>
                    <img src={NewMeetingIcon} alt="기존 회의" />
                    기존 회의 정보 수정하기
                  </PageTitle>
                  {!selectedMeeting ? (
                    <div
                      style={{
                        color: '#fff',
                        marginTop: 40,
                        fontSize: '1.1rem',
                        textAlign: 'center',
                      }}
                    >
                      좌측 프로젝트 목록에서 회의를 선택해주세요.
                    </div>
                  ) : isCompleted ? (
                    <ResultContents result={result} />
                  ) : isLoading ? (
                    <Loading />
                  ) : (
                    <>
                      {/* 기존 회의 수정 폼 (new 탭과 거의 동일) */}
                      <FormGroup>
                        <StyledLabel htmlFor="project-name">
                          프로젝트명 <span>*</span>
                        </StyledLabel>
                        <StyledInput
                          type="text"
                          id="project-name"
                          value={projectName}
                          readOnly
                          placeholder=""
                        />
                      </FormGroup>
                      <FormGroup>
                        <StyledLabel htmlFor="meeting-subject">
                          회의 제목 <span>*</span>
                        </StyledLabel>
                        <StyledInput
                          type="text"
                          id="meeting-subject"
                          value={subject}
                          onChange={(e) => setSubject(e.target.value)}
                          placeholder="회의 제목을 입력해주세요."
                        />
                      </FormGroup>
                      <FormGroup>
                        <StyledLabel htmlFor="meeting-date">
                          회의 일시 <span>*</span>
                        </StyledLabel>
                        <DatePickerWrapper>
                          <DatePicker
                            selected={meetingDate}
                            onChange={(date: Date | null) =>
                              setMeetingDate(date)
                            }
                            showTimeSelect
                            timeFormat="HH:mm"
                            timeIntervals={15}
                            dateFormat="yyyy-MM-dd HH:mm"
                            placeholderText="회의 일시를 선택하세요."
                            className="custom-datepicker"
                            withPortal={true}
                            calendarStartDay={0}
                            locale="ko"
                            showMonthDropdown={false}
                            showYearDropdown={false}
                            renderCustomHeader={undefined}
                          />
                        </DatePickerWrapper>
                      </FormGroup>
                      <FormGroup>
                        <StyledLabel htmlFor="meeting-agenda">
                          회의 안건
                        </StyledLabel>
                        <StyledTextarea
                          id="meeting-agenda"
                          value={agenda}
                          onChange={(e) => setAgenda(e.target.value)}
                          placeholder="회의 안건을 입력하세요."
                        />
                      </FormGroup>
                      <FormGroup>
                        <StyledLabel>
                          회의 참석자 <span>*</span>
                        </StyledLabel>
                        <AttendInfo
                          attendees={attendees}
                          setAttendees={setAttendees}
                          projectUsers={projectUsers}
                          hostId={hostId}
                          setHostId={setHostId}
                          hostJobname={hostJobname}
                          setHostJobname={setHostJobname}
                          currentUser={user}
                        />
                      </FormGroup>
                      <FormGroup>
                        <StyledLabel>
                          회의 음성 <span>*</span>
                        </StyledLabel>
                        <StyledUploadSection
                          onDragEnter={handleDragEnter}
                          onDragLeave={handleDragLeave}
                          onDragOver={handleDragOver}
                          onDrop={handleDrop}
                          $isDragging={isDragging}
                        >
                          {file ? (
                            <FileInfoContainer>
                              <FileInfo>
                                <FileLabel>파일명:</FileLabel>
                                <FileName>{file.name}</FileName>
                              </FileInfo>
                              <RemoveFileButton onClick={() => setFile(null)}>
                                ✕
                              </RemoveFileButton>
                            </FileInfoContainer>
                          ) : (
                            <>
                              <DropZoneMessage>
                                이곳에 파일을 드래그하거나 아이콘을 클릭하세요.
                              </DropZoneMessage>
                              <FileUploadWrapper>
                                <FileUpload
                                  setFile={setFile}
                                  setError={setError}
                                />
                              </FileUploadWrapper>
                              <RecordUploadWrapper>
                                <RecordInfoUpload setFile={setFile} />
                              </RecordUploadWrapper>
                            </>
                          )}
                        </StyledUploadSection>
                      </FormGroup>
                      <StyledUploadButton onClick={handleUpload}>
                        회의 분석하기
                      </StyledUploadButton>
                      {error && (
                        <StyledErrorMessage>{error}</StyledErrorMessage>
                      )}
                    </>
                  )}
                </>
              ) : (
                <div
                  style={{ color: '#fff', marginTop: 40, fontSize: '1.1rem' }}
                >
                  {activeTab === 'load'
                    ? '회의를 선택하면 정보가 여기에 표시됩니다.'
                    : '불러올 회의 리스트 또는 검색 UI가 들어갑니다.'}
                </div>
              )}
            </TabPanel>
          </TabSectionWrapper>
        </RightPanel>
      </ContentWrapper>
      {showNewProjectPopup && (
        <NewProjectPopup onClose={() => setShowNewProjectPopup(false)} />
      )}
      {showBanner && !showPopup && (
        <PreviewMeetingBanner onClick={() => setShowPopup(true)} />
      )}
      {showPopup && (
        <AnalysisRequestedPopup onClose={() => setShowPopup(false)} />
      )}
      {showEditProjectPopup && editingProject && (
        <EditProjectPopup
          onClose={closeEditPopup}
          projectToEdit={editingProject}
        />
      )}
    </PageWrapper>
  );
};

export default InsertConferenceInfo;
