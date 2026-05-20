import styled from "styled-components";
import { media } from "@/common/css/media"
import banner from "@/assets/images/BannerImage.png"

export const HomeRoot = styled.div`
    margin-bottom: 110px;
    margin-top: ${({ theme }) => theme.headerHeight};
` ;


// 배너
export const BannerRoot = styled.div`
  width: 100%;
  height: 450px;
  box-sizing: border-box;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: ${({ theme }) => theme.colors.black};
  &::after {
    content: "";
    position: absolute;
    inset: 0;
    background-image: url(${banner});
    background-size: cover;
    background-position: center bottom;
    background-repeat: no-repeat;
    opacity: 0.7;
    z-index: 0;
  }
  
`;

export const BannerText = styled.p`
  position: relative;
  z-index: 10;
  margin: 0;
  font-size: ${({ theme }) => theme.fontSizes.xl};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.white};
  text-align: center;
  line-height: 60px;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  text-shadow: 0 3px 4px rgba(0, 0, 0, 0.25);
  & span {
    font-weight: 600;
  }

  ${media.tablet`
    font-size: ${({ theme }) => theme.fontSizes.lg};
    line-height: 40px;
  `}

  ${media.mobile`
    font-size: ${({ theme }) => theme.fontSizes.md};
    line-height: 40px;
  `}
`;

// STEP
export const StepRoot = styled.div`
  width: 100%;
  height: 380px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px 16px;
  box-sizing: border-box;
  background-color: ${({ theme, type }) =>
          type === "basic" ? theme.colors.white : theme.colors.lightOrange};
  
  ${media.tablet`
    height: auto;
    
    &:nth-child(even) > div > div:first-child {
      order: 2;
    }
  `}
`;

export const StepRootIn = styled.div`
  width: ${({ theme }) => theme.display.sm};
  display: flex;
  align-items: center;

  ${media.tablet`
    flex-direction: column;
    width: 100%;
  `}
`;

export const StepBox = styled.div`
  width: 50%;
  
  ${media.tablet`
    width: 100%;
  `}
`;

export const ImageBox = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  & img {
    display: block;
    transform: scale(0.9);

    ${media.tablet`
      transform: scale(0.7);
      height: auto;
    `}
    
    ${media.mobile`
      width: 60%;
    `}
  }
`;

export const TextBox = styled.div`
  & p:first-child {
    margin-bottom: ${({ theme }) => theme.spacing.xs};
  }
  & p:last-child {
    margin-top: ${({ theme }) => theme.spacing.md};
  }
  
  ${media.tablet`
    text-align: center;
    
    & p:first-child {
      font-size: ${({ theme }) => theme.fontSizes.lg};
    }
    & p:nth-child(2) {
        font-size: ${({ theme }) => theme.fontSizes.md};
    }
    & p:last-child {
      font-size: ${({ theme }) => theme.fontSizes.sm};
    }
  `}
`;

// 지금 시작하기 버
export const StartRoot = styled.div`
  width: 100%;
  position: fixed;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  padding: ${({ theme }) => theme.spacing.xl};
  background-color: ${({ theme }) => theme.colors.white};
  box-shadow: 0px 0px 6px rgba(0, 0, 0, 0.1)
`;