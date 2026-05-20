import styled from "styled-components";

export const TextBox = styled.div`
  display: flex;
  flex-direction: column;
//   position: relative;
  padding: ${({ theme }) => theme.spacing.xs} 0;
`;

export const ImageWrapper = styled.div`
  position: relative;
  width: 100%;
`;


export const HoverReason = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.65);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
  font-size: 13px;
  font-weight: 500;
  text-align: center;
  z-index: 1;
  pointer-events: none;
`;

export const ItemName = styled.div`
  cursor: pointer;
  font-weight: 800;
  font-size: ${({ theme }) => theme.fontSizes.xxs};
  margin-top: ${({ theme }) => theme.spacing.sm};
`;

export const ItemDescription = styled.div`
  cursor: pointer;
  font-weight: 600;
  font-size: 12px;
  margin-top: ${({ theme }) => theme.spacing.xs};
`;

export const ItemPrice = styled.div`
  font-weight: 600;
  font-size: ${({ theme }) => theme.fontSizes.xxs};
  margin-top: ${({ theme }) => theme.spacing.xs};
`;
