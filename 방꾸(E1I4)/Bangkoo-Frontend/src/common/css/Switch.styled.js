import styled from "styled-components";
import { media } from "../../common/css/media"
import { styled as muiStyled } from "@mui/material/styles";
import Switch from "@mui/material/Switch";

/* --- MUI Switch 커스텀 --- */
// 커스텀 Switch
export const SwitchContainer = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  position: relative;
  width: 100px;
  height: 42px;
  cursor: pointer;

  ${media.tablet`
    width: 80px;
    height: 34px;
  `}
`;

// "AI 검색" 텍스트
export const Label = muiStyled("span")(({ theme, $checked }) => ({
    fontSize: theme.fontSizes.xs,
    fontWeight: 800,
    color: $checked ? theme.colors.white : theme.colors.black,
    position: "absolute",
    zIndex: 2,
    left: $checked ? 12 : "auto",
    right: $checked ? "auto" : 12,
    transition: "all 0.3s ease",
}));

// MUI Switch 커스텀
export const CustomSwitch = muiStyled(Switch)(({ theme }) => ({
    width: 100,
    height: 42,
    padding: 0,
    "& .MuiSwitch-switchBase": {
        padding: 0,
        margin: 5,
        transitionDuration: "300ms",
        "&.Mui-checked": {
            transform: "translateX(58px)",
            color: "#fff",
            "& + .MuiSwitch-track": {
                backgroundColor: theme.colors.orange,
                opacity: 1,
            },
        },
    },
    "& .MuiSwitch-switchBase > div": {
        width: 32,
        height: 32,
        borderRadius: "50%",
        backgroundColor: "#fff",
        boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: theme.fontSizes.xxs,
        fontWeight: 700,
    },
    "& .MuiSwitch-track": {
        borderRadius: 40,
        backgroundColor: theme.colors.grey,
        opacity: 1,
        transition: "background-color 0.3s",
    },
}));
