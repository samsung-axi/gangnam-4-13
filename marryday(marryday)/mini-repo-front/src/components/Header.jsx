import React from 'react'
import '../styles/Header.css'

const Header = ({ onBackToMain }) => {
    return (
        <header className={`header ${onBackToMain ? 'header-fitting' : ''}`}>
            <div className="header-content">
                {onBackToMain && (
                    <button className="back-to-main-button" onClick={onBackToMain}>
                        메인으로
                    </button>
                )}
                <div className="logo">
                    <h1 className="logo-text">Marry Day</h1>
                </div>
            </div>
        </header>
    )
}

export default Header

