import React from "react";
import "./LandingPage.css";
import { useNavigate } from "react-router-dom";
import youtubeLogo from "../../images/YOUTUBE_LOGO.png";
import landingSearch from "../../images/landing_search.png";
import landingPic1 from "../../images/landing_1pic.png";
import earthAirplane from "../../images/earth_airplane.png";
import landingGoogleMap from "../../images/landing_google_map.png";
import loadingMap from "../../images/loading_map.png";
import landingImage22 from "../../images/landing_image22.png";
import landingImage23 from "../../images/landing_image23.png";
import mapAirplane from "../../images/map_airplane.png";
import mapYoutube from "../../images/mapyoutube.png";

function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="WS-Landing-Page">
      <div className="SJ-top-image">
        <img src={mapYoutube} alt="Map Youtube" />
      </div>
      <div className="SJ-header">
        <h3>첫 여행도 두렵지 않게,</h3>
        <h1>
          유튜브 링크 하나로
          <br />
          나만의 여행 플랜 완성!
        </h1>
      </div>

      <div className="SJ-youtube-section">
        <div className="SJ-content">
          <div className="SJ-title-red">편리한 여행 장소 탐색</div>
          <div className="SJ-subtitle">유튜브 여행 영상 속 장소 자동 추출</div>
        </div>
        <img src={youtubeLogo} alt="YouTube" className="SJ-youtube-logo" />
      </div>

      <div className="SJ-search-section">
        <img src={landingSearch} alt="Search" className="SJ-search-image" />
        <img src={landingPic1} alt="Landing 1" className="SJ-landing-pic1" />
      </div>

      <div className="SJ-map-section">
        <div className="SJ-map-header">
          <div className="SJ-map-text">
            <div className="SJ-map-title">여행 일정을 한 눈에!</div>
            <div className="SJ-map-subtitle">
              AI가 짜주는 최적의 동선으로 일정 추천
            </div>
          </div>
          <img src={earthAirplane} alt="Earth" className="SJ-earth-icon" />
        </div>
        <img src={landingGoogleMap} alt="Google Map" className="SJ-map-image" />
      </div>

      <div className="SJ-preference-section">
        <div className="SJ-preference-header">
          <div className="SJ-preference-text">
            <h2>내 취향에 딱 맞게</h2>
            <p>원하는 장소, 일정, 동선까지 자유롭게 추천 가능</p>
          </div>
          <img src={loadingMap} alt="Map" className="SJ-preference-icon" />
        </div>

        <div className="SJ-tags">
          <button className="SJ-tag">전체보기</button>
          <button className="SJ-tag active">관광지</button>
          <button className="SJ-tag secondary">음식/카페</button>
          <button className="SJ-tag secondary">그 외</button>
        </div>

        <div className="SJ-selected">
          <span className="SJ-check">✔️</span>
          <span>전체 선택</span>
        </div>

        <div className="SJ-places">
          <div className="SJ-place-item">
            <div className="SJ-circle-checkbox"></div>
            <img src={landingImage22} alt="Urban Park" />
            <div className="SJ-place-info">
              <h3>도고 온천 본관</h3>
              <p>유서깊은 관광지, 온천</p>
            </div>
            <button className="SJ-menu">
              <span className="SJ-hamburger"></span>
            </button>
          </div>

          <div className="SJ-place-item">
            <div className="SJ-circle-checkbox"></div>
            <img src={landingImage23} alt="Senso-ji Temple" />
            <div className="SJ-place-info">
              <h3>도고 온천 별관</h3>
              <p>관광지, 온천</p>
            </div>
            <button className="SJ-menu">
              <span className="SJ-hamburger"></span>
            </button>
          </div>
        </div>

        <div className="SJ-travel-section">
          <div className="SJ-travel-header">
            <div className="SJ-travel-text">
              <h2>여행 중에도 편리하게!</h2>
              <p>나만의 여행 가이드북 & 실시간 여행 정보 제공</p>
            </div>
            <img src={mapAirplane} alt="Travel" className="SJ-travel-icon" />
          </div>

          <div className="SJ-restaurant-button">
            빠니보틀이 먹었던 냄비우동집 알려줘
          </div>

          <div className="SJ-chat-response">
            <div className="SJ-ai-icon">AI</div>
            <div className="SJ-chat-content">
              <p>빠니보틀이 갔던 냄비우동집은</p>
              <p>😋유노야 냄비우동 입니다.</p>
              <p className="SJ-restaurant-info">
                주소: 13-19 Dogoyunomachi, Matsuyama,
                <br />
                Ehime 790-0842 일본
                <br />
                시간: 오전11:00~오후3:00, 오후5:00~10:00
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="SJ-cta-text">
        <p>유튜브 링크 하나로 시작하는 나만의 여행!</p>
        <p> 👇🏻지금 바로👇🏻</p>
      </div>

      <button
        className="WS-Landing-Page-Button"
        onClick={() => navigate("/link")}
      >
        My Travel Link 시작
      </button>
    </div>
  );
}

export default LandingPage;
