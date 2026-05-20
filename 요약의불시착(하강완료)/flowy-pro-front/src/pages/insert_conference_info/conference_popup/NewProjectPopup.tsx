import React, { useEffect, useState } from "react";
// import AddProjectIcon from "/images/addprojecticon.svg"; // AddProjectIcon 임포트
import AddProjectIcon2 from "/images/addprojecticon2.svg"; // AddProjectIcon2 임포트
import { createProject, fetchProjectMetaData } from "../../../api/fetchProject";
import type {
  ProjectRequestBody,
  // ProjectRoleIdName,
  ProjectUserIdName,
} from "../../../types/project";
import {
  AddButton,
  CloseButton,
  CreateProjectButton,
  ErrorMessageBox,
  FormGroup,
  NoResultsMessage,
  PopupContent,
  PopupHeader,
  PopupOverlay,
  PopupTitle,
  ProjectIcon,
  RemoveButton,
  SearchContainer,
  SearchInput,
  SearchResultItem,
  SearchResultsContainer,
  SelectedUserItem,
  SelectedUsersContainer,
  SelectedUsersTitle,
  TagsContainer,
  // RoleSelect,
  StyledInput,
  StyledLabel,
  StyledTextarea,
  UserItem,
  UserListBox,
  UserManagementContainer,
  UserName,
  UserPanel,
  PopupBody,
} from './NewProjectPopup.styles';
import { useAuth } from '../../../contexts/AuthContext';
import { checkAuth } from '../../../api/fetchAuthCheck';

interface PopupProps {
  onClose: () => void;
}

const NewProjectPopup: React.FC<PopupProps> = ({ onClose }) => {
  // 팝업 내부 상태
  const [projectName, setProjectName] = React.useState("");
  const [projectUsers, setProjectUsers] = useState<ProjectUserIdName[]>([]);
  const [selectedProjectUsers, setSelectedProjectUsers] = useState<
    ProjectUserIdName[]
  >([]);
  const [projectDetails, setProjectDetails] = useState<string>("");
  // const [projectRoles, setProjectRoles] = useState<ProjectRoleIdName[]>([]);
  const [companyId, setCompanyId] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [poId, setPoId] = useState<string>("");
  const [ppId, setPpId] = useState<string>("");

  // 검색 관련 상태
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filteredUsers, setFilteredUsers] = useState<ProjectUserIdName[]>([]);

  const { user, setUser, setLoading } = useAuth();

  // 검색어에 따른 사용자 필터링
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredUsers(projectUsers);
    } else {
      const filtered = projectUsers.filter(
        (user) =>
          user.user_name.toLowerCase().includes(searchTerm.toLowerCase()) &&
          !selectedProjectUsers.some(
            (selected) => selected.user_id === user.user_id
          )
      );
      setFilteredUsers(filtered);
    }
  }, [searchTerm, projectUsers, selectedProjectUsers]);

  const handleSelectUser = (user: ProjectUserIdName) => {
    const alreadySelected = selectedProjectUsers.some(
      (u) => u.user_id === user.user_id
    );
    if (!alreadySelected) {
      setSelectedProjectUsers([
        ...selectedProjectUsers,
        { ...user, role_id: ppId },
      ]);
      // 검색어 초기화
      setSearchTerm("");
    }
  };

  const handleDeselectUser = (user: ProjectUserIdName) => {
    const updatedUsers = selectedProjectUsers.filter(
      (u) => u.user_id !== user.user_id
    );
    setSelectedProjectUsers(updatedUsers);
  };

  // 사용자 역할을 변경해주는 함수
  // const handleChangeUserRole = (userId: string, roleId: string) => {
  //   if (roleId === poId) {
  //     const existingPO = selectedProjectUsers.find(
  //       (u) => u.role_id === poId && u.user_id !== userId
  //     );
  //     if (existingPO) {
  //       // 기존 PO가 있을 경우 PP로 바꾸기
  //       const updated = selectedProjectUsers.map((user) => {
  //         if (user.user_id === userId) {
  //           return { ...user, role_id: poId };
  //         } else if (user.user_id === existingPO.user_id) {
  //           return { ...user, role_id: ppId };
  //         }
  //         return user;
  //       });
  //       setSelectedProjectUsers(updated);
  //       return;
  //     }
  //   }

  //   const updated = selectedProjectUsers.map((user) =>
  //     user.user_id === userId ? { ...user, role_id: roleId } : user
  //   );
  //   setSelectedProjectUsers(updated);
  // };

  const handleCreateProject = async () => {
    // 유효성 검사
    if (!projectName.trim()) {
      setErrorMessage("프로젝트명을 입력해주세요.");
      return;
    }

    if (selectedProjectUsers.length === 0) {
      setErrorMessage("참여자를 한 명 이상 선택해주세요.");
      return;
    }

    const userWithoutRole = selectedProjectUsers.find(
      (user) => !user.role_id || user.role_id === ""
    );

    if (userWithoutRole) {
      setErrorMessage("모든 참여자에게 역할을 지정해주세요.");
      return;
    }

    const hasPO = selectedProjectUsers.some((user) => user.role_id === poId);

    if (!hasPO) {
      setErrorMessage(
        "프로젝트에 PO 역할을 가진 참여자가 1명 이상 있어야 합니다."
      );
      return;
    }

    // 에러 초기화 후 요청
    setErrorMessage(null);

    const requestBody: ProjectRequestBody = {
      company_id: companyId,
      project_name: projectName,
      project_detail: projectDetails,
      project_status: true,
      project_users: selectedProjectUsers.map((user) => ({
        user_id: user.user_id,
        role_id: user.role_id!,
      })),
    };

    try {
      const res = await createProject(requestBody);
      console.log("프로젝트 생성 성공:", await res.json());
      onClose(); // 팝업 닫기
    } catch (err) {
      setErrorMessage("프로젝트 생성 중 오류가 발생했습니다.");
    }
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

  useEffect(() => {
    if (user && user.id && poId) {
      setSelectedProjectUsers([
        {
          user_id: user.id,
          user_name: user.name,
          role_id: poId,
        },
      ]);
    }
    fetchProjectMetaData().then((data) => {
      if (data) {
        setProjectUsers(data.users);
        // setProjectRoles(data.roles);

        const poRole = data.roles.find((r: any) => r.role_name === "PO");
        const ppRole = data.roles.find((r: any) => r.role_name === "PP");

        if (poRole) setPoId(poRole.role_id);
        if (ppRole) setPpId(ppRole.role_id);

        setCompanyId(data.company_id);
      }
    });
  }, [user, poId]);

  return (
    <PopupOverlay>
      <PopupContent>
        <PopupHeader>
          <ProjectIcon src={AddProjectIcon2} alt="새 프로젝트 생성" />
          <PopupTitle>새 프로젝트 생성하기</PopupTitle>
          <CloseButton onClick={onClose}>×</CloseButton>
        </PopupHeader>

        <PopupBody>
          <FormGroup>
            <StyledLabel htmlFor="new-project-name">프로젝트명</StyledLabel>
            <StyledInput
              type="text"
              id="new-project-name"
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

                {searchTerm.trim() ? (
                  <SearchResultsContainer>
                    {filteredUsers.length > 0 ? (
                      filteredUsers.map((user) => (
                        <SearchResultItem
                          key={user.user_id}
                          onClick={() => handleSelectUser(user)}
                        >
                          <UserName>{user.user_name}</UserName>
                          <AddButton>+</AddButton>
                        </SearchResultItem>
                      ))
                    ) : (
                      <NoResultsMessage>검색 결과가 없습니다.</NoResultsMessage>
                    )}
                  </SearchResultsContainer>
                ) : (
                  <UserListBox>
                    {projectUsers
                      .filter(
                        (user) =>
                          !selectedProjectUsers.some(
                            (selected) => selected.user_id === user.user_id
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
                )}
              </UserPanel>
              <UserPanel>
                <SelectedUsersContainer>
                  <SelectedUsersTitle>
                    선택된 참여자 ({selectedProjectUsers.length}명)
                  </SelectedUsersTitle>
                  <TagsContainer>
                    {selectedProjectUsers.length > 0 ? (
                      selectedProjectUsers.map((selectedUser) => (
                        <SelectedUserItem key={selectedUser.user_id}>
                          <UserName>{selectedUser.user_name}</UserName>
                          {selectedUser.user_id !== user?.id && (
                            <RemoveButton
                              onClick={() => handleDeselectUser(selectedUser)}
                            >
                              ×
                            </RemoveButton>
                          )}
                        </SelectedUserItem>
                      ))
                    ) : (
                      <NoResultsMessage>참여자를 추가해주세요.</NoResultsMessage>
                    )}
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
          <CreateProjectButton onClick={() => handleCreateProject()}>
            프로젝트 생성
          </CreateProjectButton>
        </PopupBody>
      </PopupContent>
    </PopupOverlay>
  );
};

export default NewProjectPopup;
