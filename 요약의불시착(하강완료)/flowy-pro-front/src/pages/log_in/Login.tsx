import React, { useEffect, useState } from 'react';
import type { ChangeEvent } from 'react';
import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  ErrorMessage,
  GoogleLoginButton,
  InputField,
  InputGroup,
  InputLabel,
  LinkContainer,
  LoginButton,
  LoginContainer,
  LoginFormContainer,
} from './Login.styles';

// import Navbar from '../../components/Navbar';

interface FormData {
  username: string;
  password: string;
}

const Login: React.FC = () => {
  const { setUser } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const errorParam = searchParams.get('error');
  // const from = location.state?.from?.pathname || '/';

  const [formData, setFormData] = useState<FormData>({
    username: '',
    password: '',
  });
  // const errorMessage = location.state?.errorMessage || '';
  const [error, setError] = useState<string>('');
  const [isGoogleRedirect, setIsGoogleRedirect] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(''); // 기존 에러 초기화

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/users/login`,
        {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            login_id: formData.username,
            password: formData.password,
          }),
        }
      );

      if (!response.ok) {
        if (response.status === 401) {
          window.location.replace('/login?error=401');
        } else if (response.status === 403) {
          window.location.replace('/login?error=not_allowed');
        } else {
          window.location.replace('/login?error=500');
        }
        return;
      }

      const data = await response.json();

      // 로그인 성공 처리

      console.log('로그인 성공:', data);
      setUser(data.user);
      window.location.replace('/');
    } catch (error) {
      console.error('로그인 중 오류 발생:', error);
      window.location.replace('/login?error=501');
    }
  };

  const handleGoogleLogin = () => {
    setIsGoogleRedirect(true);
    window.location.href = `${
      import.meta.env.VITE_API_URL
    }/api/v1/users/auth/google/login`;
  };

  useEffect(() => {
    if (errorParam === 'not_allowed') {
      setError('승인되지 않은 아이디입니다.');
    } else if (errorParam === 'not_found') {
      setError('존재하지 않는 계정입니다.');
    } else if (errorParam === '401') {
      setError('아이디 또는 비밀번호 알맞지 않습니다.');
    } else if (errorParam === '500') {
      setError('서버 오류가 발생했습니다. 다시 시도해주세요.');
    } else if (errorParam === '501') {
      setError('네트워크 오류가 발생했습니다.');
    }
    const newUrl = location.pathname;
    navigate(newUrl, { replace: true });
  }, [errorParam]);

  return (
    <LoginContainer>
      <LoginFormContainer onSubmit={handleSubmit}>
        <InputGroup>
          <InputLabel htmlFor="username">아이디</InputLabel>
          <InputField
            type="text"
            name="username"
            placeholder="아이디"
            value={formData.username}
            onChange={handleChange}
          />
        </InputGroup>

        <InputGroup>
          <InputLabel htmlFor="password">비밀번호</InputLabel>
          <InputField
            type="password"
            name="password"
            placeholder="비밀번호"
            value={formData.password}
            onChange={handleChange}
          />
        </InputGroup>
        {!isGoogleRedirect && error && <ErrorMessage>{error}</ErrorMessage>}
        <LoginButton type="submit">로그인</LoginButton>

        <GoogleLoginButton type="button" onClick={() => handleGoogleLogin()}>
          <img src="https://www.google.com/favicon.ico" alt="Google icon" />
          구글 이메일로 로그인
        </GoogleLoginButton>

        <LinkContainer>
          <Link to="/find_id">아이디 찾기</Link>
          <span>|</span>
          <Link to="/find_pw">비밀번호 찾기</Link>
          <span>|</span>
          <Link to="/sign_up">회원가입</Link>
        </LinkContainer>
      </LoginFormContainer>
    </LoginContainer>
  );
};

export default Login;
