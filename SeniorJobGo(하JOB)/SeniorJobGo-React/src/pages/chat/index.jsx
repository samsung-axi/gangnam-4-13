// pages/chat/index.jsx
import React, { useEffect, useState, useRef } from 'react';
import { API_BASE_URL } from '@/config';
import { useNavigate } from 'react-router-dom';
import styles from './styles/chat.module.scss';
import axios from 'axios';

import Header from '@components/Header/Header';
import IntentModal from '@pages/modal/IntentModal';
import ChatMessage from './components/ChatMessage';
import ChatInput from './components/ChatInput';
import GuideModal from '@pages/modal/GuideModal';
import JobSearchModal from '@pages/modal/JobSearchModal';
import TrainingSearchModal from '@pages/modal/TrainingSearchModal';
import PolicySearchModal from '@pages/modal/PolicySearchModal';
import MealSearchModal from '@pages/modal/MealSearchModal';
// import ReactMarkdown from 'react-markdown';

const Chat = () => {
  const navigate = useNavigate();

  const [userMessage, setUserMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [isBotResponding, setIsBotResponding] = useState(false);
  const [typingIntervalId, setTypingIntervalId] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [processingTime, setProcessingTime] = useState(0);

  // 스크롤 관련 상태
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [isUserScrolling, setIsUserScrolling] = useState(false);
  const [isAutoScrolling, setIsAutoScrolling] = useState(false);

  const chatsContainerRef = useRef(null);
  const promptInputRef = useRef(null);
  const abortControllerRef = useRef(null);
  const typingIntervalRef = useRef(null);

  // 채용 정보 관련 상태
  const [selectedJob, setSelectedJob] = useState(null);
  const selectedCardRef = useRef(null);

  // 훈련정보 관련 상태
  const [selectedTraining, setSelectedTraining] = useState(null);

  // 모달 및 음성 입력 상태
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [isVoiceMode, setIsVoiceMode] = useState(false);
  const [initialMode, setInitialMode] = useState(null);

  const [isGuideModalOpen, setIsGuideModalOpen] = useState(false);
  const [isJobSearchModalOpen, setIsJobSearchModalOpen] = useState(false);
  const [isTrainingSearchModalOpen, setIsTrainingSearchModalOpen] = useState(false);
  const [isPolicySearchModalOpen, setIsPolicySearchModalOpen] = useState(false);
  const [isMealSearchModalOpen, setIsMealSearchModalOpen] = useState(false);
  const [userProfile, setUserProfile] = useState(null);

  // 무료급식소 관련 상태 추가
  const [selectedMeal, setSelectedMeal] = useState(null);
  // 정책 정보 관련 상태
  const [selectedPolicy, setSelectedPolicy] = useState(null);

  const chatEndIndex = useRef(-1);
  const limit = 10;

  // 메뉴 아이템
  const suggestions = [
    { text: "시니어JobGo 이용안내", description: "서비스 이용방법을 확인해보세요.", icon: "help", id: 1 },
    { text: "AI 맞춤 채용정보 검색", description: "AI가 맞춤형 채용정보를 찾아드립니다.", icon: "work", id: 2 },
    { text: "맞춤 훈련정보 검색", description: "새로운 경력을 위한 교육과정을 찾아드립니다.", icon: "school", id: 3 },
    { text: "이력서 관리", description: "이력서 작성부터 지원까지 한번에", icon: "description", id: 4 },
    { text: "정책 정보 알리미", description: "도움되는 정부지원 정보 모음을 제공합니다.", icon: "info", id: 5 },
    { text: "무료급식소 안내", description: "가까운 급식소를 찾아보세요.", icon: "restaurant", id: 6 },
  ];

  // 스크롤 이벤트 핸들러
  const handleScroll = () => {
    const element = chatsContainerRef.current;
    if (element && !isAutoScrolling) {
      if (!isUserScrolling) {
        setIsUserScrolling(true);
      }
      const isScrolledUp = element.scrollTop < element.scrollHeight - element.clientHeight - 100;
      setShowScrollButton(isScrolledUp);
    }
  };

  // 스크롤 다운
  const scrollToBottom = () => {
    if (chatsContainerRef.current) {
      setIsAutoScrolling(true);
      setIsUserScrolling(false);
      setShowScrollButton(false);

      chatsContainerRef.current.scrollTo({
        top: chatsContainerRef.current.scrollHeight,
        behavior: 'smooth'
      });

      setTimeout(() => {
        setIsAutoScrolling(false);
      }, 500);
    }
  };

  // 채팅 내역 변경 시 스크롤
  useEffect(() => {
    const timer = setTimeout(() => {
      scrollToBottom();
    }, 0);
    return () => clearTimeout(timer);
  }, [chatHistory]);

  // 챗봇 응답 상태 변경 시 body 클래스 업데이트
  useEffect(() => {
    if (isBotResponding) {
      document.body.classList.add('bot-responding');
    } else {
      document.body.classList.remove('bot-responding');
    }
  }, [isBotResponding]);

  // 타이핑 효과 (문장을 단어 단위로 점진적으로 채팅 상태 업데이트)
  const typingEffect = (text, updateCallback, onComplete) => {
    // 기존 인터벌 있으면 정리
    if (typingIntervalRef.current) {
      clearInterval(typingIntervalRef.current);
    }

    const words = text.split(" ");
    let wordIndex = 0;
    let currentText = "";

    const intervalId = setInterval(() => {
      if (wordIndex < words.length) {
        currentText += (currentText ? " " : "") + words[wordIndex];
        updateCallback(currentText);
        wordIndex++;
        scrollToBottom();
      } else {
        clearInterval(intervalId);
        typingIntervalRef.current = null;
        if (onComplete) onComplete();
      }
    }, 50);
    typingIntervalRef.current = intervalId;
  };

  // 채팅 기록 불러오기
  useEffect(() => {
    const fetchChatHistory = async () => {
      if (chatEndIndex.current === 0) return;

      try {
        let id = null;
        let provider = null;
        try {
          id = document.cookie.split('; ')
            .find(row => row.startsWith('sjgid='))
            .split('=')[1];

          provider = document.cookie.split('; ')
            .find(row => row.startsWith('sjgpr='))
            .split('=')[1];

          const response = await axios.get(`${API_BASE_URL}/auth/check`, {
            withCredentials: true
          });

          if (!response.data) throw new Error();
        } catch (error) {
          alert('세션이 만료되었습니다.\n다시 로그인 해주세요.');
          document.cookie = 'sjgid=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
          document.cookie = 'sjgpr=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
          navigate('/');
        }

        const response = await axios.get(`${API_BASE_URL}/chat/get/limit/${id}`, {
          params: {
            end: chatEndIndex.current,
            limit: limit
          },
          withCredentials: true
        });
        // 만약 응답 데이터가 { messages: [...] } 형태라면 messages 배열을 사용합니다.
        const messages = response.data.messages ? response.data.messages : response.data;

        const newMessages = []

        // for문을 통해 index가 0인 메시지는 건너뛰고, 나머지 메시지를 변환하여 chatHistory에 추가합니다.
        for (const msg of messages) {
          const role = msg.role === "user" ? "user" : "model";
          let newMsg = { role, text: "" };

          // 문자열인 경우
          if (typeof msg.content === "string") {
            newMsg.text = msg.content;
          }
          // 객체인 경우
          else if (typeof msg.content === "object" && msg.content !== null) {
            // 메시지 텍스트 설정
            if (msg.content.message) {
              newMsg.text = msg.content.message;
            } else if (msg.content.text) {
              newMsg.text = msg.content.text;
            } 

            // 채용정보 추가
            if (msg.content.jobPostings && msg.content.jobPostings.length > 0) {
              newMsg.jobPostings = msg.content.jobPostings;
            }

            // 훈련과정 정보 추가
            if (msg.content.trainingCourses && msg.content.trainingCourses.length > 0) {
              newMsg.trainingCourses = msg.content.trainingCourses;
            }

            // 무료급식소 정보 추가
            if (msg.content.mealServices && msg.content.mealServices.length > 0) {
              newMsg.mealServices = msg.content.mealServices;
            }

            // 메시지 타입 추가
            if (msg.content.type) {
              newMsg.type = msg.content.type;
            }

            // 음성 입력 모드 추가
            if (msg.content.mode === 'voice') {
              setIsVoiceMode(true);
            }
          }

          // 채팅 내역에 추가
          newMessages.push(newMsg);
        }
        setChatHistory(prev => [...newMessages, ...prev]);
        chatEndIndex.current = response.data.index;
      } catch (error) {
        console.error('채팅 내역 불러오기 오류:', error);
      }
    };
    fetchChatHistory();

    // 채팅 내역 불러오기 완료 후 바로 스크롤 하단으로 이동
    setTimeout(() => {
      scrollToBottom();
    }, 100);

    // 스크롤을 맨 위로 올리면 메시지를 불러오는 로직 추가
    const container = chatsContainerRef.current;
    const handleScrollToTop = async () => {
      const scrollPosition = container.scrollTop;
      if (scrollPosition <= 0) {
        const prevScrollHeight = container.scrollHeight;
        await fetchChatHistory();
        requestAnimationFrame(() => {
          const newScrollHeight = container.scrollHeight;
          const scrollDifference = newScrollHeight - prevScrollHeight;
          // 기존 스크롤 위치 보정: prepend된 메시지 높이만큼 보정
          container.scrollTop = scrollDifference;
        });
      }
    }
    container.addEventListener('scroll', handleScrollToTop);

    return () => {
      container.removeEventListener('scroll', handleScrollToTop);
    };
  }, [navigate]);

  // 폼 제출 핸들러
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!userMessage.trim() || isBotResponding) return;

    const message = userMessage.trim();
    setChatHistory(prev => [...prev, { role: "user", text: message }]);
    setUserMessage("");
    setIsBotResponding(true);
    setStartTime(Date.now());
    setProcessingTime(0);

    try {
      // 로딩 메시지 추가
      setChatHistory(prev => [...prev, {
        role: "bot",
        text: "답변을 준비중입니다...",
        loading: true
      }]);

      const response = await axios.post(`${API_BASE_URL}/chat/`, {
        user_message: message,
        session_id: "default_session",
        chat_history: chatHistory.map(msg => ({
          role: msg.role,
          content: msg.text
        }))
      }, { withCredentials: true });

      // 빈 봇 메시지를 먼저 추가
      const newBotMessage = {
        role: "bot",
        text: "",
        type: response.data.type,
        jobPostings: response.data.jobPostings || [],
        trainingCourses: response.data.trainingCourses || [],
        policyPostings: response.data.policyPostings || [],
        mealPostings: response.data.mealPostings || []
      };

      // 로딩 메시지 제거 및 빈 봇 메시지 추가
      setChatHistory(prev => {
        const filtered = prev.filter(msg => !msg.loading);
        return [...filtered, newBotMessage];
      });

        // 타이핑 효과로 메시지 표시
        typingEffect(
          response.data.message,
          (currentText) => {
            setChatHistory(prev => {
              const updated = [...prev];
              updated[updated.length - 1] = {
                ...updated[updated.length - 1],
                text: currentText
              };
              return updated;
            });
          },
          () => {
            scrollToBottom();
          }
        );

    } catch (error) {
      console.error("메시지 전송 오류:", error);
      setChatHistory(prev => {
        const filtered = prev.filter(msg => !msg.loading);
        return [...filtered, {
          role: "bot",
          text: "죄송합니다. 메시지를 처리하는 중에 오류가 발생했습니다.",
          type: "error"
        }];
      });
    } finally {
      setIsBotResponding(false);
      setStartTime(null);
    }
  };

  // 추천 메뉴 클릭 핸들러
  const handleSuggestionClick = (item) => {
    switch (item.id) {
      case 1:
        setIsGuideModalOpen(true);
        break;
      case 2:
        setIsJobSearchModalOpen(true);
        break;
      case 3:
        setIsTrainingSearchModalOpen(true);
        break;
      case 4:
        // 이력서 관련 추가하기
      break;
      case 5:
        setIsPolicySearchModalOpen(true);
        break;
      case 6:
        setIsMealSearchModalOpen(true);
        break;
      default:
        break;
    }
  };

  // 채팅 내역 삭제
  const handleDeleteChats = () => {
    setChatHistory([]);
    setIsBotResponding(false);
    chatEndIndex.current = 0;
  };

  // =========== 채용 공고 클릭 핸들러 ===========
  const handleJobClick = (job) => {
    setSelectedJob(prev => {
      const newSelected = prev?.id === job.id ? null : job;
      if (newSelected) {
        setTimeout(() => {
          const cardElement = document.querySelector(`[data-job-id="${job.id}"]`);
          if (cardElement) {
            cardElement.scrollIntoView({
              behavior: 'smooth',
              block: 'center',
              inline: 'center'
            });
          }
        }, 100);
      }
      return newSelected;
    });
  };

  // =========== 응답 중단 핸들러 ===========
  const handleStopResponse = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setIsBotResponding(false);
    setUserMessage("");
  };

  // =========== 훈련 공고 클릭 핸들러 ===========
  const handleTrainingClick = (training) => {
    setSelectedTraining(prev => {
      const newSelected = prev?.id === training.id ? null : training;
      if (newSelected) {
        setTimeout(() => {
          const cardElement = document.querySelector(`[data-training-id="${training.id}"]`);
          if (cardElement) {
            cardElement.scrollIntoView({
              behavior: 'smooth',
              block: 'center',
              inline: 'center'
            });
          }
        }, 100);
      }
      return newSelected;
    });
  };

  // =========== 모달 핸들러 ===========
  const handleIntentSubmit = (mode, text) => {
    setIsModalOpen(false);
    
    if (!text?.trim()) return;

    // 모드에 따라 다르게 처리
    if (mode === 'text') {
      setIsVoiceMode(false);
      setUserMessage(text);
      handleMessageSubmit(text);
    } else if (mode === 'voice') {
      setIsVoiceMode(true);
      
      // 음성 입력 텍스트를 채팅 기록에 추가하고 API 요청
      handleMessageSubmit(text);
    }
  };

  // handleMessageSubmit 함수도 확인
  const handleMessageSubmit = async (message) => {
    try {
      // 사용자 메시지 추가
      setChatHistory(prev => [...prev, {
        role: "user",
        text: message
      }]);

      // 로딩 메시지 추가
      setChatHistory(prev => [...prev, {
        role: "bot",
        text: "답변을 준비중입니다...",
        loading: true
      }]);

      setIsBotResponding(true);

      // API 요청 및 응답 처리
      const response = await axios.post(`${API_BASE_URL}/chat/`, {
        user_message: message,
        session_id: "default_session",
        chat_history: chatHistory.map(msg => ({
          role: msg.role,
          content: msg.text
        }))
      }, { withCredentials: true });

      // 로딩 메시지 제거 및 실제 응답 추가
      setChatHistory(prev => {
        const filtered = prev.filter(msg => !msg.loading);
        return [...filtered, {
          role: "bot",
          text: response.data.message || "죄송합니다. 현재 조건에 맞는 정보를 찾지 못했습니다.", // 기본 메시지 추가
          type: response.data.type,
          jobPostings: response.data.jobPostings || [],
          trainingCourses: response.data.trainingCourses || [],
          policyPostings: response.data.policyPostings || [],
          mealPostings: response.data.mealPostings || []
        }];
      });

      setIsBotResponding(false);
      setUserMessage("");

    } catch (error) {
      console.error("메시지 전송 오류:", error);
      setChatHistory(prev => {
        const filtered = prev.filter(msg => !msg.loading);
        return [...filtered, {
          role: "bot",
          text: "죄송합니다. 오류가 발생했습니다. 다시 시도해주세요.",
          type: "error"
        }];
      });
      setIsBotResponding(false);
    }
  };

  // 음성 입력 클릭 핸들러 수정
  const handleVoiceInputClick = async (mode) => {
    try {
      if (mode === 'text') {
        setIsVoiceMode(false);  // 텍스트 모드로 전환
      } else {
        // 마이크 권한 확인
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        stream.getTracks().forEach(track => track.stop()); // 스트림 해제
        
        setIsVoiceMode(true);   // 음성 모드로 전환
        setInitialMode('voice'); // 초기 모드를 음성으로 설정
        setIsModalOpen(true);   // 모달 열기
      }
    } catch (error) {
      console.error('마이크 권한 오류:', error);
      alert('마이크 사용 권한이 필요합니다. 브라우저 설정에서 마이크 권한을 허용해주세요.');
      setIsVoiceMode(false);  // 에러 발생 시 텍스트 모드로 유지
    }
  };

  const handleInputChange = (e) => {
    const text = e.target.value;
    if (text.length <= 500) {
      setUserMessage(text);
    }
  };

  // =========== 맞춤 검색 제출 핸들러 ===========
  const handleJobSearchSubmit = (formData) => {
    setIsJobSearchModalOpen(false);

    // 채팅 기록에 사용자 메시지 추가
    setChatHistory(prev => [...prev, {
      role: "user",
      text: "AI 맞춤 채용 정보",
    }]);

    // 로딩 메시지 추가
    setChatHistory(prev => [...prev, {
      role: "bot",
      text: "맞춤 채용정보를 검색중입니다...",
      loading: true
    }]);

    // 백엔드로 데이터 전송
    const searchData = {
      ...formData,
      location: formData.city + (formData.district ? ` ${formData.district}` : ''),
    };

    axios.post(`${API_BASE_URL}/jobs/search`, searchData, {
      withCredentials: true
    })
      .then(response => {
        // 로딩 메시지 제거 및 실제 응답 추가
        setChatHistory(prev => {
          const filtered = prev.filter(msg => !msg.loading);
          return [...filtered, {
            role: "bot",
            text: response.data.message,
            jobPostings: response.data.jobPostings || [],
            type: "job_search"
          }];
        });
      })
      .catch(error => {
        console.error("채용정보 검색 오류:", error);
        setChatHistory(prev => {
          const filtered = prev.filter(msg => !msg.loading);
          return [...filtered, {
            role: "bot",
            text: "죄송합니다. 채용정보를 검색하는 중에 오류가 발생했습니다.",
            type: "error"
          }];
        });
      });
  };

  // =========== 훈련 검색 제출 핸들러 ===========
  const handleTrainingSearchSubmit = (formData) => {
    setIsTrainingSearchModalOpen(false);

    // 채팅 기록에 사용자 메시지 추가
    setChatHistory(prev => [...prev, {
      role: "user",
      text: "AI 맞춤 훈련 정보",
    }]);

    // 로딩 메시지 추가
    setChatHistory(prev => [...prev, {
      role: "bot",
      text: "맞춤 훈련정보를 검색중입니다...",
      loading: true
    }]);

    // 백엔드로 데이터 전송
    const searchData = {
      ...formData,
      location: formData.city + (formData.district ? ` ${formData.district}` : ''),
    };

    axios.post(`${API_BASE_URL}/trainings/search`, searchData, {
      withCredentials: true
    })
    .then(response => {
      setChatHistory(prev => {
        const filtered = prev.filter(msg => !msg.loading);
        return [...filtered, {
          role: "bot",
          text: response.data.message,
          trainingCourses: response.data.trainingCourses || [],
          type: "training_search"
        }];
      });
    })
    .catch(error => {
      console.error("훈련정보 검색 오류:", error);
      setChatHistory(prev => {
        const filtered = prev.filter(msg => !msg.loading);
        return [...filtered, {
          role: "bot",
          text: "죄송합니다. 훈련정보를 검색하는 중에 오류가 발생했습니다.",
          type: "error"
        }];
      });
    });
  };

 // 정책 클릭 핸들러
 const handlePolicyClick = (policy) => {
  setSelectedPolicy(prev => {
    const newSelected = prev?.id === policy.id ? null : policy;
    if (newSelected) {
      setTimeout(() => {
        const cardElement = document.querySelector(`[data-policy-id="${policy.id}"]`);
          if (cardElement) {
            cardElement.scrollIntoView({
              behavior: 'smooth',
              block: 'center',
              inline: 'center'
            });
          }
        }, 100);
      }
      return newSelected;
    });
  };

  // 무료급식소 클릭 핸들러 추가
  const handleMealClick = (meal) => {
    setSelectedMeal(prev => {
      const newSelected = prev?.name === meal.name ? null : meal;  // name으로 비교
      // 카드가 선택되었을 때 스크롤
      if (!prev || prev.name !== meal.name) {
        setTimeout(() => {
          const cardElement = document.querySelector(`[data-meal-id="${meal.name}"]`);
          if (cardElement) {
            cardElement.scrollIntoView({
              behavior: 'smooth',
              block: 'center',
              inline: 'center'
            });
          }
        }, 100);
      }
      return newSelected;
    });
  };

  // 무료급식소 검색 제출 핸들러
  const handleMealSearchSubmit = (searchQuery) => {
    setIsMealSearchModalOpen(false);

    // 채팅 기록에 사용자 메시지 추가
    setChatHistory(prev => [...prev, {
      role: "user",
      text: `무료급식소 검색: ${searchQuery}`,
    }]);

    // 로딩 메시지 추가
    setChatHistory(prev => [...prev, {
      role: "bot",
      text: "무료급식소 정보를 검색중입니다...",
      loading: true
    }]);

    // 백엔드로 데이터 전송 여기 axios.post(`${API_BASE_URL}/trainings/search
    axios.post(`${API_BASE_URL}/meals/search`, { user_message: searchQuery }, {
      withCredentials: true
    })
    .then(response => {
      setChatHistory(prev => {
        const filtered = prev.filter(msg => !msg.loading);
        return [...filtered, {
          role: "bot",
          text: response.data.message || "검색 결과입니다.",
          mealPostings: response.data.mealPostings || [],
          type: response.data.type
        }];
      });
    })
    .catch(error => {
      console.error("무료급식소 검색 오류:", error);
      setChatHistory(prev => {
        const filtered = prev.filter(msg => !msg.loading);
        return [...filtered, {
          role: "bot",
          text: "죄송합니다. 무료급식소 검색 중에 오류가 발생했습니다.",
          type: "error"
        }];
      });
    });
  };

  // 정책 검색 제출 핸들러 추가
  const handlePolicySearchSubmit = (searchQuery) => {
    setIsPolicySearchModalOpen(false);

    // 채팅 기록에 사용자 메시지 추가
    setChatHistory(prev => [...prev, {
      role: "user",
      text: `정책 정보 검색: ${searchQuery}`,
    }]);

    // 로딩 메시지 추가
    setChatHistory(prev => [...prev, {
      role: "bot",
      text: "정책 정보를 검색중입니다...",
      loading: true
    }]);

    // 백엔드로 데이터 전송
    axios.post(`${API_BASE_URL}/policy/search`, { 
      user_message: searchQuery 
    }, {
      withCredentials: true
    })
    .then(response => {
      setChatHistory(prev => {
        const filtered = prev.filter(msg => !msg.loading);
        return [...filtered, {
          role: "bot",
          text: response.data.message || "검색 결과입니다.",
          policyPostings: response.data.policyPostings || [],
          type: response.data.type
        }];
      });
    })
    .catch(error => {
      console.error("정책 정보 검색 오류:", error);
      setChatHistory(prev => {
        const filtered = prev.filter(msg => !msg.loading);
        return [...filtered, {
          role: "bot",
          text: "죄송합니다. 정책 정보 검색 중에 오류가 발생했습니다.",
          type: "error"
        }];
      });
    });
  };

  return (
    <div className={styles.page}>
      <Header />
      <main className={styles.content}>
        <IntentModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSubmit={handleIntentSubmit} initialMode={initialMode} />

        <div className={styles.container} ref={chatsContainerRef} onScroll={handleScroll}>
          {chatHistory.length === 0 && (
            <>
              <div className={styles.appHeader}>
                <h1 className={styles.heading}>안녕하세요!</h1>
                <h2 className={styles.subHeading}>무엇을 도와드릴까요?</h2>
              </div>

              <ul className={styles.suggestions}>
                {suggestions.map((item) => (
                  <li key={item.id} className={styles.suggestionsItem} onClick={() => handleSuggestionClick(item)}>
                    <div className={styles.textWrapper}>
                      <p className={styles.text}>{item.text}</p>
                      <p className={styles.description}>{item.description}</p>
                    </div>
                    <span className={`material-symbols-rounded ${item.icon}`}>{item.icon}</span>
                  </li>
                ))}
              </ul>
            </>
          )}
          <div className={styles.chatsContainer}>
            {chatHistory.map((message, index) => (
              <ChatMessage
                key={index}
                message={message}
                selectedJob={selectedJob}
                selectedTraining={selectedTraining}
                selectedPolicy={selectedPolicy}
                selectedMeal={selectedMeal}
                onJobClick={handleJobClick}
                onTrainingClick={handleTrainingClick}
                onPolicyClick={handlePolicyClick}
                onMealClick={handleMealClick}
                selectedCardRef={selectedCardRef}
              />
            ))}
          </div>

          <ChatInput 
            userMessage={userMessage} 
            isBotResponding={isBotResponding} 
            isVoiceMode={isVoiceMode} 
            onSubmit={handleFormSubmit} 
            onChange={handleInputChange} 
            onVoiceInputClick={handleVoiceInputClick}
            onStopResponse={handleStopResponse} 
            onDeleteChats={handleDeleteChats}
            setIsVoiceMode={setIsVoiceMode}
          />

          {showScrollButton && chatHistory.length > 0 && (
            <button className={`${styles.scrollButton} ${styles.visible}`} onClick={scrollToBottom}>
              <span className="material-symbols-rounded">arrow_downward</span>
            </button>
          )}
        </div>

        <GuideModal 
          isOpen={isGuideModalOpen} 
          onClose={() => setIsGuideModalOpen(false)} 
        />
        
        <JobSearchModal 
          isOpen={isJobSearchModalOpen} 
          onClose={() => setIsJobSearchModalOpen(false)} 
          onSubmit={handleJobSearchSubmit} 
          userProfile={userProfile} 
        />

        <TrainingSearchModal 
          isOpen={isTrainingSearchModalOpen} 
          onClose={() => setIsTrainingSearchModalOpen(false)} 
          onSubmit={handleTrainingSearchSubmit} 
          userProfile={userProfile} 
        />

        <PolicySearchModal 
          isOpen={isPolicySearchModalOpen}
          onClose={() => setIsPolicySearchModalOpen(false)}
          onSubmit={handlePolicySearchSubmit}
          userProfile={userProfile}
        />

        <MealSearchModal 
          isOpen={isMealSearchModalOpen}
          onClose={() => setIsMealSearchModalOpen(false)}
          onSubmit={handleMealSearchSubmit}
          userProfile={userProfile}
        />
      </main>
    </div>
  );
};

export default Chat;