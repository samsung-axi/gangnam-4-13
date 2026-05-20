import React, { useState } from "react";
import "../../css/travel/TravelPageModal.css";
import ReactDOM from "react-dom";
import { FaTimes } from "react-icons/fa";

const TravelPageModal = ({
  showModal,
  setShowModal,
  selectedItem,
  handlePinToggle,
  onUpdateTitle,
  onDeleteItem,
}) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");

  // 수정 클릭 핸들러 함수
  const openEditModal = (itemId) => {
    if (!selectedItem || !itemId) return;

    if (selectedItem) {
      setNewTitle(selectedItem.title);
      setIsEditModalOpen(true);
    }
  };

  // 제목 수정 저장 함수
  const handleSaveTitle = () => {
    onUpdateTitle(selectedItem, newTitle);
    setIsEditModalOpen(false);
    setShowModal(false);
  };

  // 수정 모달 취소 핸들러
  const handleEditCancel = () => {
    setIsEditModalOpen(false);
  };
  console.log(selectedItem);

  return ReactDOM.createPortal(
    <div className="SJ-Travel-Modal">
      {showModal && (
        <>
          <div
            className="SJ-modal-overlay"
            onClick={() => setShowModal(false)}
          />
          <div className="SJ-modal-bottom">
            <div className="SJ-modal-content">
              <button
                className="SJ-modal-option"
                onClick={() => handlePinToggle(selectedItem)}
              >
                <span className="SJ-modal-icon">📌</span>
                {selectedItem.fixed ? "고정 해제" : "고정 하기"}
              </button>

              <button
                className="SJ-modal-option"
                onClick={() => openEditModal(selectedItem)}
              >
                <span className="SJ-modal-icon">✏️</span>
                이름 수정
              </button>

              <button
                className="SJ-modal-option delete"
                onClick={() => setShowDeleteModal(true)}
              >
                <span className="SJ-modal-icon">🗑️</span>
                삭제
              </button>
            </div>
          </div>
        </>
      )}

      {/* 수정 모달 */}
      {isEditModalOpen && (
        <div className="WS-second-Modal-Overlay">
          <div className="WS-second-Modal-Content">
            <div className="WS-Edit-Modal-Message-Container">
              <div className="WS-Edit-Modal-Title">이름 수정</div>
              <div className="WS-Edit-Modal-Message">
                나만의 여행 이름을 만들어보세요!
              </div>
            </div>

            <div className="WS-Edit-Modal-Input-Container">
              <input
                type="text"
                className="WS-Edit-Modal-Input"
                placeholder={selectedItem?.title}
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                autoFocus
              />
              {newTitle && (
                <button
                  className="WS-Edit-Modal-Reset-Button"
                  onClick={() => setNewTitle("")}
                  type="button"
                >
                  <FaTimes />
                </button>
              )}
            </div>
            <div className="WS-second-Modal-Button-Container">
              <button
                className="WS-second-Modal-Button"
                onClick={handleEditCancel}
              >
                취소
              </button>
              <button
                className="WS-second-Modal-Button"
                onClick={handleSaveTitle}
              >
                저장
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 삭제 모달 */}
      {showDeleteModal && (
        <div className="WS-second-Modal-Overlay">
          <div className="WS-second-Modal-Content" id="WS-Delete-Modal-Content">
            <div className="WS-Delete-Modal-Message-Container">
              <div className="WS-Delete-Modal-Title">삭제하시겠습니까?</div>
              <div className="WS-Delete-Modal-Message">
                여행 목록에서 삭제됩니다.
              </div>
            </div>

            <div className="WS-second-Modal-Button-Container">
              <button
                className="WS-second-Modal-Button"
                onClick={() => setShowDeleteModal(false)}
              >
                취소
              </button>
              <button
                className="WS-second-Modal-Button"
                onClick={() => {
                  onDeleteItem(selectedItem);
                  setShowDeleteModal(false);
                }}
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}
    </div>,
    document.body
  );
};

export default TravelPageModal;
