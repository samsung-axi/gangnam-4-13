import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import * as LucideIcons from "lucide-react";
import { HelpCircle } from "lucide-react";
import "../../css/admin/DashboardModal.css";
import ChartComponent from "./ChartComponent";

const DashboardModal = ({ isOpen, onClose }) => {
    const [isDetailPage, setIsDetailPage] = useState(false);
    const iconNames = Object.keys(LucideIcons);

    const findKeywordIcon = (keyword) => {
        if (!keyword) return HelpCircle;
        const exactMatch = iconNames.find((name) => name.toLowerCase() === keyword.toLowerCase());
        if (exactMatch) return LucideIcons[exactMatch];

        const partialMatch = iconNames.find((name) => name.toLowerCase().includes(keyword.toLowerCase()));
        if (partialMatch) return LucideIcons[partialMatch];

        const getSimilarity = (str1, str2) => {
            let matches = 0;
            const minLength = Math.min(str1.length, str2.length);
            for (let i = 0; i < minLength; i++) {
                if (str1[i] === str2[i]) matches++;
            }
            return matches / Math.max(str1.length, str2.length);
        };

        let bestMatch = { icon: HelpCircle, score: 0 };
        for (const name of iconNames) {
            const similarity = getSimilarity(name.toLowerCase(), keyword.toLowerCase());
            if (similarity > bestMatch.score) {
                bestMatch = { icon: LucideIcons[name], score: similarity };
            }
        }

        return bestMatch.icon;
    };

    const formatChange = (change) => {
        const value = parseInt(change);
        return value > 0 ? `▲${value}%` : `▼${Math.abs(value)}%`;
    };

    const keywordData = [
        { label: "청량한", count: 120, change: 17 },
        { label: "따뜻한", count: 110, change: 10 },
        { label: "겨울", count: 98, change: -5 },
        { label: "시트러스", count: 96, change: 8 },
        { label: "우디", count: 85, change: -12 },
    ];

    const perfumeData = [
        { brand: "샤넬", name: "넘버5 오 드 퍼퓸", count: 62, change: 25, image: "/images/chanel.png" },
        { brand: "딥티크", name: "필로시코스 오 드 퍼퓸", count: 58, change: 17, image: "/images/diptyque.png" },
        { brand: "조 말론", name: "우드 세이지 앤 씨 솔트 오 드 코롱", count: 49, change: -5, image: "/images/jomalone.png" },
    ];

    const perfumeDataLastWeek = [1447, 1283, 1100, 978, 856];
    const perfumeDataThisWeek = [1447, 1283, 1100, 978, 856];
    const perfumeLabels = [
        "넘버5 오 드 퍼퓸",
        "필로시코스 오 드 퍼퓸",
        "우드 세이지 앤 씨 솔트 오 드 코롱",
        "블랑쉬 오 드 퍼퓸",
        "엔젤스 웨어 오 드 퍼퓸",
    ];

    const keywordDataLastWeek = [958, 976, 1102, 1228, 1362];
    const keywordDataThisWeek = keywordData.map((item) => item.count);
    const keywordLabels = keywordData.map((item) => item.label);

    const top3Keywords = keywordData.slice(0, 3);
    const top3Perfumes = perfumeData.slice(0, 3);

    const goToDetailPage = () => setIsDetailPage(true);
    const goBackToMainPage = () => setIsDetailPage(false);

    useEffect(() => {
        console.log(isDetailPage ? "상세 페이지로 이동" : "메인 페이지로 돌아가기");
    }, [isDetailPage]);

    if (!isOpen) return null;

    return (
        <div className="dashboard-modal-overlay" onClick={onClose}>
            <div className="dashboard-modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="dashboard-close-button" onClick={onClose}>
                    <X size={24} />
                </button>

                <button className="dashboard-toggle-button" onClick={isDetailPage ? goBackToMainPage : goToDetailPage}>
                    {isDetailPage ? "< 돌아가기" : "상세 페이지 보기 >"}
                </button>

                {!isDetailPage && (
                    <div key="mainPage" className="dashboard-section">
                        <h2 className="dashboard-section-title">주간 인기 키워드</h2>
                        <div className="dashboard-grid">
                            {top3Keywords.map(({ label, count, change }) => {
                                const IconComponent = findKeywordIcon(label);
                                return (
                                    <div key={label} className="dashboard-card">
                                        <div className="dashboard-card-inner">
                                            <IconComponent size={40} className="dashboard-card-icon" />
                                            <h3 className="dashboard-card-label">{label}</h3>
                                            <p className="dashboard-card-stats">사용자의 선택 횟수: {count}회</p>
                                            <p className="dashboard-card-change">지난 주 대비 {formatChange(change)}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <h2 className="dashboard-section-title">주간 인기 향수</h2>
                        <div className="dashboard-grid">
                            {top3Perfumes.map(({ brand, name, count, change, image }) => (
                                <div key={name} className="dashboard-card">
                                    <div className="dashboard-card-inner">
                                        <img src={image} alt={brand} className="dashboard-card-perfume" />
                                        <h3 className="dashboard-card-label">{brand}</h3>
                                        <p className="dashboard-card-name">{name}</p>
                                        <p className="dashboard-card-stats">추천 횟수: {count}회</p>
                                        <p className="dashboard-card-change">지난 주 대비 {formatChange(change)}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {isDetailPage && (
                    <div className="dashboard-section">
                        <h2 className="dashboard-section-title">주간 인기 키워드</h2>
                        <div className="chart-container">
                            <ChartComponent title="지난주 인기 키워드" labels={keywordLabels} data={keywordDataLastWeek} />
                            <ChartComponent title="이번주 인기 키워드" labels={keywordLabels} data={keywordDataThisWeek} />
                        </div>

                        <h2 className="dashboard-section-title">주간 인기 향수</h2>
                        <div className="chart-container">
                            <ChartComponent title="지난주 인기 향수" labels={perfumeLabels} data={perfumeDataLastWeek} />
                            <ChartComponent title="이번주 인기 향수" labels={perfumeLabels} data={perfumeDataThisWeek} />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DashboardModal;
