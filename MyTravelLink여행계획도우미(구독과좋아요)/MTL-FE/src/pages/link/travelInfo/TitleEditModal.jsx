import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import '../../../css/linkpage/TravelInfo/TitleEditModal.css';
import { FaTimes } from 'react-icons/fa';

const TitleEditModal = ({ isOpen, onClose, travelDays, travelInfoTitle, onSave }) => {
  const [daysValue, setDaysValue] = React.useState(travelDays);
  const [titleValue, setTitleValue] = React.useState(travelInfoTitle);

  useEffect(() => {
    setDaysValue(travelDays);
    setTitleValue(travelInfoTitle);
  }, [travelDays, travelInfoTitle]);

  if (!isOpen) return null;



  return ReactDOM.createPortal(
    <div className="WS-Modal-Overlay">
      <div className="WS-TitleEditModal-Content">
        <div className="WS-TitleEditModal-Text-Container">
          <div className="WS-TitleEditModal-header-Container">
            <div className='HG-modal-title'>여행일, 제목 수정</div>
          </div>

          <div className="WS-TitleEditModal-Body-Container">
            <div className="WS-TitleEditModal-date-Container">
              <div className="WS-TitleEditModal-title">여행일</div>
              <div className="WS-TitleEditModal-Date-input-Container">
                <input
                  className="WS-TitleEditModal-Date-input"
                  type="number"
                  value={daysValue}
                  onChange={(e) => setDaysValue(e.target.value)}
                />

                {daysValue && (
                  <button
                    className="WS-TitleEditModal-Date-Reset-Button"
                    onClick={() => setDaysValue('')}
                    type="button"
                  >
                    <FaTimes />
                  </button>
                )}
              </div>
            </div>


            <div className="WS-TitleEditModal-Edit-Container">
              <div className="WS-TitleEditModal-title">제목</div>

              <input
                className="WS-TitleEditModal-input"
                type="text"
                value={titleValue}
                onChange={(e) => setTitleValue(e.target.value)}
              />

              {titleValue && (
                <button
                  className="WS-TitleEditModal-Date-Reset-Button"
                  onClick={() => setTitleValue('')}
                  type="button"
                >
                  <FaTimes />
                </button>
              )}

            </div>
          </div>
        </div>

        <div className="WS-TitleEditModal-Button-Container">
          <button className="WS-TitleEditModal-Button" onClick={onClose}>취소</button>
          <button className="WS-TitleEditModal-Button" onClick={() => {
            onSave({ days: daysValue, title: titleValue });
            onClose();
          }}>확인</button>
        </div>
      </div>
    </div >,
    document.body // 또는 document.getElementById('modal-root')
  );
};

export default TitleEditModal;