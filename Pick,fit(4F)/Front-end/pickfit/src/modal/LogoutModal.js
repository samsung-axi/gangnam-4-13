import React from 'react';
import '../styles/LoginModal.css';  // CSS 파일 임포트

const LogoutModal = ({ isOpen, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <p>정말 로그아웃 하시겠습니까?</p>
        <button onClick={onConfirm} className="modal-button">
          로그아웃
        </button>
        <button onClick={onCancel} className="modal-button">
          취소
        </button>
      </div>
    </div>
  );
};

export default LogoutModal;
