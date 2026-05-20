// common/CommonButton.js
import React from "react";
import {StyledButton} from "./css/Button.styled"

const CommonButton = ({
          children,
          width,
          height,
          bgColor,
          fontSize,
          fontWeight,
          radius,
          color,
          type = "fill",
          onClick,
          ...rest
      }) => {
    return (
        <StyledButton
            width={width}
            height={height}
            $bgColor={bgColor}
            fontSize={fontSize}
            fontWeight={fontWeight}
            $borderRadius={radius}
            color={color}
            type={type}
            onClick={onClick}
            {...rest}
        >
            {children}
        </StyledButton>
    );
};

export default CommonButton;
