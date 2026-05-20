import React, { useState, useRef, useEffect } from "react";
import { FaComments, FaTimes } from "react-icons/fa";
import "../css/layout/Wish.css";
import OpenAI from "openai";
import { v4 as uuidv4 } from "uuid";
import ReactDOM from "react-dom";
import SendIcon from "@mui/icons-material/Send";
import wishBotIcon from "../images/basic profile.png";

import { searchContent } from "../apis/Apis";

const Wish = ({ onClose }) => {
  const [messages, setMessages] = useState([
    {
      id: uuidv4(),
      type: 'bot',
      content: '안녕하세요! 여행 계획에 대해 어떤 도움이 필요하신가요?'
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const modalRef = useRef(null);

  // OpenAI 클라이언트 초기화
  const openai = new OpenAI({
    apiKey: process.env.REACT_APP_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true, // 클라이언트 사이드에서 사용
  });

  // 자동 스크롤
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 모달 외부 클릭 처리
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  // 날씨 상태 한글 매핑
  const weatherTranslation = {
    // 날씨 메인 상태
    Clear: "맑음",
    Clouds: "구름",
    Rain: "비",
    Drizzle: "이슬비",
    Thunderstorm: "천둥번개",
    Snow: "눈",
    Mist: "안개",
    Fog: "안개",
    Haze: "실안개",

    // 상세 설명
    "clear sky": "맑은 하늘",
    "few clouds": "구름 조금",
    "scattered clouds": "구름 조금",
    "broken clouds": "구름 많음",
    "overcast clouds": "흐림",
    "light rain": "약한 비",
    "moderate rain": "비",
    "heavy rain": "강한 비",
    "light snow": "약한 눈",
    snow: "눈",
    mist: "안개",
    fog: "안개",
    haze: "실안개",
  };

  // 현재 위치 가져오기
  const getCurrentLocation = () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocation이 지원되지 않습니다."));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          reject(error);
        }
      );
    });
  };

  // 현재 위치의 날씨 정보 가져오기
  const getCurrentLocationWeather = async () => {
    const API_KEY = process.env.REACT_APP_WEATHER_API_KEY;

    if (!API_KEY) {
      console.error("API 키가 설정되지 않았습니다.");
      return {
        error: true,
        message: "API 키가 설정되지 않았습니다.",
        details: ".env 파일에 REACT_APP_WEATHER_API_KEY를 설정해주세요.",
      };
    }

    try {
      const location = await getCurrentLocation();
      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${location.latitude}&lon=${location.longitude}&appid=${API_KEY}&units=metric&lang=kr`;

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(
          `날씨 정보를 찾을 수 없습니다. 상태 코드: ${response.status}`
        );
      }

      const data = await response.json();

      // 날씨 상태 번역
      const weatherMain =
        weatherTranslation[data.weather[0].main] || data.weather[0].main;
      const weatherDesc =
        weatherTranslation[data.weather[0].description] ||
        data.weather[0].description;

      return {
        cityName: data.name,
        temperature: Math.round(data.main.temp),
        condition: weatherMain,
        description: weatherDesc,
        humidity: data.main.humidity,
        feelsLike: Math.round(data.main.feels_like),
      };
    } catch (error) {
      console.error("날씨 정보를 가져오는데 실패했습니다:", error);
      return {
        error: true,
        message: error.message,
        details: "위치 정보를 확인해주세요.",
      };
    }
  };

  // 챗봇 응답 생성 함수
  const generateBotResponse = async (userMessage) => {
    // 특정 키워드에 대한 즉각 응답 처리 (예: 날씨, 환율)
    if (userMessage.includes("날씨")) {
      return "현재 날씨 버튼을 클릭하시면 실시간 날씨 정보를 확인하실 수 있습니다.";
    }
    if (userMessage.includes("환율")) {
      return "환율 버튼을 클릭하시면 현재 엔화/원화 환율을 확인하실 수 있습니다.";
    }

    try {
      // OpenAI API에 보낼 프롬프트 구성
      const prompt = `
      시스템: 당신은 일본 여행 전문가입니다. 다음 규칙을 따라 답변해주세요:
      - 한국어로 답변합니다.
      - 친절하고 상세하게 설명합니다.
      - 존댓말을 사용합니다.
      - 일본 여행에 대한 전문적인 조언을 제공합니다.
      - 답변은 3-4문장으로 구성합니다.
      
      사용자 질문: ${userMessage}
      
      답변:`;

      // OpenAI API 호출 (예시: text-davinci-003 모델 사용)
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",  // 최신 모델 사용
          messages: [
            {
              role: "system",
              content: prompt
            },
            {
              role: "user",
              content: userMessage
            }
          ],
          max_tokens: 200,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        throw new Error("API 응답 오류");
      }

      const data = await response.json();
      if (data && data.choices && data.choices[0] && data.choices[0].message) {
        return data.choices[0].message.content.trim();
      }
      throw new Error("응답 형식 오류");
    } catch (error) {
      console.error("응답 생성 중 오류:", error);
      return "죄송합니다. 질문을 더 구체적으로 해주시면 자세히 답변 드리도록 하겠습니다. 특정 도시, 관광지, 교통, 숙소, 음식 등에 대해 궁금하신 점을 말씀해 주세요.";
    }
  };

  // 메시지 전송 처리 예시
  const handleSendMessage = async () => {
    if (inputMessage.trim() === "" || isLoading) return;

    try {
      setIsLoading(true);

      // 사용자 메시지 추가
      const userMessage = {
        id: uuidv4(),
        type: "user",
        content: inputMessage,
      };
      setMessages(prev => [...prev, userMessage]);
      setInputMessage("");

      // 백엔드 API 호출ㄷe
      const response = await fetch(process.env.REACT_APP_BACKEND_URL + "/api/v1/chat/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: inputMessage,
          chat_history: messages
            .filter(m => m.type === "user" || m.type === "bot")
            .map(m => [m.type === "user" ? m.content : "", m.type === "bot" ? m.content : ""])
            .filter(([q, a]) => q || a)
        }),
      });

      if (!response.ok) {
        throw new Error("API 응답 오류");
      }

      const data = await response.json();

      // 봇 응답 추가
      const botMessage = {
        id: uuidv4(),
        type: "bot",
        content: data.response,
        sources: data.search_results  // 검색 결과가 있다면 표시
      };
      setMessages(prev => [...prev, botMessage]);

    } catch (error) {
      console.error("메시지 처리 중 오류:", error);
      const errorMessage = {
        id: uuidv4(),
        type: "bot",
        content: "죄송합니다. 일시적인 오류가 발생했습니다. 다시 시도해 주세요."
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      scrollToBottom();
    }
  };

  // Enter 키 처리
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // 날씨 정보 가져오기 버튼 핸들러
  const handleWeatherButton = async () => {
    try {
      const weatherInfo = await getCurrentLocationWeather();
      if (weatherInfo && !weatherInfo.error) {
        const weatherMessage = {
          id: messages.length + 1,
          type: "bot",
          content: `${weatherInfo.cityName}의 현재 날씨 정보\n날씨: ${weatherInfo.condition}\n기온: ${weatherInfo.temperature}°C\n체감온도: ${weatherInfo.feelsLike}°C\n습도: ${weatherInfo.humidity}%`,
        };
        setMessages((prev) => [...prev, weatherMessage]);
        scrollToBottom();
      } else {
        const errorMessage = {
          id: messages.length + 1,
          type: "bot",
          content: `날씨 정보를 가져오는데 실패했습니다. ${weatherInfo?.message || ""
            } ${weatherInfo?.details || ""}`,
        };
        setMessages((prev) => [...prev, errorMessage]);
        scrollToBottom();
      }
    } catch (error) {
      console.error("날씨 정보 가져오기 실패:", error);
      const errorMessage = {
        id: messages.length + 1,
        type: "bot",
        content: "죄송합니다. 날씨 정보를 가져오는데 실패했습니다.",
      };
      setMessages((prev) => [...prev, errorMessage]);
      scrollToBottom();
    }
  };

  // 환율 정보 가져오기
  const getExchangeRate = async () => {
    try {
      const response = await fetch(
        "https://api.exchangerate-api.com/v4/latest/JPY"
      );
      const data = await response.json();

      // KRW/JPY 환율 계산 (1엔 당 원화)
      const krwPerJpy = data.rates.KRW;

      // 1000엔 기준으로 계산
      const jpyAmount = 1000;
      const krwAmount = (krwPerJpy * jpyAmount).toFixed(0);

      return {
        jpyAmount,
        krwAmount,
        rate: krwPerJpy,
      };
    } catch (error) {
      console.error("환율 정보를 가져오는데 실패했습니다:", error);
      return null;
    }
  };

  // 환율 버튼 핸들러
  const handleExchangeButton = async () => {
    try {
      const exchangeInfo = await getExchangeRate();
      if (exchangeInfo) {
        const exchangeMessage = {
          id: messages.length + 1,
          type: "bot",
          content: `엔화/원화 환율 정보

🇯🇵 100엔 
🇰🇷 ${exchangeInfo.rate.toFixed(2) * 100}원`,
        };
        setMessages((prev) => [...prev, exchangeMessage]);
        scrollToBottom();
      } else {
        const errorMessage = {
          id: messages.length + 1,
          type: "bot",
          content: "죄송합니다. 환율 정보를 가져오는데 실패했습니다.",
        };
        setMessages((prev) => [...prev, errorMessage]);
        scrollToBottom();
      }
    } catch (error) {
      console.error("환율 정보 처리 실패:", error);
      const errorMessage = {
        id: messages.length + 1,
        type: "bot",
        content: "죄송합니다. 환율 정보를 처리하는데 실패했습니다.",
      };
      setMessages((prev) => [...prev, errorMessage]);
      scrollToBottom();
    }
  };

  return ReactDOM.createPortal(
    <div className="WS-Modal-Overlay">
      <div className="WS-Wish" ref={modalRef}>
        <div className="WS-Wish-Header">
          <h3>Wish : AI 여행 도우미</h3>
          <button
            className="WS-Wish-Close-Button"
            onClick={onClose}
          >
            <FaTimes />
          </button>
        </div>

        <div className="WS-Wish-Messages">
          {messages.map(message => (
            <div
              key={message.id}
              className={`WS-Wish-Message ${message.type}`}
            >
              {message.type === 'bot' && (
                <div className="WS-Wish-Bot-Avatar">
                  <img className="WS-Wish-Bot-Avatar-Icon" src={wishBotIcon} alt="wishBotIcon" />
                </div>
              )}
              <div className="WS-Wish-Message-Content">
                {message.content}
                {message.sources && message.sources.length > 0 && (
                  <div className="WS-Wish-Sources">
                    <small>참고 자료:</small>
                    <ul>
                      {message.sources.map((source, index) => (
                        <li key={index}>
                          <a href={source.url} target="_blank" rel="noopener noreferrer">
                            {source.title || source.url}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="WS-Wish-Message bot">
              <div className="WS-Wish-Bot-Avatar">A</div>
              <div className="WS-Wish-Message-Content">
                답변을 생성하고 있습니다...
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="WS-Wish-Weather-Button-Container">
          <button
            onClick={handleWeatherButton}
            className="WS-Wish-Weather-Button"
          >
            날씨 ☀
          </button>
          <button
            className="WS-Wish-Exchange-Button"
            onClick={handleExchangeButton}
          >
            환율 💴
          </button>
        </div>
        <div className="WS-Wish-Input-Container">
          <input
            className="WS-Wish-Input"
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="메시지를 입력하세요."
            disabled={isLoading}
          />
          <button
            className="WS-Wish-Send-Button"
            onClick={handleSendMessage}
            disabled={isLoading}
          >
            <SendIcon />
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default Wish;
