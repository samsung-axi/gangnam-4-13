// pages/main/index.jsx
import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import styles from './styles/main.module.scss';
import Header from '@components/Header/Header';
import ChatbotIcon from '@assets/images/icon-robot.svg'
import { API_BASE_URL } from '@/config';

const JobCard = ({ job, onClick, isSelected, cardRef }) => (
  <div 
    ref={cardRef}
    className={`${styles.jobCard} ${isSelected ? styles.selected : ''}`} 
    onClick={() => onClick(job)}
  >
    <div className={styles.jobCard__header}>
      <div className={styles.jobCard__location}>
        <span className={styles.icon}>📍</span>
        {job.location}
      </div>
      <div className={styles.jobCard__company}>{job.company}</div>
    </div>
    <h3 className={styles.jobCard__title}>{job.title}</h3>
    <div className={styles.jobCard__details}>
      <div className={styles.jobCard__detail}>
        <span className={styles.icon}>💰</span>
        {job.salary}
      </div>
      <div className={styles.jobCard__detail}>
        <span className={styles.icon}>⏰</span>
        {job.workingHours}
      </div>
    </div>
    
    {/* 상세 정보 영역 */}
    <div className={`${styles.jobCard__description} ${isSelected ? styles.visible : ''}`}>
      <p data-label="고용형태">{job.employmentType}</p>
      <p data-label="근무시간">{job.workingHours}</p>
      <p data-label="급여">{job.salary}</p>
      <p data-label="복리후생">{job.benefits}</p>
      <p data-label="상세내용">{job.description}</p>
    </div>
    
    {/* 버튼 영역 */}
    <div className={`${styles.jobCard__footer} ${isSelected ? styles.visible : ''}`}>
      <button className={styles.jobCard__button}>
        지원하기
      </button>
    </div>
  </div>
);

// TrainingCard 컴포넌트 추가
const TrainingCard = ({ training, onClick, isSelected, cardRef }) => (
  <div 
    ref={cardRef}
    className={`${styles.trainingCard} ${isSelected ? styles.selected : ''}`} 
    onClick={() => onClick(training)}
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
      {training.target && (
        <div className={styles.trainingCard__detail}>
          <span className={styles.icon}>👥</span>
          {training.target}
        </div>
      )}
    </div>
    
    <div className={`${styles.trainingCard__description} ${isSelected ? styles.visible : ''}`}>
      {training.description && (
        <p data-label="교육내용">{training.description}</p>
      )}
    </div>
  </div>
);

const Main = () => {
  // 상태 관리
  const [showUserInfoForm, setShowUserInfoForm] = useState(false);
  const [userInfo, setUserInfo] = useState({ age: '', gender: '', location: '', jobType: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [isKeywordFormExpanded, setIsKeywordFormExpanded] = useState(false);
  const [inputText, setInputText] = useState('');
  const [isNoticeOpen, setIsNoticeOpen] = useState(false);
  const [hideNotice, setHideNotice] = useState(false);
  const [messages, setMessages] = useState([
    // 초기 봇 메세지 설정
    {
      type: 'bot',
      text: '안녕하세요. AI 취업도우미입니다.\n어떤 도움이 필요하신가요?',
      options: [
        { id: 1, text: '채용 정보' },
        { id: 2, text: '훈련 정보' },
        { id: 3, text: '이력서 관리' }
      ]
    }
  ]);

  const [sessionId, setSessionId] = useState('');
  const [selectedJob, setSelectedJob] = useState(null);
  const [isDetailsVisible, setIsDetailsVisible] = useState(false);
  const selectedCardRef = useRef(null);

  // 스크롤 관련 상태 관리
  const chatContainerRef = useRef(null);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [isUserScrolling, setIsUserScrolling] = useState(false);
  const [isAutoScrolling, setIsAutoScrolling] = useState(false);

  // 상태 추가
  const [processingTime, setProcessingTime] = useState(0);
  const [startTime, setStartTime] = useState(null);

  // 스크롤 이벤트 핸들러
  const handleScroll = () => {
    const element = chatContainerRef.current;
    if (element && !isAutoScrolling) {

      // 사용자가 스크롤하면 감지
      if(!isUserScrolling) {
        setIsUserScrolling(true);
      }

      // 스크롤이 위로 올라갔을 때 버튼 표시
      const isScrolledUp = element.scrollTop < element.scrollHeight - element.clientHeight - 100;
      setShowScrollButton(isScrolledUp);
    }
  };

  // 스크롤 다운 이벤트
  const scrollToBottom = () => {
    setIsAutoScrolling(true);
    setIsUserScrolling(false);
    setShowScrollButton(false);

    chatContainerRef.current?.scrollTo({
      top: chatContainerRef.current.scrollHeight,
      behavior: 'smooth'
    });

    // 스크롤 애니메이션 완료 후 auto scrolling 상태 해제
    setTimeout(() => {
      setIsAutoScrolling(false);
    }, 500);
  };

  // 입력창 관련 핸들러
  const handleInputChange = (e) => {
    const text = e.target.value;
    if(text.length <= 200 && !text.includes('\n')) {
      setInputText(text);
    }
  };

  // 붙여넣기 핸들러
  const handlePaste = (e) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData('text');
    const newText = inputText + pastedText;

    // 200자 제한 적용
    if(newText.length <= 200) {
      setInputText(newText);
    } else {
      setInputText(newText.slice(0, 200));
    }
  }

  // 엔터키 입력 핸들러
  const handleKeyPress = (e) => {
    if(e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      e.stopPropagation();
      handleSubmit(e);
    }
  };

  // 메세지 전송 핸들러
  const handleSubmit = async () => {
    const trimmedText = inputText.trim();
    if(trimmedText === '') return;

    setIsLoading(true);
    setStartTime(Date.now());  // 시작 시간 기록
    setProcessingTime(0);
    
    // 사용자 메시지 추가
    setMessages(prevMessages => [
        ...prevMessages,
        { type: 'user', text: trimmedText },
        { type: 'bot', text: '', isLoading: true }  // 로딩 메시지 추가
    ]);
    setInputText('');

    try {
        // 처리 시간 업데이트를 위한 인터벌
        const timer = setInterval(() => {
            setProcessingTime(prev => prev + 1);
        }, 1000);

        const response = await axios.post(`${API_BASE_URL}/chat/`, {
            user_message: trimmedText,
            user_profile: userInfo,
            session_id: sessionId 
        });

        clearInterval(timer);  // 타이머 정지

        const { message, jobPostings, type } = response.data;

        // 로딩 메시지를 실제 응답으로 교체
        setMessages(prevMessages => 
            prevMessages.map((msg, idx) => 
                idx === prevMessages.length - 1 
                    ? { type: 'bot', text: message, jobPostings: jobPostings }
                    : msg
            )
        );

        if(response.data.user_profile) {
            setUserInfo(response.data.user_profile);
        }


    } catch (error) {
        console.error("메시지 전송 오류:", error);
        setMessages(prevMessages => 
            prevMessages.map((msg, idx) => 
                idx === prevMessages.length - 1 
                    ? { type: 'bot', text: "죄송합니다. 메시지를 처리하는 중에 오류가 발생했습니다." }
                    : msg
            )
        );
    } finally {
        setIsLoading(false);
        setStartTime(null);
    }
  };

  const handleOptionClick = (optionId) => {
    let selectedMenu = '';
    switch(optionId) {
      case 1:
        selectedMenu = '채용 정보';
        break;
        
      case 2:
        selectedMenu = '훈련 정보';
        break;

      case 3:
        selectedMenu = '이력서 관리';
        break
    }

    setMessages((prevMessages) => [
      ...prevMessages,
      {
        type: 'user',
        text: selectedMenu,
      },
    ]);

    // 채용정보 메뉴 클릭 시
    if(optionId === 1) {
      setShowUserInfoForm(true);
    }
  };

  const handleUserInfoSubmit = async (e) => {
    e.preventDefault();

    const ageValue = userInfo.age ? parseInt(userInfo.age, 10) : undefined;
    const updatedUserInfo = {
        ...userInfo,
        age: ageValue,
    };

    const userInfoText = `입력하신 정보는 다음과 같습니다.\n\n나이 : ${userInfo.age}세\n성별 : ${userInfo.gender}\n희망 근무 지역 : ${userInfo.location}\n희망 직무 : ${userInfo.jobType}\n\n🔍 이 정보를 바탕으로 채용 정보를 검색하겠습니다!`;

    setMessages(prevMessages => [
      ...prevMessages,
      { type: 'bot', text: userInfoText }
    ]);

    setShowUserInfoForm(false);

    try {
      const searchQuery = `${userInfo.jobType} ${userInfo.location}`;
      const response = await axios.post(`${API_BASE_URL}/chat/`, {
        user_message: searchQuery,
        user_profile: updatedUserInfo,
        session_id: sessionId || "default_session"
      });

      const { message, jobPostings, user_profile, type } = response.data;

      if (user_profile) {
        setUserInfo(user_profile);
      }

      setMessages(prevMessages => [
        ...prevMessages,
        {
          type: 'bot',
          text: message,
          jobPostings: jobPostings
        }
      ]);

    } catch (error) {
      console.error("일자리 검색 중 오류:", error);
      setMessages(prevMessages => [
        ...prevMessages,
        { type: 'bot', text: "죄송합니다. 일자리 검색 중 오류가 발생했습니다." }
      ]);
    }
  };

  const handleUserInfoChange = (e) => {
    const { name, value } = e.target;
    setUserInfo(prevInfo => ({ ...prevInfo, [name]: value }));
  };

  const handleJobClick = (job) => {
    setSelectedJob(job);
    setIsDetailsVisible(true);

    // 약간의 지연을 주어 애니메이션이 시작된 후 스크롤
    setTimeout(() => {
      if (selectedCardRef.current) {
        selectedCardRef.current.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        });
      }
    }, 100);
  };

  const toggleDetails = () => {
    setIsDetailsVisible(!isDetailsVisible);
    if (isDetailsVisible) {
      setSelectedJob(null); // 상세 정보 숨길 때 선택된 공고 초기화
    }
  };

  // 훈련정보 관련 상태 추가
  const [selectedTraining, setSelectedTraining] = useState(null);
  
  // 훈련과정 클릭 핸들러 추가
  const handleTrainingClick = (training) => {
    setSelectedTraining(prev => prev?.id === training.id ? null : training);
    if (selectedCardRef.current) {
      selectedCardRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
    }
  };

  // 스크롤 관련 useEffect 통합
  useEffect(() => {
    const chatContainer = chatContainerRef.current;
    if (chatContainer) {
      setIsAutoScrolling(true);
      setShowScrollButton(false);
      
      chatContainer.scrollTo({
        top: chatContainer.scrollHeight,
        behavior: 'smooth'
      });

      // 스크롤 애니메이션이 끝난 후 auto scrolling 상태 해제
      setTimeout(() => {
        setIsAutoScrolling(false);
      }, 500);
    }
  }, [messages]);


  return (
    <div className={styles.page}>
      <Header />
      <main className={styles.content}>
        <div className={styles.chat}>
          <div className={styles.chat__header}>
            <div className={styles.chat__info}>
              {/* <img src={ChatbotIcon} alt="챗봇 아이콘" /> */}
              <span>시니어잡봇과 채팅하기</span>
            </div>
            <button className={styles.chat__mypage}>마이페이지</button>
          </div>

          <div className={styles.chat__messages} ref={chatContainerRef} onScroll={handleScroll}>
            {!hideNotice && (
              <div className={styles.notice}>
                <div className={styles.notice__header} onClick={() => setIsNoticeOpen(!isNoticeOpen)}>
                  <div className={styles.notice__title}>
                    <span className={styles.notice__icon}>📢</span>
                    <span>안녕하세요. 시니어JobGo입니다.</span>
                  </div>
                  <span className={`${styles.notice__arrow} ${isNoticeOpen ? styles.open : ''}`}>
                    <i className='bx bx-chevron-down'></i>
                    {/* <box-icon name='chevron-down'></box-icon> */}
                  </span>
                </div>
                {isNoticeOpen && (
                  <>
                    <div className={styles.notice__content}>
                      본 챗봇은 상담원과의 실시간 채팅 서비스는 운영되지 않습니다.<br />
                      AI 채용도우미와 자유롭게 대화하며 나에게 맞는 채용 정보를 받아보세요! 😊<br />
                    </div>
                    <div className={styles.notice__buttons}>
                    <button className={styles.notice__hideButton} onClick={() => setHideNotice(true)}>
                      다시 열지 않음
                    </button>
                    <button className={styles.notice__hideButton} onClick={() => setIsNoticeOpen(false)}>
                      접어두기
                    </button>
                    </div>
                  </>
                )}
              </div>
            )}
            
            {messages.map((message, index) => (
              <div key={index} className={styles.message}>
                {message.type === 'bot' ? (
                  <div className={styles.message__bot}>
                    <img src={ChatbotIcon} alt="챗봇 아이콘" className={styles.message__icon} />
                    <div className={styles.message__content}>
                      {message.isLoading ? (
                        <>
                          <div className={styles.loadingBar} />
                          <div className={styles.processingTime}>
                            답변 생성 중... {processingTime}초
                          </div>
                        </>
                      ) : (
                        <>
                          {message.text.split('\n').map((line, i) => (
                            <React.Fragment key={i}>
                              {line}
                              {i < message.text.split('\n').length - 1 && <br />}
                            </React.Fragment>
                          ))}
                          {message.jobPostings && message.jobPostings.length > 0 && (
                            <div className={styles.jobList}>
                              {message.jobPostings.map(job => (
                                <JobCard 
                                  key={job.id}
                                  job={job} 
                                  onClick={handleJobClick}
                                  isSelected={selectedJob && selectedJob.id === job.id}
                                  cardRef={selectedJob && selectedJob.id === job.id ? selectedCardRef : null}
                                />
                              ))}
                            </div>
                          )}
                          {message.trainingCourses && message.trainingCourses.length > 0 && (
                            <div className={styles.trainingList}>
                              {message.trainingCourses.map(course => (
                                <TrainingCard
                                  key={course.id}
                                  training={course}
                                  onClick={handleTrainingClick}
                                  isSelected={selectedTraining && selectedTraining.id === course.id}
                                  cardRef={selectedTraining && selectedTraining.id === course.id ? selectedCardRef : null}
                                />
                              ))}
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className={styles.message__user}>
                    <div className={styles.message__content}>
                      {message.text}
                    </div>
                  </div>
                )}

                {message.options && (
                  <div className={styles.options}>
                    {message.options.map((option) => (
                      <button key={option.id} className={styles.options__button} onClick={() => handleOptionClick(option.id)}>
                        <span className={styles.options__text}>{option.text}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {showUserInfoForm && (
              <div className={styles.userForm}>
                <form onSubmit={handleUserInfoSubmit}>
                  <input type="number" name="age" value={userInfo.age} onChange={handleUserInfoChange} placeholder="나이 (숫자만 입력 가능)" required />
                  <input type="test" name="gender" value={userInfo.gender} onChange={handleUserInfoChange} placeholder="성별 (예: 남성)" required />
                  <input type="text" name="location" value={userInfo.location} onChange={handleUserInfoChange} placeholder="희망근무지역 (예: 서울 강남구)" required />
                  <input type="text" name="jobType" value={userInfo.jobType} onChange={handleUserInfoChange} placeholder="희망직무 (예: 사무직)" required />
                  <button type="submit">입력</button>
                </form>
              </div>
            )}
          </div>
          {showScrollButton && (
            <button className={`${styles.scrollButton} ${styles.visible}`} onClick={scrollToBottom}>
              <i className='bx bx-down-arrow-alt'></i>
              최신 메세지 보기
            </button>
          )}
          <div className={styles.chat__input}>
            <div className={styles.input__container}>
              <textarea 
                placeholder="메시지를 입력해주세요" 
                value={inputText} 
                onChange={handleInputChange} 
                onKeyUp={handleKeyPress} 
                onPaste={handlePaste} 
                rows="1" 
                disabled={isLoading} 
              />
              <button 
                className={styles.mic__button}
                onClick={() => {
                  // IntentModal을 음성 모드로 열기
                  setShowIntentModal(true);
                  setInitialMode('voice');
                }}
                disabled={isLoading}
              >
                <i className='bx bx-microphone'></i>
              </button>
            </div>
            
            <button onClick={handleSubmit} disabled={isLoading}>
              {isLoading ? '답변 준비중...' : '입력'}
            </button>
          </div>
        </div>
        
      </main>
    </div>
  );
};

export default Main;