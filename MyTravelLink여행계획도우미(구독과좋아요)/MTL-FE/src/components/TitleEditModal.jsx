import React, { useState } from 'react';
import '../css/Modal.css';

const TitleEditModal = ({ isOpen, onClose, title, onSave }) => {
  const [updateTitle, setUpdateTitle] = useState(title);

  if (!isOpen) return null;
  
  const handleOverlayClick = (e) => {
    if (e.target.className === 'HG-modal-overlay') {
      onClose();
    }
  };

  const handleTitleChange = (e) => {
    console.log(e.target.value);
    setUpdateTitle(e.target.value);
  };

  return (
    <div className="HG-modal-overlay" onClick={handleOverlayClick}>
      <div className="HG-modal-content">
        <h2>제목 편집</h2>
        <input 
          type="text"
          defaultValue={updateTitle}
          className="HG-modal-input"
          onChange={handleTitleChange}
        />
        <div className="HG-modal-buttons">
          <button onClick={() => onClose()}>취소</button>
          <button onClick={() => onSave(updateTitle)}>저장</button>
        </div>
      </div>
    </div>
  );
};

export default TitleEditModal; 