import styled from "styled-components";

export const DrawerRoot = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, ${({ $isOpen }) => ($isOpen ? 0 : 0.35)});
  transition: background 0.4s ease-in-out;
  z-index: 1998;
`;

export const DrawerWrapper = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  width: 75%;
  height: 100vh;
  background: white;
  box-shadow: -4px 0 16px rgba(0, 0, 0, 0.1);
  z-index: 999;
  padding: 24px;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;

  transform: translateX(${({ $isOpen }) => ($isOpen ? "0%" : "100%")});
  transition: transform 0.4s ease-in-out;
  
`;

export const SearchBox = styled.div`
  display: flex;
  justify-content: center;
  margin-top: ${({ theme }) => theme.spacing.xl};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  
  & > div > div > div {
    box-shadow: none;
  }
`;

export const KeywordBox = styled.div`
  padding: 0 ${({ theme }) => theme.spacing.xxl};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const Content = styled.div`
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.xxl};
  box-sizing: border-box;
  overflow-y: auto;
  flex: 1;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 40px 24px;

  & > div > p:nth-child(2){
    margin-top: ${({ theme }) => theme.spacing.md};
  }

  & > div > p:nth-child(3){
    margin-top: ${({ theme }) => theme.spacing.xs};
    margin-bottom: ${({ theme }) => theme.spacing.sm};
  }

  & > div > button {
    margin-top: ${({ theme }) => theme.spacing.md};
  }

  &::-webkit-scrollbar {
    width: 10px;
  }

  /* 스크롤바 트랙 (배경) */
  &::-webkit-scrollbar-track {
    background: transparent;
  }

  /* 스크롤바 핸들 (움직이는 부분) */
  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.darkGrey};
    border-radius: 10px;
    background-clip: padding-box;
    border: 3px solid transparent;
  }
`;

export const NoContent = styled.div`
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.xxl};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
`;

export const TextBox = styled.div`
  height: 95px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  & p:nth-child(1){
     margin-top: ${({ theme }) => theme.spacing.md};
  }
  & p:nth-child(2){
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  
` ;


export const ButtonBox = styled.div`
  display: flex;
  justify-content: flex-end;
  padding-top: ${({ theme }) => theme.spacing.xl};
  box-sizing: border-box;
`;

export const CloseButton = styled.button`
  position: absolute;
  left: -45px;
  top: 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 45px;
  height: 60px;
  border-radius: ${({ theme }) => theme.borderRadius.sm} 0 0 ${({ theme }) => theme.borderRadius.sm};
  border:0;
  background-color: ${({ theme }) => theme.colors.orange};
  color: ${({ theme }) => theme.colors.white};
  font-size: ${({ theme }) => theme.fontSizes.xxs};
  font-weight: 600;
  cursor: pointer;
  
  & svg {
    width: 18px;
    height: 18px;
    margin-bottom: 6px;
    & path, circle {
      stroke: ${({ theme }) => theme.colors.white};
    }
  }
`;