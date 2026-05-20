import React, { useState, useEffect } from 'react';
import styles from './styles/JobSearchModal.module.scss';

const JobSearchModal = ({ isOpen, onClose, onSubmit, userProfile }) => {
  const [formData, setFormData] = useState({
    ageGroup: '',
    gender: '',
    city: '',
    district: '',
    jobType: '',
    career: ''
  });
  const [isEditing, setIsEditing] = useState(!userProfile);
  const [isRecording, setIsRecording] = useState(false);
  const [currentField, setCurrentField] = useState(null);

  const ageGroups = ['40대', '50대', '60대', '70대', '80대~'];
  const cities = ['서울', '경기', '인천', '강원', '대전', '세종', '충남', '충북', '부산', '울산', '경남', '경북', '대구', '광주', '전남', '전북', '제주'];

  const [errors, setErrors] = useState({
    ageGroup: false,
    gender: false,
    district: false,
    city: false,
  });

  useEffect(() => {
    if (userProfile) {
      setFormData(userProfile);
      setIsEditing(false);
    }
  }, [userProfile]);

  const handleSubmit = (e) => {
    e.preventDefault();

    // 유효성 검증 업데이트
    const newErrors = {
      ageGroup: !formData.ageGroup,
      gender: !formData.gender,
      district: !formData.district,
      city: !formData.city,
    };

    setErrors(newErrors);
  
    // 필수 필드 검증
    if(Object.values(newErrors).some(error => error)) {
      return;
    }
    onSubmit(formData);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  // 음성 인식 설정
  const startVoiceRecognition = (field) => {
    if (!('webkitSpeechRecognition' in window)) {
      alert('이 브라우저는 음성 인식을 지원하지 않습니다.');
      return;
    }

    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = 'ko-KR';
    recognition.onresult = (event) => {
      const text = event.results[0][0].transcript;
      setFormData(prev => ({ ...prev, [field]: text }));
      setIsRecording(false);
      setCurrentField(null);
    };

    recognition.onend = () => {
      setIsRecording(false);
      setCurrentField(null);
    };

    setIsRecording(true);
    setCurrentField(field);
    recognition.start();
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2>{userProfile ? '맞춤 정보 확인' : '채용정보 검색'}</h2>
        <form onSubmit={handleSubmit} className={styles.searchForm}>
        <div className={`${styles.formGroup} ${errors.ageGroup ? styles.hasError : ''}`}>
        <label>연령대<span className={styles.required}>*</span></label>
            <div className={styles.ageButtons}>
              {ageGroups.map(age => (
                <button
                  key={age}
                  type="button"
                  className={`${styles.ageButton} ${formData.ageGroup === age ? styles.active : ''}`}
                  onClick={() => {
                    setFormData(prev => ({ ...prev, ageGroup: age }));
                    setErrors(prev => ({ ...prev, ageGroup: false }));
                  }}
                  disabled={!isEditing}
                >
                  {age}
                </button>
              ))}
            </div>
            {errors.ageGroup && <p className={styles.errorText}>연령대를 선택해주세요</p>}
          </div>

          <div className={`${styles.formGroup} ${errors.gender ? styles.hasError : ''}`}>
          <label>성별<span className={styles.required}>*</span></label>
            <div className={styles.genderButtons}>
              <button
                type="button"
                className={`${styles.genderButton} ${formData.gender === 'male' ? styles.active : ''}`}
                onClick={() => {
                  setFormData(prev => ({ ...prev, gender: 'male' }));
                  setErrors(prev => ({ ...prev, gender: false }));
                }}
                disabled={!isEditing}
              >
                남자
              </button>
              <button
                type="button"
                className={`${styles.genderButton} ${formData.gender === 'female' ? styles.active : ''}`}
                onClick={() => {
                  setFormData(prev => ({ ...prev, gender: 'female' }));
                  setErrors(prev => ({ ...prev, gender: false }));
                }}
                disabled={!isEditing}
              >
                여자
              </button>
            </div>
            {errors.gender && <p className={styles.errorText}>성별을 선택해주세요</p>}
          </div>

          <div className={`${styles.formGroup} ${errors.city || errors.district ? styles.hasError : ''}`}>
          <label>희망근무지역<span className={styles.required}>*</span></label>
            <div className={styles.locationInputs}>
              <select
                value={formData.city}
                onChange={(e) => {
                  setFormData(prev => ({ ...prev, city: e.target.value }));
                  setErrors(prev => ({ ...prev, city: false }));
                }}
                disabled={!isEditing}
              >
                <option value="">시/도</option>
                {cities.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
              <input
                type="text"
                value={formData.district}
                onChange={(e) => {
                  setFormData(prev => ({ ...prev, district: e.target.value }));
                  setErrors(prev => ({ ...prev, district: false }));
                }}
                disabled={!isEditing}
                placeholder="군/구 입력"
              />
            </div>
            {(errors.city || errors.district) && 
              <p className={styles.errorText}>희망근무지역을 입력해주세요</p>
            }
          </div>

          <div className={styles.formGroup}>
            <label>희망직종</label>
            <div className={styles.voiceInputGroup}>
              <input
                type="text"
                value={formData.jobType}
                onChange={(e) => setFormData(prev => ({ ...prev, jobType: e.target.value }))}
                disabled={!isEditing}
                placeholder="예: 사무직, 미화, 경비"
              />
              <button
                type="button"
                className={`${styles.voiceButton} ${currentField === 'jobType' ? styles.recording : ''}`}
                onClick={() => startVoiceRecognition('jobType')}
                disabled={!isEditing}
              >
                <span className="material-symbols-rounded">
                  {currentField === 'jobType' ? 'mic' : 'mic_none'}
                </span>
              </button>
            </div>
          </div>

          <div className={styles.formGroup}>
            <label>경력사항</label>
            <div className={styles.voiceInputGroup}>
              <input
                type="text"
                value={formData.career}
                onChange={(e) => setFormData(prev => ({ ...prev, career: e.target.value }))}
                disabled={!isEditing}
                placeholder="예: 경리 3년"
              />
              <button
                type="button"
                className={`${styles.voiceButton} ${currentField === 'career' ? styles.recording : ''}`}
                onClick={() => startVoiceRecognition('career')}
                disabled={!isEditing}
              >
                <span className="material-symbols-rounded">
                  {currentField === 'career' ? 'mic' : 'mic_none'}
                </span>
              </button>
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

export default JobSearchModal; 