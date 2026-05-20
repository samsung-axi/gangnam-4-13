// NotFoundAccount.tsx
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

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
    background: 
      radial-gradient(circle at 20% 50%, rgba(45, 17, 85, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, rgba(45, 17, 85, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 40% 80%, rgba(45, 17, 85, 0.1) 0%, transparent 50%);
    pointer-events: none;
  }
`;

const Container = styled.div`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  padding: 50px 40px;
  border-radius: 30px;
  width: 100%;
  max-width: 450px;
  box-shadow: 
    0 20px 40px rgba(45, 17, 85, 0.1),
    0 10px 20px rgba(45, 17, 85, 0.05);
  border: 1px solid rgba(45, 17, 85, 0.1);
  text-align: center;
  position: relative;
  z-index: 1;
`;

const ErrorIcon = styled.div`
  width: 80px;
  height: 80px;
  margin: 0 auto 25px;
  background: linear-gradient(135deg, #e74c3c, #c0392b);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 40px;
  color: white;
  box-shadow: 0 8px 20px rgba(231, 76, 60, 0.3);
  animation: bounceIn 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);

  @keyframes bounceIn {
    0% {
      transform: scale(0);
    }
    50% {
      transform: scale(1.1);
    }
    100% {
      transform: scale(1);
    }
  }

  &::after {
    content: '!';
    font-weight: 700;
  }
`;

const Title = styled.h2`
  color: #2d1155;
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 20px;
  text-shadow: 0 2px 4px rgba(45, 17, 85, 0.1);
`;

const Description = styled.p`
  color: rgba(45, 17, 85, 0.8);
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 30px;
  line-height: 1.6;
`;

const ButtonGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' }>`
  width: 100%;
  height: 56px;
  border-radius: 12px;
  background: ${({ variant }) => 
    variant === 'secondary'
      ? 'rgba(45, 17, 85, 0.1)'
      : 'linear-gradient(135deg, #2d1155 0%, #4a1e75 100%)'
  };
  color: ${({ variant }) => 
    variant === 'secondary' ? '#2d1155' : 'white'
  };
  border: ${({ variant }) => 
    variant === 'secondary' ? '2px solid rgba(45, 17, 85, 0.2)' : 'none'
  };
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: ${({ variant }) => 
    variant === 'secondary' ? 'none' : '0 8px 20px rgba(45, 17, 85, 0.3)'
  };
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
    box-shadow: ${({ variant }) => 
      variant === 'secondary' 
        ? '0 8px 20px rgba(45, 17, 85, 0.2)' 
        : '0 12px 25px rgba(45, 17, 85, 0.4)'
    };
    background: ${({ variant }) => 
      variant === 'secondary'
        ? 'rgba(45, 17, 85, 0.15)'
        : undefined
    };

    &::before {
      left: 100%;
    }
  }

  &:active {
    transform: translateY(0);
  }
`;

const NotFoundAccount = () => {
  const navigate = useNavigate();
  
  return (
    <Wrapper>
      <Container>
        <ErrorIcon />
        <Title>계정을 찾을 수 없습니다</Title>
        <Description>
          입력하신 아이디 또는 이메일 정보와 일치하는<br />
          계정이 존재하지 않습니다.<br />
          정보를 다시 확인해주세요.
        </Description>
        <ButtonGroup>
          <Button onClick={() => navigate('/find_pw')}>
            다시 시도하기
          </Button>
          <Button variant="secondary" onClick={() => navigate('/login')}>
            로그인으로 돌아가기
          </Button>
          <Button variant="secondary" onClick={() => navigate('/sign_up/choose')}>
            회원가입하기
          </Button>
        </ButtonGroup>
      </Container>
    </Wrapper>
  );
};

export default NotFoundAccount;
