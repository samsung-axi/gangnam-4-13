import React, { useEffect, useState, useRef } from "react";
import "./Loading.css";
import loadingEarth from "../../images/loading_earth.png";
import loadingSunglass from "../../images/loading_sunglass.png";
import loadingBag from "../../images/loading_bag.png";
import loadingMap from "../../images/loading_map.png";
import loadingAirplane from "../../images/loading_airplane.png";

function Loading({ type = "default" }) {
  const [progress, setProgress] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const animationFrameRef = useRef();
  const lastUpdateTimeRef = useRef(Date.now());
  const loadingImages = [loadingEarth, loadingSunglass, loadingBag, loadingMap];

  
  // 메시지 설정
  const messages = {
    default: {  // 기본 메시지 추가
      main: "잠시만 기다려주세요.",
      sub: "최상의 결과를 위해\n준비중입니다.",
    },
    travelInfo: {
      main: "여행 기간에 맞는\n여행 정보를\n준비중입니다.",
      sub: "최상의 결과를 위해\n2~3분만 기다려 주세요.",
    },
    guidebook: {
      main: "여행 장소를 담은\n가이드북을\n준비중입니다.",
      sub: "최상의 결과를 위해\n2~3분만 기다려 주세요.",
    },
    travelList: {
      main: "여행 정보를 담은\n목록을\n준비중입니다.",
      sub: "최상의 결과를 위해\n2~3분만 기다려 주세요.",
    },
    guideList: {
      main: "가이드북을 담은\n목록을\n준비중입니다.",
      sub: "최상의 결과를 위해\n2~3분만 기다려 주세요.",
    },
  };
  const currentMessage = messages[type] || messages.default;

  useEffect(() => {
    // 이미지 순환을 위한 타이머
    const imageInterval = setInterval(() => {
      setCurrentImageIndex(
        (prevIndex) => (prevIndex + 1) % loadingImages.length
      );
    }, 2000);

    // cleanup 함수에 interval 정리 추가
    return () => {
      clearInterval(imageInterval);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  // 별도의 useEffect로 분리하여 성능 체크와 애니메이션 처리
  useEffect(() => {
    const animate = () => {
      const currentTime = Date.now();
      const deltaTime = currentTime - lastUpdateTimeRef.current;
      
      // 3700ms 동안 진행되도록 설정 (비행기와 동일)
      const duration = 3700;

      setProgress((prevProgress) => {
        // 비행기와 동일한 속도로 진행
        const newProgress = prevProgress + (deltaTime / duration) * 100;

        if (newProgress >= 100) {
          // 100%에 도달하면 약간의 지연 후 리셋
          setTimeout(() => {
            setProgress(0);
          }, 15);
          return 100;
        }

        return newProgress;
      });

      lastUpdateTimeRef.current = currentTime;
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    lastUpdateTimeRef.current = Date.now();
    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  // 비행기와 프로그레스 바가 동시에 사라지도록 설정
  const airplaneOpacity = progress >= 98 ? 0 : 1;
  const progressWidth = progress >= 100 ? 0 : progress;

  return (
    <div className="SJ_loading_container">
      <div className="SJ_loading_content">
        <div className="SJ_loading_image_container">
          <img
            src={loadingImages[currentImageIndex]}
            alt="Loading Icon"
            className="SJ_loading_earth"
          />
        </div>
        <p className="SJ_loading_message">
          {currentMessage.main}
        </p>
        <p className="SJ_loading_sub_message">
          {currentMessage.sub}
        </p>
        <div className="SJ_progress_wrapper">
          <img
            src={loadingAirplane}
            alt="Loading Airplane"
            className="SJ_loading_airplane"
          />
          <div className="SJ_progress_container">
            <div className="SJ_progress_bar_main" />
            <div className="SJ_progress_bar_background" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Loading;
