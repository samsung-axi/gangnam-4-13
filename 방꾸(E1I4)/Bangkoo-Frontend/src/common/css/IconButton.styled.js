import styled from "styled-components";
import { media } from "../../common/css/media"

export const StyledIconButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
  box-sizing: border-box;
  width: ${({ width }) => width || "34px"};
  height: ${({ height }) => height || "34px"};
  cursor: pointer;
  transition: 0.2s;
  border-width: ${({ type }) => type === "outline" ? '1px' : "none"};
  border-style: ${({ type }) => type === "outline" ? 'solid' : "none"};
  border-color: ${({ theme, color, type }) => type === "outline" ? color : "none"};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  background-color: ${({ theme, color, type }) =>
    type === "full" ? theme.colors[color] || color || theme.colors.orange : 'transparent'};
  box-shadow: ${({ type }) =>
    type === "full" ? "0 2px 4px rgba(0, 0, 0, 0.25)" : 'none'};

  ${media.tablet`
    width: 30px;
    height: 30px;
      
    & svg {
      width: 20px;
      height: 20px;
    }
  `}
`;
