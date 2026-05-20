import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../assets/css/register.css';

const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        userId: '',
        password: '',
        passwordConfirm: '',
    });
    const [agreements, setAgreements] = useState({
        terms: false,
        privacy: false,
    });
    const [isFormValid, setIsFormValid] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleCheckboxChange = (e) => {
        const { name, checked } = e.target;
        setAgreements(prev => ({
            ...prev,
            [name]: checked
        }));
    };

    useEffect(() => {
        // 모든 필드가 채워져있고 비밀번호가 일치하며 약관에 모두 동의했는지 확인
        const isValid = 
            formData.userId.length >= 5 && 
            formData.password.length >= 8 && 
            formData.password === formData.passwordConfirm &&
            agreements.terms && 
            agreements.privacy;
        
        setIsFormValid(isValid);
    }, [formData, agreements]);

    return (
        <div className="hmk-form-section">
            <div className="hmk-form-header">
                <button 
                    className="hmk-back-button"
                    onClick={() => navigate(-1)}
                >
                    ←
                </button>
                <h1 className="hmk-form-title">회원가입</h1>
            </div>

            <form className="hmk-register-form">
                <div className="hmk-form-content">
                    <div className="hmk-input-group">
                        <label>아이디<span className="required">*</span></label>
                        <div className="hmk-input-with-button">
                            <input 
                                type="text" 
                                name="userId"
                                value={formData.userId}
                                onChange={handleInputChange}
                                placeholder="5~20자 영문 혹은 영문+숫자 조합"
                                className="hmk-input"
                            />
                            <button type="button" className="hmk-check-button">중복확인</button>
                        </div>
                    </div>

                    <div className="hmk-input-group">
                        <label>비밀번호<span className="required">*</span></label>
                        <input 
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            placeholder="비밀번호를 입력해주세요"
                            className="hmk-input"
                        />
                    </div>

                    <div className="hmk-input-group">
                        <label>비밀번호 확인<span className="required">*</span></label>
                        <input 
                            type="password"
                            name="passwordConfirm"
                            value={formData.passwordConfirm}
                            onChange={handleInputChange}
                            placeholder="비밀번호를 다시 입력해주세요"
                            className="hmk-input"
                        />
                        <p className="hmk-input-hint">비밀번호는 8자 이상, 2개 이상 문자를 조합해주세요.</p>
                    </div>

                    <div className="hmk-agreement-section">
                        <h2 className="hmk-agreement-title">
                            시니어잡고 이용을 위한<br />
                            약관에 <span className="highlight">동의</span>해주세요.
                        </h2>
                        
                        <div className="hmk-agreement-items">
                            <div className="hmk-agreement-item">
                                <label htmlFor="terms">
                                    플랫폼 이용약관 <span className="required">[필수]</span>
                                </label>
                                <input 
                                    type="checkbox" 
                                    id="terms"
                                    name="terms"
                                    checked={agreements.terms}
                                    onChange={handleCheckboxChange}
                                />
                            </div>
                            <div className="hmk-agreement-item">
                                <label htmlFor="privacy">
                                    개인정보 수집 및 이용 동의 <span className="required">[필수]</span>
                                </label>
                                <input 
                                    type="checkbox" 
                                    id="privacy"
                                    name="privacy"
                                    checked={agreements.privacy}
                                    onChange={handleCheckboxChange}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="hmk-form-footer">
                    <button 
                        type="submit" 
                        className="hmk-register-button"
                        disabled={!isFormValid}
                    >
                        가입하기
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Register; 