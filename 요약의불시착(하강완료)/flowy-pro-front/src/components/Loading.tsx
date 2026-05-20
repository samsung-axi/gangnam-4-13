import React from "react";
import styled, { keyframes } from "styled-components";

const Wrapper = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const rotate = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

const Spinner = styled.div`
  width: 50px;
  height: 50px;
  border: 6px solid #ccc;
  border-top-color: #351745;
  border-radius: 50%;
  animation: ${rotate} 1s linear infinite;
  margin-bottom: 1rem;
`;

const Text = styled.p`
  font-size: 1.2rem;
  color: #333;
`;

const Loading: React.FC = () => {
  return (
    <Wrapper>
      <Spinner />
      <Text>로딩 중...</Text>
    </Wrapper>
  );
};

export default Loading;
