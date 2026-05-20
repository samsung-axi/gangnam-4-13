import { useState, useEffect } from 'react';

const themes = [
    'spicy', 'fruity', 'citrus', 'green', 'aldehyde', 
    'aquatic', 'fougere', 'gourmand', 'woody', 'oriental', 
    'floral', 'musk', 'powdery', 'amber', 'tobacco-leather'
];

// 랜덤으로 테마를 선택하는 헬퍼 함수
const getRandomTheme = () => {
    return themes[Math.floor(Math.random() * themes.length)];
};

// 테마를 자동으로 변경하는 커스텀 훅
export const useTheme = (interval = 3000) => {
    // 현재 테마 상태 관리
    const [currentTheme, setCurrentTheme] = useState(getRandomTheme());

    // interval 마다 테마 자동 변경
    useEffect(() => {
        const themeTimer = setInterval(() => {
            setCurrentTheme(getRandomTheme());
        }, interval);
        return () => clearInterval(themeTimer);
    }, [interval]);

    return currentTheme;
};
