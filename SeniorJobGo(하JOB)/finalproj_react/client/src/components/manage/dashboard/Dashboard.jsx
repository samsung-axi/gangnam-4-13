import React from 'react';
import StatCard from './StatCard';
import Chart from './Chart';

const Dashboard = () => {
    const stats = [
        { title: "총 사용자", value: "1,234", trend: "+12%" },
        { title: "오늘의 방문자", value: "156", trend: "+5%" },
        { title: "이력서 작성 수", value: "89", trend: "+8%" },
        { title: "챗봇 상담 수", value: "432", trend: "+15%" }
    ];

    return (
        <div className="hmk-manage-dashboard">
            <div className="hmk-manage-section-header">
                <h1>대시보드</h1>
            </div>
            
            <div className="hmk-manage-stats">
                {stats.map((stat, index) => (
                    <StatCard 
                        key={index}
                        title={stat.title}
                        value={stat.value}
                        trend={stat.trend}
                    />
                ))}
            </div>

            <div className="hmk-manage-charts">
                <Chart title="사용자 통계" />
                <Chart title="이력서 작성 현황" />
            </div>
        </div>
    );
};

export default Dashboard; 