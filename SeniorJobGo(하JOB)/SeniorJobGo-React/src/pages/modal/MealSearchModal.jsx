import React, { useState, useEffect } from 'react';
import styles from './styles/JobSearchModal.module.scss';
import modalStyles from './styles/MealSearchModal.module.scss';
import MealCard from '../chat/components/MealCard';

const MealSearchModal = ({ isOpen, onClose, onSubmit, userProfile }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isEditing, setIsEditing] = useState(!userProfile);
  const [isRecording, setIsRecording] = useState(false);
  const [currentField, setCurrentField] = useState(null);

  const searchTags = ['종로구', '강남구', '영등포구', '관악구', '용산구'];

  const [errors, setErrors] = useState({
    searchQuery: false,
  });

  useEffect(() => {
    if (userProfile) {
      setSearchQuery(userProfile.searchQuery || '');
      setIsEditing(false);
    }
  }, [userProfile]);

  const handleTagClick = (e, tag) => {
    e.preventDefault();  // 버튼 기본 동작 방지
    setSearchQuery(tag);  // 검색어 설정
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = {
      searchQuery: !searchQuery.trim()
    };

    setErrors(newErrors);
  
    // 필수 필드 검증
    if (Object.values(newErrors).some(error => error)) {
      return;
    }
    onSubmit(searchQuery);
  };

  const handleEdit = () => {
    setIsEditing(true);
    setCurrentField('searchQuery');
  };

  // 음성 인식 설정
  const startVoiceRecognition = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert('이 브라우저는 음성 인식을 지원하지 않습니다.');
      return;
    }

    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = 'ko-KR';
    recognition.onresult = (event) => {
      const text = event.results[0][0].transcript;
      setSearchQuery(text);
      setIsRecording(false);
      setCurrentField(null);
    };

    recognition.onend = () => {
      setIsRecording(false);
      setCurrentField(null);
    };

    setIsRecording(true);
    recognition.start();
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2>{userProfile ? '맞춤 정보 확인' : '무료급식소 검색'}</h2>
        <form onSubmit={handleSubmit} className={styles.searchForm}>
          <div className={`${styles.formGroup} ${errors.searchQuery ? styles.hasError : ''}`}>
            <label>검색어<span className={styles.required}>*</span></label>
            <div className={styles.voiceInputGroup}>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                disabled={!isEditing}
                placeholder="지역명을 입력해주세요"
              />
              <button
                type="button"
                className={`${styles.voiceButton} ${currentField === 'searchQuery' ? styles.recording : ''}`}
                onClick={startVoiceRecognition}
                disabled={!isEditing}
              >
                <span className="material-symbols-rounded">
                  {currentField === 'searchQuery' ? 'mic' : 'mic_none'}
                </span>
              </button>
            </div>
            {errors.searchQuery && <p className={styles.errorText}>지역명을 입력해주세요</p>}
          </div>
          <h4 className={modalStyles.recommendationTitle}>추천 검색어</h4>
          <div className={modalStyles.searchTags}>
            <div className={modalStyles.searchTagsInner}>
              {searchTags.map((tag) => (
                <button
                  key={tag}
                  type="button"  // type을 button으로 변경
                  onClick={(e) => handleTagClick(e, tag)}
                  className={modalStyles.tagButton}
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
            {userProfile && !isEditing ? (
              <>
                <button type="button" onClick={handleEdit} className={styles.editButton}>
                  수정하기
                </button>
                <button type="submit" className={styles.submitButton}>
                  검색하기
                </button>
              </>
            ) : (
              <button type="submit" className={styles.submitButton}>
                검색하기
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default MealSearchModal; 