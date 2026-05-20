import React from "react";
import { ReactComponent as CheckCircleIcon } from "../assets/images/CheckCircleIcon.svg";
import { ReactComponent as CloseIcon } from "../assets/images/CloseIcon.svg";
import { ToastContainer } from './css/Toast.styled';
import CommonIconButton from "./CommonIconButton";
import {Text} from "./Typography";

function CustomToast({ message, closeToast }) {
    return (
        <ToastContainer>
            <div>
                <CheckCircleIcon />
                <Text size="xxs" $weight={600} color="white">{message}</Text>
            </div>
            <CommonIconButton
                width="20px"
                height="20px"
                color="orange"
                icon={<CloseIcon />}
                onClick={closeToast}
            />
        </ToastContainer>
    );
}

export default CustomToast;
