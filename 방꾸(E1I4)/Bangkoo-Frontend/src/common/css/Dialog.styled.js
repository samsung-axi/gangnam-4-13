import styled from "styled-components";
import {Dialog} from "@mui/material";

export const DialogStyle = styled(Dialog)`
    & .MuiPaper-root {
        min-width: 300px;
        max-width: 1200px;
        border-radius: ${({ theme }) => theme.borderRadius.sm};
        z-index: 1600 !important;
        pointer-events: auto;
        position: relative;
    }
`;

export const TitleBox = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.xl};
    box-sizing: border-box;
`;

export const TitleStyle = styled.div`
    font-size: ${({ theme }) => theme.fontSizes.xs};
    color: ${({ theme }) => theme.colors.black};
    font-weight: 800;
`;

export const IconButton = styled.button`
    background: transparent;
    padding: 0px;
    border: none;
    cursor: pointer;
`;

export const ContentsBox = styled.div`
    padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.xl};
    box-sizing: border-box;
`;

export const ControllerBox = styled.div`
    padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.xl};
    box-sizing: border-box;
    display: flex;
    justify-content: center;
    align-items: center;
  
    & button {
      margin: 0 6px;
    }
`;