import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
    return (
        <div className="hmk-manage-sidebar">
            <div className="hmk-manage-logo">
                <span>시니어JobGo</span>
                <span className="hmk-manage-logo-sub">관리자</span>
            </div>
            <nav className="hmk-manage-nav">
                <ul>
                    <li>
                        <Link to="/manage/dashboard">대시보드</Link>
                    </li>
                    <li>
                        <Link to="/manage/users">사용자 관리</Link>
                    </li>
                    <li>
                        <Link to="/manage/content">콘텐츠 관리</Link>
                    </li>
                    <li>
                        <Link to="/manage/chatbot">AI 챗봇 관리</Link>
                    </li>
                    <li>
                        <Link to="/manage/resume">이력서 작성 지원</Link>
                    </li>
                    <li>
                        <Link to="/manage/recommend">추천 시스템 관리</Link>
                    </li>
                </ul>
            </nav>
        </div>
    );
};

export default Sidebar; 