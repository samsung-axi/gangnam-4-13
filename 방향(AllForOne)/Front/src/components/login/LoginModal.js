import React from 'react';

const NonMemberLoginModal = ({ navigate, setShowLoginModal }) => {
    const handleCloseModal = () => {
        setShowLoginModal(false); // 모달만 닫기
        // 추천 제한 상태를 유지하므로 추가 상태 변경 로직은 필요하지 않음
    };

    return (
        <div className="non-member-modal-overlay">
            <div className="non-member-modal-content">
                <h2>로그인 후 이용해주세요</h2>
                <p className="non-member-modal-content-1">
                    더 많은 추천을 받으시려면 로그인이 필요합니다.
                </p>
                <button
                    className="non-member-login-button"
                    onClick={() => navigate('/login')}
                >
                    로그인
                </button>
                <button
                    className="non-member-close-button"
                    onClick={handleCloseModal}
                >
                    닫기
                </button>
            </div>
        </div>
    );
};

export default NonMemberLoginModal;
