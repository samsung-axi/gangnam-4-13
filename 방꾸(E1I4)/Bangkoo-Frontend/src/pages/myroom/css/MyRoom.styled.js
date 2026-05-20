import styled from "styled-components";
import { media } from "@/common/css/media"

export const MainLayout = styled.div`
  display: flex;
  width: 100%;
  margin-top: ${({ theme }) => theme.headerHeight};
  height: calc(100vh - ${({ theme }) => theme.headerHeight});
`;

export const LeftPanel = styled.div`
  width: calc(100vw - 500px);
  //width: 70%;
  //min-width: calc(100vw - 500px);
  padding: ${({ theme }) => theme.spacing.md};
  box-sizing: border-box;
  border-right: 1px solid ${({ theme }) => theme.colors.grey};
  display: flex;
  flex-direction: column;

  & > p {
    margin-top: ${({ theme }) => theme.spacing.lg};
    text-align: center;
    margin-bottom: ${({ theme }) => theme.spacing.lg};
  }
`;

export const RightPanel = styled.div`
  //min-width: 346px;
  //width: 30%;
  width: 500px;
  //max-width: 500px;
  height: 100%;
  padding: ${({ theme }) => theme.spacing.md};
  padding-bottom: 0;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
`;

export const GridBox = styled.div`
  flex: 1;
  position: relative;
  overflow-x: hidden;
  box-sizing: border-box;
  overflow-y: auto;
  height: 100%;
  background-color: ${({ theme }) => theme.colors.white};

  /* 스크롤바 전체 영역 */
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

// 업로드 영역
export const ControllerBox = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

export const FlexBox = styled.div`
  display: flex;
  align-items: center;
  
  & button:nth-child(2) {
    margin: 0 ${({ theme }) => theme.spacing.sm};
  }
`;


// 가구 컨트롤 영역
export const AIControllerBox = styled.div`
  position: relative;
`;

// 검색 버튼
export const AISearchButton = styled.button`
  position: absolute;
  right: -16px;
  top: 0;
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

export const SearchTooltip = styled.div`
  position: absolute;
  right: 40px;
  top: -10px;
  width: 200px;
  background-color: ${({ theme }) => theme.colors.dark};
  color: #fff;
  font-size: ${({ theme }) => theme.fontSizes.xxs};
  padding: 10px 16px;
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  z-index: 100;

  &::after {
    content: "";
    position: absolute;
    right: -20px;
    top: 25px;
    border-width: 10px;
    border-style: solid;
    border-color: transparent transparent transparent ${({ theme }) => theme.colors.dark};
  }

  & > div {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 6px;
    
    & svg {
      width: 12px;
      height: 12px;
      & path {
        stroke: ${({ theme }) => theme.colors.white}
      }
    }
  }
  
  & p {
    line-height: 1.4;
  }

`;

export const TabBox = styled.div`
  margin-top: ${({ theme }) => theme.spacing.xxl};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

export const FurnitureGrid = styled.div`
  display: grid;
  //grid-template-columns: repeat(auto-fill, minmax(135px, 1fr));
  grid-template-columns: repeat(3, 1fr);
  //align-items: stretch;
  gap: ${({ theme }) => theme.spacing.md};
  padding-bottom: ${({ theme }) => theme.spacing.md};
  padding-right: 10px;
  box-sizing: border-box;
  //align-content: start;
  background-color: ${({ theme }) => theme.colors.white};
  
  & > * {
    min-width: 0;
  }

  ${media.tablet`
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  `}
`;

export const ImageBox = styled.div`
  position: relative;
`;

export const AddItem = styled.div`
  position: absolute;
  top: -5px;
  right: -5px;
  z-index: 10;
  
`;

export const TextBox = styled.div`

  & p:nth-child(2){
    padding-top: ${({ theme }) => theme.spacing.sm};
  }
  
  & p:nth-child(3){
    padding-top: ${({ theme }) => theme.spacing.xs};
    padding-bottom: ${({ theme }) => theme.spacing.sm};
  }
`;

export const InteriorBox = styled.div`

 
`;

export const InteriorControllerBox = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding-bottom: ${({ theme }) => theme.spacing.md};
  
  & button:last-child {
    margin-left: ${({ theme }) => theme.spacing.sm};;
  }
`;

export const EmptyBox = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;
