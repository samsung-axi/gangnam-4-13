import React, { useState, useRef, useEffect } from "react";
import "../../assets/css/Translation/GlossaryModal.css";

function GlossaryModal({ isOpen, onClose, onCreate }) {
  const [glossaryName, setGlossaryName] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleInputChange = (e) => {
    const input = e.target.value;
    if (input.length > 50) {
      alert("용어집 이름은 최대 50자까지 입력 가능합니다.");
      return;
    }
    setGlossaryName(input);
  };

  const handleCreate = () => {
    if (glossaryName.trim() === "") {
      alert("용어집 이름을 입력해주세요.");
      return;
    }
    onCreate(glossaryName);
    setGlossaryName("");
    onClose();
  };

  return isOpen ? (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={onClose}>
          X
        </button>
        <h2>새 용어집 생성</h2>
        <input
          type="text"
          className="glossary-input"
          placeholder="용어집 이름을 입력하세요"
          value={glossaryName}
          onChange={handleInputChange}
          ref={inputRef}
        />
        <div className="modal-buttons">
          <button
            className="create-button"
            onClick={handleCreate}
            disabled={!glossaryName.trim()}
          >
            생성
          </button>
        </div>
      </div>
    </div>
  ) : null;
}

export default GlossaryModal;
