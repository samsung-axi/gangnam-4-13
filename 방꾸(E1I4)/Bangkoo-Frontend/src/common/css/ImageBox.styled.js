import styled from "styled-components";

export const ImageBoxStyle = styled.div`
  width: 100%;
  aspect-ratio: 4 / 3;
  border-radius: ${({ theme }) => theme.borderRadius.xs};
  border: 1px solid ${({ theme }) => theme.colors.grey};
  overflow: hidden;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${({ theme }) => theme.colors.white};
  box-sizing: border-box;

  & img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }

  &:hover div.center-box {
    opacity: 1;
    pointer-events: auto;
  }
`;

export const AiChip = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  background-color: ${({ theme }) => theme.colors.orange};
  border-radius: 0;
  color: #fff;
  font-size:  12px;
  font-weight: 700;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  padding: 4px 8px 4px 6px;
  box-sizing: border-box;
  
  & svg {
    width: 10px;
    height: 10px;
  }
`;

// eyeOn 과 eyeClosed 사용 AI Chip과 유사 (김범석)
export const EyeOnChip = styled.div`
  width: 50px;
  height: 50px;
  position: absolute;
  top: 0;
  left: 0;
  background-color: ${({ theme }) => theme.colors.orange};
  border-radius: 0;
  color: #fff;
  // font-size:  ${({ theme }) => theme.fontSizes.xxs};
  font-weight: 700;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
`;
export const EyeClosedChip = styled.div`
  width: 50px;
  height: 50px;
  position: absolute;
  top: 0;
  left: 0;
  background-color: ${({ theme }) => theme.colors.darkGrey};
  border-radius: 0;
  color: #fff;
  font-size:  ${({ theme }) => theme.fontSizes.xxs};
  font-weight: 700;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
`;

export const CenterBox = styled.div.attrs(() => ({
    className: "center-box"
}))`
  position: absolute;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.2s ease;
`;

export const TopRightBox = styled.div`
  position: absolute;
  top: 20px;
  right: ${({ theme }) => theme.spacing.sm};
  
  & svg {
    width: 14px;
    height: 14px;
  }
`;


export const BottomRightBox = styled.div`
  position: absolute;
  bottom: ${({ theme }) => theme.spacing.sm};
  right: ${({ theme }) => theme.spacing.sm};
  
  & svg {
    width: 14px;
    height: 14px;
  }
`;

export const BottomRightBoxPlus = styled(BottomRightBox)`
  & svg {
    width: 10px;
    height: 10px;
  }
`;

export const CheckboxArea = styled.div`
  position: absolute;
  bottom: 8px;
  right: 8px;
  cursor: pointer;
  z-index: 2;
`;

export const HoverTextBox = styled.div`
  position: absolute;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  display: flex;
  flex-direction: column;
  //justify-content: center;
  align-items: center;
  padding: 12px;
  text-align: center;
  font-size: ${({ theme }) => theme.fontSizes.xxs};
  font-weight: 600;
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: 2;

  ${ImageBoxStyle}:hover & {
    opacity: 1;
  }
  
  & > div {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    & p {
      white-space: pre-wrap;
      line-height: 1.4;
    }
  }
`;
