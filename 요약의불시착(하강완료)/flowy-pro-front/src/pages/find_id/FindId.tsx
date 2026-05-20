import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { fetchFindId, sendEmailCode, verifyCode } from '../../api/fetchFindId';
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

const Container = styled.div`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  padding: 50px 40px;
  border-radius: 30px;
  width: 100%;
  max-width: 500px;
  box-shadow: 0 20px 40px rgba(45, 17, 85, 0.1),
    0 10px 20px rgba(45, 17, 85, 0.05);
  border: 1px solid rgba(45, 17, 85, 0.1);
  text-align: center;
  position: relative;
  z-index: 1;
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

const Title = styled.h2`
  font-size: 32px;
  font-weight: 700;
  color: #2d1155;
  margin-bottom: 40px;
  text-shadow: 0 2px 4px rgba(45, 17, 85, 0.1);
`;

const InputGroup = styled.div`
  margin-bottom: 20px;
  text-align: left;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #2d1155;
  font-size: 16px;
`;

const Input = styled.input`
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

  &:disabled {
    background: rgba(45, 17, 85, 0.05);
    cursor: not-allowed;
  }
`;

const Button = styled.button<{
  disabled?: boolean;
  variant?: 'primary' | 'secondary';
}>`
  width: 100%;
  height: 56px;
  border-radius: 12px;
  background: ${({ variant, disabled }) =>
    disabled
      ? 'rgba(45, 17, 85, 0.3)'
      : variant === 'secondary'
      ? 'rgba(45, 17, 85, 0.1)'
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

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: ${({ variant }) =>
      variant === 'secondary'
        ? '0 8px 20px rgba(45, 17, 85, 0.2)'
        : '0 12px 25px rgba(45, 17, 85, 0.4)'};
    background: ${({ variant }) =>
      variant === 'secondary' ? 'rgba(45, 17, 85, 0.15)' : undefined};

    &::before {
      left: 100%;
    }
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }
`;

const ResultBox = styled.div<{ success?: boolean }>`
  margin-top: 30px;
  padding: 20px;
  border-radius: 15px;
  background: ${({ success }) =>
    success ? 'rgba(39, 174, 96, 0.1)' : 'rgba(231, 76, 60, 0.1)'};
  border: 2px solid
    ${({ success }) =>
      success ? 'rgba(39, 174, 96, 0.3)' : 'rgba(231, 76, 60, 0.3)'};
  color: ${({ success }) => (success ? '#27ae60' : '#e74c3c')};
  font-weight: 600;
  font-size: 18px;
  text-align: center;
  animation: slideIn 0.4s cubic-bezier(0.4, 0, 0.2, 1);

  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const StepIndicator = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 30px;
  gap: 15px;
`;

const Step = styled.div<{ active?: boolean; completed?: boolean }>`
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

const FindId: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  // const [showCodeInput, setShowCodeInput] = useState(false);
  const [code, setCode] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [foundId, setFoundId] = useState('');
  const [notFoundMsg, setNotFoundMsg] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [currentStep, setCurrentStep] = useState(1); // 1: 이메일, 2: 인증, 3: 결과

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

  const handleEmailVerify = async () => {
    if (!email.includes('@')) {
      showAlert('error', '이메일 오류', '올바른 이메일 형식을 입력해주세요.');
      return;
    }

    setIsSending(true);
    try {
      await sendEmailCode(email);
      showAlert(
        'success',
        '인증 코드 발송 완료',
        '이메일로 인증 코드가 발송되었습니다.\n이메일을 확인해주세요.'
      );
      // setShowCodeInput(true);
      setCurrentStep(2);
    } catch (error: any) {
      showAlert(
        'error',
        '전송 실패',
        error.message || '이메일 전송에 실패했습니다.\n다시 시도해주세요.'
      );
    } finally {
      setIsSending(false);
    }
  };

  const handleCodeConfirm = async () => {
    if (code.length < 4) {
      showAlert(
        'warning',
        '인증 코드 확인',
        '올바른 인증 코드를 입력해주세요.'
      );
      return;
    }
    try {
      const result = await verifyCode(code);
      if (result.verified) {
        setIsVerified(true);
        setCurrentStep(3);
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

  const handleFindId = async () => {
    try {
      const result = await fetchFindId(email);
      if (result.user_login_id) {
        setFoundId(result.user_login_id);
        setNotFoundMsg('');
      } else {
        setFoundId('');
        setNotFoundMsg('등록된 아이디가 없습니다.');
      }
    } catch (err: any) {
      showAlert(
        'error',
        '조회 실패',
        err.message || '아이디 조회 중 오류가 발생했습니다.'
      );
    }
  };

  // 이메일 입력 필드에서 엔터 키 처리
  const handleEmailKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !isSending && email.trim()) {
      e.preventDefault();
      handleEmailVerify();
    }
  };

  // 인증 코드 입력 필드에서 엔터 키 처리
  const handleCodeKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && code.trim()) {
      e.preventDefault();
      handleCodeConfirm();
    }
  };

  useEffect(() => {
    if (isVerified) {
      handleFindId();
    }
  }, [isVerified]);

  // 뒤로가기 함수
  const handleGoBack = () => {
    navigate('/login');
  };

  return (
    <Wrapper>
      <Container>
        <BackButton onClick={handleGoBack} title="로그인 페이지로 돌아가기">
          ←
        </BackButton>

        <Title>아이디 찾기</Title>

        <StepIndicator>
          <Step active={currentStep === 1} completed={currentStep > 1} />
          <StepLine completed={currentStep > 1} />
          <Step active={currentStep === 2} completed={currentStep > 2} />
          <StepLine completed={currentStep > 2} />
          <Step active={currentStep === 3} completed={false} />
        </StepIndicator>

        {currentStep === 1 && (
          <>
            <InputGroup>
              <Label>이메일 주소</Label>
              <Input
                type="email"
                placeholder="이메일을 입력하세요"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={handleEmailKeyDown}
                disabled={isSending}
              />
            </InputGroup>
            <Button onClick={handleEmailVerify} disabled={isSending || !email}>
              {isSending ? '발송중...' : '인증 코드 발송'}
            </Button>
          </>
        )}

        {currentStep === 2 && (
          <>
            <InputGroup>
              <Label>인증 코드</Label>
              <Input
                type="text"
                placeholder="이메일로 받은 인증 코드를 입력하세요"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                onKeyDown={handleCodeKeyDown}
                maxLength={6}
              />
            </InputGroup>
            <Button onClick={handleCodeConfirm} disabled={!code}>
              인증 확인
            </Button>
            <Button
              variant="secondary"
              onClick={() => {
                setCurrentStep(1);
                // setShowCodeInput(false);
                setCode('');
              }}
            >
              이메일 다시 입력
            </Button>
          </>
        )}

        {currentStep === 3 && (
          <>
            {foundId && (
              <ResultBox success>
                찾은 아이디: <strong>{foundId}</strong>
              </ResultBox>
            )}

            {notFoundMsg && (
              <ResultBox success={false}>{notFoundMsg}</ResultBox>
            )}

            <Button
              variant="secondary"
              onClick={() => {
                setCurrentStep(1);
                // setShowCodeInput(false);
                setIsVerified(false);
                setCode('');
                setFoundId('');
                setNotFoundMsg('');
              }}
            >
              다시 찾기
            </Button>
          </>
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

export default FindId;
