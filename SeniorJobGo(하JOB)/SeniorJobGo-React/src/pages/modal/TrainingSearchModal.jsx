import React, { useState, useEffect } from 'react';
import styles from './styles/TrainingSearchModal.module.scss';

const TrainingSearchModal = ({ isOpen, onClose, onSubmit, userProfile }) => {
  const [formData, setFormData] = useState({
    city: '',
    district: '',
    interests: [],
    preferredTime: '',
    preferredDuration: ''
  });
  const [isEditing, setIsEditing] = useState(!userProfile);
  const [customInterest, setCustomInterest] = useState('');

  const cities = ['서울', '경기', '인천', '강원', '대전', '세종', '충남', '충북', '부산', '울산', '경남', '경북', '대구', '광주', '전남', '전북', '제주'];
  const commonInterests = ['사무행정', 'IT/컴퓨터', '요양보호', '조리/외식', '경비', '운전/운송', '생산/제조', '판매/영업', '건물관리'];

  const [errors, setErrors] = useState({
    city: false,
    district: false,
  });

  useEffect(() => {
    if (userProfile) {
      setFormData(userProfile);
      setIsEditing(false);
    }
  }, [userProfile]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = {
      city: !formData.city,
      district: false,
    };

    setErrors(newErrors);

    // 필수 필드 검증
    if (Object.values(newErrors).some(error => error)) {
      return;
    }

    onSubmit(formData);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const toggleInterest = (interest) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const addCustomInterest = () => {
    if (customInterest.trim() && !formData.interests.includes(customInterest.trim())) {
      setFormData(prev => ({
        ...prev,
        interests: [...prev.interests, customInterest.trim()]
      }));
      setCustomInterest('');
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2>{userProfile ? '맞춤 훈련정보 확인' : '훈련정보 검색'}</h2>
        <form onSubmit={handleSubmit} className={styles.searchForm}>
          <div className={styles.formGroup}>
            <label>희망 교육지역<span className={styles.required}>*</span></label>
            <div className={styles.locationInputs}>
              <select
                value={formData.city}
                onChange={(e) => {
                  setFormData(prev => ({ ...prev, city: e.target.value }));
                  setErrors(prev => ({ ...prev, city: false }));
                }}
                disabled={!isEditing}
              >
                <option value="">시/도 선택</option>
                {cities.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
              <input
                type="text"
                value={formData.district}
                onChange={(e) => {
                  setFormData(prev => ({ ...prev, district: e.target.value }));
                }}
                disabled={!isEditing}
                placeholder="군/구 입력"
              />
            </div>
            {errors.city && 
              <p className={styles.errorText}>희망 교육지역을 선택해주세요</p>
            }
          </div>

          <div className={styles.formGroup}>
            <label>관심 분야 (다중 선택 가능)</label>
            <div className={styles.interestButtons}>
              {commonInterests.map(interest => (
                <button
                  key={interest}
                  type="button"
                  className={`${styles.interestButton} ${formData.interests.includes(interest) ? styles.active : ''}`}
                  onClick={() => toggleInterest(interest)}
                  disabled={!isEditing}
                >
                  {interest}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.formGroup}>
            <label>선호 교육시간</label>
            <select
              value={formData.preferredTime}
              onChange={(e) => setFormData(prev => ({ ...prev, preferredTime: e.target.value }))}
              disabled={!isEditing}
            >
              <option value="">선택하세요</option>
              <option value="morning">오전 (09:00~12:00)</option>
              <option value="afternoon">오후 (13:00~17:00)</option>
              <option value="evening">저녁 (18:00~21:00)</option>
              <option value="anytime">시간 무관</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label>선호 교육기간</label>
            <select
              value={formData.preferredDuration}
              onChange={(e) => setFormData(prev => ({ ...prev, preferredDuration: e.target.value }))}
              disabled={!isEditing}
            >
              <option value="">선택하세요</option>
              <option value="short">단기 (1개월 이내)</option>
              <option value="medium">중기 (1~3개월)</option>
              <option value="long">장기 (3개월 이상)</option>
              <option value="any">기간 무관</option>
            </select>
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

export default TrainingSearchModal; 