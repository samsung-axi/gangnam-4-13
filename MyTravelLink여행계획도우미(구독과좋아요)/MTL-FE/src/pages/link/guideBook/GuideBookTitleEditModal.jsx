import React, { useState } from 'react';
import { FaTimes } from "react-icons/fa";


const TitleEditModal = ({ isOpen, onClose, title, onSave }) => {
  const [updateTitle, setUpdateTitle] = useState(title);

  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target.className === 'WS-Modal-Overlay') {
      onClose();
    }
  };

  const handleTitleChange = (e) => {
    console.log(e.target.value);
    setUpdateTitle(e.target.value);
  };

  return (
    <div className="WS-Modal-Overlay" onClick={handleOverlayClick}>
      <div className="WS-second-Modal-Content">
        <div className="WS-Edit-Modal-Message-Container">
          <div className="WS-Edit-Modal-Title">가이드북 제목 수정</div>
          <div className="WS-Edit-Modal-Message">
            가이드북의 제목을 수정할 수 있습니다.
          </div>
        </div>

        <div className="WS-Edit-Modal-Input-Container">
          <input
            className="WS-Edit-Modal-Input"
            type="text"
            value={updateTitle}
            onChange={(e) => setUpdateTitle(e.target.value)}
          />
          {updateTitle && (
            <button
              className="WS-Edit-Modal-Reset-Button"
              onClick={() => setUpdateTitle('')}
              type="button"
            >
              <FaTimes />
            </button>
          )}
        </div>

        <div className="WS-second-Modal-Button-Container">
          <button className="WS-second-Modal-Button" onClick={onClose}>취소</button>
          <button className="WS-second-Modal-Button" onClick={() => {
            onSave(updateTitle);
            onClose();
          }}>
            확인
          </button>
        </div>
      </div>
    </div>
  );
};

export default TitleEditModal; 