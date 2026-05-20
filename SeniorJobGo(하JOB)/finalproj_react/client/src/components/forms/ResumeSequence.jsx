import React, { useState, useEffect, useRef, memo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMicrophone, faArrowLeft, faCheck, faArrowDown } from '@fortawesome/free-solid-svg-icons';
import '../../assets/css/resumeSequence.css';
import { voiceService } from '../../api/voiceService';
import { useVoiceRecording } from '../../hooks/useVoiceRecording';
import axios from 'axios';

// 미리 녹음된 안내 음성 파일 경로 수정
const audioGuides = {
    1: `${process.env.REACT_APP_API_URL}/static/audio/guides/name_question.mp3`,
    2: `${process.env.REACT_APP_API_URL}/static/audio/guides/age_question.mp3`,
    3: `${process.env.REACT_APP_API_URL}/static/audio/guides/phone_question.mp3`,
    4: `${process.env.REACT_APP_API_URL}/static/audio/guides/address_question.mp3`
};

// AgeButtonGroup 컴포넌트 수정
const AgeButtonGroup = memo(({ value, onChange, isCompleted, onConfirm, step }) => {
    const [isEditing, setIsEditing] = useState(false);

    const handleAgeSelect = (age) => {
        onChange('age', age);
    };

    const handleClick = () => {
        if (isCompleted) {
            setIsEditing(true);
        }
    };

    return (
        <div className="hmk-input-area">
            <div className="hmk-input-container">
                <div className="hmk-age-buttons">
                    {['50대', '60대', '70대', '80대', '90대 이상'].map((age) => (
                        <button
                            key={age}
                            type="button"
                            className={`hmk-age-button ${value === age ? 'selected' : ''} ${isCompleted && !isEditing ? 'completed' : ''}`}
                            onClick={() => handleAgeSelect(age)}
                        >
                            {age}
                        </button>
                    ))}
                </div>
            </div>
            <div className={`hmk-confirm-button-wrapper ${value ? 'show' : ''}`}>
                <button 
                    className="hmk-confirm-button"
                    onClick={() => onConfirm(step)}
                >
                    확인
                </button>
            </div>
        </div>
    );
});

// Section 컴포넌트를 파일 최상단으로 분리
const Section = memo(({ step, question, field, value, onChange, onConfirm, isCompleted, currentStep, sectionsRef }) => {
    const sectionRef = useRef(null);
    const [isEditing, setIsEditing] = useState(false);  // 편집 모드 상태 추가
    const [editValue, setEditValue] = useState(value);  // 편집 중인 값 상태 추가

    // sectionsRef에 현재 섹션의 ref 등록
    useEffect(() => {
        sectionsRef.current[step] = sectionRef.current;
    }, [step, sectionsRef]);

    useEffect(() => {
        setEditValue(value);
    }, [value]);

    // 입력 핸들러
    const handleChange = (e) => {
        const newValue = e.target.value;
        setEditValue(newValue);
        onChange(field, newValue);
    };

    // 입력 필드 클릭 핸들러
    const handleInputClick = () => {
        if (isCompleted) {
            setIsEditing(true);
            setEditValue('');  // 기존 값 초기화
        }
    };

    // 편집 완료 핸들러
    const handleEditComplete = () => {
        if (editValue.trim()) {
            setIsEditing(false);
            onConfirm(step);
        }
    };

    // 입력값 초기화 핸들러
    const handleClear = (e) => {
        e.stopPropagation();  // 이벤트 버블링 방지
        onChange(field, '');
    };

    return (
        <div ref={sectionRef} className={`hmk-sequence-section ${isCompleted ? 'completed' : ''} ${currentStep === step ? 'active' : ''}`}>
            <div className="hmk-sequence-content">
                <h2 className="hmk-sequence-question">{question}</h2>
                {field === 'age' ? (
                    <AgeButtonGroup
                        value={value}
                        onChange={onChange}
                        isCompleted={isCompleted}
                        onConfirm={onConfirm}
                        step={step}
                    />
                ) : (
                    <div className="hmk-input-area">
                        <div className="hmk-input-container">
                            <div className="hmk-input-wrapper">
                                <input
                                    type={field === 'phone' ? 'tel' : 'text'}
                                    className={`hmk-sequence-input ${isCompleted && !isEditing ? 'completed' : ''}`}
                                    value={isEditing ? editValue : value}
                                    onChange={handleChange}
                                    onClick={handleInputClick}
                                    placeholder={field === 'phone' ? '전화번호를 입력해주세요' : 
                                               field === 'address' ? '주소를 입력해주세요' : '입력해주세요'}
                                />
                                {value && (
                                    <button 
                                        className="hmk-clear-button"
                                        onClick={handleClear}
                                        type="button"
                                    >
                                        ×
                                    </button>
                                )}
                            </div>
                            <button 
                                className="hmk-voice-button"
                                onClick={() => onConfirm(step)}
                            >
                                <FontAwesomeIcon icon={faMicrophone} />
                            </button>
                        </div>
                        <div className={`hmk-confirm-button-wrapper ${((isEditing && editValue.trim()) || (!isCompleted && value.trim())) ? 'show' : ''}`}>
                            <button 
                                className="hmk-confirm-button"
                                onClick={isEditing ? handleEditComplete : () => onConfirm(step)}
                            >
                                {isEditing ? '수정 완료' : '확인'}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
});

const ResumeSequence = () => {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState(() => {
        // 로컬 스토리지에서 기존 데이터 불러오기
        const savedData = localStorage.getItem('resumeFormData');
        return savedData ? JSON.parse(savedData) : {
            name: '',
            age: '',
            phone: '',
            address: '',
        };
    });
    const [isListening, setIsListening] = useState(false);
    const [completedSteps, setCompletedSteps] = useState([]);
    const sectionsRef = useRef([]);
    const { isRecording, error, startRecording, checkSilence } = useVoiceRecording();
    const [isProcessing, setIsProcessing] = useState(false);

    // 폼 데이터가 변경될 때마다 로컬 스토리지에 저장
    useEffect(() => {
        const timer = setTimeout(() => {
            localStorage.setItem('resumeFormData', JSON.stringify(formData));
        }, 500); // 디바운스 시간 설정

        return () => clearTimeout(timer);
    }, [formData]);

    // 모든 단계가 완료되었는지 확인
    const isAllCompleted = completedSteps.length === 4;

    // 폼 제출 처리
    const handleSubmit = async () => {
        try {
            // 서버로 데이터 전송
            const response = await axios.post('http://localhost:8000/api/voice/resume', formData);
            if (response.data.success) {
                // 성공 시 로컬 스토리지 클리어
                localStorage.removeItem('resumeFormData');
                // 다음 페이지로 이동
                navigate('/success');
            }
        } catch (error) {
            console.error('폼 제출 중 오류:', error);
        }
    };

    // speak 함수 수정
    const speak = useCallback(async (step) => {
        console.log(`speak 함수 호출: step ${step}`);
        try {
            const audioUrl = audioGuides[step];
            console.log('오디오 URL:', audioUrl);

            const response = await fetch(audioUrl);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const blob = await response.blob();
            const audio = new Audio(URL.createObjectURL(blob));
            
            audio.playsinline = true;
            audio.preload = 'auto';
            
            return new Promise((resolve) => {
                audio.oncanplaythrough = () => {
                    const playPromise = audio.play();
                    if (playPromise !== undefined) {
                        playPromise
                            .then(() => {
                                console.log('오디오 재생 시작');
                            })
                            .catch(error => {
                                console.error('오디오 재생 실패:', error);
                                resolve();
                            });
                    }
                };
                
                audio.onended = () => {
                    URL.revokeObjectURL(audio.src); // 메모리 해제
                    resolve();
                };
                
                audio.onerror = (e) => {
                    console.error('오디오 로드 중 오류:', e);
                    URL.revokeObjectURL(audio.src); // 메모리 해제
                    resolve();
                };
            });
        } catch (error) {
            console.error('음성 안내 재생 중 오류:', error);
            return Promise.resolve();
        }
    }, []);

    // STT 기능 - 답변 받기
    const startListeningHandler = async (field) => {
        if (isProcessing) return;
        
        try {
            setIsProcessing(true);
            setIsListening(true);

            // 모든 필드에 대해 동일한 녹음 로직 사용
            const recordingTime = field === 'phone' ? 15000 : 8000;  // 전화번호는 15초, 나머지는 8초
            const silenceThreshold = field === 'phone' ? 8000 : 5000;  // 전화번호는 8초, 나머지는 5초 침묵

            return new Promise(async (resolve, reject) => {
                try {
                    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                    const mediaRecorder = new MediaRecorder(stream);
                    const audioChunks = [];

                    mediaRecorder.ondataavailable = (event) => {
                        audioChunks.push(event.data);
                    };

                    mediaRecorder.onstop = async () => {
                        try {
                            const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
                            let text = await voiceService.speechToText(audioBlob);
                            
                            if (field === 'phone') {
                                // 전화번호의 경우에만 숫자 변환 수행
                                const numbers_only = text.replace(/[^0-9]/g, '');
                                if (numbers_only.length >= 10) {
                                    text = `${numbers_only.slice(0,3)}-${numbers_only.slice(3,7)}-${numbers_only.slice(7)}`;
                                } else {
                                    text = numbers_only;
                                }
                            } else if (field === 'address') {
                                // 주소 입력의 경우 주소 매칭
                                const matchResult = await voiceService.matchAddress(text);
                                if (matchResult.matched_address) {
                                    const addr = matchResult.matched_address;
                                    text = `${addr.city} ${addr.district} ${addr.town} ${addr.road_name} ${addr.building_main_num}${addr.building_sub_num ? '-'+addr.building_sub_num : ''}`;
                                }
                            }
                            // 이름과 나이는 변환 없이 그대로 사용

                            setFormData(prev => ({...prev, [field]: text}));
                            resolve(text);
                        } catch (error) {
                            console.error('음성 인식 오류:', error);
                            reject(error);
                        } finally {
                            setIsListening(false);
                            setIsProcessing(false);
                        }
                    };

                    mediaRecorder.start();

                    // 녹음 중지 타이머
                    setTimeout(() => {
                        if (mediaRecorder.state === 'recording') {
                            mediaRecorder.stop();
                        }
                    }, recordingTime);

                    // 침묵 감지 로직
                    let lastAudioTime = Date.now();
                    const silenceCheck = setInterval(() => {
                        if (audioChunks.length > 0 && Date.now() - lastAudioTime > silenceThreshold) {
                            clearInterval(silenceCheck);
                            if (mediaRecorder.state === 'recording') {
                                mediaRecorder.stop();
                            }
                        }
                        if (audioChunks.length > 0) {
                            lastAudioTime = Date.now();
                        }
                    }, 1000);
                } catch (error) {
                    reject(error);
                }
            });

        } catch (error) {
            console.error('음성 입력 오류:', error);
            setIsListening(false);
            setIsProcessing(false);
            throw error;
        }
    };

    // handleConfirm 함수 수정
    const handleConfirm = useCallback((step) => {
        if (!completedSteps.includes(step)) {
            setCompletedSteps(prev => [...prev, step]);
            setCurrentStep(step + 1);
            
            // 다음 섹션으로 스크롤
            setTimeout(() => {
                if (sectionsRef.current[step + 1]) {
                    sectionsRef.current[step + 1].scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }, 100);

            if (step + 1 <= 4) {
                speak(step + 1);
            }
        }
    }, [completedSteps, speak]);

    // 질문 텍스트 가져오기
    const getQuestionForStep = (step) => {
        switch (step) {
            case 1:
                return "이름이 어떻게 되세요?";
            case 2:
                return "나이가 어떻게 되세요?";
            case 3:
                return "전화번호가 어떻게 되세요?";
            case 4:
                return "어디 사세요?";
            default:
                return "";
        }
    };

    // 입력값 변경 핸들러를 메모이제이션
    const handleInputChange = useCallback((field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    }, []);

    // 컴포넌트 마운트 시 첫 번째 안내 음성 재생 (의존성 배열 수정)
    useEffect(() => {
        speak(1);  // 첫 번째 질문 재생
        return () => {
            localStorage.removeItem('resumeFormData');
        };
    }, []); // 빈 의존성 배열로 변경

    const handleVoiceInput = async (field) => {
        try {
            setIsProcessing(true);
            
            // 1. 음성 녹음 시작
            await startListeningHandler(field);
            
            setIsProcessing(false);
        } catch (error) {
            console.error('음성 입력 중 오류:', error);
            setIsProcessing(false);
        }
    };

    return (
        <div 
            className="hmk-sequence-container"
            onSubmit={e => e.preventDefault()}
        >
            <div className="hmk-sequence-header">
                <button 
                    className="hmk-back-button"
                    onClick={() => navigate(-1)}
                >
                    <FontAwesomeIcon icon={faArrowLeft} />
                </button>
                <div className="hmk-progress-bar">
                    <div className="hmk-progress-track">
                        <div 
                            className="hmk-progress-fill"
                            style={{ width: `${(completedSteps.length / 4) * 100}%` }} // 수정: 단계 수에 맞게 변경
                        ></div>
                    </div>
                    <span className="hmk-progress-step">{completedSteps.length}/4</span>
                </div>
            </div>

            <div className="hmk-sections-container">
                <Section 
                    key={1}
                    step={1}
                    question="이름이 어떻게 되세요?"
                    field="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    onConfirm={handleConfirm}
                    isCompleted={completedSteps.includes(1)}
                    currentStep={currentStep}
                    sectionsRef={sectionsRef}
                />
                {completedSteps.includes(1) && (
                    <Section 
                        key={2}
                        step={2}
                        question="나이가 어떻게 되세요?"
                        field="age"
                        value={formData.age}
                        onChange={handleInputChange}
                        onConfirm={handleConfirm}
                        isCompleted={completedSteps.includes(2)}
                        currentStep={currentStep}
                        sectionsRef={sectionsRef}
                    />
                )}
                {completedSteps.includes(2) && (
                    <Section 
                        key={3}
                        step={3}
                        question="전화번호가 어떻게 되세요?"
                        field="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        onConfirm={handleConfirm}
                        isCompleted={completedSteps.includes(3)}
                        currentStep={currentStep}
                        sectionsRef={sectionsRef}
                    />
                )}
                {completedSteps.includes(3) && (
                    <Section 
                        key={4}
                        step={4}
                        question="어디 사세요?"
                        field="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        onConfirm={handleConfirm}
                        isCompleted={completedSteps.includes(4)}
                        currentStep={currentStep}
                        sectionsRef={sectionsRef}
                    />
                )}
            </div>

            {/* 모든 단계가 완료되면 제출 버튼 표시 */}
            {isAllCompleted && (
                <div className="hmk-sequence-footer">
                    <button 
                        className="hmk-submit-button"
                        onClick={handleSubmit}
                    >
                        제출하기
                    </button>
                </div>
            )}
        </div>
    );
};

export default ResumeSequence;
