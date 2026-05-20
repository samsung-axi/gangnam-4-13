import React from 'react';

const Header = () => {
    return (
        <header className="hmk-manage-header">
            <div className="hmk-manage-header-left">
                <h2>관리자 대시보드</h2>
            </div>
            <div className="hmk-manage-header-right">
                <div className="hmk-manage-search">
                    <input type="search" placeholder="검색..." />
                </div>
                <div className="hmk-manage-user-menu">
                    <span className="hmk-manage-notification">🔔</span>
                    <div className="hmk-manage-profile">
                        <span>관리자</span>
                        <img src="/admin-avatar.png" alt="관리자" />
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header; 