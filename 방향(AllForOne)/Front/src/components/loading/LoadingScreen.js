import React from 'react';
import '../../css/components/LoadingScreen.css';

const LoadingScreen = ({ message = 'Loading...' }) => {
    return (
        <div className="loading-screen">
            <div className="loading-loader-circle"></div>
            {message && <div className="loading-loader-text">{message}</div>}
        </div>
    );
};

export default LoadingScreen;
