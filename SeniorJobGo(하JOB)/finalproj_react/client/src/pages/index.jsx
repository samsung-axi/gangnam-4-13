import React, { useEffect, useState, useRef } from 'react';
import '../assets/css/main.css';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ChatbotIcon from '../assets/images/chatbot-icon.png';

const Main = () => {
  const [showUserInfoForm, setShowUserInfoForm] = useState(false);
  const [userInfo, setUserInfo] = useState({ age: '', location: '', jobType: ''});

  const messagesEndRef = useRef(null); // 스크롤을 위한 ref
  const chatContainerRef = useRef(null);

  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState([
    {
      type: 'bot',
      text: '안녕하세요. 시니어잡고입니다.\n본 챗봇은 상담원과의 실시간 채팅 서비스는 운영되지 않습니다'
    },
    {
      type: 'bot',
      text: '안녕하세요. 시니어잡고입니다.\n어떤 도움이 필요하신가요?',
      options: [
        { id: 1, text: '채용 정보' },
        { id: 2, text: '훈련 정보' },
        { id: 3, text: '이력서 관리' }
      ]
    }
  ]);

  const handleInputChange = (e) => {
    const text = e.target.value;
    if(text.length <= 200 & !text.includes('\n')) {
      setInputText(text);
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData('text');
      const newText = inputText + pastedText;

      // 붙여넣은 후의 전체 텍스트가 200자 넘지 않도록 제한
      if(newText.length <= 200) {
        setInputText(newText);
      } else {
        // 200자 까지만 잘라서 붙여넣기
        setInputText(newText.slice(0, 200));
      }
      // e.preventDefault();
  }

  const handleKeyPress = (e) => {
    if(e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      e.stopPropagation();
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    const trimmedText = inputText.trim();
    if(trimmedText === '') return;

    console.log("message: ", trimmedText);

    setMessages(prevMessages => [
      ...prevMessages,
      {
        type: 'user',
        text: trimmedText,
      },
    ]);
    setInputText('');
  }

  const handleOptionClick = (optionId) => {
    setMessages((prevMessages) => [
      ...prevMessages,
      {
        type: 'user',
        text: `옵션 ${optionId}번을 선택했습니다.`,
      },
    ]);
    if(optionId === 1) {
      setShowUserInfoForm(true);
    }
  };

  const handleUserInfoSubmit = (e) => {
    e.preventDefault();
    setMessages(prevMessages => [
      ...prevMessages,
      {
        type: 'bot',
        text: `입력하신 정보:\n나이: ${userInfo.age}\n희망근무지역:${userInfo.location}\n희망직무: ${userInfo.jobType}\n\n이 정보를 바탕으로 채용 정보를 검색하겠습니다.`
      }
    ]);
    setShowUserInfoForm(false);
  };

  const handleUserInfoChange = (e) => {
    const { name, value } = e.target;
    setUserInfo(prevInfo => ({ ...prevInfo, [name]: value }));
  };  

  // 메세지 추가될 때마다 스크롤 최신 이동
  useEffect(() => {
    const chatContainer = chatContainerRef.current;
    if(chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="main-container">
      <Header />
      <div className="chat-container">
        <div className="chat-header">
          <div className="chatbot-info">
            <img src={ChatbotIcon} alt="챗봇 아이콘" />
            <span>시니어잡봇과 채팅하기</span>
          </div>
          <button className="my-page">마이페이지</button>
        </div>
        
        <div className="chat-messages" ref={chatContainerRef}>
          {messages.map((message, index) => (
            <div key={index} className={`message ${message.type}`}>
              {message.type === 'bot' ? (
                <div className="bot-message">
                  <img src={ChatbotIcon} alt="챗봇 아이콘" className="bot-icon" />
                  <div className="message-content">
                    {message.text.split('\n').map((line, i) => (
                      <React.Fragment key={i}>
                        {line}
                        {i < message.text.split('\n').length - 1 && <br />}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="user-message">
                  <div className="message-content user">
                    {message.text.split('\n').map((line, i) => (
                      <React.Fragment key={i}>
                        {line}
                        {/* {i < message.text.split('\n').length - 1 && <br />} */}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              )}
              
              {message.options && (
                <div className="options-container">
                  {message.options.map((option) => (
                    <button
                      key={option.id}
                      className="option-button"
                      onClick={() => handleOptionClick(option.id)}
                    >
                      <span className="option-number">{option.id}</span>
                      <span className="option-text">{option.text}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
          {/* <div ref={messagesEndRef}></div> */}
          {showUserInfoForm && (
            <div className="message bot">
              <div className="bot-message">
                <img src={ChatbotIcon} alt="챗봇 아이콘" className="bot-icon" />
                <div className="message-content">
                  <form onSubmit={handleUserInfoSubmit} className="user-info-form">
                    <input type="number" name="age" value={userInfo.age} onChange={handleUserInfoChange} placeholder="나이" required />
                    <input type="text" name="location" value={handleUserInfoChange} placeholder="희망근무지역" required />
                    <input type="text" name="jobType" value={userInfo.jobType} onChange={handleUserInfoChange} placeholder="희망직무" required />
                    <button type="submit">입력</button>
                  </form>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="chat-input">
          <textarea 
            placeholder="메세지를 입력해주세요" 
            className="message-input"
            value={inputText}
            onChange={handleInputChange}
            onKeyUp={handleKeyPress}
            onPaste={handlePaste}
            rows="1"
          />
          <button type="button" className="send-button" onClick={handleSubmit}>전송</button>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Main;
