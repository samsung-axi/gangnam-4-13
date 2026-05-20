import styled, { keyframes } from 'styled-components';

// 아래에서 위로 등장하는 애니메이션 정의
const slideUpAnimation = keyframes`
  0% {
    transform: translateY(50px);
    opacity: 0;
  }
  100% {
    transform: translateY(0);
    opacity: 1;
  }
`;

export const Hero = styled.section`
  cursor: default;
  width: 100vw;
  height: 100vh;
  min-width: 320px;
  min-height: 600px;
  background: radial-gradient(
      100% 100% at 50% 0%,
      #e3cfee 0%,
      #a480b8 29.81%,
      #654477 51.92%,
      #351745 75.48%,
      #170222 93.75%
    ),
    #2e0446;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
`;

export const Content = styled.div`
  position: relative;
  text-align: center;
  color: white;
  z-index: 10;
`;

export const CenteredText = styled.h1`
  color: #fff;
  text-align: center;
  font-family: 'Rethink Sans';
  font-size: 100px;
  font-style: normal;
  font-weight: 700;
  line-height: 120px;
  letter-spacing: -2px;
  margin-top: 120px;
  animation: ${slideUpAnimation} 1.2s ease-out;
`;
