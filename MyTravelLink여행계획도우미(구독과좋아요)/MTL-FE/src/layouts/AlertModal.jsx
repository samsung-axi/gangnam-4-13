import React from 'react';
import ReactDOM from 'react-dom';
import '../css/layout/AlertModal.css';

const AlertModal = ({ isOpen, message, onClose }) => {
    if (!isOpen) return null;

    return ReactDOM.createPortal(
        <div className="WS-Modal-Overlay">
            <div className="WS-AlertModal-Content">
                <div className="WS-AlertModal-Message-Container">
                    <div className="WS-AlertModal-Title">알림</div>
                    <div className="WS-AlertModal-Message">{message}</div>
                </div>

                <div className="WS-AlertModal-Button-Container">
                    <button className="WS-AlertModal-Button" onClick={onClose}>
                        확인
                    </button>
                </div>
            </div>
        </div>,
        document.body // 또는 document.getElementById('modal-root') 
    );
};

export default AlertModal; 