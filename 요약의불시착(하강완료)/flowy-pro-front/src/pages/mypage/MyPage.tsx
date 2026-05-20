import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { postLogin } from '../../api/fetchMypage';
import {
  Button,
  ErrorText,
  FormArea,
  FormContainer,
  Input,
  InputGroup,
  Label,
  MyPageWrapper,
} from './MyPage.styles';

const MyPage: React.FC = () => {
  const { user } = useAuth();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [searchParams] = useSearchParams();
  const errorParam = searchParams.get('error');
  const navigate = useNavigate();

  const handleLogin = async () => {
    const result = await postLogin({
      login_id: user?.login_id || '',
      password,
    });

    if (result) {
      console.log('로그인 성공:', result);
      setError('');
      window.location.replace('/mypage/alterInfo');
      // navigate('/mypage/alterInfo');
    } else {
      window.location.replace('/mypage?error=402');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  useEffect(() => {
    if (errorParam === '402') {
      setError('비밀번호가 일치하지 않습니다.');
    }
    const newUrl = location.pathname;
    navigate(newUrl, { replace: true });
  }, [errorParam]);

  return (
    <MyPageWrapper>
      <FormArea>
        <FormContainer>
          <InputGroup>
            <Label htmlFor="id">아이디</Label>
            <Input type="text" id="id" value={user?.login_id} readOnly />
          </InputGroup>
          <InputGroup>
            <Label htmlFor="password">비밀번호</Label>
            <Input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="비밀번호를 입력하세요"
            />
          </InputGroup>
          {error && <ErrorText>{error}</ErrorText>}
          <Button onClick={() => handleLogin()}>내 정보 확인하기</Button>
        </FormContainer>
      </FormArea>
    </MyPageWrapper>
  );
};

export default MyPage;
