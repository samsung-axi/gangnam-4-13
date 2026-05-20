import styled from "styled-components";

export const TooltipWrapper = styled.div`
  position: absolute;
  z-index: 10000;
  top: ${({ $top }) => `${$top}px`};
  left: ${({ $left }) => `${$left}px`};
`;

export const TooltipBubble = styled.div`
  position: relative;
  background: ${({ theme }) => theme.colors.white};
  color: ${({ theme }) => theme.colors.black};
  padding: 12px 16px;
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  font-size: ${({ theme }) => theme.fontSizes.xxs};
  font-weight: 600;
  box-shadow: 0px -2px 16px rgba(0, 0, 0, 0.2);
  max-width: 260px;

  &::after {
    content: "";
    position: absolute;
    left: ${({ $arrowLeft }) => $arrowLeft !== undefined ? `${$arrowLeft}px` : "50%"};
    transform: translateX(-50%);
    ${({ $direction }) =>
            $direction === "up"
                    ? `
      top: -10px;
      border-width: 0 10px 10px 10px;
      border-style: solid;
      border-color: transparent transparent #fff transparent;
    `
                    : `
      bottom: -10px;
      border-width: 10px 10px 0 10px;
      border-style: solid;
      border-color: #fff transparent transparent transparent;
    `}
  }
`;
