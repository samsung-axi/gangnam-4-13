import React from 'react';
import { Link } from 'react-router-dom';
import {
  CardSubtitle,
  CardTitle,
  GoogleIcon,
  IconWrapper,
  LogoImg,
  MobileIcon,
  OptionCard,
  SelectionOptions,
  SelectionTitle,
  SignUpContainer,
  SignUpWrapper,
} from './choose_method_styles';

const ChooseMethod: React.FC = () => {
  const handleGoogleLogin = () => {
    window.location.href = `${
      import.meta.env.VITE_API_URL
    }/api/v1/users/auth/google/login`;
  };

  return (
    <SignUpWrapper>
      <SignUpContainer>
        <LogoImg src="/images/flowyLogo.svg" alt="Flowy PRO Logo" />
        <SelectionTitle>회원가입 방식 선택</SelectionTitle>
        <SelectionOptions>
          <Link to="/sign_up/form" style={{ textDecoration: 'none' }}>
            <OptionCard $primary={true}>
              <IconWrapper>
                <MobileIcon src="/images/mobile-icon.svg" alt="Mobile Icon" />
              </IconWrapper>
              <CardTitle>휴대폰 번호로 회원가입</CardTitle>
              <CardSubtitle>빠르고 간편한 회원가입</CardSubtitle>
            </OptionCard>
          </Link>
          <div
            onClick={() => handleGoogleLogin()}
            style={{ textDecoration: 'none' }}
          >
            <OptionCard $primary={false} data-primary="false">
              <IconWrapper>
                <GoogleIcon
                  src="https://www.google.com/favicon.ico"
                  alt="Google Icon"
                />
              </IconWrapper>
              <CardTitle>구글 이메일로 회원가입</CardTitle>
              <CardSubtitle>구글 계정으로 간편 가입</CardSubtitle>
            </OptionCard>
          </div>
        </SelectionOptions>
      </SignUpContainer>
    </SignUpWrapper>
  );
};

export default ChooseMethod;
