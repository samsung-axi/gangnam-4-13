import React, { useState } from "react";
import EditEventPop from "./edit_utils";
import {
  CloseBtn,
  DateBadge,
  EmptyState,
  LargeCheckbox,
  MeetingBox,
  MeetingContent,
  MeetingIcon,
  MeetingTimeBox,
  MeetingTitle,
  Overlay,
  PopContainer,
  PopupBody,
  PopupHeader,
  Section,
  SectionContent,
  SectionHeader,
  SectionHeaderLeft,
  SectionTitle,
  Title,
  TodoBox,
  TodoContent,
  TodoIcon,
  TodoText,
  ToggleIcon,
} from "./calendarPop.styles";

interface CalendarPopProps {
  date: Date;
  todos: {
    id: string;
    title: string;
    completed?: boolean;
    start?: Date | string;
    end?: Date | string;
    comment?: string;
  }[];
  meetings: {
    id: string;
    title: string;
    start?: Date | string;
    end?: Date | string;
    comment?: string;
  }[];
  onClose: () => void;
  onEdit?: (id: string, completed: boolean) => void;
}

const CalendarPop: React.FC<CalendarPopProps> = ({
  date,
  todos,
  meetings,
  onClose,
  onEdit,
}) => {
  const [editTarget, setEditTarget] = useState<null | {
    type: "todo" | "meeting";
    event: any;
  }>(null);
  
  const [isMeetingsOpen, setIsMeetingsOpen] = useState(true);
  const [isTodosOpen, setIsTodosOpen] = useState(true);

  // 해당 날짜의 회의만 필터링하고 시간순으로 정렬
  const filteredAndSortedMeetings = meetings
    .filter(meeting => {
      // start가 없거나 유효하지 않은 일정 제외
      if (!meeting.start) return false;
      
      const meetingDate = typeof meeting.start === "string" ? new Date(meeting.start) : meeting.start;
      if (isNaN(meetingDate.getTime())) return false;
      
      // 해당 날짜의 회의만 포함
      return (
        meetingDate.getFullYear() === date.getFullYear() &&
        meetingDate.getMonth() === date.getMonth() &&
        meetingDate.getDate() === date.getDate()
      );
    })
    .sort((a, b) => {
      const dateA = typeof a.start === "string" ? new Date(a.start) : a.start!;
      const dateB = typeof b.start === "string" ? new Date(b.start) : b.start!;
      return dateA.getTime() - dateB.getTime();
    });

  // 해당 날짜의 할 일만 필터링 (end 날짜 기준)
  const filteredTodos = todos.filter(todo => {
    // end가 없는 할 일은 제외 (날짜 지정 안된 할 일)
    if (!todo.end) return false;
    
    const todoDate = typeof todo.end === "string" ? new Date(todo.end) : todo.end;
    if (isNaN(todoDate.getTime())) return false; // 유효하지 않은 날짜는 제외
    
    // 해당 날짜의 할 일만 포함
    return (
      todoDate.getFullYear() === date.getFullYear() &&
      todoDate.getMonth() === date.getMonth() &&
      todoDate.getDate() === date.getDate()
    );
  });

  const formatDate = (date: Date) => {
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const weekdays = ["일", "월", "화", "수", "목", "금", "토"];
    const weekday = weekdays[date.getDay()];
    return `${month}월 ${day}일 (${weekday})`;
  };

  const formatTime = (timeValue: Date | string | undefined) => {
    if (!timeValue) return "";
    const d = typeof timeValue === "string" ? new Date(timeValue) : timeValue;
    if (isNaN(d.getTime())) return "";
    
    const h = d.getHours();
    const min = d.getMinutes();
    const ampm = h < 12 ? "오전" : "오후";
    let hour12 = h % 12;
    if (hour12 === 0) hour12 = 12;
    return `${ampm} ${hour12.toString().padStart(2, "0")}:${min
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <Overlay onClick={onClose}>
      <PopContainer onClick={e => e.stopPropagation()}>
        <PopupHeader>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <Title>일정 확인</Title>
            <DateBadge>{formatDate(date)}</DateBadge>
          </div>
          <CloseBtn onClick={onClose}>✕</CloseBtn>
        </PopupHeader>

        <PopupBody>
          <Section>
            <SectionHeader onClick={() => setIsMeetingsOpen(!isMeetingsOpen)}>
              <SectionHeaderLeft>
                <MeetingIcon>M</MeetingIcon>
                <SectionTitle>회의 ({filteredAndSortedMeetings.length})</SectionTitle>
              </SectionHeaderLeft>
              <ToggleIcon isOpen={isMeetingsOpen}>
                ▼
              </ToggleIcon>
            </SectionHeader>
            
            <SectionContent isOpen={isMeetingsOpen}>
              {filteredAndSortedMeetings.length === 0 ? (
                <EmptyState>예정된 회의가 없습니다</EmptyState>
              ) : (
                filteredAndSortedMeetings.map((meeting) => {
                  const timeStr = formatTime(meeting.start);
                  return (
                    <MeetingBox key={meeting.id}>
                      <MeetingContent>
                        {timeStr && <MeetingTimeBox>{timeStr}</MeetingTimeBox>}
                        <MeetingTitle>{meeting.title}</MeetingTitle>
                      </MeetingContent>
                    </MeetingBox>
                  );
                })
              )}
            </SectionContent>
          </Section>

          <Section>
            <SectionHeader onClick={() => setIsTodosOpen(!isTodosOpen)}>
              <SectionHeaderLeft>
                <TodoIcon>T</TodoIcon>
                <SectionTitle>할 일 ({filteredTodos.length})</SectionTitle>
              </SectionHeaderLeft>
              <ToggleIcon isOpen={isTodosOpen}>
                ▼
              </ToggleIcon>
            </SectionHeader>
            
            <SectionContent isOpen={isTodosOpen}>
              {filteredTodos.length === 0 ? (
                <EmptyState>등록된 할 일이 없습니다</EmptyState>
              ) : (
                filteredTodos.map((todo) => (
                  <TodoBox
                    key={todo.id}
                    onClick={(e) => {
                      if (e.target === e.currentTarget)
                        setEditTarget({ type: "todo", event: todo });
                    }}
                  >
                    <TodoContent>
                      <LargeCheckbox
                        checked={todo.completed}
                        onChange={(e) => {
                          e.stopPropagation();
                          onEdit && onEdit(todo.id, !todo.completed);
                        }}
                      />
                      <TodoText completed={todo.completed}>
                        {todo.title}
                      </TodoText>
                    </TodoContent>
                  </TodoBox>
                ))
              )}
            </SectionContent>
          </Section>
        </PopupBody>

        {editTarget && (
          <EditEventPop
            type={editTarget.type}
            event={editTarget.event}
            onSave={(id: string, completed: boolean) => {
              onEdit && onEdit(id, completed);
              setEditTarget(null);
            }}
            onClose={() => setEditTarget(null)}
          />
        )}
      </PopContainer>
    </Overlay>
  );
};

export default CalendarPop;
