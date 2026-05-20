import React, { useState } from 'react';
import styled from 'styled-components';
import { Search, Users, Crown } from 'lucide-react';

type Attendee = {
  user_id: string;
  name: string;
  email: string;
  user_jobname: string;
};

interface ProjectUser {
  user_id: string;
  name: string;
  email: string;
  user_jobname: string;
}

interface CurrentUser {
  id: string;
  name?: string;
  email?: string;
}

interface AttendInfoProps {
  attendees: Attendee[];
  setAttendees: (a: Attendee[]) => void;
  projectUsers: ProjectUser[];

  hostId: string;
  setHostId: (id: string) => void;
  hostJobname: string;
  setHostJobname: (job: string) => void;
  currentUser: CurrentUser | null;
}

const AttendInfoWrapper = styled.div`
  margin-bottom: 25px;
  width: 100%;
`;

// const SectionTitle = styled.h3`
//   color: #351745;
//   margin-bottom: 15px;
//   font-size: 1.1rem;
//   font-weight: 600;
// `;

const UserSelectionPanel = styled.div`
  background: linear-gradient(135deg, #f8f5ff, #ede7f3);
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 15px;
  box-shadow: 0 2px 8px rgba(53, 23, 69, 0.08);
  border: 1px solid rgba(53, 23, 69, 0.1);
`;

const SearchAndActionsRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
`;

const SearchBox = styled.div`
  position: relative;
  flex: 1;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 8px 12px 8px 35px;
  border: 2px solid rgba(53, 23, 69, 0.2);
  border-radius: 6px;
  font-size: 0.9rem;
  box-sizing: border-box;
  background: rgba(255, 255, 255, 0.95);
  color: #351745;

  &:focus {
    outline: none;
    border-color: #351745;
    box-shadow: 0 0 0 2px rgba(53, 23, 69, 0.1);
  }

  &::placeholder {
    color: rgba(53, 23, 69, 0.6);
  }
`;

const SearchIcon = styled(Search)`
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  color: rgba(53, 23, 69, 0.6);
  width: 16px;
  height: 16px;
`;

const UserGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 8px;
  max-height: 200px;
  overflow-y: auto;

  /* 커스텀 스크롤바 */
  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(53, 23, 69, 0.1);
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(53, 23, 69, 0.3);
    border-radius: 3px;

    &:hover {
      background: rgba(53, 23, 69, 0.5);
    }
  }
`;

const UserCard = styled.div<{ $selected: boolean; $isHost: boolean }>`
  display: flex;
  align-items: center;
  padding: 8px;
  border: 1px solid
    ${(props) =>
      props.$isHost
        ? '#480b6a'
        : props.$selected
        ? '#351745'
        : 'rgba(53, 23, 69, 0.2)'};
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  background: ${(props) =>
    props.$isHost
      ? 'rgba(72, 11, 106, 0.05)'
      : props.$selected
      ? 'rgba(53, 23, 69, 0.05)'
      : 'white'};

  &:hover {
    border-color: ${(props) => (props.$isHost ? '#480b6a' : '#351745')};
    background: ${(props) =>
      props.$isHost ? 'rgba(72, 11, 106, 0.08)' : 'rgba(53, 23, 69, 0.08)'};
  }
`;

const UserCheckbox = styled.input`
  margin-right: 8px;
  width: 16px;
  height: 16px;
  accent-color: #351745;
`;

const UserInfo = styled.div`
  flex: 1;
`;

const UserNameEmail = styled.div`
  font-weight: 600;
  color: #333;
  display: flex;
  align-items: center;
  gap: 5px;
`;

const UserEmailSpan = styled.span`
  font-size: 0.75rem;
  color: #666;
  font-weight: 400;
  margin-left: 8px;
`;

const UserRole = styled.input`
  font-size: 0.85rem;
  color: #351745;
  background: rgba(255, 255, 255, 0.7);
  border: 1px solid rgba(53, 23, 69, 0.3);
  border-radius: 4px;
  padding: 3px 6px;
  margin-top: 3px;
  width: 100%;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: #351745;
    box-shadow: 0 0 0 1px rgba(53, 23, 69, 0.1);
  }

  &::placeholder {
    color: rgba(53, 23, 69, 0.5);
  }
`;

const SelectedSummary = styled.div`
  background: rgba(53, 23, 69, 0.05);
  border-radius: 6px;
  padding: 10px;
  margin-bottom: 10px;
  border-left: 3px solid #351745;
`;

const SummaryTitle = styled.div`
  font-weight: 600;
  color: #ffffff;
  margin-bottom: 6px;
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.95rem;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
`;

const SelectedTag = styled.span`
  display: inline-flex;
  align-items: center;
  background: rgba(0, 180, 186, 0.15);
  color: #00b4ba;
  padding: 3px 6px;
  border-radius: 12px;
  font-size: 0.8rem;
  margin: 1px;
  gap: 3px;
  box-shadow: 0 1px 3px rgba(0, 180, 186, 0.2);
  border: 1px solid rgba(0, 180, 186, 0.3);
`;

const HostTag = styled.span`
  display: inline-flex;
  align-items: center;
  background: linear-gradient(135deg, #00b4ba, #00a0a5);
  color: white;
  padding: 3px 6px;
  border-radius: 12px;
  font-size: 0.8rem;
  margin: 1px;
  gap: 3px;
  box-shadow: 0 1px 3px rgba(0, 180, 186, 0.4);
  font-weight: 600;
`;

const QuickActions = styled.div`
  display: flex;
  gap: 8px;
`;

const QuickButton = styled.button`
  padding: 6px 12px;
  border: 1px solid #351745;
  background: transparent;
  color: #351745;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.85rem;
  transition: all 0.2s ease;

  &:hover {
    background: linear-gradient(135deg, #351745 0%, #4a1168 100%);
    color: white;
    transform: translateY(-1px);
    box-shadow: 0 2px 6px rgba(53, 23, 69, 0.2);
  }
`;

const AttendInfo: React.FC<AttendInfoProps> = ({
  attendees,
  setAttendees,
  projectUsers = [],
  hostId,
  // setHostId,
  hostJobname,
  setHostJobname,
  // currentUser,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredUsers = projectUsers.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // const handleHostSelect = (user_id: string) => {
  //   setHostId(user_id);
  //   const selectedUser = projectUsers.find((u) => u.user_id === user_id);
  //   if (selectedUser) {
  //     setHostJobname(selectedUser.user_jobname || '');
  //     // 회의장이 참석자 목록에 있다면 제거
  //     setAttendees(attendees.filter((att) => att.user_id !== user_id));
  //   }
  // };

  const handleAttendeeToggle = (user: ProjectUser) => {
    const isSelected = attendees.some((att) => att.user_id === user.user_id);

    if (isSelected) {
      // 선택 해제
      setAttendees(attendees.filter((att) => att.user_id !== user.user_id));
    } else {
      // 선택 추가 (회의장이 아닌 경우에만)
      if (user.user_id !== hostId) {
        setAttendees([
          ...attendees,
          {
            user_id: user.user_id,
            name: user.name,
            email: user.email,
            user_jobname: user.user_jobname || '',
          },
        ]);
      }
    }
  };

  const handleRoleChange = (user_id: string, role: string) => {
    if (user_id === hostId) {
      setHostJobname(role);
    } else {
      const updated = attendees.map((att) =>
        att.user_id === user_id ? { ...att, user_jobname: role } : att
      );
      setAttendees(updated);
    }
  };

  const handleSelectAll = () => {
    const availableUsers = projectUsers.filter(
      (user) => user.user_id !== hostId
    );
    setAttendees(
      availableUsers.map((user) => ({
        user_id: user.user_id,
        name: user.name,
        email: user.email,
        user_jobname: user.user_jobname || '',
      }))
    );
  };

  const handleClearAll = () => {
    setAttendees([]);
  };

  const hostUser = projectUsers.find((user) => user.user_id === hostId);

  // 실제로 선택된 참석자만 필터링 (빈 user_id 제외)
  const selectedAttendees = attendees.filter(
    (att) => att.user_id && att.user_id.trim() !== ''
  );

  return (
    <AttendInfoWrapper>
      {/* 선택된 사용자 요약 */}
      {(hostUser || selectedAttendees.length > 0) && (
        <SelectedSummary>
          <SummaryTitle>
            <Users size={18} />
            선택된 참석자 ({(hostUser ? 1 : 0) + selectedAttendees.length}명)
          </SummaryTitle>
          {hostUser && (
            <HostTag>
              <Crown size={14} />
              {hostUser.name} (회의장)
            </HostTag>
          )}
          {selectedAttendees.map((att) => (
            <SelectedTag key={att.user_id}>{att.name}</SelectedTag>
          ))}
        </SelectedSummary>
      )}

      <UserSelectionPanel>
        <SearchAndActionsRow>
          <SearchBox>
            <SearchIcon />
            <SearchInput
              type="text"
              placeholder="이름 또는 이메일로 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </SearchBox>

          <QuickActions>
            <QuickButton onClick={handleSelectAll}>전체 선택</QuickButton>
            <QuickButton onClick={handleClearAll}>선택 해제</QuickButton>
          </QuickActions>
        </SearchAndActionsRow>

        <UserGrid>
          {filteredUsers.map((user) => {
            const isHost = user.user_id === hostId;
            const isSelected = attendees.some(
              (att) => att.user_id === user.user_id
            );
            const currentRole = isHost
              ? hostJobname
              : attendees.find((att) => att.user_id === user.user_id)
                  ?.user_jobname ||
                user.user_jobname ||
                '';
            // const isCurrentUser = user.user_id === currentUser?.id;

            return (
              <UserCard
                key={user.user_id}
                $selected={isSelected}
                $isHost={isHost}
                onClick={() => !isHost && handleAttendeeToggle(user)}
              >
                <div>
                  {!isHost && (
                    <UserCheckbox
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleAttendeeToggle(user)}
                      onClick={(e) => e.stopPropagation()}
                    />
                  )}
                </div>
                <UserInfo>
                  <UserNameEmail>
                    {user.name}
                    {isHost && <Crown size={16} color="#480b6a" />}
                    <UserEmailSpan>/ {user.email}</UserEmailSpan>
                  </UserNameEmail>
                  <UserRole
                    type="text"
                    placeholder="역할 입력"
                    value={currentRole}
                    onChange={(e) =>
                      handleRoleChange(user.user_id, e.target.value)
                    }
                    onClick={(e) => e.stopPropagation()}
                  />
                </UserInfo>
              </UserCard>
            );
          })}
        </UserGrid>
      </UserSelectionPanel>
    </AttendInfoWrapper>
  );
};

export default AttendInfo;
