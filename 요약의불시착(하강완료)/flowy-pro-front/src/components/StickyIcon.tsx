// components/StickyIcon.tsx
import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

// 스타일 정의
const IconWrapper = styled.div`
  position: fixed;
  bottom: 32px;
  left: 32px;
  z-index: 9999;
  background-color: white;
  border-radius: 50%;
  padding: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  transition: transform 0.2s ease;

  &:hover {
    transform: scale(1.08);
    background-color: #f0f0f0;
  }
`;

const RobotImage = styled.img`
  width: 40px;
  height: 40px;
`;

const StickyIcon: React.FC = () => {
  const navigate = useNavigate();

  return (
    <IconWrapper onClick={() => navigate("/chatbot/stream")}>
      <RobotImage src="/images/chatbot.png" alt="챗봇 아이콘" />
    </IconWrapper>
  );
};

export default StickyIcon;
