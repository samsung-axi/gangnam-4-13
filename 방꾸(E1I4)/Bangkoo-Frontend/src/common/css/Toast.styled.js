import styled from "styled-components";

// 토스트 팝업
export const ToastContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  background-color: ${({ theme }) => theme.colors.dark};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  justify-content: space-between;
  
  & > div {
    display: flex;
    align-items: center;
    & p {
      margin-left: ${({ theme }) => theme.spacing.xs};
    }
  }
  
  & > button > svg {
    & path {
      stroke: ${({ theme }) => theme.colors.white};
    }
  }
`;