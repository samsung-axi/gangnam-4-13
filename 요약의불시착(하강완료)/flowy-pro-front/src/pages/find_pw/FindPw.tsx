// PasswordReset.tsx

import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  fetchChangePassword,
  sendPwEmailCode,
  verifyCodeWithUserLoginIdAndPw,
} from '../../api/fetchFindId';
import AlertModal from './popup/AlertModal';
import LoadingModal from './popup/LoadingModal';

const Wrapper = styled.div`
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
    background: radial-gradient(
        circle at 20% 50%,
        rgba(45, 17, 85, 0.1) 0%,
        transparent 50%
      ),
      radial-gradient(
        circle at 80% 20%,
        rgba(45, 17, 85, 0.1) 0%,
        transparent 50%
      ),
      radial-gradient(
        circle at 40% 80%,
        rgba(45, 17, 85, 0.1) 0%,
        transparent 50%
      );
    pointer-events: none;
  }
`;

export const Container = styled.div`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  padding: 50px 40px;
  border-radius: 30px;
  width: 100%;
  max-width: 500px;
  box-shadow: 0 20px 40px rgba(45, 17, 85, 0.1),
    0 10px 20px rgba(45, 17, 85, 0.05);
  border: 1px solid rgba(45, 17, 85, 0.1);
  position: relative;
  z-index: 1;

  @media (max-width: 480px) {
    margin: 20px;
    padding: 40px 30px;
  }
`;

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
  font-size: 32px;
  font-weight: 700;
  color: #2d1155;
  margin-bottom: 40px;
  text-align: center;
  text-shadow: 0 2px 4px rgba(45, 17, 85, 0.1);
`;

export const Step = styled.div`
  margin-bottom: 32px;
`;

const StepIndicator = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 30px;
  gap: 15px;
`;

const StepDot = styled.div<{ active?: boolean; completed?: boolean }>`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: ${({ active, completed }) =>
    completed ? '#27ae60' : active ? '#2d1155' : 'rgba(45, 17, 85, 0.3)'};
  transition: all 0.3s ease;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: white;
    opacity: ${({ completed }) => (completed ? 1 : 0)};
    transition: opacity 0.3s ease;
  }
`;

const StepLine = styled.div<{ completed?: boolean }>`
  width: 30px;
  height: 2px;
  background: ${({ completed }) =>
    completed ? '#27ae60' : 'rgba(45, 17, 85, 0.3)'};
  transition: background 0.3s ease;
`;

const InputGroup = styled.div`
  margin-bottom: 20px;
  text-align: left;
`;

export const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #2d1155;
  font-size: 16px;
`;

export const Input = styled.input`
  width: 100%;
  padding: 16px 20px;
  border: 2px solid rgba(45, 17, 85, 0.1);
  border-radius: 12px;
  font-size: 16px;
  background: rgba(255, 255, 255, 0.8);
  color: #2d1155;
  font-weight: 500;
  box-sizing: border-box;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #2d1155;
    box-shadow: 0 0 0 3px rgba(45, 17, 85, 0.1);
    background: rgba(255, 255, 255, 1);
  }

  &:hover {
    border-color: rgba(45, 17, 85, 0.3);
  }

  &::placeholder {
    color: rgba(45, 17, 85, 0.5);
    font-weight: 400;
  }
`;

export const Button = styled.button<{
  color?: string;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
}>`
  width: 100%;
  height: 56px;
  border-radius: 12px;
  background: ${({ variant, disabled, color }) =>
    disabled
      ? 'rgba(45, 17, 85, 0.3)'
      : variant === 'secondary'
      ? 'rgba(45, 17, 85, 0.1)'
      : color === '#2196f3'
      ? 'linear-gradient(135deg, #2196f3 0%, #1976d2 100%)'
      : 'linear-gradient(135deg, #2d1155 0%, #4a1e75 100%)'};
  color: ${({ variant, disabled }) =>
    disabled
      ? 'rgba(255, 255, 255, 0.7)'
      : variant === 'secondary'
      ? '#2d1155'
      : 'white'};
  border: ${({ variant }) =>
    variant === 'secondary' ? '2px solid rgba(45, 17, 85, 0.2)' : 'none'};
  font-size: 16px;
  font-weight: 700;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  margin: 12px 0;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: ${({ disabled, variant }) =>
    disabled || variant === 'secondary'
      ? 'none'
      : '0 8px 20px rgba(45, 17, 85, 0.3)'};
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.2),
      transparent
    );
    transition: left 0.6s ease;
  }

  &:hover:enabled {
    transform: translateY(-2px);
    box-shadow: ${({ variant, color }) =>
      variant === 'secondary'
        ? '0 8px 20px rgba(45, 17, 85, 0.2)'
        : color === '#2196f3'
        ? '0 12px 25px rgba(33, 150, 243, 0.4)'
        : '0 12px 25px rgba(45, 17, 85, 0.4)'};
    background: ${({ variant }) =>
      variant === 'secondary' ? 'rgba(45, 17, 85, 0.15)' : undefined};

    &::before {
      left: 100%;
    }
  }

  &:active:enabled {
    transform: translateY(0);
  }
`;

export const ErrorText = styled.div`
  color: #e74c3c;
  font-size: 13px;
  font-weight: 500;
  margin-top: 8px;
  padding: 8px 12px;
  background: rgba(231, 76, 60, 0.1);
  border-radius: 8px;
  border-left: 3px solid #e74c3c;
  animation: slideIn 0.3s ease;

  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const StepTitle = styled.h3`
  color: #2d1155;
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 20px;
  text-align: center;
`;

const InfoText = styled.p`
  color: rgba(45, 17, 85, 0.7);
  font-size: 14px;
  text-align: center;
  margin-bottom: 25px;
  line-height: 1.5;
`;

const FindPw: React.FC = () => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [userLoginId, setUserLoginId] = useState('');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [checkPassword, setCheckPassword] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [searchParams] = useSearchParams();
  const [isSending, setIsSending] = useState(false);
  const navigate = useNavigate();

  // 모달 상태
  const [alertModal, setAlertModal] = useState({
    isOpen: false,
    type: 'info' as 'success' | 'error' | 'warning' | 'info',
    title: '',
    message: '',
  });

  const showAlert = (
    type: 'success' | 'error' | 'warning' | 'info',
    title: string,
    message: string
  ) => {
    setAlertModal({
      isOpen: true,
      type,
      title,
      message,
    });
  };

  const closeAlert = () => {
    setAlertModal((prev) => ({ ...prev, isOpen: false }));
  };

  // 뒤로가기 함수
  const handleGoBack = () => {
    navigate('/login');
  };

  useEffect(() => {
    const userIdFromUrl = searchParams.get('userId');
    const emailFromUrl = searchParams.get('email');

    if (userIdFromUrl && emailFromUrl) {
      setUserLoginId(userIdFromUrl);
      setEmail(emailFromUrl);
      setStep(2);
    }
  }, [searchParams]);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (
      !newPassword.match(
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+{};:,<.>]).{8,16}$/
      )
    ) {
      newErrors.newPassword =
        '비밀번호는 영문, 숫자, 특수문자를 포함한 8~16자여야 합니다.';
    }

    if (newPassword !== checkPassword) {
      newErrors.checkPassword = '비밀번호가 일치하지 않습니다.';
    }
    return newErrors;
  };

  const handleFindPw = async () => {
    if (!email.includes('@')) {
      showAlert('error', '이메일 오류', '올바른 이메일 형식을 입력해주세요.');
      return;
    }

    setIsSending(true);

    try {
      await sendPwEmailCode(email, userLoginId);
      showAlert(
        'success',
        '인증 코드 발송 완료',
        '이메일로 인증 코드가 발송되었습니다.\n이메일을 확인해주세요.'
      );
      navigate(
        `?userId=${encodeURIComponent(userLoginId)}&email=${encodeURIComponent(
          email
        )}`
      );
    } catch (error: any) {
      const errorDetail =
        error?.response?.data?.detail ||
        error?.message ||
        '알 수 없는 오류가 발생했습니다.';

      showAlert('error', '오류 발생', errorDetail);
    } finally {
      setIsSending(false);
    }
  };

  const handleVerifyCode = async () => {
    if (code.length < 4) {
      showAlert(
        'warning',
        '인증 코드 확인',
        '올바른 인증 코드를 입력해주세요.'
      );
      return;
    }

    try {
      const result = await verifyCodeWithUserLoginIdAndPw({
        user_login_id: userLoginId,
        email,
        input_code: code,
      });

      if (result.verified) {
        showAlert(
          'success',
          '인증 성공',
          '이메일 인증이 완료되었습니다.\n새 비밀번호를 설정해주세요.'
        );
        setStep(3);
      } else {
        showAlert(
          'error',
          '인증 실패',
          '인증 코드가 올바르지 않습니다.\n다시 확인해주세요.'
        );
      }
    } catch (error: any) {
      showAlert(
        'error',
        '인증 오류',
        error.message || '인증 중 오류가 발생했습니다.\n다시 시도해주세요.'
      );
    }
  };

  const handleChangePassword = async () => {
    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const res = await fetchChangePassword({
        new_password: newPassword,
      });

      setErrors({});
      showAlert(
        'success',
        '비밀번호 변경 완료',
        `${res.message}\n로그인 페이지로 이동합니다.`
      );

      // 모달이 닫힌 후 페이지 이동
      setTimeout(() => {
        window.location.replace('/login');
      }, 2000);
    } catch (error: any) {
      showAlert(
        'error',
        '변경 실패',
        error.message || '비밀번호 변경 중 오류가 발생했습니다.'
      );
    }
  };

  // 첫 번째 단계에서 엔터 키 처리 (아이디 또는 이메일 입력 후)
  const handleStep1KeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !isSending && userLoginId.trim() && email.trim()) {
      e.preventDefault();
      handleFindPw();
    }
  };

  // 두 번째 단계에서 엔터 키 처리 (인증 코드 입력 후)
  const handleCodeKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && code.trim()) {
      e.preventDefault();
      handleVerifyCode();
    }
  };

  // 세 번째 단계에서 엔터 키 처리 (비밀번호 확인 입력 후)
  const handlePasswordKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && newPassword.trim() && checkPassword.trim()) {
      e.preventDefault();
      handleChangePassword();
    }
  };

  return (
    <Wrapper>
      <Container>
        <BackButton onClick={handleGoBack} title="로그인 페이지로 돌아가기">
          ←
        </BackButton>

        <Title>비밀번호 찾기</Title>

        <StepIndicator>
          <StepDot active={step === 1} completed={step > 1} />
          <StepLine completed={step > 1} />
          <StepDot active={step === 2} completed={step > 2} />
          <StepLine completed={step > 2} />
          <StepDot active={step === 3} completed={false} />
        </StepIndicator>

        {step === 1 && (
          <Step>
            <StepTitle>계정 정보 입력</StepTitle>
            <InfoText>아이디와 이메일을 입력하여 계정을 확인합니다.</InfoText>

            <InputGroup>
              <Label>아이디</Label>
              <Input
                type="text"
                placeholder="아이디를 입력하세요"
                value={userLoginId}
                onChange={(e) => setUserLoginId(e.target.value)}
                onKeyDown={handleStep1KeyDown}
              />
            </InputGroup>

            <InputGroup>
              <Label>이메일</Label>
              <Input
                type="email"
                placeholder="이메일을 입력하세요"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={handleStep1KeyDown}
              />
            </InputGroup>

            <Button
              onClick={handleFindPw}
              disabled={isSending || !userLoginId || !email}
            >
              {isSending ? '발송중...' : '인증 코드 발송'}
            </Button>
          </Step>
        )}

        {step === 2 && (
          <Step>
            <StepTitle>이메일 인증</StepTitle>
            <InfoText>{email}로 발송된 인증 코드를 입력해주세요.</InfoText>

            <InputGroup>
              <Label>인증 코드</Label>
              <Input
                type="text"
                placeholder="인증 코드를 입력하세요"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                onKeyDown={handleCodeKeyDown}
                maxLength={6}
              />
            </InputGroup>

            <Button onClick={handleVerifyCode} disabled={!code}>
              인증 확인
            </Button>

            <Button variant="secondary" onClick={() => setStep(1)}>
              이전 단계
            </Button>
          </Step>
        )}

        {step === 3 && (
          <Step>
            <StepTitle>새 비밀번호 설정</StepTitle>
            <InfoText>새로운 비밀번호를 입력해주세요.</InfoText>

            <InputGroup>
              <Label>새 비밀번호</Label>
              <Input
                type="password"
                placeholder="영문, 숫자, 특수문자 포함 8~16자"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              {errors.newPassword && (
                <ErrorText>{errors.newPassword}</ErrorText>
              )}
            </InputGroup>

            <InputGroup>
              <Label>비밀번호 확인</Label>
              <Input
                type="password"
                placeholder="비밀번호를 다시 입력하세요"
                value={checkPassword}
                onChange={(e) => setCheckPassword(e.target.value)}
                onKeyDown={handlePasswordKeyDown}
              />
              {errors.checkPassword && (
                <ErrorText>{errors.checkPassword}</ErrorText>
              )}
            </InputGroup>

            <Button
              onClick={handleChangePassword}
              disabled={!newPassword || !checkPassword}
            >
              비밀번호 변경
            </Button>

            <Button variant="secondary" onClick={() => setStep(2)}>
              이전 단계
            </Button>
          </Step>
        )}
      </Container>

      {/* 모달들 */}
      <AlertModal
        isOpen={alertModal.isOpen}
        onClose={closeAlert}
        type={alertModal.type}
        title={alertModal.title}
        message={alertModal.message}
      />

      <LoadingModal
        isOpen={isSending}
        message="인증 코드를 발송하고 있습니다..."
      />
    </Wrapper>
  );
};

export default FindPw;
