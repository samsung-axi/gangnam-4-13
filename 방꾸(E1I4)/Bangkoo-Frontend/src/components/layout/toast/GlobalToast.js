import React from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Toast.styled.css";

function GlobalToast() {
    return (
        <ToastContainer
            position="top-center"
            autoClose={5000}
            hideProgressBar
            closeButton={false}
            toastClassName="custom-toast-body"
        />
    );
}

export default GlobalToast;
