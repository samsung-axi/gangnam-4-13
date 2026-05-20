import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faFileLines, // 중앙 이력서 아이콘
    faHome,      // 홈 아이콘
    faBriefcase, // 구인공고 아이콘
    faCalendarDays, // 프로그램 아이콘
    faUser       // 마이페이지 아이콘
} from '@fortawesome/free-solid-svg-icons';
import '../../assets/css/resumeStart.css';

const ResumeStart = () => {
    const navigate = useNavigate();

    return (
        <div className="hmk-form-section">
            <div className="hmk-form-header">
                <button 
                    className="hmk-back-button"
                    onClick={() => navigate(-1)}
                >
                    ←
                </button>
            </div>

            <div className="hmk-resume-content">
                <div className="hmk-resume-icon">
                    <FontAwesomeIcon 
                        icon={faFileLines} 
                        size="4x"
                    />
                </div>

                <button 
                    className="hmk-resume-button"
                    onClick={() => navigate('/resume/create')}
                >
                    이력서 작성
                </button>
            </div>

            <div className="hmk-bottom-navigation">
                <button className="nav-item active">
                    <FontAwesomeIcon icon={faHome} />
                    홈
                </button>
                <button className="nav-item">
                    <FontAwesomeIcon icon={faBriefcase} />
                    구인공고
                </button>
                <button className="nav-item">
                    <FontAwesomeIcon icon={faCalendarDays} />
                    프로그램
                </button>
                <button className="nav-item">
                    <FontAwesomeIcon icon={faUser} />
                    마이페이지
                </button>
            </div>
        </div>
    );
};

export default ResumeStart; 