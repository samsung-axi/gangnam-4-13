// 📁 pages/myroom/dialog/css/ModalWrapper.styled.js
import styled from "styled-components";

export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.6); // 어두운 뒷배경
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const ModalContent = styled.div`
  background: white;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing.xxl};
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.3);
  max-width: 960px;
  width: 90%;
`;
