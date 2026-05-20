import React from 'react';
import { Link } from 'react-router-dom';
import '../css/layout/LogoHeader.css';
import LOGO from '../images/LOGO.png';

/**
 * 상단 로고 헤더 컴포넌트
 * 로고 이미지를 표시하고 클릭 시 메인 페이지('/')로 이동
 */
const LogoHeaderComponent = () => {
    return (
        <header className="WS-main-header">
            <Link to="/link">
                {/* 로고 이미지 - 클릭하면 메인 페이지로 이동 */}
                <img src={LOGO} alt="My Travel Link" className="WS-Header-Logo" />
            </Link>
        </header>
    );
};

export default LogoHeaderComponent;

// 완료 ==================================================================

