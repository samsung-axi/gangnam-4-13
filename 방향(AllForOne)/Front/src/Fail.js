import React from "react";
import "./css/Login.css";
import { useNavigate } from 'react-router-dom';

function ErrorScreen({ errorMessage, onRetry, errorType }) {

    const navigate = useNavigate();

    const renderErrorContent = () => {
        switch (errorType) {
            case "LEAVE_ACCOUNT":
                return (
                    <div className="error-content">
                        <p>탈퇴한 계정입니다. 로그인이 불가능합니다.</p>
                        <button className="retry-button" onClick={() => navigate('/')}>
                            다시 시도하기
                        </button>
                    </div>
                );
            case "NETWORK_ERROR":
                return (
                    <div className="error-content">
                        <p>네트워크 연결에 문제가 발생했습니다.</p>
                        <p>인터넷 연결을 확인하고 다시 시도해주세요.</p>
                        <button className="retry-button" onClick={onRetry}>
                            다시 시도하기
                        </button>
                    </div>
                );
            case "UNKNOWN_ERROR":
            default:
                return (
                    <div className="error-content">
                        <p>에러 발생: {errorMessage || "알 수 없는 오류가 발생했습니다."}</p>
                        <button className="retry-button" onClick={onRetry}>
                            다시 시도하기
                        </button>
                    </div>
                );
        }
    };

    return (
        <div className="login-error">
            <div className="error-box">
                {renderErrorContent()}
            </div>
        </div>
    );
}

export default ErrorScreen;
