import styled from "styled-components";
import { media } from "../../common/css/media"

export const TabMenu = styled.div`
  display: flex;
  align-items: center;
  position: relative;
  background-color: ${({ theme }) => theme.colors.white};
`;

export const TabLineStyle = styled.div`
  width: 100%;
  position: absolute;
  bottom: 0px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.darkGrey};
`;

export const Tab = styled.button`
  position: relative;
  padding: 6px 12px;
  font-size: ${({ theme, fontSize }) =>
    theme.fontSizes[fontSize] || fontSize || theme.fontSizes.base};
  font-weight: ${({ $active }) => ($active ? 800 : 500)};
  color: ${({ theme, $active }) =>
    $active ? theme.colors.orange : theme.colors.darkGrey};
  border: none;
  background: none;
  border-bottom: ${({ $active, theme }) =>
    $active ? `3px solid ${theme.colors.orange}` : "3px solid transparent"};
  cursor: pointer;
  transition: all 0.2s ease;
  z-index: 10;\

  &:hover {
   
  }

  ${media.tablet`
    font-size: ${({ theme }) => theme.fontSizes.xs};
    padding: 6px 10px;
  `}
  
`;
