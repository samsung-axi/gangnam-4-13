import React from 'react';

const StatCard = ({ title, value, trend }) => {
    const isTrendPositive = trend.startsWith('+');
    
    return (
        <div className="hmk-manage-stat-card">
            <h3 className="hmk-manage-stat-title">{title}</h3>
            <div className="hmk-manage-stat-value">{value}</div>
            <div className={`hmk-manage-stat-trend ${isTrendPositive ? 'positive' : 'negative'}`}>
                {trend}
            </div>
        </div>
    );
};

export default StatCard; 