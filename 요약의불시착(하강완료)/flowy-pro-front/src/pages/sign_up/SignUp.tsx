import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import SignUpSuccessModal from './SignUpSuccessModal';
import {
  checkDuplicate,
  fetchSignupInfos,
  type Company,
  type CompanyPosition,
  // type Sysrole,
} from '../../api/fetchSignupInfos';

export const SignUpWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  position: relative;
  overflow: hidden;
  padding: 20px;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      radial-gradient(circle at 20% 50%, rgba(45, 17, 85, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, rgba(45, 17, 85, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 40% 80%, rgba(45, 17, 85, 0.1) 0%, transparent 50%);
    pointer-events: none;
  }
`;

export const FormContainer = styled.div`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  padding: 50px 60px;
  border-radius: 30px;
  width: 100%;
  max-width: 600px;
  box-shadow: 
    0 20px 40px rgba(45, 17, 85, 0.1),
    0 10px 20px rgba(45, 17, 85, 0.05);
  border: 1px solid rgba(45, 17, 85, 0.1);
  position: relative;
  z-index: 1;
`;

// 뒤로가기 버튼 스타일
const BackButton = styled.button`
  position: absolute;
  top: 20px;
  left: 20px;
  background: none;
  border: none;
  color: #2d1155;
  font-size: 24px;
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;

  &:hover {
    background: rgba(45, 17, 85, 0.1);
    color: #4a1e75;
    transform: translateX(-2px);
  }
`;

export const Title = styled.h2`
  text-align: center;
  font-size: 32px;
  font-weight: 700;
  color: #2d1155;
  margin-bottom: 40px;
  margin-top: 20px;
  text-shadow: 0 2px 4px rgba(45, 17, 85, 0.1);
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

export const InputGroup = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  border: 2px solid rgba(45, 17, 85, 0.1);
  border-radius: 12px;
  padding: 0 20px;
  height: 56px;
  background: rgba(255, 255, 255, 0.8);
  transition: all 0.3s ease;

  &:focus-within {
    border-color: #2d1155;
    box-shadow: 0 0 0 3px rgba(45, 17, 85, 0.1);
    background: rgba(255, 255, 255, 1);
  }

  &:hover {
    border-color: rgba(45, 17, 85, 0.3);
  }
`;

export const Label = styled.label`
  width: 150px;
  flex-shrink: 0;
  margin-right: 20px;
  font-weight: 600;
  color: #2d1155;
  font-size: 16px;
`;

export const StyledAsterisk = styled.span`
  color: #e74c3c;
  margin-left: 4px;
  font-weight: 700;
`;

export const Input = styled.input`
  flex-grow: 1;
  padding: 0;
  border: none;
  background: transparent;
  font-size: 16px;
  outline: none;
  color: #2d1155;
  font-weight: 500;

  &::placeholder {
    color: rgba(45, 17, 85, 0.5);
    font-size: 14px;
    font-weight: 400;
    text-align: right;
  }

  &:-webkit-autofill {
    -webkit-box-shadow: 0 0 0 30px rgba(255, 255, 255, 0.9) inset;
    -webkit-text-fill-color: #2d1155;
  }
`;

export const Select = styled.select`
  flex-grow: 1;
  padding: 0;
  border: none;
  background: transparent;
  font-size: 16px;
  outline: none;
  color: #2d1155;
  font-weight: 500;
  cursor: pointer;

  option {
    color: #2d1155;
    background: white;
  }
`;

export const SubmitButton = styled.button`
  height: 66px;
  border-radius: 15px;
  background: linear-gradient(135deg, #2d1155 0%, #4a1e75 100%);
  color: white;
  font-size: 18px;
  font-weight: 700;
  padding: 0 32px;
  border: none;
  cursor: pointer;
  margin-top: 30px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 8px 20px rgba(45, 17, 85, 0.3);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: left 0.6s ease;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 25px rgba(45, 17, 85, 0.4);

    &::before {
      left: 100%;
    }
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 6px 15px rgba(45, 17, 85, 0.3);
  }
`;

export const ErrorText = styled.div`
  color: #e74c3c;
  font-size: 13px;
  font-weight: 500;
  margin-bottom: 15px;
  margin-left: 170px;
  padding: 8px 12px;
  background: rgba(231, 76, 60, 0.1);
  border-radius: 8px;
  border-left: 3px solid #e74c3c;
`;

const MessageWrapper = styled.div`
  margin-bottom: 15px;
  margin-left: 170px;
  font-weight: 500;
  font-size: 13px;
`;

const ErrorMessage = styled.div`
  color: #e74c3c;
  padding: 8px 12px;
  background: rgba(231, 76, 60, 0.1);
  border-radius: 8px;
  border-left: 3px solid #e74c3c;
  margin-bottom: 8px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const SuccessMessage = styled.div`
  color: #27ae60;
  padding: 8px 12px;
  background: rgba(39, 174, 96, 0.1);
  border-radius: 8px;
  border-left: 3px solid #27ae60;
  margin-bottom: 8px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const SignUp: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    username: '',
    password: '',
    confirmPassword: '',
    company: '',
    position: '',
    department: '',
    team: '',
    job: '',
  });
  const [showModal, setShowModal] = useState(false);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [positions, setPositions] = useState<CompanyPosition[]>([]);
  const [isDuplicate, setIsDuplicate] = useState<boolean | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // 뒤로가기 함수
  const handleGoBack = () => {
    navigate('/sign_up');
  };

  // const [sysroles, setSysroles] = useState<Sysrole[]>([]);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.name) newErrors.name = '이름을 입력해주세요.';
    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      newErrors.email = '유효한 이메일 주소를 입력해주세요.';
    }

    if (!formData.phone.match(/^\d+$/)) {
      newErrors.phone = '전화번호는 숫자만 입력해주세요.';
    }

    if (!formData.username.match(/^[a-z0-9]{6,16}$/)) {
      newErrors.username = '아이디는 영문 소문자와 숫자 조합 6~16자입니다.';
    }

    if (
      !formData.password.match(
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+{};:,<.>]).{8,16}$/
      )
    ) {
      newErrors.password =
        '비밀번호는 영문, 숫자, 특수문자를 포함한 8~16자여야 합니다.';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = '비밀번호가 일치하지 않습니다.';
    }

    if (!formData.company) newErrors.company = '회사를 선택해주세요.';

    if (!formData.position) newErrors.position = '직급을 선택해주세요.';

    return newErrors;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name === 'company') {
      const selectedCompany = companies.find((c) => c.company_id === value);
      if (selectedCompany) {
        setPositions(selectedCompany.company_positions || []);
      } else {
        setPositions([]);
      }

      // 회사 변경 시 직급 초기화
      setFormData((prev) => ({
        ...prev,
        company: value,
        position: '', // 직급 초기화
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/users/signup`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            login_id: formData.username,
            password: formData.password,
            phone: formData.phone,
            company: formData.company,
            department: formData.department,
            team: formData.team,
            position: formData.position,
            job: formData.job,
            sysrole: '4864c9d2-7f9c-4862-9139-4e8b0ed117f4', // 일반 사원 데이터
            login_type: 'general',
          }),
        }
      );

      if (!response.ok) {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const errorData = await response.json();
          throw new Error(errorData.message || '회원가입 실패');
        } else {
          throw new Error(
            response.statusText || '회원가입 실패: 서버 응답 오류'
          );
        }
      }

      setShowModal(true); // 회원가입 성공 시 모달 열기
    } catch (error: any) {
      console.error('error:', error);
      alert(`오류 발생: ${error.message}`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
    }
  };

  useEffect(() => {
    const loadCompanies = async () => {
      try {
        const result = await fetchSignupInfos();
        setCompanies(result.companies);
      } catch (err) {
        // 에러 처리
        console.error('회사 목록 로딩 실패:', err);
      }
    };

    loadCompanies();
  }, []);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      const usernameRegex = /^[a-z0-9]{6,16}$/;

      // 아이디 길이 + 유효성 조건 통과 시에만 중복 확인 요청
      if (
        formData.username.length > 2 &&
        usernameRegex.test(formData.username)
      ) {
        checkDuplicate(formData.username).then((result) =>
          setIsDuplicate(result)
        );
      } else {
        setIsDuplicate(null); // 유효하지 않으면 중복 결과 초기화
      }
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [formData.username]);

  return (
    <>
              <SignUpWrapper>
          <FormContainer>
            <BackButton onClick={handleGoBack} title="회원가입 방식 선택으로 돌아가기">
              ←
            </BackButton>
            
            <Title>회원가입</Title>
          <Form onSubmit={handleSubmit} onKeyDown={handleKeyDown}>
            <InputGroup>
              <Label>
                이름 <StyledAsterisk>*</StyledAsterisk>
              </Label>
              <Input
                name="name"
                type="text"
                placeholder="이름을 입력하세요"
                required
                onChange={handleChange}
              />
            </InputGroup>
            {errors.name && <ErrorText>{errors.name}</ErrorText>}
            <InputGroup>
              <Label>
                이메일주소 <StyledAsterisk>*</StyledAsterisk>
              </Label>
              <Input
                name="email"
                type="email"
                placeholder="이메일을 입력하세요"
                required
                onChange={handleChange}
              />
            </InputGroup>
            {errors.email && <ErrorText>{errors.email}</ErrorText>}
            <InputGroup>
              <Label>
                핸드폰번호 <StyledAsterisk>*</StyledAsterisk>
              </Label>
              <Input
                name="phone"
                type="tel"
                placeholder="- 없이 숫자만 입력"
                required
                onChange={handleChange}
              />
            </InputGroup>
            {errors.phone && <ErrorText>{errors.phone}</ErrorText>}
            <InputGroup>
              <Label>
                아이디 <StyledAsterisk>*</StyledAsterisk>
              </Label>
              <Input
                name="username"
                type="text"
                placeholder="영문소문자/숫자, 6~16자"
                required
                onChange={handleChange}
              />
            </InputGroup>
            {(isDuplicate !== null || errors.username) && (
              <MessageWrapper>
                {isDuplicate === true && (
                  <ErrorMessage>이미 사용 중인 아이디입니다</ErrorMessage>
                )}
                {isDuplicate === false && (
                  <SuccessMessage>사용 가능한 아이디입니다</SuccessMessage>
                )}
                {errors.username && (
                  <ErrorMessage>{errors.username}</ErrorMessage>
                )}
              </MessageWrapper>
            )}
            <InputGroup>
              <Label>
                비밀번호 <StyledAsterisk>*</StyledAsterisk>
              </Label>
              <Input
                name="password"
                type="password"
                placeholder="영문+숫자+특수문자 조합, 8~16자"
                required
                onChange={handleChange}
              />
            </InputGroup>
            {errors.password && <ErrorText>{errors.password}</ErrorText>}
            <InputGroup>
              <Label>
                비밀번호 확인 <StyledAsterisk>*</StyledAsterisk>
              </Label>
              <Input
                name="confirmPassword"
                type="password"
                placeholder="비밀번호를 다시 입력하세요"
                required
                onChange={handleChange}
              />
            </InputGroup>
            {errors.confirmPassword && (
              <ErrorText>{errors.confirmPassword}</ErrorText>
            )}
            <InputGroup>
              <Label>
                소속 회사명 <StyledAsterisk>*</StyledAsterisk>
              </Label>
              <Select
                name="company"
                required
                onChange={handleChange}
                value={formData.company}
              >
                <option value="">회사 선택</option>
                {companies.map((company) => (
                  <option key={company.company_id} value={company.company_id}>
                    {company.company_name}
                  </option>
                ))}
              </Select>
            </InputGroup>
            {errors.company && <ErrorText>{errors.company}</ErrorText>}
            <InputGroup>
              <Label>
                소속 직급명 <StyledAsterisk>*</StyledAsterisk>
              </Label>
              <Select
                name="position"
                required
                onChange={handleChange}
                value={formData.position}
              >
                <option value="">직급 선택</option>
                {positions.map((pos) => (
                  <option key={pos.position_id} value={pos.position_id}>
                    {pos.position_name}
                  </option>
                ))}
              </Select>
            </InputGroup>
            <InputGroup>
              <Label>직업군</Label>
              <Input name="job" type="text" onChange={handleChange} />
            </InputGroup>
            <InputGroup>
              <Label>소속 부서명</Label>
              <Input name="department" type="text" onChange={handleChange} />
            </InputGroup>
            <InputGroup>
              <Label>소속 팀명</Label>
              <Input name="team" type="text" onChange={handleChange} />
            </InputGroup>
            <SubmitButton type="submit">가입 완료</SubmitButton>
          </Form>
        </FormContainer>
      </SignUpWrapper>
      {showModal && (
        <SignUpSuccessModal
          visible={showModal}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
};

export default SignUp;
