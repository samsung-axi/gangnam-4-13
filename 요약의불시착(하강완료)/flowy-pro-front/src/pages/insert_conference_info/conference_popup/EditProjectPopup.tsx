import React, { useEffect, useState } from 'react';
import AddProjectIcon2 from '/images/addprojecticon2.svg';
import {
  fetchProjectMetaData,
  updateProjectWithUsers,
} from '../../../api/fetchProject';
import type {
  ProjectUserIdName,
  ProjectResponse,
  ProjectUpdateRequestBody,
} from '../../../types/project';
import {
  AddButton,
  CloseButton,
  CreateProjectButton,
  ErrorMessageBox,
  FormGroup,
  // NoResultsMessage,
  PopupContent,
  PopupHeader,
  PopupOverlay,
  PopupTitle,
  ProjectIcon,
  RemoveButton,
  SearchContainer,
  SearchInput,
  // SearchResultItem,
  // SearchResultsContainer,
  SelectedUserItem,
  SelectedUsersContainer,
  SelectedUsersTitle,
  TagsContainer,
  StyledInput,
  StyledLabel,
  StyledTextarea,
  UserItem,
  UserListBox,
  UserManagementContainer,
  UserName,
  UserPanel,
  PopupBody,
} from './EditProjectPopup.styles';

interface PopupProps {
  onClose: () => void;
  projectToEdit: ProjectResponse;
}

const EditProjectPopup: React.FC<PopupProps> = ({ onClose, projectToEdit }) => {
  // 팝업 내부 상태
  const [projectName, setProjectName] = useState('');
  const [allCompanyUsers, setAllCompanyUsers] = useState<ProjectUserIdName[]>(
    []
  );
  const [selectedProjectUsers, setSelectedProjectUsers] = useState<
    ProjectUserIdName[]
  >([]);
  const [projectDetails, setProjectDetails] = useState('');
  // const [companyId, setCompanyId] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [poId, setPoId] = useState('');
  const [ppId, setPpId] = useState('');

  // 검색 관련 상태
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredUsers, setFilteredUsers] = useState<ProjectUserIdName[]>([]);

  // 검색어에 따른 사용자 필터링
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredUsers(allCompanyUsers);
    } else {
      const filtered = allCompanyUsers.filter(
        (user) =>
          user.user_name.toLowerCase().includes(searchTerm.toLowerCase()) &&
          !selectedProjectUsers.some(
            (selected) => selected.user_id === user.user_id
          )
      );
      setFilteredUsers(filtered);
    }
  }, [searchTerm, allCompanyUsers, selectedProjectUsers]);

  const handleSelectUser = (user: ProjectUserIdName) => {
    if (!selectedProjectUsers.some((u) => u.user_id === user.user_id)) {
      setSelectedProjectUsers([
        ...selectedProjectUsers,
        { ...user, role_id: ppId },
      ]);
      setSearchTerm('');
    }
  };

  const handleDeselectUser = (user: ProjectUserIdName) => {
    setSelectedProjectUsers(
      selectedProjectUsers.filter((u) => u.user_id !== user.user_id)
    );
  };

  const handleUpdateProject = async () => {
    // 유효성 검사
    if (!projectName.trim()) {
      setErrorMessage('프로젝트명을 입력해주세요.');
      return;
    }
    if (selectedProjectUsers.length === 0) {
      setErrorMessage('참여자를 한 명 이상 선택해주세요.');
      return;
    }
    if (!selectedProjectUsers.some((user) => user.role_id === poId)) {
      setErrorMessage(
        '프로젝트에 PO 역할을 가진 참여자가 1명 이상 있어야 합니다.'
      );
      return;
    }

    setErrorMessage(null);

    const requestBody: ProjectUpdateRequestBody = {
      project_id: projectToEdit.projectId,
      project_name: projectName,
      project_detail: projectDetails,
      // project_status: true,
      project_users: selectedProjectUsers.map((user) => ({
        user_id: user.user_id,
        role_id: user.role_id!,
      })),
    };

    try {
      await updateProjectWithUsers(projectToEdit.projectId, requestBody);
      window.location.replace('/insert_info');
    } catch (err) {
      setErrorMessage('프로젝트 수정 중 오류가 발생했습니다.');
    }
  };

  useEffect(() => {
    const initialize = async () => {
      // 1. 메타 데이터 로드
      const metaData = await fetchProjectMetaData();
      if (!metaData) {
        setErrorMessage('프로젝트 데이터를 불러오는 데 실패했습니다.');
        return;
      }
      console.log(metaData);
      const allUsers = metaData.users || [];
      const allRoles = metaData.roles || [];
      setAllCompanyUsers(allUsers);
      // setCompanyId(metaData.company_id || '');
      const poRole = allRoles.find((r: any) => r.role_name === 'PO');
      const ppRole = allRoles.find((r: any) => r.role_name === 'PP');
      const poRoleId = poRole ? poRole.role_id : '';
      const ppRoleId = ppRole ? ppRole.role_id : '';
      setPoId(poRoleId);
      setPpId(ppRoleId);

      // 2. 수정할 프로젝트 정보 채우기
      setProjectName(projectToEdit.projectName);
      setProjectDetails(projectToEdit.projectDetail || '');

      // 3. 기존 참여자 정보 로드 및 설정
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/v1/stt/project-users/${
            projectToEdit.projectId
          }`,
          {
            credentials: 'include',
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        );
        const projectUsersData = await res.json();
        if (projectUsersData && projectUsersData.users) {
          const currentParticipants = projectUsersData.users.map(
            (u: { user_id: string; name: string; role_id: string }) => ({
              user_id: u.user_id,
              user_name: u.name,
              role_id: u.role_id,
            })
          );

          console.log(projectUsersData);
          setSelectedProjectUsers(currentParticipants);
        }
      } catch (error) {
        setErrorMessage('기존 참여자 정보를 불러오는 데 실패했습니다.');
      }
    };
    initialize();
  }, [projectToEdit]);

  return (
    <PopupOverlay>
      <PopupContent>
        <PopupHeader>
          <ProjectIcon src={AddProjectIcon2} alt="프로젝트 수정" />
          <PopupTitle>프로젝트 수정하기</PopupTitle>
          <CloseButton onClick={onClose}>×</CloseButton>
        </PopupHeader>

        <PopupBody>
          <FormGroup>
            <StyledLabel htmlFor="edit-project-name">프로젝트명</StyledLabel>
            <StyledInput
              type="text"
              id="edit-project-name"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="프로젝트명을 입력해주세요"
            />
          </FormGroup>
          <FormGroup>
            <StyledLabel htmlFor="project-attendees">
              프로젝트 참여자 선택
            </StyledLabel>
            <UserManagementContainer>
              <UserPanel>
                <SearchContainer>
                  <SearchInput
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="사용자 검색"
                  />
                </SearchContainer>
                <UserListBox>
                  {filteredUsers
                    .filter(
                      (u) =>
                        !selectedProjectUsers.some(
                          (su) => su.user_id === u.user_id
                        )
                    )
                    .map((user) => (
                      <UserItem key={user.user_id}>
                        <span>{user.user_name}</span>
                        <AddButton onClick={() => handleSelectUser(user)}>
                          +
                        </AddButton>
                      </UserItem>
                    ))}
                </UserListBox>
              </UserPanel>
              <UserPanel>
                <SelectedUsersContainer>
                  <SelectedUsersTitle>
                    선택된 참여자 ({selectedProjectUsers.length}명)
                  </SelectedUsersTitle>
                  <TagsContainer>
                    {/* PO 역할을 가진 사용자 먼저 렌더링 */}
                    {selectedProjectUsers
                      .filter((user) => user.role_id === poId)
                      .map((selectedUser) => (
                        <SelectedUserItem key={selectedUser.user_id}>
                          <UserName>Host: {selectedUser.user_name}</UserName>
                          {/* PO는 제거 버튼 없음 */}
                        </SelectedUserItem>
                      ))}

                    {/* 나머지 사용자 렌더링 */}
                    {selectedProjectUsers
                      .filter((user) => user.role_id !== poId)
                      .map((selectedUser) => (
                        <SelectedUserItem key={selectedUser.user_id}>
                          <UserName>{selectedUser.user_name}</UserName>
                          <RemoveButton
                            onClick={() => handleDeselectUser(selectedUser)}
                          >
                            ×
                          </RemoveButton>
                        </SelectedUserItem>
                      ))}
                  </TagsContainer>
                </SelectedUsersContainer>
              </UserPanel>
            </UserManagementContainer>
          </FormGroup>
          <FormGroup>
            <StyledLabel htmlFor="project-details">프로젝트 설명</StyledLabel>
            <StyledTextarea
              id="project-details"
              value={projectDetails}
              onChange={(e) => setProjectDetails(e.target.value)}
              placeholder="프로젝트에 대한 설명을 입력해주세요"
            />
          </FormGroup>
          {errorMessage && <ErrorMessageBox>{errorMessage}</ErrorMessageBox>}
          <CreateProjectButton onClick={handleUpdateProject}>
            수정하기
          </CreateProjectButton>
        </PopupBody>
      </PopupContent>
    </PopupOverlay>
  );
};

export default EditProjectPopup;
