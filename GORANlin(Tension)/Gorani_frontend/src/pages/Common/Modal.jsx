import React from "react";
import "../../assets/css/all.css";
import "../../assets/css/Common/modal.css";
import GoogleLoginComponent from "../Login/GoogleLogin";
import NaverLogin from "../Login/Naver";
import KakaoLogin from "../Login/KakaoLogin";

const Modal = ({ isOpen, toggleModal }) => {
  if (!isOpen) return null; // 모달이 열리지 않았으면 렌더링하지 않음

  return (
    <div
      className="modal-overlay"
      onClick={toggleModal} // 모달 외부 클릭 시 닫기
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()} // 내부 클릭 시 닫히지 않도록 방지
      >
        <button
          className="close-button"
          onClick={(e) => {
            e.stopPropagation(); // 이벤트 버블링 방지
            toggleModal();
          }}
          aria-label="Close modal"
        >
          X
        </button>
        <h2 id="modal-title">로그인</h2>
        <GoogleLoginComponent />
        <KakaoLogin />
        <NaverLogin />
      </div>
    </div>
  );
};

export default Modal;
