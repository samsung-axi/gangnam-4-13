import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { locationData } from '../../constants/locationData';
import { jobCategories } from '../../constants/jobData';
import '../../assets/css/introstep.css';

const IntroStep = () => {
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();
  
  const [formData, setFormData] = useState({
    birthYear: '',
    birthMonth: '',
    birthDay: '',
    gender: '',
    city: '',
    district: '',
    jobCategory: '',
    jobSubCategory: '',
    customJob: ''
  });
  
  const [age, setAge] = useState(null);
  const [isFormValid, setIsFormValid] = useState(false);

  // 생년월일 옵션 생성
  const years = Array.from({length: 80}, (_, i) => currentYear - 80 + i);
  const months = Array.from({length: 12}, (_, i) => i + 1);
  const days = Array.from({length: 31}, (_, i) => i + 1);

  // 나이 계산
  useEffect(() => {
    if (formData.birthYear && formData.birthMonth && formData.birthDay) {
      const birthDate = new Date(formData.birthYear, formData.birthMonth - 1, formData.birthDay);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      setAge(age);
    }
  }, [formData.birthYear, formData.birthMonth, formData.birthDay]);

  // 폼 유효성 검사
  useEffect(() => {
    const isValid = formData.birthYear && formData.birthMonth && formData.birthDay && 
                   formData.gender && formData.city && formData.district && 
                   (formData.jobCategory && formData.jobSubCategory || formData.customJob);
    setIsFormValid(isValid);
  }, [formData]);

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
      ...(field === 'city' ? { district: '' } : {}),
      ...(field === 'jobCategory' ? { jobSubCategory: '' } : {})
    }));
  };

  const handleNext = () => {
    navigate('/resume/create', { state: { formData } });
  };

  const handleSkip = () => {
    navigate('/resume/create');
  };

  return (
    <div className="hmk_introstep_container">
      <header className="hmk_introstep_header">
        <button className="hmk_introstep_back_button" onClick={() => navigate(-1)}>←</button>
        <h1>희망근무조건</h1>
      </header>

      <div className="hmk_introstep_form_section">
        <div className="hmk_introstep_form_group">
          <label>생년월일을 선택해주세요.</label>
          <div className="hmk_introstep_date_select_group">
            <select 
              className="hmk_introstep_select"
              value={formData.birthYear} 
              onChange={(e) => handleChange('birthYear', e.target.value)}
            >
              <option value="">년도</option>
              {years.map(year => (
                <option key={year} value={year}>{year}년</option>
              ))}
            </select>
            <select 
              className="hmk_introstep_select"
              value={formData.birthMonth} 
              onChange={(e) => handleChange('birthMonth', e.target.value)}
            >
              <option value="">월</option>
              {months.map(month => (
                <option key={month} value={month}>{month}월</option>
              ))}
            </select>
            <select 
              className="hmk_introstep_select"
              value={formData.birthDay} 
              onChange={(e) => handleChange('birthDay', e.target.value)}
            >
              <option value="">일</option>
              {days.map(day => (
                <option key={day} value={day}>{day}일</option>
              ))}
            </select>
            {age && <span className="hmk_introstep_age_display">만 {age}세</span>}
          </div>
        </div>

        <div className="hmk_introstep_form_group">
          <label>성별을 선택해주세요.</label>
          <div className="hmk_introstep_gender_group">
            <button
              type="button"
              className={`hmk_introstep_gender_button ${formData.gender === 'male' ? 'selected' : ''}`}
              onClick={() => handleChange('gender', 'male')}
            >
              남자
            </button>
            <button
              type="button"
              className={`hmk_introstep_gender_button ${formData.gender === 'female' ? 'selected' : ''}`}
              onClick={() => handleChange('gender', 'female')}
            >
              여자
            </button>
          </div>
        </div>

        <div className="hmk_introstep_form_group">
          <label>현재 거주중인 지역은 어디신가요?</label>
          <div className="hmk_introstep_location_select_group">
            <select 
              className="hmk_introstep_select"
              value={formData.city}
              onChange={(e) => handleChange('city', e.target.value)}
            >
              <option value="">시/도 선택</option>
              {Object.keys(locationData).map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
            {formData.city && (
              <select 
                className="hmk_introstep_select"
                value={formData.district}
                onChange={(e) => handleChange('district', e.target.value)}
              >
                <option value="">시/군/구 선택</option>
                {locationData[formData.city].map(district => (
                  <option key={district} value={district}>{district}</option>
                ))}
              </select>
            )}
          </div>
        </div>

        <div className="hmk_introstep_form_group">
          <label>희망 직무를 선택해주세요.</label>
          <div className="hmk_introstep_job_container">
            <div className="hmk_introstep_job_selects">
              <select 
                className="hmk_introstep_select"
                value={formData.jobCategory}
                onChange={(e) => handleChange('jobCategory', e.target.value)}
              >
                <option value="">직종 선택</option>
                {Object.keys(jobCategories).map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              {formData.jobCategory && (
                <select 
                  className="hmk_introstep_select"
                  value={formData.jobSubCategory}
                  onChange={(e) => handleChange('jobSubCategory', e.target.value)}
                >
                  <option value="">세부 직종 선택</option>
                  {jobCategories[formData.jobCategory].map(subCategory => (
                    <option key={subCategory} value={subCategory}>{subCategory}</option>
                  ))}
                </select>
              )}
            </div>
            <input
              type="text"
              placeholder="직접 입력"
              value={formData.customJob}
              onChange={(e) => handleChange('customJob', e.target.value)}
              className="hmk_introstep_custom_job_input"
            />
          </div>
        </div>
      </div>

      <div className="hmk_introstep_button_group">
        <button 
          className={`hmk_introstep_next_button ${isFormValid ? 'active' : ''}`}
          onClick={handleNext}
          disabled={!isFormValid}
        >
          다음
        </button>
        <button className="hmk_introstep_skip_button" onClick={handleSkip}>
          다음에 선택하기
        </button>
      </div>
    </div>
  );
};

export default IntroStep; 