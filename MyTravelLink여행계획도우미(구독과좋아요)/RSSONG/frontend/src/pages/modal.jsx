import React, { useState } from 'react';
import '../css/modal.css';

import Listen from '../images/listen.png';
import Record from '../images/record.png';
import check from '../images/check.png';

function Modal({ isOpen, onClose }) {
    const [isNextModalOpen, setIsNextModalOpen] = useState(false);
    const [isThirdModalOpen, setIsThirdModalOpen] = useState(false);
    const [recordedData, setRecordedData] = useState(null);
    const [stack, setStack] = useState(0);

    const handleCheckClick = () => {
        const newStack = stack + 1;
        setStack(newStack);

        if (newStack >= 10) {
            // 10스택 달성 시
            setStack(0);  // 스택 초기화
            setIsThirdModalOpen(true);  // 세 번째 모달 열기
            setIsNextModalOpen(false);  // 두 번째 모달 닫기
        } else {
            setIsNextModalOpen(true);
        }
    };

    const closeNextModal = () => {
        setIsNextModalOpen(false);
    };

    const closeThirdModal = () => {
        setIsThirdModalOpen(false);
    };

    // 세 번째 모달 (10스택 달성)
    if (isThirdModalOpen) {
        return (
            <div className="modal-overlay" onClick={closeThirdModal}>
                <div className="modal-content" onClick={e => e.stopPropagation()}>
                    <button className="close-button" onClick={closeThirdModal}>×</button>
                    <div className="third-modal-content">
                        <h2>⭐️축하합니다⭐️</h2>
                        <h3>10개의 별을 모았어요!</h3>
                        <div className="reward-container">
                            {/* 여기에 보상 내용 추가 */}
                        </div>
                        <div className="third-modal-buttons">
                            <button className="continue-btn">계속하기</button>
                            <button className="finish-btn">그만하기</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // 두 번째 모달
    if (isNextModalOpen) {
        return (
            <div className="modal-overlay" onClick={closeNextModal}>
                <div className="modal-content" onClick={e => e.stopPropagation()}>
                    <button className="close-button" onClick={closeNextModal}>×</button>
                    <h2>⭐️참 잘했어요⭐️</h2>
                    <h2>나랑 더 놀까?</h2>
                    <input type="hidden" name="stack" value={stack} />
                    <div className="star-counter">
                    {Array(stack).fill().map((_, i) => (
                        <span 
                            key={i} 
                            className="star"
                            style={{ animationDelay: `${i * 0.1}s` }}  // 각 별마다 딜레이 추가
                        >
                            ⭐️
                        </span>
                    ))}
                </div>
                    <div className="next-modal-content">
                        <button className="next-modal-btn">응!</button>
                        <button className="next-modal-btn">그만놀래!</button>
                    </div>
                </div>
            </div>
        );
    }

    // 첫 번째 모달
    if (!isOpen && !isNextModalOpen && !isThirdModalOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <button className="close-button" onClick={onClose}>×</button>
                <input type="hidden" name="stack" value={stack} />

                <div className="waveform-container">
                    <div className="waveform"></div>
                </div>

                <div className='modal-btn-container'>
                    <button className='record-btn'>
                        <img src={Record} alt="record" className='modal-btn' />
                    </button>
                    
                    <button className='listen-btn'>
                        <img src={Listen} alt="listen" className='modal-btn' />
                    </button>

                    <button className='check-btn' onClick={handleCheckClick}>
                        <img src={check} alt="check" className='modal-btn' />
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Modal;