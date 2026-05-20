// pages/myroom/dialog/css/AiRecommended.styled.js

import styled from "styled-components";
import Slider from "react-slick";

export const AiRecommendedRoot = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  
  & > p {
    text-align: center;
    margin-bottom: ${({ theme }) => theme.spacing.xl};
    
    & span {
      color: ${({ theme }) => theme.colors.orange};
    }
  }
`;

export const StyledSlider = styled(Slider)`
  width: 800px;
  .slick-slide {
    width: 200px !important;
    padding: 0 ${({ theme }) => theme.spacing.sm};
  }

  .slick-track {
    display: flex;
    align-items: center;
  }
  
  & img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
`;

export const ImageWrapper = styled.div`
  padding: ${({ theme }) => theme.spacing.sm};
`;

export const FurnitureImageStyled = styled.img`
  width: 100%;
  aspect-ratio: 4 / 3;
  border: 1px solid ${({ theme }) => theme.colors.grey};
  object-fit: cover;
`;

export const ProgressBarWrapper = styled.div`
  margin-top: ${({ theme }) => theme.spacing.lg};
  & p {
    text-align: center;
    margin-bottom: ${({ theme }) => theme.spacing.sm};;
    & span {
      font-weight: 700;
    }
  }
`;

export const ProgressOuter = styled.div`
  background: ${({ theme }) => theme.colors.lightGrey};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  height: 15px;
`;

export const ProgressInner = styled.div`
  background: ${({ theme }) => theme.colors.orange};
  height: 100%;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  width: ${({ $percent }) => $percent}%;
  transition: width 0.5s ease;
`;
