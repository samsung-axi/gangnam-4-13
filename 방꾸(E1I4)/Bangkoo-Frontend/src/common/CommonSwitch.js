import React  from "react";
import { SwitchContainer, CustomSwitch, Label } from "./css/Switch.styled";
import { useTheme } from "styled-components";

const CommonSwitch = ({checked, setChecked}) => {
    const theme = useTheme(); // styled-components 테마 사용

    const handleToggle = () => {
        setChecked((prev) => !prev);
    };

    return (
        <SwitchContainer onClick={handleToggle}>
            <Label $checked={checked}>AI 검색</Label>
            <CustomSwitch
                checked={checked}
                disableRipple
                icon={
                    <div style={{color: theme.colors.grey}}>
                        OFF
                    </div>
                }
                checkedIcon={
                    <div style={{color: theme.colors.orange}}>
                        ON
                    </div>
                }
            />
        </SwitchContainer>
    );
};

export default CommonSwitch;