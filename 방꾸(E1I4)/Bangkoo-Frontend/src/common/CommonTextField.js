import React from "react";
import {InputWrapper, InputStyle, ClearAllBox} from "./css/TextField.styled";
import { ReactComponent as CloseIcon } from "../assets/images/CloseIcon.svg";
import CommonIconButton from "./CommonIconButton";

const CommonTextField = ({
                             type = "text",
                             width,
                             height,
                             placeholder,
                             value,
                             onChange,
                             disabled,
                             name,
                             line,
                             custom,
                             fontSize,
                             onFocus,
                             imagePreviewUrl,
                             onClearAll,
                             onEnter,
                             onKeyDown,
                             className,
                         }) => {

    const shouldShowClear = value !== "" || imagePreviewUrl;

    return (
        <InputWrapper
            width={width}
            height={height}
            $line={line}
            $custom={custom}
            className={`your-default-styles ${className || ""}`}
        >
            <InputStyle
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                disabled={disabled}
                name={name}
                fontSize={fontSize}
                onFocus={onFocus}
                onKeyDown={(e) => {
                    // 엔터키 입력
                    if (e.key === "Enter" && typeof onEnter === "function") {
                        onEnter();
                    }
                    
                    // 백스페이스 이미지 제거
                    if (e.key === "Backspace" && value === "" && imagePreviewUrl && onClearAll) {
                        onClearAll();
                    }

                    // 외부 onKeyDown도 호출
                    if (typeof onKeyDown === "function") {
                        onKeyDown(e);
                    }
                }}
            />
            {shouldShowClear && (
                <ClearAllBox onClick={onClearAll}>
                    <CommonIconButton
                        type="full"
                        width="20px"
                        height="20px"
                        icon={<CloseIcon />}
                    />
                </ClearAllBox>
            )}
        </InputWrapper>
    );
};

export default CommonTextField;