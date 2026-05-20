import React from 'react';
import styles from '../../../css/chat/SaveScentButton.module.css';
import BookmarkAddIcon from '@mui/icons-material/BookmarkAdd';
import { useRecommendation } from '../../../pages/chat/hooks/useRecommendation';

const SaveScentButton = ({ chatId }) => {
    const { handleCreateScentCard } = useRecommendation();

    const handleSaveScent = async () => {
        try {
            await handleCreateScentCard(chatId);
        } catch (error) {
            console.error("향기 카드 생성 실패:", error);
        }
    };

    return (
        <button 
            className={styles.saveScentButton}
            onClick={handleSaveScent}
        >
            <BookmarkAddIcon sx={{ fontSize: 24 }} />
            <span>향기 기록하기</span>
            <div className={styles.buttonEffect} />
        </button>
    );
};

export default SaveScentButton;