// src/components/SignUpSuccessModal.tsx
import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

interface Props {
  visible: boolean;
  onClose: () => void;
}

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(45, 17, 85, 0.6);
  backdrop-filter: blur(8px);
  display: flex;
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

const ModalBox = styled.div`
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(10px);
  border: 2px solid rgba(45, 17, 85, 0.2);
  border-radius: 25px;
  padding: 40px 30px;
  width: 90%;
  max-width: 450px;
  text-align: center;
  box-shadow: 
    0 25px 50px rgba(45, 17, 85, 0.3),
    0 10px 20px rgba(45, 17, 85, 0.1);
  animation: slideUp 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;

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

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #2d1155, #4a1e75, #2d1155);
    border-radius: 25px 25px 0 0;
  }
`;

const SuccessIcon = styled.div`
  width: 80px;
  height: 80px;
  margin: 0 auto 25px;
  background: linear-gradient(135deg, #27ae60, #2ecc71);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 40px;
  color: white;
  box-shadow: 0 8px 20px rgba(39, 174, 96, 0.3);
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
    content: '✓';
  }
`;

const Title = styled.h2`
  color: #2d1155;
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 20px;
  text-shadow: 0 2px 4px rgba(45, 17, 85, 0.1);
`;

const Text = styled.p`
  color: rgba(45, 17, 85, 0.8);
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 8px;
  line-height: 1.5;
`;

const Button = styled.button`
  margin-top: 30px;
  background: linear-gradient(135deg, #2d1155 0%, #4a1e75 100%);
  color: white;
  font-weight: 700;
  font-size: 16px;
  padding: 16px 32px;
  border: none;
  border-radius: 15px;
  cursor: pointer;
  box-shadow: 0 8px 20px rgba(45, 17, 85, 0.3);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
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

const SignUpSuccessModal: React.FC<Props> = ({ visible, onClose }) => {
  const navigate = useNavigate();

  if (!visible) return null;

  return (
    <Overlay>
      <ModalBox>
        <SuccessIcon />
        <Title>회원가입이 완료되었습니다.</Title>
        <Text>관리자의 승인 후 서비스를 이용하실 수 있습니다.</Text>
        <Text>승인 결과는 등록하신 이메일로 안내드립니다.</Text>
        <Button
          onClick={() => {
            onClose(); // optional close
            navigate("/");
          }}
        >
          메인으로 돌아가기
        </Button>
      </ModalBox>
    </Overlay>
  );
};

export default SignUpSuccessModal;
