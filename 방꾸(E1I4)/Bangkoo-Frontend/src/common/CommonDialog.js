import React, { useEffect, useRef }  from 'react';
import {
    DialogStyle,
    TitleBox,
    IconButton,
    ContentsBox,
    ControllerBox
} from "./css/Dialog.styled"
import { ReactComponent as CloseIcon } from "../assets/images/CloseIcon.svg";
import CommonButton from './CommonButton';
import {Text} from "./Typography";

const CommonDialog = ({
                          open,
                          onClose,
                          onClick,
                          title,
                          children,
                          cancel = true,
                          submit = true,
                          submitText = '확인',
                      }) => {

    const dialogRef = useRef(null); // 다이얼로그 DOM 참조

    // 포커스 이동
    useEffect(() => {
        if (open && dialogRef.current) {
            dialogRef.current.focus();
        }
    }, [open]);

    const buttonProps = {
        width:"140px",
        height: "40px",
        fontSize: "xs"
    };

    return (
        <DialogStyle open={open}>
            <div ref={dialogRef} style={{ outline: "none" }}>
                <TitleBox>
                    <Text size="base" $weight={700}>{title}</Text>
                    <IconButton onClick={onClose}><CloseIcon /></IconButton>
                </TitleBox>
                <ContentsBox>
                    {children}
                </ContentsBox>
                <ControllerBox>
                    {cancel &&
                        <CommonButton
                            type="outline"
                            onClick={onClose}
                            children={"취소"}
                            {...buttonProps}
                        />
                    }

                    {submit &&
                        <CommonButton
                            onClick={onClick}
                            className="dialog-submit-button"
                            children={submitText}
                            {...buttonProps}
                        />
                    }

                </ControllerBox>
            </div>

        </DialogStyle>
    );
};

export default CommonDialog;