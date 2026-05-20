import React, { useState, useRef } from 'react';
import "../css/guide.css";
import camera from "../images/Cam.png";
import mic from "../images/record.svg";
import Logo from "../images/LOGO.png";
import { Link, useNavigate } from 'react-router-dom';
import { isMobile } from 'react-device-detect';


const Guide = () => {
    const navigate = useNavigate();
  
    const fileInputRef = useRef(null);
    // 모바일에서 카메라 아이콘을 클릭했을 때 호출
    const handleMobileCameraClick = () => {
      if (fileInputRef.current) {
        fileInputRef.current.click(); // 내장 카메라 앱 실행
      }
    };


      const [selectedPhoto, setSelectedPhoto] = useState(null);
    

    // 사진(파일) 선택 시
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedPhoto(file);
      // 선택된 파일을 Card 페이지로 전달하고 이동
      navigate('/card', {
        state: { photo: file },
      });
    }
  };
  return (
    <div className="guide-container">
      <div className="guide-header">
      <Link to="/">
        <img src={Logo} alt="Logo"className="logo" />
        </Link>                   
      </div>

      <div className="guide-content">
        <h1 className="guide-title">
          <h1 className="alert-icon">!알쏭달쏭 이용 가이드</h1>
        </h1>

        <div className="guide-steps">
          <div className="step">
            <div className="step-number">
              1. <img src={camera} alt="카메라" className="camera-icon" />
              사물을 촬영하고
            </div>
          </div>

          <div className="step">
            <div className="step-number">
              2. <span className="tag">한글</span>
              <span className="tag">영어</span> 단어/음성 확인
            </div>
          </div>

          <div className="step">
            <div className="step-number">
              3. <img src={mic} alt="마이크" className="mic-icon" />
              누르고 발음을 확인해요
            </div>
          </div>

          <div className="step">
            <div className="step-number">4. 바로 찍어볼까요?</div>
          </div>
        </div>

        <div className="guide-buttons">
        <Link to="/">
          <button className="btn-no">아니</button>
        </Link>


        {/** 
                       * 모바일: 버튼 클릭 시 먼저 사진을 찍은 후, card로 이동 
                       * 데스크탑: 기존 방식대로 card로 이동하며 openCamera: true 전달 
                       */}
                      {isMobile ? (
                        // 모바일
                        <>
                        <button className="btn-yes" onClick={handleMobileCameraClick}>응!</button>
                          <input
                            type="file"
                            accept="image/*"
                            capture="environment"
                            style={{ display: 'none' }}
                            ref={fileInputRef}
                            onChange={handleFileChange}
                          />
                        </>
                      ) : (
                        // 데스크탑
                        <Link to="/card" state={{ openCamera: true }}>
                          <button className="btn-yes">응!</button>
                        </Link>
                      )}
          <Link to="/">
          

        </Link> 
        </div>
      </div>
    </div>
  );
};

export default Guide;
