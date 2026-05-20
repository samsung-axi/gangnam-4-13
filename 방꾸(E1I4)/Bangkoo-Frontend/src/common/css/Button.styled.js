import styled from "styled-components";

// 버튼
export const StyledButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 4px 6px;
  box-sizing: border-box;
  min-width: ${({ width }) => width || "auto"};
  height: ${({ height }) => height || "40px"};
  background-color: ${({ theme, $bgColor, type }) =>
    type === "outline" ? theme.colors.white : theme.colors[$bgColor] || $bgColor || theme.colors.orange};
  color: ${({ theme, color, type, $bgColor }) =>
    type === "outline"
        ? theme.colors[$bgColor] || $bgColor || theme.colors.orange
        : theme.colors[color] || color || "#fff"};
  font-size: ${({ theme, fontSize }) =>
    theme.fontSizes[fontSize] || fontSize || theme.fontSizes.base};
  font-weight: ${({ fontWeight }) => fontWeight || 500};
  border-radius: ${({ theme, $borderRadius }) => theme.borderRadius[$borderRadius] || $borderRadius || "6px"};
  border: ${({ theme, type, $bgColor }) =>
    type === "outline" ? `1px solid ${theme.colors[$bgColor] || $bgColor || theme.colors.orange}` : "none"};
  cursor: pointer;
  transition: 0.2s;
`;