import React, { useState, useEffect } from 'react';
import LinkList from './LinkList';          // 링크 목록 컴포넌트
import SearchYoutube from './SearchYoutube';// 유튜브 검색 컴포넌트
import '../../css/linkpage/LinkPage.css';
import { FaCheck } from 'react-icons/fa'; // 체크 아이콘 import
import youtubeIcon from '../../images/youtube.png'; // YouTube 로고 이미지 import
import { useNavigate } from 'react-router-dom'; // 추가
import axios from 'axios'; // 추가


const LinkPage = () => {
  const navigate = useNavigate(); // 추가
  const [activeTab, setActiveTab] = useState('youtube');
  const [linkData, setLinkData] = useState([]); // 빈 배열로 초기화
  const [linkCount, setLinkCount] = useState(0); // 0으로 초기화

  // 링크 데이터를 가져오는 API 호출 함수
  const fetchLinks = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    // axios 호출 시 token이 올바르게 헤더에 추가되었는지 확인
    try {
      const response = await axios.get(process.env.REACT_APP_BACKEND_URL + '/user/url/list', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setLinkData(response.data);
    } catch (error) {
      console.error('링크 목록 조회 실패:', error);
    }
  };

  useEffect(() => {
    fetchLinks();
  }, [navigate]);

  useEffect(() => {
    setLinkCount(linkData.length);
  }, [linkData]);

  const renderContent = () => {
    switch (activeTab) {
      case 'links':
        return <LinkList linkData={linkData} setLinkData={setLinkData} />
      // refreshLinks={fetchLinks} />;
      case 'youtube':
        // SearchYoutube에 refreshLinks 함수를 전달합니다.
        return <SearchYoutube linkData={linkData} setLinkData={setLinkData} />
      default:
        return null;
    }
  };

  return (
    <div className="WS-Link-Page">
      {/* 탭 영역 */}
      <nav className="WS-Link-Tab-Container">
        {/* 유튜브검색 탭 */}
        <div className="WS-Link-Tabs">
          <div
            className={`WS-Link-Tab ${activeTab === "youtube" ? "active" : ""}`}
            onClick={() => setActiveTab("youtube")}
          >
            <div className="WS-Link-Tab-Content">
              <img
                src={youtubeIcon}
                alt="YouTube"
                className="WS-youtube-icon"
              />
              <span>유튜브 검색</span>
            </div>
          </div>

          {/* 링크 탭 */}
          <div
            onClick={() => setActiveTab("links")}
            className={`WS-Link-Tab ${activeTab === "links" ? "active" : ""}`}
          >
            <div className="WS-Link-Tab-Content">
              <span>링크</span>

              {linkCount >= 5 ? (
                <span className="WS-check-icon">
                  <FaCheck />
                </span>
              ) : (
                <span className="WS-Count">{linkCount}</span>
              )}
            </div>
          </div>

        </div>

        <div className="SJ-Tab-Indicator-Container">
          <div
            className="SJ-Tab-Indicator"
            style={{
              transform: `translateX(${activeTab === "youtube" ? "0" : "100%"
                })`,
            }}
          ></div>
        </div>
      </nav>

      <div className="WS-Link-Page-Content">{renderContent()}</div>
    </div>
  );
};

export default LinkPage;

// 완료 ===================================================================
