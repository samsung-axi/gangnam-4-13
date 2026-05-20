import React, { useState, useEffect } from 'react';
import styles from './styles/PolicySearchModal.module.scss';
import { API_BASE_URL } from '@/config';

const PolicyCard = ({ policy }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className={styles.policyCard}>
      <div 
        className={styles.policyHeader} 
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <h3>{policy.제목}</h3>
        <div className={styles.policyMeta}>
          <span>출처: {policy.출처}</span>
          <span>대상: {policy.지원_대상}</span>
        </div>
      </div>
      
      <div className={`${styles.policyDetails} ${isExpanded ? styles.expanded : ''}`}>
        <div className={styles.detailsGrid}>
          <div className={styles.detailItem}>
            <h4>주요 내용</h4>
            <p>{policy.주요_내용}</p>
          </div>
          <div className={styles.detailItem}>
            <h4>신청 방법</h4>
            <p>{policy.신청_방법}</p>
          </div>
          <div className={styles.detailItem}>
            <h4>연락처</h4>
            <p>{policy.연락처}</p>
          </div>
        </div>
        
        {policy.URL && (
          <div className={styles.actionButtons}>
            <a 
              href={policy.URL} 
              target="_blank" 
              rel="noopener noreferrer" 
              className={styles.viewButton}
            >
              자세히 보기
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

const PolicySearchModal = ({ isOpen, onClose, onSubmit }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    searchQuery: false,
  });

  const searchTags = ['노인일자리', '노인복지', '기초연금', '장기요양', '돌봄서비스', '주거지원', '노후보장', '건강관리'];

  const handleTagClick = (e, tag) => {
    e.preventDefault();  // 버튼 기본 동작 방지
    setSearchQuery(tag);  // 검색어 설정
  };

  const handleSearch = async (e) => {
    e.preventDefault();

    const newErrors = {
      searchQuery: !searchQuery.trim(), // 검색어가 비어있는지 확인
    };

    setErrors(newErrors);

    // 필수 필드 검증
    if(Object.values(newErrors).some(error => error)) {
      return;
    }

    onSubmit(searchQuery);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2>정책 정보 검색</h2>
        <form onSubmit={handleSearch} className={styles.searchForm}>
          <div className={`${styles.formGroup}`}>
            <label>검색어<span className={styles.required}>*</span></label>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="검색어를 입력해주세요"
              className={styles.searchInput}
            />
          </div>
          {errors.searchQuery && 
            <p className={styles.errorText}>검색어를 입력해주세요</p>
          }
          <h4 className={styles.recommendationTitle}>추천 검색어</h4>
          <div className={styles.searchTags}>
            <div className={styles.searchTagsInner}>
              {searchTags.map((tag) => (
                <button
                  key={tag}
                  type="button"  // type을 button으로 변경
                  onClick={(e) => handleTagClick(e, tag)}
                  className={styles.tagButton}
                >
                  #{tag}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.buttonGroup}>
            <button type="button" onClick={onClose} className={styles.cancelButton}>
              취소
            </button>
            <button type="submit" className={styles.submitButton}>
              검색하기
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PolicySearchModal; 