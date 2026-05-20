import styled from "styled-components";
import { media } from "../../common/css/media"

export const InputWrapper = styled.div`
  position: relative;
  width: ${({ width }) => width || "100%"};
  height: ${({ height }) => height || "40px"};
  border: ${({ theme, $custom, $line }) =>
    $custom === "outline" ? `1px solid ${theme.colors[$line] || $line || theme.colors.grey}` : "none"};
  border-radius: ${({theme}) => theme.borderRadius.sm};
  background-color: #fff;
`;

export const InputStyle = styled.input`
  width: calc(100% - 20px - 6px);
  height: 100%;
  border: none;
  padding: 0 10px;
  box-sizing: border-box;
  background-color: transparent;
  font-size: ${({ theme, fontSize }) =>
    fontSize ? theme.fontSizes[fontSize] : theme.fontSizes.sm};

  &::placeholder {
    color: rgba(205,205,205.1);
    font-weight: 800;
  }
  &:focus {
    outline: none;
  }

  ${media.tablet`
    font-size: ${({ theme }) => theme.fontSizes.sm};
  `}
  
  ${media.mobile`
    font-size: ${({ theme }) => theme.fontSizes.xs};
  `}
`;

export const ClearAllBox = styled.div`
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  justify-content: center;
  svg {
    width: 14px;
    height: 14px;
    path {
      stroke: ${({ theme }) => theme.colors.white};
    }
  }
`;
