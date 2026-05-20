import styled from "styled-components";

export const HeaderRoot = styled.div`
  position: fixed;
  top:0;
  width: 100%;
  height: ${({ theme }) => theme.headerHeight};
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid ${({ theme }) => theme.colors.grey};
  padding: 6px 34px;
  box-sizing: border-box;
  background-color: ${({ theme }) => theme.colors.white};
  z-index: 20;
  & > svg {
    cursor: pointer;
  }
`;

export const LoginBox = styled.div`
  display: flex;
  align-items: center;
  
  & p {
    margin-left: ${({ theme }) => theme.spacing.sm};;
  }
`;