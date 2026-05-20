import React from 'react';

const Chart = ({ title }) => {
    return (
        <div className="hmk-manage-chart">
            <h3 className="hmk-manage-chart-title">{title}</h3>
            <div className="hmk-manage-chart-content">
                <div className="hmk-manage-chart-placeholder">
                    차트가 들어갈 자리입니다
                </div>
            </div>
        </div>
    );
};

export default Chart; 