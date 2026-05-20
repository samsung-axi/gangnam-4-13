import styled from "styled-components";

export const InteriorRoot = styled.div`
  display: flex;
  flex-direction: column;
  
  & > p {
    margin-bottom: ${({ theme }) => theme.spacing.sm};
  }
`;

export const InteriorImageBox = styled.div`
  width: 580px;
  aspect-ratio: 16 / 9;
  border: 1px solid ${({ theme }) => theme.colors.grey};
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.md};;

  & img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;