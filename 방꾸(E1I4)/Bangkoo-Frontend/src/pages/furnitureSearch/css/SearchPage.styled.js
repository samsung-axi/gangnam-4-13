import styled from "styled-components";
import { media } from "@/common/css/media"

export const SearchRoot = styled.div`
  width: ${({ theme }) => theme.display.base};
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 56px;
  box-sizing: border-box;
  margin: ${({ theme }) => theme.headerHeight} auto;
  
  
  & > div > div > div {
    box-shadow: none;
  }
  
  ${media.tablet`
  
  `}
` ;

export const LoadingBox = styled.div`
  padding: 100px 0 0;
` ;

export const GridBox = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 40px 24px;
  margin-top: 32px;
  
  & button {
    margin-top: ${({ theme }) => theme.spacing.md};
  }
` ;

export const TextBox = styled.div`
  height: 108px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  & > div > p:nth-child(1){
     margin-top: ${({ theme }) => theme.spacing.md};
     margin-bottom: 6px;
  }
  & > div > p:nth-child(2){
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  
` ;

export const SearchTermBox = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-start;
  
  & > p {
    margin: 40px 0 24px;
  }
` ;