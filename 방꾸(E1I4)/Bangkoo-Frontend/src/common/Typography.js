import styled from "styled-components";

export const Text = styled.p`
  font-family: 'Pretendard';
  font-size: ${({ theme, size }) =>
          size ? theme.fontSizes[size] || size : theme.fontSizes.xs};
  font-weight: ${({ $weight }) => $weight || 500};
  color: ${({ theme, color }) => theme.colors[color] || theme.colors.black};
  line-height: ${({ $line }) => $line || 'normal'};;
  margin: 0;
`;
