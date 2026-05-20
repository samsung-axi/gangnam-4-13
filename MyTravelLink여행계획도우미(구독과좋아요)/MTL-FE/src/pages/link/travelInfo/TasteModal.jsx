import React, { useState } from 'react';
import '../../../css/linkpage/TravelInfo/TasteModal.css';
import resetIcon from '../../../images/resetBtn.svg';


const TasteModal = ({ isOpen, onClose, onSave }) => {
  const [updateTaste, setUpdateTaste] = useState('');

  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target.className === 'HG-modal-overlay') {
      setUpdateTaste('');
      onClose();
    }
  };

  return (
    <div className="HG-modal-overlay" onClick={handleOverlayClick}>
      <div className="HG-modal-content-taste">
        <div className='HG-modal-content-taste-container'>
          <div className='HG-modal-title-taste'>선호하는 여행 일정은?</div>
          <div className='HG-modal-description-taste'>선택해주신 스타일로 일정을 생성합니다.</div>
          <div className='HG-input-wrapper-taste'>
            <input
              id="taste-busy"
              className='HG-taste-radio-input'
              type="radio"
              name="taste"
              value="busy"
              onChange={() => setUpdateTaste('busy')}
            />
            <label
              htmlFor="taste-busy"
              className='HG-taste-radio-label'
            >
              빼곡한 일정 선호
            </label>

            <input
              id="taste-normal"
              className='HG-taste-radio-input'
              type="radio"
              name="taste"
              value="normal"
              onChange={() => setUpdateTaste('normal')}
            />
            <label
              htmlFor="taste-normal"
              className='HG-taste-radio-label'
            >
              적당한 일정 선호
            </label>
            <input
              id="taste-relax"
              className='HG-taste-radio-input'
              type="radio"
              name="taste"
              value="relax"
              onChange={() => setUpdateTaste('relax')}
            />
            <label
              htmlFor="taste-relax"
              className='HG-taste-radio-label'
            >
              널널한 일정 선호
            </label>
          </div>
        </div>

        <div className="HG-modal-buttons">
          <div className="HG-modal-button" onClick={() => {
            setUpdateTaste('');
            onClose();
          }}>취소</div>
          <div
            className={updateTaste ? "HG-modal-button-submit-checked" : "HG-modal-button-submit"}

            onClick={() => {
              if (!updateTaste) {
                alert('일정 스타일을 선택해주세요.');
                return;
              }
              onSave(updateTaste);
              onClose();
            }}
          >
            생성
          </div>
        </div>
      </div>
    </div>
  );
};

export default TasteModal; 