import React from "react";
import "./ConfirmModal.css";
import { Save, Trash2 } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  title?: string;
  content: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: (e: React.MouseEvent) => void; // 확인 버튼 클릭 이벤트
  onCancel: (e: React.MouseEvent) => void; // 취소 버튼 클릭 이벤트
}

const ConfirmModal: React.FC<ModalProps> = ({
  isOpen,
  title,
  content,
  confirmText = "확인",
  cancelText = "취소",
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  // 텍스트에 따라 아이콘 렌더링
  const renderIcon = () => {
    if (content.includes("저장")) {
      return <Save className="confirm-modal-save-icon" />;
    }
    if (content.includes("삭제")) {
      return <Trash2 className="confirm-modal-delete-icon" />;
    }
    return null;
  };

  return (
    <div className="confirm-modal-overlay">
      <div className="confirm-modal-container">
        <div className="confirm-modal-icon">{renderIcon()}</div>
        {title && <div className="confirm-modal-title">{title}</div>}
        <div className="confirm-modal-content">{content}</div>
        <div className="confirm-modal-actions">
          <button className="confirm-modal-button confirm" onClick={onConfirm}>
            {confirmText}
          </button>
          <button className="confirm-modal-button cancel" onClick={onCancel}>
            {cancelText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
