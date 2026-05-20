import React from "react";
import { useNavigate } from "react-router-dom";
import ShortBtn from "../../components/buttons/ShortBtn";
import MainSlider from "./MainSlider";
import "./home.css";
import usePlanStore from "../../stores/PlanStore";

const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <div className="slider-container">
        <MainSlider />
      </div>
      <div className="travel-container">
        <div className="travel-main-text">
          <h1>AI와 함께 떠나는 여행 계획</h1>
          <p>EASY TRAVEL과 함께 맞춤형 일정을 작성해보세요!</p>
        </div>
        <div className="travel-buttons">
          <div className="travel-plan-button">
            <ShortBtn 
              content="음성으로 시작" 
              onClick={() => {
                navigate("/voice");
              }}
            />
          </div>
          <div className="travel-plan-button">
            <ShortBtn
              content="텍스트로 시작"
              onClick={() => {
                usePlanStore.getState().initPlanInfo();
                navigate("/plan/filter");
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
