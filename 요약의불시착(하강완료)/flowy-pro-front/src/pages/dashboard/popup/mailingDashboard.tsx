import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FiMail, FiX } from 'react-icons/fi';

import type { Feedback, SummaryLog } from '../Dashboard.types';
import type { Todo } from '../../../types/project';
import { postSummaryTask } from '../../../api/fetchProject';
import AlertModal from '../../find_id/popup/AlertModal';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
`;

const ModalBox = styled.div`
  background: #fff;
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
  width: 90%;
  max-width: 540px;
  max-height: 85vh;
  position: relative;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const PopupHeader = styled.div`
  background: linear-gradient(135deg, #6a4c93 0%, #4b2067 100%);
  padding: 24px 28px;
  display: flex;
  align-items: center;
  gap: 12px;
  position: relative;
`;

const PopupIcon = styled.div`
  width: 32px;
  height: 32px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 18px;
`;

const PopupTitle = styled.h2`
  color: white;
  font-size: 1.4rem;
  font-weight: 600;
  margin: 0;
  flex: 1;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 50%;
  right: 24px;
  transform: translateY(-50%);
  background: rgba(255, 255, 255, 0.2);
  border: none;
  border-radius: 6px;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.3);
  }
`;

const ScrollableBody = styled.div`
  padding: 32px 28px;
  overflow-y: auto;
  flex: 1;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #a8a8a8;
  }
`;

const ReceiverSection = styled.div`
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 20px;
`;

const SectionLabel = styled.div`
  font-size: 1.2rem;
  color: #2c3e50;
  font-weight: 600;
  margin-bottom: 20px;
  text-align: center;
`;

const CheckboxGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const CheckboxLabel = styled.label`
  display: flex;
  flex-direction: column;
  font-size: 1rem;
  color: #2c3e50;
  font-weight: 500;
  cursor: pointer;
  gap: 8px;
`;

const CheckboxRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const Checkbox = styled.input.attrs({ type: 'checkbox' })`
  width: 18px;
  height: 18px;
  accent-color: #6a4c93;
  cursor: pointer;
`;

const UserList = styled.div`
  padding-left: 30px;
  color: #6a4c93;
  font-size: 0.9rem;
  line-height: 1.4;
  margin-top: 8px;
  word-break: break-all;
`;

const CustomReceiverContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding-left: 30px;
  position: relative;
`;

const ReceiverInput = styled.input`
  width: 70%;
  border: 1px solid #ddd;
  background: #fff;
  border-radius: 8px;
  padding: 10px 12px;
  font-size: 0.95rem;
  color: #2c3e50;
  transition: border-color 0.2s ease;

  &:focus {
    outline: none;
    border-color: #6a4c93;
    box-shadow: 0 0 0 2px rgba(106, 76, 147, 0.1);
  }

  &::placeholder {
    color: #adb5bd;
  }
`;

const Dropdown = styled.div`
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 8px;
  margin-top: 4px;
  position: absolute;
  width: 70%;
  max-height: 150px;
  overflow-y: auto;
  z-index: 10;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`;

const DropdownItem = styled.div`
  padding: 10px 12px;
  cursor: pointer;
  font-size: 0.95rem;
  color: #2c3e50;
  transition: background-color 0.2s ease;

  &:hover {
    background: #f8f9fa;
  }

  &:not(:last-child) {
    border-bottom: 1px solid #f1f1f1;
  }
`;

const SelectedReceivers = styled.div`
  margin-top: 12px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const SelectedReceiver = styled.span`
  display: inline-flex;
  align-items: center;
  background: #f3e5f5;
  color: #6a4c93;
  padding: 6px 10px;
  border-radius: 16px;
  font-size: 0.85rem;
  font-weight: 500;
`;

const RemoveButton = styled.button`
  background: none;
  border: none;
  color: #6a4c93;
  margin-left: 6px;
  padding: 0;
  cursor: pointer;
  font-size: 16px;
  line-height: 1;
  transition: color 0.2s ease;

  &:hover {
    color: #4b2067;
  }
`;

const NoticeText = styled.div`
  text-align: center;
  color: #6c757d;
  font-size: 0.9rem;
  margin-bottom: 24px;
  font-style: italic;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 24px;
`;

const ActionButton = styled.button<{ variant?: 'primary' | 'secondary' }>`
  flex: 1;
  border: none;
  border-radius: 12px;
  padding: 16px 0;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  ${(props) =>
    props.variant === 'secondary'
      ? `
    background: #f8f9fa;
    color: #6c757d;
    border: 2px solid #e9ecef;
    
    &:hover {
      background: #e9ecef;
      color: #495057;
      transform: translateY(-1px);
    }
  `
      : `
    background: linear-gradient(135deg, #6a4c93 0%, #4b2067 100%);
    color: white;
    box-shadow: 0 4px 12px rgba(106, 76, 147, 0.3);
    
    &:hover {
      background: linear-gradient(135deg, #4b2067 0%, #3a1851 100%);
      transform: translateY(-1px);
      box-shadow: 0 6px 16px rgba(106, 76, 147, 0.4);
    }
  `}

  &:active {
    transform: translateY(0);
  }
`;

interface MailingDashboardProps {
  offModify: () => void;
  onClose: () => void;
  onUnlockButtons?: () => void; // 버튼 잠금 해제 콜백
  summary: SummaryLog | null;
  tasks: any;
  feedback: Feedback[];
  meetingInfo: {
    project: string;
    title: string;
    date: string;
    attendees: { user_id: string; user_name: string }[];
    agenda: string;
    project_users: { user_id: string; user_name: string; user_email: string }[];
    meeting_id: string;
  };
  meetingId: string | undefined;
}

type MailSection =
  | SummaryLog
  | Feedback
  | {
      section: string;
      items: string[];
    };

const MailingDashboard = ({
  offModify,
  onClose,
  onUnlockButtons,
  summary,
  tasks,
  feedback,
  meetingInfo,
  meetingId,
}: MailingDashboardProps) => {
  console.log('meetingInfo:', meetingInfo);
  // const [showTooltip, setShowTooltip] = useState(false);
  const [mailItems /*, setMailItems*/] = useState({
    summary: false,
    tasks: false,
    feedback: false,
  });
  const [receivers, setReceivers] = useState<{
    allProject: boolean;
    allAttendees: boolean;
    custom: boolean;
    customValue: string;
    selectedAttendees: string[];
    selectedCustom: {
      user_id: string;
      user_name: string;
      user_email: string;
    }[];
  }>({
    allProject: false,
    allAttendees: false,
    custom: false,
    customValue: '',
    selectedAttendees: [],
    selectedCustom: [],
  });
  // const [showPreview, setShowPreview] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownContainerRef = React.useRef<HTMLDivElement>(null);

  // 알림 모달 상태 추가
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);

  // 메일 미리보기용 데이터
  const mailPreview: MailSection[] = [];
  if (mailItems.summary && summary) mailPreview.push(summary);
  if (mailItems.tasks && tasks) {
    // tasks는 attendees별로 되어 있으니, 각 참석자별로 섹션화
    Object.entries(tasks).forEach(([name, items]) => {
      const taskArr = items as any[];
      if (name === 'unassigned') {
        if (taskArr.length > 0)
          mailPreview.push({
            section: '[ 미할당 작업 목록 ]',
            items: taskArr.map((t: any) => t.description),
          });
      } else {
        if (taskArr.length > 0)
          mailPreview.push({
            section: `[ ${name} ]`,
            items: taskArr.map((t: any) => t.description),
          });
      }
    });
  }
  if (mailItems.feedback && feedback) mailPreview.push(...feedback);

  // const isRecipientMissing =
  //   (!receivers.allProject && !receivers.allAttendees && !receivers.custom) ||
  //   (receivers.custom && receivers.selectedCustom.length === 0);

  // 회의 참석자 또는 프로젝트 참여자 전체 수신 시 자동 할당
  useEffect(() => {
    if (receivers.allProject) {
      setReceivers((r) => ({
        ...r,
        selectedCustom: meetingInfo.project_users,
      }));
    } else if (receivers.allAttendees) {
      const attendeeUsers = meetingInfo.attendees
        .map((attendee) =>
          meetingInfo.project_users.find(
            (pUser) => pUser.user_id === attendee.user_id
          )
        )
        .filter(
          (
            user
          ): user is {
            user_id: string;
            user_name: string;
            user_email: string;
          } => Boolean(user)
        );
      setReceivers((r) => ({ ...r, selectedCustom: attendeeUsers }));
    } else if (!receivers.custom) {
      setReceivers((r) => ({ ...r, selectedCustom: [] }));
    }
  }, [
    receivers.allProject,
    receivers.allAttendees,
    receivers.custom,
    meetingInfo.attendees,
    meetingInfo.project_users,
  ]);

  useEffect(() => {
    if (!isDropdownOpen) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownContainerRef.current &&
        !dropdownContainerRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  const removeReceiver = (userIdToRemove: string) => {
    setReceivers((r) => ({
      ...r,
      selectedCustom: r.selectedCustom.filter(
        (user) => user.user_id !== userIdToRemove
      ),
    }));
  };

  const potentialCandidates = meetingInfo.project_users.filter(
    (user) =>
      !receivers.selectedCustom.some(
        (selected) => selected.user_id === user.user_id
      )
  );

  const filteredCandidates = receivers.customValue
    ? potentialCandidates.filter((user) =>
        user.user_name
          .toLowerCase()
          .includes(receivers.customValue.toLowerCase())
      )
    : potentialCandidates;

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (
      e.key === 'Enter' &&
      receivers.customValue &&
      filteredCandidates.length > 0
    ) {
      const selectedUser = filteredCandidates[0];
      setReceivers((r) => ({
        ...r,
        selectedCustom: [...r.selectedCustom, selectedUser],
        customValue: '',
      }));
      setIsDropdownOpen(false);
    }
  };

  // meeting_info 데이터 구조 생성 함수 (roles 추가)
  const makeMeetingInfoForMail = () => {
    return {
      info_n: receivers.selectedCustom.map((user) => ({
        name: user.user_name,
        email: user.user_email,
        roles: (tasks && tasks[user.user_name]
          ? tasks[user.user_name]
          : []
        ).map((todo: any) => ({
          action: todo.action,
          schedule: todo.schedule ?? null,
        })),
      })),
      dt: meetingInfo.date,
      subj: meetingInfo.title,
      update_dt: new Date().toISOString(),
      meeting_id: meetingInfo.meeting_id, // meetingInfo에 meeting_id가 반드시 있어야 함
    };
  };

  // db update용 함수(구현 예정)
  // const handleDbUpdate = () => {
  //   // db에 update 기능 구현 예정
  // };

  // 수신 대상자 유효성 검사 함수
  const validateReceivers = () => {
    // 1) 아무것도 체크 안 한 경우
    if (!receivers.allProject && !receivers.allAttendees && !receivers.custom) {
      return false;
    }
    // 2) 개별 수신자 지정만 체크하고 아무도 선택 안 한 경우
    if (receivers.custom && receivers.selectedCustom.length === 0) {
      return false;
    }
    return true;
  };

  // 메일 발송 및 조건 분기 함수
  const handleSendMail = async () => {
    if (!validateReceivers()) {
      // 유효성 검사 실패 시 오류 모달 표시
      setShowErrorAlert(true);
      return;
    }

    // (기타: 개별 수신자 지정 등)
    const payload = makeMeetingInfoForMail();
    console.log('백엔드로 보낼 payload:', payload);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/stt/meeting/send-update-email`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // 메일 발송 성공 시 알림 모달 표시
      setShowSuccessAlert(true);
      return; // 성공 시 함수 종료
    } catch (e) {
      alert('메일 발송에 실패했습니다.');
      return; // 실패 시에도 함수 종료
    }
  };

  // 수정 취소 핸들러
  const handleCancel = () => {
    offModify();
    onUnlockButtons?.(); // 버튼 잠금 해제
    onClose();
  };

  // 받아온 assignRole(할 일 목록) insert할 때 정형화 된 형태로 변경
  const getPostPayload = () => {
    const allTodos: Todo[] = tasks
      ? (Object.values(tasks).flat() as Todo[])
      : [];

    return {
      updated_task_assign_contents: {
        assigned_todos: allTodos,
      },
    };
  };

  // 데이터 fetch 함수
  const handleSaveSummaryTasks = async () => {
    // setIsEditingSummary(false);
    if (!summary || !summary.updated_summary_contents) {
      console.error('summaryLog가 정의되지 않았습니다.');
      return;
    }

    const payload = getPostPayload();

    if (!payload?.updated_task_assign_contents) {
      console.error('작업 할당 내용이 없습니다.');
      return;
    }

    try {
      await postSummaryTask(
        meetingId,
        summary.updated_summary_contents,
        payload.updated_task_assign_contents
      );
      console.log('저장 완료');
      // 예: showToast('요약 및 작업이 성공적으로 저장되었습니다.');
    } catch (error) {
      console.error('저장 실패:', error);
      // 예: showToast('저장에 실패했습니다. 다시 시도해주세요.');
    }
  };

  return (
    <>
      <ModalOverlay>
        <ModalBox>
          <PopupHeader>
            <PopupIcon>
              <FiMail />
            </PopupIcon>
            <PopupTitle>회의 결과 수정 및 메일 발송</PopupTitle>
            <CloseButton onClick={onClose}>
              <FiX size={18} />
            </CloseButton>
          </PopupHeader>

          <ScrollableBody>
            <ReceiverSection>
              <SectionLabel>수신 대상자 선택</SectionLabel>
              <CheckboxGroup>
                {/* 프로젝트 참여자 전체 */}
                <CheckboxLabel>
                  <CheckboxRow>
                    <Checkbox
                      checked={receivers.allProject}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setReceivers((prev) => ({
                            ...prev,
                            allProject: true,
                            allAttendees: false,
                            custom: false,
                          }));
                        } else {
                          setReceivers((prev) => ({
                            ...prev,
                            allProject: false,
                          }));
                        }
                      }}
                    />
                    프로젝트 참여자 전체 수신
                  </CheckboxRow>
                  {receivers.allProject && (
                    <UserList>
                      {meetingInfo.project_users
                        .map((user) => user.user_name)
                        .join(', ')}
                    </UserList>
                  )}
                </CheckboxLabel>

                {/* 회의 참석자 전체 */}
                <CheckboxLabel>
                  <CheckboxRow>
                    <Checkbox
                      checked={receivers.allAttendees}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setReceivers((prev) => ({
                            ...prev,
                            allProject: false,
                            allAttendees: true,
                            custom: false,
                          }));
                        } else {
                          setReceivers((prev) => ({
                            ...prev,
                            allAttendees: false,
                          }));
                        }
                      }}
                    />
                    회의 참석자 전체 수신
                  </CheckboxRow>
                  {receivers.allAttendees && (
                    <UserList>
                      {meetingInfo.attendees.map((a) => a.user_name).join(', ')}
                    </UserList>
                  )}
                </CheckboxLabel>

                {/* 개별 수신자 지정 */}
                <CheckboxLabel>
                  <CheckboxRow>
                    <Checkbox
                      checked={receivers.custom}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setReceivers((prev) => ({
                            ...prev,
                            allProject: false,
                            allAttendees: false,
                            custom: true,
                          }));
                        } else {
                          setReceivers((prev) => ({
                            ...prev,
                            custom: false,
                            selectedCustom: [],
                          }));
                        }
                      }}
                    />
                    개별 수신자 지정
                  </CheckboxRow>
                  {receivers.custom && (
                    <CustomReceiverContainer ref={dropdownContainerRef}>
                      <ReceiverInput
                        placeholder="프로젝트 참여자 이름 검색"
                        value={receivers.customValue}
                        onChange={(e) =>
                          setReceivers((prev) => ({
                            ...prev,
                            customValue: e.target.value,
                          }))
                        }
                        onKeyPress={handleKeyPress}
                        onClick={() => setIsDropdownOpen((prev) => !prev)}
                      />
                      {isDropdownOpen && filteredCandidates.length > 0 && (
                        <Dropdown>
                          {filteredCandidates.map((user) => (
                            <DropdownItem
                              key={user.user_id}
                              onMouseDown={() => {
                                setReceivers((r) => ({
                                  ...r,
                                  selectedCustom: [...r.selectedCustom, user],
                                  customValue: '',
                                }));
                                setIsDropdownOpen(false);
                              }}
                            >
                              {user.user_name}
                            </DropdownItem>
                          ))}
                        </Dropdown>
                      )}
                      <SelectedReceivers>
                        {receivers.selectedCustom.map((user) => (
                          <SelectedReceiver key={user.user_id}>
                            {user.user_name}
                            <RemoveButton
                              onMouseDown={() => removeReceiver(user.user_id)}
                            >
                              ×
                            </RemoveButton>
                          </SelectedReceiver>
                        ))}
                      </SelectedReceivers>
                    </CustomReceiverContainer>
                  )}
                </CheckboxLabel>
              </CheckboxGroup>
            </ReceiverSection>

            <NoticeText>
              수신 대상자를 선택하지 않으면 메일은 전송되지 않습니다
            </NoticeText>

            <ButtonContainer>
              <ActionButton variant="secondary" onClick={handleCancel}>
                수정 취소
              </ActionButton>

              <ActionButton
                onClick={async () => {
                  // 유효성 검사
                  if (!validateReceivers()) {
                    setShowErrorAlert(true);
                    return;
                  }

                  const payload = makeMeetingInfoForMail();
                  console.log(
                    '==== [메일로 보낼 최종 meeting_info payload] ===='
                  );
                  console.log(JSON.stringify(payload, null, 2));

                  try {
                    // 먼저 데이터 저장
                    await handleSaveSummaryTasks();

                    // 그 다음 메일 발송 (성공 시 알림 모달 표시)
                    await handleSendMail();

                    // 수정 모드 종료
                    offModify();

                    // 버튼 잠금 해제
                    onUnlockButtons?.();
                  } catch (error) {
                    console.error('버튼 클릭 처리 중 오류:', error);
                  }
                }}
              >
                수정하고 메일 보내기
              </ActionButton>
            </ButtonContainer>
          </ScrollableBody>
        </ModalBox>
      </ModalOverlay>

      {/* 메일 발송 완료 알림 모달 */}
      {showSuccessAlert && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: 3000,
          }}
        >
          <AlertModal
            isOpen={showSuccessAlert}
            onClose={() => {
              setShowSuccessAlert(false);
              onClose();
            }}
            type="success"
            title="메일 발송 완료"
            message="회의 결과가 성공적으로 발송되었습니다."
            confirmText="확인"
          />
        </div>
      )}

      {/* 수신자 선택 오류 알림 모달 */}
      {showErrorAlert && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: 3000,
          }}
        >
          <AlertModal
            isOpen={showErrorAlert}
            onClose={() => setShowErrorAlert(false)}
            type="error"
            title="수신자 설정 필요"
            message="수신 대상자를 선택해야 수정 내용이 저장됩니다."
            confirmText="확인"
          />
        </div>
      )}
    </>
  );
};

export default MailingDashboard;
