import React from 'react';
import styles from './styles/GuideModal.module.scss';

const GuideModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const guides = [
    {
      title: "AI 맞춤 추천",
      description: "AI가 경력, 관심사, 선호도를 분석하여\n최적화된 채용정보와 교육과정을 추천해드립니다.",
      icon: "check_circle"
    },
    {
      title: "음성 검색 기능",
      description: "번거로운 타이핑 없이, 음성으로 편리하게\n챗봇과 대화를 이어나가세요.",
      icon: "record_voice_over"
    },
    {
      title: "실시간 채용·훈련정보",
      description: "매일 업데이트되는 채용정보와 교육과정,\nAI를 통해 추천을 받아보세요.",
      icon: "update"
    }
  ];

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2>시니어JobGo 이용안내</h2>
        <div className={styles.guideList}>
          {guides.map((guide, index) => (
            <div key={index} className={styles.guideItem}>
              <span className="material-symbols-rounded">{guide.icon}</span>
              <div className={styles.guideText}>
                <h3>{guide.title}</h3>
                <p>{guide.description}</p>
              </div>
            </div>
          ))}
        </div>
        <button className={styles.closeButton} onClick={onClose}>
          확인
        </button>
      </div>
    </div>
  );
};

export default GuideModal; 