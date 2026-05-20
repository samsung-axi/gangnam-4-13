import React, { useState, useEffect } from "react";
import Modal from "../../layouts/AlertModal";
import "../../css/linkpage/LinkList.css";
import { FaMinus } from "react-icons/fa";
import SelectDayTab from "./SelectDayTab";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const LinkList = ({ linkData, setLinkData }) => {
  const [inputLink, setInputLink] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [showDayTab, setShowDayTab] = useState(false);
  const navigate = useNavigate();

  // 모달 표시 함수
  const showModal = (message) => {
    setModalMessage(message);
    setModalOpen(true);
  };

  // URL 유효성 검사 함수
  const isValidUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  // 링크 타입 확인 함수
  const getLinkType = (url) => {
    const loweredUrl = url.toLowerCase();
    if (loweredUrl.includes("youtube.com") || loweredUrl.includes("youtu.be")) {
      return "youtube";
    } else if (
      loweredUrl.includes("naver.com") ||
      loweredUrl.includes("blog.naver")
    ) {
      return "blog";
    }
    return null;
  };

  // URL 중복 체크 함수
  const isLinkDuplicate = (url) => {
    return linkData.some((link) => {
      const normalizeUrl = (url) => {
        try {
          const normalized = new URL(url);
          return normalized.hostname + normalized.pathname + normalized.search;
        } catch {
          return url;
        }
      };
      return normalizeUrl(link.url) === normalizeUrl(url);
    });
  };

  // 링크 추가 처리
  const handleAddLink = async () => {
    if (linkData.length >= 5) {
      showModal("링크는 최대 5개까지만 추가할 수 있습니다.");
      return;
    }

    if (!inputLink.trim()) {
      showModal("URL을 입력해주세요.");
      return;
    }

    if (!isValidUrl(inputLink)) {
      showModal("올바른 URL 형식이 아닙니다.");
      return;
    }

    if (isLinkDuplicate(inputLink)) {
      showModal("이미 등록된 링크입니다.");
      setInputLink("");
      return;
    }

    const type = getLinkType(inputLink);
    if (!type) {
      showModal("지원하지 않는 URL입니다.");
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      // SearchYoutube.jsx와 동일한 API 엔드포인트 사용
      const response = await axios.post(process.env.REACT_APP_BACKEND_URL + '/user/save', {
        url: inputLink,
        title: inputLink, // 초기 제목은 URL로 설정
        author: "직접 입력" // 직접 입력한 URL임을 표시
      }, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.status === 200) {
        setLinkData((prev) => [
          ...prev,
          {
            url: inputLink,
            type: type,
            id: Date.now(),
            url_title: response.data.title || inputLink,
            author: "직접 입력",
          },
        ]);

        setInputLink("");
      }
    } catch (error) {
      console.error("URL 저장 실패:", error);
      let errorMessage = '링크 저장에 실패했습니다.';
      if (error.response && error.response.data) {
        errorMessage = error.response.data.message || JSON.stringify(error.response.data);
      }
      showModal(errorMessage); // 
    }
  };

  // 링크 삭제 함수
  const handleDeleteLink = async (link) => {
    if (!window.confirm(`${link.url}을(를) 삭제하시겠습니까?`)) return;
    const token = localStorage.getItem('token');
    try {
      await axios.delete(process.env.REACT_APP_BACKEND_URL + '/user/delete?url=' + encodeURIComponent(link.url), {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setLinkData(linkData.filter((l) => l.id !== link.id));
    } catch (error) {
      console.error("URL 삭제 실패:", error);
      let msg = 'URL 삭제 실패';
      if (error.response && error.response.data) {
        msg = error.response.data.message || JSON.stringify(error.response.data);
      }
      alert(msg);
    }
  };

  // 다음 버튼 클릭 시 등록된 링크의 URL만 추출하여 SelectDayTab으로 전달하면서 화면 전환
  const handleNextClick = () => {
    setShowDayTab(true);
  };

  const handleBack = () => {
    setShowDayTab(false);
  };

  // 컴포넌트 마운트 시 저장된 URL 목록 가져오기
  useEffect(() => {
    const fetchSavedUrls = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        const response = await axios.get(
          process.env.REACT_APP_BACKEND_URL + "/user/url/list",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (response.status === 200 && response.data) {
          const urls = response.data.map(item => ({
            url: item.url,
            type: getLinkType(item.url),
            id: item.id || Date.now(),
            url_title: item.urlTitle || item.url,
            author: item.urlAuthor || "직접 입력"
          }));
          setLinkData(urls);
        }
      } catch (error) {
        console.error("URL 목록 가져오기 실패:", error);
        let errorMessage = "저장된 URL 목록을 가져오는데 실패했습니다.";
        if (error.response && error.response.data) {
          errorMessage = error.response.data.message || JSON.stringify(error.response.data);
        }
        showModal(errorMessage);
      }
    };

    fetchSavedUrls();
  }, []); // 컴포넌트 마운트 시 한 번만 실행

  if (showDayTab) {
    // linkData는 { url, type, id } 객체 배열입니다.
    // URL 문자열만 추출하여 linkData prop으로 전달합니다.
    const linkUrls = linkData.map((link) => link.url);
    return <SelectDayTab onBack={handleBack} linkData={linkUrls} />;
  }
  
  return (
    <div className="WS-LinkList">
      <div className="WS-Link-Input-Container">
        <input
          id="WS-guidebook-search-input"
          type="text"
          placeholder="유튜브 or 블로그 링크 붙여넣기"
          className="WS-Link-Input"
          value={inputLink}
          onChange={(e) => setInputLink(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleAddLink()}
        />
        <button className="WS-LinkList-AddButton" onClick={handleAddLink}>
          {" "}+{" "}
        </button>
      </div>

      <div className="WS-LinkList-Items">
        {linkData.map((link, index) => {
          const displayTitle = link.url_title || "제목 없음";
          const typeValue = getLinkType(link.url);
          return (
            <div key={index} className={`WS-LinkList-Item ${typeValue}`}>
              <div className="WS-LinkList-Content">
                <span className="WS-LinkList-Badge">
                  {typeValue === "youtube" ? "YOUTUBE" : "BLOG"}
                </span>
                <span className="WS-LinkList-Text" title={displayTitle}>
                  {displayTitle.length > 23
                    ? `${displayTitle.substring(0, 23)}...`
                    : displayTitle}
                </span>
              </div>
              <button
                className="WS-LinkList-DeleteButton"
                onClick={() => handleDeleteLink(link)}
                title="삭제"
              >
                <FaMinus />
              </button>
            </div>
          );
        })}

        <div className="WS-LinkList-Next-Container">
          <div className="WS-LinkList-Counter">{linkData.length}/5</div>
          <button
            className="WS-LinkList-NextButton"
            disabled={linkData.length === 0}
            onClick={handleNextClick}
          >
            다음
          </button>
        </div>
      </div>

      <Modal
        isOpen={modalOpen}
        message={modalMessage}
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
};

export default LinkList;