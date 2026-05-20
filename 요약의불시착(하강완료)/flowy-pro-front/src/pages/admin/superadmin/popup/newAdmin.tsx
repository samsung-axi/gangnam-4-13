import React, { useState, useEffect, useMemo } from 'react';
import styled from 'styled-components';
import { FiUser, FiArrowLeft, FiArrowRight, FiX } from 'react-icons/fi';
import {
  fetchSignupInfos,
  fetchUsersByCompany,
} from '../../../../api/fetchSignupInfos';

const Modal = styled.div<{ $isOpen: boolean }>`
  display: ${(props) => (props.$isOpen ? 'flex' : 'none')};
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(8px);
  justify-content: center;
  align-items: center;
  z-index: 1000;
  animation: fadeIn 0.3s ease-out;

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 24px;
  width: 100%;
  max-width: 700px;
  max-height: 90vh;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(45, 17, 85, 0.15);
  border: 1px solid rgba(45, 17, 85, 0.1);
  animation: slideUp 0.3s ease-out;

  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(30px) scale(0.95);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }
`;

const ModalHeader = styled.div`
  background: linear-gradient(135deg, #2d1155 0%, #4b2067 100%);
  color: white;
  padding: 32px 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
`;

const HeaderContent = styled.div`
  flex: 1;
`;

const Title = styled.h2`
  margin: 0 0 8px 0;
  font-size: 1.75rem;
  font-weight: 700;
  color: white;
`;

const Subtitle = styled.p`
  margin: 0;
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.8);
  font-weight: 400;
`;

const CloseButton = styled.button`
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: scale(1.05);
  }
`;

const StepIndicator = styled.div`
  display: flex;
  justify-content: center;
  padding: 24px 40px;
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
`;

const Step = styled.div<{ $active: boolean; $completed: boolean }>`
  display: flex;
  align-items: center;
  gap: 12px;

  &:not(:last-child)::after {
    content: '';
    width: 60px;
    height: 2px;
    background: ${(props) => (props.$completed ? '#2d1155' : '#e2e8f0')};
    margin: 0 24px;
    border-radius: 1px;
  }
`;

const StepNumber = styled.div<{ $active: boolean; $completed: boolean }>`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.3s ease;

  ${(props) => {
    if (props.$completed) {
      return `
        background: linear-gradient(135deg, #2d1155 0%, #4b2067 100%);
        color: white;
        box-shadow: 0 4px 12px rgba(45, 17, 85, 0.3);
      `;
    } else if (props.$active) {
      return `
        background: white;
        color: #2d1155;
        border: 2px solid #2d1155;
        box-shadow: 0 4px 12px rgba(45, 17, 85, 0.2);
      `;
    } else {
      return `
        background: #e2e8f0;
        color: #64748b;
        border: 2px solid #e2e8f0;
      `;
    }
  }}
`;

const StepLabel = styled.span<{ $active: boolean; $completed: boolean }>`
  font-size: 14px;
  font-weight: 500;
  color: ${(props) =>
    props.$active || props.$completed ? '#2d1155' : '#64748b'};
  transition: color 0.3s ease;
`;

const ModalBody = styled.div`
  padding: 40px;
  overflow-y: auto;
  max-height: 50vh;
  min-height: 200px;
`;

const FormGroup = styled.div`
  margin-bottom: 24px;
`;

const Label = styled.label`
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 8px;
`;

const Select = styled.select`
  width: 100%;
  height: 48px;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  padding: 0 16px;
  font-size: 16px;
  color: #374151;
  background: white;
  cursor: pointer;
  transition: all 0.2s ease;
  appearance: none;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e");
  background-position: right 12px center;
  background-repeat: no-repeat;
  background-size: 16px;

  &:hover {
    border-color: #2d1155;
  }

  &:focus {
    outline: none;
    border-color: #2d1155;
    box-shadow: 0 0 0 3px rgba(45, 17, 85, 0.1);
  }
`;

const UserTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

  th,
  td {
    padding: 16px;
    text-align: left;
    border-bottom: 1px solid #e5e7eb;
  }

  th {
    background: #f8fafc;
    font-weight: 600;
    color: #374151;
    font-size: 14px;
  }

  tbody tr {
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
      background: rgba(45, 17, 85, 0.02);
    }

    &.selected {
      background: rgba(45, 17, 85, 0.05);
      border-left: 4px solid #2d1155;
    }
  }

  td {
    font-size: 14px;
    color: #6b7280;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: #6b7280;

  svg {
    width: 48px;
    height: 48px;
    margin-bottom: 16px;
    color: #d1d5db;
  }

  h3 {
    margin: 0 0 8px 0;
    font-size: 18px;
    font-weight: 600;
    color: #374151;
  }

  p {
    margin: 0;
    font-size: 14px;
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  color: #6b7280;
`;

const LoadingSpinner = styled.div`
  width: 40px;
  height: 40px;
  border: 3px solid #f3f4f6;
  border-top: 3px solid #2d1155;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const SearchInput = styled.input`
  width: 100%;
  height: 40px;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  padding: 0 16px;
  font-size: 14px;
  color: #374151;
  background: white;
  margin-bottom: 16px;
  transition: all 0.2s ease;

  &:hover {
    border-color: #2d1155;
  }

  &:focus {
    outline: none;
    border-color: #2d1155;
    box-shadow: 0 0 0 3px rgba(45, 17, 85, 0.1);
  }

  &::placeholder {
    color: #9ca3af;
  }
`;

// const ErrorContainer = styled.div`
//   display: flex;
//   flex-direction: column;
//   align-items: center;
//   justify-content: center;
//   padding: 40px 20px;
//   text-align: center;
//   background: linear-gradient(135deg, #fef2f2 0%, #fde8e8 100%);
//   border: 1px solid #fca5a5;
//   border-radius: 12px;
//   color: #dc2626;
// `;

// const ErrorIcon = styled.div`
//   width: 48px;
//   height: 48px;
//   margin-bottom: 16px;
//   color: #ef4444;
//   font-size: 48px;
// `;

// const ErrorTitle = styled.h3`
//   margin: 0 0 8px 0;
//   font-size: 18px;
//   font-weight: 600;
//   color: #dc2626;
// `;

// const ErrorMessage = styled.p`
//   margin: 0 0 16px 0;
//   font-size: 14px;
//   color: #991b1b;
//   line-height: 1.5;
//   white-space: pre-line;
// `;

// const RetryButton = styled.button`
//   padding: 8px 16px;
//   border-radius: 8px;
//   border: 1px solid #dc2626;
//   background: #dc2626;
//   color: white;
//   font-size: 14px;
//   font-weight: 500;
//   cursor: pointer;
//   transition: all 0.2s ease;

//   &:hover {
//     background: #b91c1c;
//     border-color: #b91c1c;
//   }
// `;

const ConfirmationCard = styled.div`
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 24px;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;
`;

const UserAvatar = styled.div`
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: linear-gradient(135deg, #2d1155 0%, #4b2067 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 20px;
  font-weight: 600;
`;

const UserDetails = styled.div`
  flex: 1;

  h3 {
    margin: 0 0 4px 0;
    font-size: 18px;
    font-weight: 600;
    color: #1f2937;
  }

  p {
    margin: 0;
    font-size: 14px;
    color: #6b7280;
  }
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
`;

const InfoItem = styled.div`
  label {
    display: block;
    font-size: 12px;
    font-weight: 500;
    color: #6b7280;
    margin-bottom: 4px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  span {
    font-size: 14px;
    font-weight: 500;
    color: #1f2937;
  }
`;

const ModalFooter = styled.div`
  padding: 24px 40px;
  background: #f8fafc;
  border-top: 1px solid #e2e8f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  position: sticky;
  bottom: 0;
  z-index: 10;
  min-height: 80px;
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.2s ease;
  cursor: pointer;
  border: none;

  ${(props) =>
    props.variant === 'primary'
      ? `
    background: linear-gradient(135deg, #2d1155 0%, #4b2067 100%);
    color: white;
    box-shadow: 0 4px 12px rgba(45, 17, 85, 0.3);

    &:hover {
      transform: translateY(-1px);
      box-shadow: 0 6px 16px rgba(45, 17, 85, 0.4);
    }

    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      transform: none;
    }
  `
      : `
    background: white;
    color: #6b7280;
    border: 1px solid #d1d5db;

    &:hover {
      background: #f9fafb;
      color: #374151;
    }
  `}

  &:active {
    transform: translateY(0);
  }
`;

interface Company {
  company_id: string;
  company_name: string;
}

interface User {
  user_id: string;
  user_name: string;
  user_email: string;
  user_phonenum: string;
  user_login_id: string;
  user_dept_name: string;
  user_team_name: string;
}

interface NewAdminProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent, adminData?: any) => void;
  formData: {
    user_name: string;
    user_id: string;
    user_email: string;
    user_phonenum: string;
    company_name: string;
  };
  onUserSelect: (userData: any) => void;
}

const NewAdmin: React.FC<NewAdminProps> = ({
  visible,
  onClose,
  onSubmit,
  // formData,
  onUserSelect,
}) => {
  const [currentStep, setCurrentStep] = useState<1 | 2>(1);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  // const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (visible) {
      loadCompanies();
      setCurrentStep(1);
      setSelectedCompany(null);
      setSelectedUser(null);
      setUsers([]);
      setSearchTerm('');
      // setError(null);
    }
  }, [visible]);

  const loadCompanies = async () => {
    try {
      const data = await fetchSignupInfos();

      if (data.companies && Array.isArray(data.companies)) {
        setCompanies(data.companies);
      } else {
        setCompanies([]);
      }
    } catch (error) {
      setCompanies([]);
    }
  };

  const loadUsers = async (companyId: string) => {
    setLoading(true);
    // setError(null);

    try {
      const users = await fetchUsersByCompany(companyId);

      if (users && Array.isArray(users)) {
        setUsers(users);
      } else {
        setUsers([]);
      }
    } catch (error) {
      let errorMessage = '사용자 목록을 불러오는데 실패했습니다.';

      if (error instanceof Error) {
        if (error.message.includes('500')) {
          errorMessage =
            '서버에 일시적인 문제가 발생했습니다.\n잠시 후 다시 시도해주세요.';
        } else if (
          error.message.includes('timeout') ||
          error.message.includes('TimeoutError')
        ) {
          errorMessage =
            '서버 응답 시간이 초과되었습니다.\n잠시 후 다시 시도해주세요.';
        } else if (error.message.includes('403')) {
          errorMessage = '이 회사의 사용자 목록을 볼 권한이 없습니다.';
        } else if (error.message.includes('404')) {
          errorMessage = '해당 회사를 찾을 수 없습니다.';
        }
      }

      // setError(errorMessage);
      console.log(errorMessage);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCompanyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const companyId = e.target.value;

    const company = companies.find((c) => c.company_id === companyId);

    setSelectedCompany(company || null);
    setSelectedUser(null);
    setSearchTerm('');
    // setError(null);

    if (company) {
      loadUsers(companyId);
    } else {
      setUsers([]);
    }
  };

  const handleUserSelect = (user: User) => {
    setSelectedUser(user);
  };

  const handleNext = () => {
    if (selectedUser) {
      setCurrentStep(2);
    }
  };

  const handleBack = () => {
    setCurrentStep(1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedUser && selectedCompany) {
      const adminData = {
        user_name: selectedUser.user_name,
        user_id: selectedUser.user_id,
        user_email: selectedUser.user_email,
        user_phonenum: selectedUser.user_phonenum,
        company_name: selectedCompany.company_name,
      };

      onUserSelect(adminData);

      onSubmit(e, adminData);
    }
  };

  const filteredUsers = useMemo(() => {
    if (!searchTerm.trim()) return users;

    return users.filter(
      (user) =>
        user.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.user_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.user_login_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.user_dept_name &&
          user.user_dept_name
            .toLowerCase()
            .includes(searchTerm.toLowerCase())) ||
        (user.user_team_name &&
          user.user_team_name.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [users, searchTerm]);

  const renderStep1 = () => (
    <>
      <FormGroup>
        <Label>회사 선택</Label>
        <Select
          value={selectedCompany?.company_id || ''}
          onChange={handleCompanyChange}
        >
          <option value="">회사를 선택하세요</option>
          {companies.map((company) => (
            <option key={company.company_id} value={company.company_id}>
              {company.company_name}
            </option>
          ))}
        </Select>
      </FormGroup>

      <FormGroup>
        <Label>사용자 목록</Label>
        {!selectedCompany ? (
          <EmptyState>
            <FiUser />
            <h3>회사를 먼저 선택하세요</h3>
            <p>사용자 목록을 보려면 위에서 회사를 선택해주세요.</p>
          </EmptyState>
        ) : loading ? (
          <LoadingContainer>
            <LoadingSpinner />
            <p>사용자 목록을 불러오는 중...</p>
          </LoadingContainer>
        ) : users.length > 0 ? (
          <>
            <SearchInput
              type="text"
              placeholder="이름, 이메일, 아이디, 부서, 팀으로 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            {filteredUsers.length > 0 ? (
              <UserTable>
                <thead>
                  <tr>
                    <th>이름</th>
                    <th>이메일</th>
                    <th>부서</th>
                    <th>팀</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr
                      key={user.user_id}
                      onClick={() => {
                        handleUserSelect(user);
                      }}
                      className={
                        selectedUser?.user_id === user.user_id ? 'selected' : ''
                      }
                      style={{
                        backgroundColor:
                          selectedUser?.user_id === user.user_id
                            ? 'rgba(45, 17, 85, 0.1)'
                            : 'transparent',
                        borderLeft:
                          selectedUser?.user_id === user.user_id
                            ? '4px solid #2d1155'
                            : 'none',
                      }}
                    >
                      <td>
                        {selectedUser?.user_id === user.user_id && '✓ '}
                        {user.user_name}
                      </td>
                      <td>{user.user_email}</td>
                      <td>{user.user_dept_name || '-'}</td>
                      <td>{user.user_team_name || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </UserTable>
            ) : (
              <EmptyState>
                <FiUser />
                <h3>검색 결과가 없습니다</h3>
                <p>검색어를 변경해보세요.</p>
              </EmptyState>
            )}
          </>
        ) : (
          <EmptyState>
            <FiUser />
            <h3>사용자가 없습니다</h3>
            <p>선택한 회사에 등록된 사용자가 없습니다.</p>
          </EmptyState>
        )}
      </FormGroup>
    </>
  );

  const renderStep2 = () => (
    <>
      {selectedUser && selectedCompany && (
        <ConfirmationCard>
          <UserInfo>
            <UserAvatar>{selectedUser.user_name.charAt(0)}</UserAvatar>
            <UserDetails>
              <h3>{selectedUser.user_name}</h3>
              <p>{selectedCompany.company_name}</p>
            </UserDetails>
          </UserInfo>

          <InfoGrid>
            <InfoItem>
              <label>로그인 ID</label>
              <span>{selectedUser.user_login_id}</span>
            </InfoItem>
            <InfoItem>
              <label>이메일</label>
              <span>{selectedUser.user_email}</span>
            </InfoItem>
            <InfoItem>
              <label>전화번호</label>
              <span>{selectedUser.user_phonenum}</span>
            </InfoItem>
            <InfoItem>
              <label>부서</label>
              <span>{selectedUser.user_dept_name || '-'}</span>
            </InfoItem>
          </InfoGrid>
        </ConfirmationCard>
      )}

      <p style={{ color: '#6b7280', fontSize: '14px', lineHeight: '1.5' }}>
        선택한 사용자를 관리자로 등록하시겠습니까?
        <br />
        기존 관리자가 있는 경우 일반 사용자로 변경됩니다.
      </p>
    </>
  );

  return (
    <Modal $isOpen={visible}>
      <ModalContent>
        <ModalHeader>
          <HeaderContent>
            <Title>관리자 계정 등록</Title>
            <Subtitle>
              {currentStep === 1
                ? '회사를 선택하고 관리자로 등록할 사용자를 선택하세요.'
                : '선택한 사용자 정보를 확인하세요.'}
            </Subtitle>
          </HeaderContent>
          <CloseButton onClick={onClose}>
            <FiX />
          </CloseButton>
        </ModalHeader>

        <StepIndicator>
          <Step $active={currentStep === 1} $completed={currentStep > 1}>
            <StepNumber
              $active={currentStep === 1}
              $completed={currentStep > 1}
            >
              1
            </StepNumber>
            <StepLabel $active={currentStep === 1} $completed={currentStep > 1}>
              사용자 선택
            </StepLabel>
          </Step>

          <Step $active={currentStep === 2} $completed={false}>
            <StepNumber $active={currentStep === 2} $completed={false}>
              2
            </StepNumber>
            <StepLabel $active={currentStep === 2} $completed={false}>
              정보 확인
            </StepLabel>
          </Step>
        </StepIndicator>

        <ModalBody>
          {currentStep === 1 ? renderStep1() : renderStep2()}
        </ModalBody>

        <ModalFooter>
          <div>
            {currentStep === 2 && (
              <Button variant="secondary" onClick={handleBack}>
                <FiArrowLeft />
                이전
              </Button>
            )}
          </div>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-end',
              gap: '8px',
            }}
          >
            {currentStep === 1 && (
              <>
                {selectedUser && (
                  <div
                    style={{
                      fontSize: '12px',
                      color: '#2d1155',
                      fontWeight: '500',
                    }}
                  >
                    ✓ 선택됨: {selectedUser.user_name}
                  </div>
                )}
                <Button
                  variant="primary"
                  onClick={handleNext}
                  disabled={!selectedUser}
                  style={{
                    opacity: selectedUser ? 1 : 0.5,
                    cursor: selectedUser ? 'pointer' : 'not-allowed',
                    minWidth: '120px',
                  }}
                >
                  다음 {selectedUser ? '✓' : ''}
                  <FiArrowRight />
                </Button>
              </>
            )}

            {currentStep === 2 && (
              <Button variant="primary" onClick={handleSubmit}>
                관리자로 등록
              </Button>
            )}
          </div>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default NewAdmin;
