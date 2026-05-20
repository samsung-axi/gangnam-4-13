import React from 'react';

import styles from '../styles/commonCard.module.scss';

const PolicyCard = ({ policy, onClick, isSelected, cardRef }) => {
  return (
    <div
      ref={cardRef}
      className={`${styles.policyCard} ${isSelected ? styles.selected : ''}`}
      onClick={() => onClick(policy)}
      data-policy-id={policy.id}
    >
      <div className={styles.policyCard__header}>
        <div className={styles.policyCard__department}>
          <span className={`material-symbols-rounded`}>account_balance</span>
          {policy.source}
        </div>
        <div className={styles.policyCard__date}>{policy.publishDate}</div>
      </div>
      
      <h3 className={styles.policyCard__title}>
        {policy.title !== '정보 없음' ? policy.title : '제목 없음'}
      </h3>
      
      {/* tags가 있을 때만 렌더링 */}
      {policy.tags && policy.tags.length > 0 && (
        <div className={styles.policyCard__tags}>
          {policy.tags.map((tag, index) => (
            <span key={`${policy.id}-tag-${index}`} className={styles.policyCard__tag}>
              {tag}
            </span>
          ))}
        </div>
      )}

      <div className={`${styles.policyCard__description} ${isSelected ? styles.visible : ''}`}>
        <p data-label="지원대상">{policy.target}</p>
        <p data-label="지원내용">{policy.content !== '정보 없음' ? policy.content : '상세 내용이 없습니다.'}</p>
        <p data-label="신청방법">{policy.applyMethod}</p>
        <p data-label="신청기간">{policy.applicationPeriod}</p>
        <p data-label="지원유형">{policy.supplytype}</p>
        <p data-label="문의처">{policy.contact}</p>
      </div>

      {policy.url && (
        <div className={`${styles.policyCard__footer} ${isSelected ? styles.visible : ''}`}>
          <a
            href={policy.url}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.policyCard__button}
            onClick={(e) => e.stopPropagation()}
          >
            자세히 보기
          </a>
        </div>
      )}
    </div>
  );
};

export default PolicyCard; 
