import React from 'react';
import PropTypes from 'prop-types';
// import styles from '../styles/chat.module.scss';
import styles from '../styles/commonCard.module.scss';

const TrainingCard = ({ training, onClick, isSelected, cardRef }) => (
  <div
    ref={cardRef}
    className={`${styles.trainingCard} ${isSelected ? styles.selected : ''}`}
    onClick={() => onClick(training)}
    data-training-id={training.id}
  >
    <div className={styles.trainingCard__header}>
      <div className={styles.trainingCard__institute}>
        <span className={styles.icon}>🏫</span>
        {training.institute}
      </div>
      <div className={styles.trainingCard__location}>{training.location}</div>
    </div>
    <h3 className={styles.trainingCard__title}>{training.title}</h3>
    <div className={styles.trainingCard__details}>
      <div className={styles.trainingCard__detail}>
        <span className={styles.icon}>📅</span>
        {training.period}
      </div>
      <div className={styles.trainingCard__detail}>
        <span className={styles.icon}>💰</span>
        {training.cost}
      </div>
      <div className={styles.trainingCard__detail}>
        <span className={styles.icon}>👥</span>
        정원 {training.yardMan}명
      </div>
    </div>

    <div className={`${styles.trainingCard__description} ${isSelected ? styles.visible : ''}`}>
      <p data-label="훈련기관">{training.institute}</p>
      <p data-label="훈련대상">{training.target}</p>
      <p data-label="훈련기간">{training.period}</p>
      <p data-label="시작일">{training.startDate}</p>
      <p data-label="종료일">{training.endDate}</p>
      <p data-label="수강료">{training.cost}</p>
      <p data-label="정원">{training.yardMan}명</p>
      <p data-label="문의전화">{training.telNo}</p>
      <p data-label="훈련내용">{training.description}</p>
    </div>

    <div className={`${styles.trainingCard__footer} ${isSelected ? styles.visible : ''}`}>
      <a
        href={training.titleLink}
        target="_blank"
        rel="noopener noreferrer"
        className={styles.trainingCard__button}
      >
        상세정보 보기
      </a>
    </div>
  </div>
);

TrainingCard.propTypes = {
  training: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    institute: PropTypes.string.isRequired,
    period: PropTypes.string,
    cost: PropTypes.string,
    target: PropTypes.string,
    description: PropTypes.string,
    titleLink: PropTypes.string
  }).isRequired,
  onClick: PropTypes.func,
  isSelected: PropTypes.bool,
  cardRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.instanceOf(Element) })
  ])
};

export default TrainingCard; 