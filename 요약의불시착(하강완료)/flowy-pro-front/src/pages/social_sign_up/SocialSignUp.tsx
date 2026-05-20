import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SignUpSuccessModal from '../sign_up/SignUpSuccessModal';
import {
  fetchSignupInfos,
  type Company,
  type CompanyPosition,
} from '../../api/fetchSignupInfos';
import {
  BackButton,
  ErrorText,
  Form,
  FormContainer,
  Input,
  InputGroup,
  Label,
  Select,
  StyledAsterisk,
  SubmitButton,
  Title,
  Wrapper,
} from './SocialSignUp.styles';

const SocialSignUp: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    username: '',
    password: '',
    confirmPassword: '',
    company: '',
    department: '',
    position: '',
    team: '',
    job: '',
  });
  const [showModal, setShowModal] = useState(false);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [positions, setPositions] = useState<CompanyPosition[]>([]);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

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
        `${import.meta.env.VITE_API_URL}/api/v1/users/social_signup`,
        // `/api/v1/users/social_signup`,
        {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            // name: formData.name,
            // email: formData.email,
            login_id: formData.username,
            password: formData.password,
            phone: formData.phone,
            company: formData.company,
            department: formData.department,
            team: formData.team,
            position: formData.position,
            job: formData.job,
            sysrole: '4864c9d2-7f9c-4862-9139-4e8b0ed117f4', // 일반 사원 데이터
            login_type: 'google',
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

  const handleGoBack = () => {
    navigate('/sign_up');
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

  return (
    <>
      <Wrapper>
        <FormContainer>
          <BackButton onClick={handleGoBack} title="회원가입 방식 선택으로 돌아가기">
            ←
          </BackButton>
          
          <Title>소셜 회원가입</Title>
          <Form onSubmit={handleSubmit} onKeyDown={handleKeyDown}>
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
            {errors.username && <ErrorText>{errors.username}</ErrorText>}
            <InputGroup>
              <Label>
                비밀번호 <StyledAsterisk>*</StyledAsterisk>
              </Label>
              <Input
                name="password"
                type="password"
                placeholder="영문소문자/숫자, 6~16자"
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
                소속 직급명<StyledAsterisk>*</StyledAsterisk>
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
      </Wrapper>
      {showModal && (
        <SignUpSuccessModal
          visible={showModal}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
};

export default SocialSignUp;
