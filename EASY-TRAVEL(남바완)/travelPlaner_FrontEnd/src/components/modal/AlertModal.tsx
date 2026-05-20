import React from "react";
import "./AlertModal.css";
import { Save } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  title?: string;
  content: string;
  confirmText?: string;
  onConfirm: () => void; // 확인 버튼 클릭 이벤트
}

const ConfirmModal: React.FC<ModalProps> = ({
  isOpen,
  title,
  content,
  confirmText = "확인",
  onConfirm,
}) => {
  if (!isOpen) return null;

  // 텍스트에 따라 아이콘 렌더링
  const renderIcon = () => {
    if (content.includes("확인")) {
      return <Save className="confirm-modal-save-icon" />;
    }
    return null;
  };

  return (
    <div className="alert_modal_overlay">
      <div className="alert_modal_container">
        <div className="alert_modal_icon">{renderIcon()}</div>
        {title && <div className="alert_modal_title">{title}</div>}
        <div className="alert_modal_content">{content}</div>
        <div className="alert_modal_actions">
          <button className="alert_modal_button confirm" onClick={onConfirm}>
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
