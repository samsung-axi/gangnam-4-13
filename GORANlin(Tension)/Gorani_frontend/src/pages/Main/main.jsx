import React, { useState, useEffect, useRef } from "react";
import "../../assets/css/all.css";
import "../../assets/css/Main/main.css";
import "../../assets/css/Translation/translation.css";
import Footer from "../Common/Footer";
import Header from "../Common/Header";
import Modal from "../Common/Modal";
import Glossary from "../Translation/Glossary";
import { getTranslationResult } from "../../Apis/TranslateAPI";

function Main() {
  
  const [inputText, setInputText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [showGlossary, setShowGlossary] = useState(false);
  const [showSourceDropdown, setShowSourceDropdown] = useState(false);
  const [showTargetDropdown, setShowTargetDropdown] = useState(false);
  const [sourceLanguage, setSourceLanguage] = useState("한국어");
  const [targetLanguage, setTargetLanguage] = useState("영어");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [nickname, setNickname] = useState("GORANI");
  const [userInfo, setUserInfo] = useState(null);
  const translationOutputRef = useRef(null);
  const [selectedModel, setSelectedModel] = useState("OpenAI"); // 기본값 OpenAI
  const [showModelDropdown, setShowModelDropdown] = useState(false);
  const availableModels = ["OpenAI", "Gorani", "LangGorani"];

  useEffect(() => {
    const storedUserInfo = localStorage.getItem("userInfo");
    const storedToken = localStorage.getItem("token");

    if (storedUserInfo && storedToken) {
      const parsedUserInfo = JSON.parse(storedUserInfo);
      setUserInfo(parsedUserInfo);
      setIsLoggedIn(true);
    } else {
      console.log("No user info or token found in localStorage");
      setUserInfo(null);
      setIsLoggedIn(false);
    }
  }, []);

  useEffect(() => {
    if (userInfo) {
      setNickname(userInfo.username || "GORANI");
    }
  }, [userInfo]); // ✅ userInfo가 변경될 때마다 닉네임 업데이트

  const toggleModelDropdown = (e) => {
    e.stopPropagation();
    setShowModelDropdown((prev) => !prev);
  };

  const selectModel = (model) => {
    setSelectedModel(model);
    setShowModelDropdown(false);
  };

  const handleTranslate = async () => {
    const sourceCode = languageCodeMap[sourceLanguage];
    const targetCode = languageCodeMap[targetLanguage];

    console.log(
      `Translating from: ${sourceCode} to: ${targetCode} using ${selectedModel}`
    );

    try {
      const response = await getTranslationResult(
        inputText,
        sourceCode,
        targetCode,
        selectedModel
      );
      console.log("Translation Response:", response);
      setTranslatedText(response);
      setIsEditing(false);
    } catch (error) {
      console.error("Error during translation request:", error);
      alert("번역 요청 중 문제가 발생했습니다. 다시 시도해 주세요.");
    }
  };

  const openGlossary = () => {
    setShowGlossary((prev) => !prev);
  };

  const toggleSourceDropdown = (e) => {
    e.stopPropagation();
    setShowSourceDropdown((prev) => !prev);
  };

  const toggleTargetDropdown = (e) => {
    e.stopPropagation();
    setShowTargetDropdown((prev) => !prev);
  };

  const selectSourceLanguage = (language) => {
    setSourceLanguage(language);
    setShowSourceDropdown(false);
  };

  const selectTargetLanguage = (language) => {
    setTargetLanguage(language);
    setShowTargetDropdown(false);
  };

  const toggleModal = () => {
    setIsModalOpen((prev) => !prev);
  };

  const handleLogin = () => {
    const userInfo = { username: "GORANI" };
    localStorage.setItem("userInfo", JSON.stringify(userInfo));

    setUserInfo(userInfo); // 상태 업데이트
    setIsLoggedIn(true);
    setIsModalOpen(false);
  };
  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    setUserInfo(null);
    setIsLoggedIn(false);
    setNickname("GORANI");
    alert("로그아웃되었습니다.");
  };

  const reverseLanguages = () => {
    setSourceLanguage(targetLanguage);
    setTargetLanguage(sourceLanguage);
    setInputText(translatedText); // 입력창 내용을 번역 결과로 변경
    setTranslatedText(inputText); // 번역 결과를 입력창 내용으로 변경
  };

  const languageCodeMap = {
    한국어: "korean",
    영어: "english",
    일본어: "Japanese",
  };

  const handleCopy = () => {
    navigator.clipboard
      .writeText(translatedText)
      .then(() => alert("번역 결과가 복사되었습니다."))
      .catch((err) => console.error("복사 실패:", err));
  };

  const toggleEdit = () => {
    setIsEditing((prev) => {
      const newState = !prev;
      if (newState) {
        setTimeout(() => {
          if (translationOutputRef.current) {
            translationOutputRef.current.focus();
          }
        }, 0); // 상태 변경 후 focus() 실행
      }
      return newState;
    });
  };


  return (
    <div className="translation-container">
      <Header
        isLoggedIn={isLoggedIn}
        nickname={nickname} 
        toggleModal={toggleModal}
        handleLogout={handleLogout}
      />
      <main className="main-content">
        <div className="translation-box">
          <div className="model-selection">
            <button
              className="model-button"
              onClick={(e) => toggleModelDropdown(e)}
            >
              <span>{selectedModel}</span>
            </button>
            {showModelDropdown && (
              <ul className="model-dropdown">
                {availableModels.map((model) => (
                  <li key={model} onClick={() => selectModel(model)}>
                    {model}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="before-translation">
            <div className="data-source-language">
              <div className="left-items">
                <div
                  className="data-source-language-button"
                  onClick={(e) => toggleSourceDropdown(e)}
                >
                  <span>{sourceLanguage}</span>
                </div>
                <button
                  className="dropdown-toggle-button"
                  onClick={(e) => toggleSourceDropdown(e)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={`dropdown-icon ${
                      showSourceDropdown ? "clicked" : ""
                    }`}
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>
              </div>

              <div className="right-items">
                <img
                  src="../../../images/revers.jpg"
                  alt="Reverse Icon"
                  className="reverse-icon"
                  onClick={reverseLanguages} // 리버스 기능 추가
                />
              </div>
              {showSourceDropdown && (
                <ul className="language-dropdown">
                  {["한국어", "영어", "일본어"].map((lang) => (
                    <li
                      key={lang}
                      className={`language-option ${
                        lang === targetLanguage ? "disabled" : ""
                      }`}
                      onClick={() =>
                        lang !== targetLanguage && selectSourceLanguage(lang)
                      }
                    >
                      {lang}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <textarea
              className="translation-input"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="번역할 내용을 입력하세요"
              lang={languageCodeMap[sourceLanguage]}
            />
            <button className="translation-button" onClick={handleTranslate}>
              번역하기
            </button>
          </div>
          <div className="translation-result">
            <div className="data-source-language">
              <div className="left-items">
                <div
                  className="data-source-language-button"
                  onClick={(e) => toggleTargetDropdown(e)}
                >
                  <span>{targetLanguage}</span>
                </div>
                <button
                  className="dropdown-toggle-button"
                  onClick={(e) => toggleTargetDropdown(e)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={`dropdown-icon ${
                      showTargetDropdown ? "clicked" : ""
                    }`}
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>
              </div>
              <div className="right-items">
                <button
                  className="glossary-button"
                  onClick={
                    isLoggedIn
                      ? openGlossary
                      : () => alert("로그인 후 이용 가능합니다.")
                  }
                >
                  용어집
                </button>
                {showGlossary && isLoggedIn && userInfo && (
                  <Glossary
                    userInfo={userInfo}
                    onClose={() => setShowGlossary(false)}
                  />
                )}
              </div>
              {showTargetDropdown && (
                <ul className="language-dropdown">
                  {["한국어", "영어", "일본어"].map((lang) => (
                    <li
                      key={lang}
                      className={`language-option ${
                        lang === sourceLanguage ? "disabled" : ""
                      }`}
                      onClick={() =>
                        lang !== sourceLanguage && selectTargetLanguage(lang)
                      }
                    >
                      {lang}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <textarea
              className="translation-output"
              value={translatedText}
              onChange={(e) => setTranslatedText(e.target.value)}
              disabled={!isEditing}
              ref={translationOutputRef}
              lang={languageCodeMap[targetLanguage]}
            ></textarea>
            <div className="output-button">
              <button className="output-edit" onClick={toggleEdit}>
                <svg
                  fill="#fff"
                  width="25px"
                  height="25px"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M22,7.24a1,1,0,0,0-.29-.71L17.47,2.29A1,1,0,0,0,16.76,2a1,1,0,0,0-.71.29L13.22,5.12h0L2.29,16.05a1,1,0,0,0-.29.71V21a1,1,0,0,0,1,1H7.24A1,1,0,0,0,8,21.71L18.87,10.78h0L21.71,8a1.19,1.19,0,0,0,.22-.33,1,1,0,0,0,0-.24.7.7,0,0,0,0-.14ZM6.83,20H4V17.17l9.93-9.93,2.83,2.83ZM18.17,8.66,15.34,5.83l1.42-1.41,2.82,2.82Z" />
                </svg>
              </button>
              <button className="output-copy" onClick={handleCopy}>
                <svg
                  fill="#fff"
                  width="25px"
                  height="25px"
                  viewBox="0 0 1920 1920"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M0 1919.887h1467.88V452.008H0v1467.88ZM1354.965 564.922v1242.051H112.914V564.922h1242.051ZM1920 0v1467.992h-338.741v-113.027h225.827V112.914H565.035V338.74H452.008V0H1920ZM338.741 1016.93h790.397V904.016H338.74v112.914Zm0 451.062h790.397v-113.027H338.74v113.027Zm0-225.588h564.57v-112.913H338.74v112.913Z"
                    fill-rule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </main>
      <Modal isOpen={isModalOpen} toggleModal={toggleModal}>
        <button onClick={handleLogin}>로그인 완료</button>
      </Modal>
      <div className="shooting_star"></div>
      <div className="shooting_star"></div>
      <div className="shooting_star"></div>
      <div className="shooting_star"></div>
      <div className="shooting_star"></div>
      <div className="shooting_star"></div>
      <Footer />
    </div>
  );
}

export default Main;
