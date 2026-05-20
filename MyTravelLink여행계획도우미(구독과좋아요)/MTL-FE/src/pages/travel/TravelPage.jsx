import React, { useState } from 'react';
import TravelList from "./TravelList";
import GuidebookList from "./GuideBookList";
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

import '../../css/travel/TravelPage.css';

const TravelPage = () => {
  const [activeTab, setActiveTab] = useState('travel');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);


  const renderContent = () => {
    switch (activeTab) {
      case 'travel':
        return <TravelList />;
      case 'guide':
        return <GuidebookList />;
      default:
        return null;
    }
  };

  return (
    <div className="SJ-Travel-Page">

      <div className="SJ-Travel-Tab-Container">
        <div className="SJ-Travel-Tabs">
          
          <div
            className={`SJ-Travel-Tab ${activeTab === "travel" ? "active" : ""}`}
            onClick={() => setActiveTab("travel")}
          >
            여행 목록
          </div>

          <div
            className={`SJ-Travel-Tab ${activeTab === "guide" ? "active" : ""}`}
            onClick={() => setActiveTab("guide")}
          >
            가이드북 목록
          </div>

        </div>
        <div className="SJ-Tab-Indicator-Container">
          <div
            className="SJ-Tab-Indicator"
            style={{
              transform: `translateX(${activeTab === "travel" ? "0" : "100%"})`,
            }}
          ></div>
        </div>
      </div>

      <div className="SJ-Travel-Page-Content">
        {renderContent()}
      </div>
    </div>
  );
};

export default TravelPage;
