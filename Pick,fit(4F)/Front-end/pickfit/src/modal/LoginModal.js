import React from 'react';
import '../styles/LoginModal.css';  // CSS 파일 임포트

const LoginModal = ({ isOpen, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <p>로그인 해줘</p>
        <button onClick={onConfirm} className="modal-button">
          확인
        </button>
      </div>
    </div>
  );
};

export default LoginModal;
