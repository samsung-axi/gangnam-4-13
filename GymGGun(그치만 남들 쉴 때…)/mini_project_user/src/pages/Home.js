import React, { useState, useRef, useEffect } from "react";
import "../styles/Home.css";
import { useAppContext } from "../AppContext";

const Home = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef(null);
  const progressIntervalRef = useRef(null);
  const { setImageData, toggle, setIsToggled, setName } = useAppContext();
  const isCanceledRef = useRef(false);

  useEffect(() => {
    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, []);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile);
    } else {
      alert("PDF 파일만 업로드 가능합니다.");
      e.target.value = null;
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type === "application/pdf") {
        setFile(droppedFile);

        // 파일 input 엘리먼트에도 파일 설정
        // 이는 새로운 DataTransfer 객체를 생성하고 파일을 추가한 다음,
        // 그것을 input 엘리먼트의 files 속성에 할당하는 방식으로 작동합니다
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(droppedFile);
        fileInputRef.current.files = dataTransfer.files;
      } else {
        alert("PDF 파일만 업로드 가능합니다.");
      }
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const startProgressSimulation = () => {
    setProgress(0);

    // 프로그레스 바를 시뮬레이션하기 위한 인터벌 설정
    // 실제 API에서는 진행 상황을 받아와서 업데이트해야 합니다
    const simulateProgress = () => {
      setProgress((prevProgress) => {
        // 현재 진행 상태에 따라 증가 속도 조절
        let increment;
        if (prevProgress < 30) {
          increment = 3; // 초기에는 빠르게
        } else if (prevProgress < 60) {
          increment = 2; // 중간은 보통 속도
        } else if (prevProgress < 85) {
          increment = 1; // 후반에는 느리게
        } else {
          increment = 0.5; // 마지막은 아주 느리게
        }

        // 95%까지만 진행 (100%는 완료 시에만)
        return Math.min(prevProgress + increment, 95);
      });
    };

    // 50ms마다 진행 상태 업데이트
    progressIntervalRef.current = setInterval(simulateProgress, 50);
  };

  const handleAnalyze = async (e) => {
    e.preventDefault();
    if (!file) {
      alert("PDF 파일을 업로드해주세요.");
      return;
    }
  
    setLoading(true);
    isCanceledRef.current = false;
    startProgressSimulation();
  
    const formData = new FormData();
    formData.append("file", file);
  
    try {
      const response = await fetch("http://localhost:8000/process-pdf", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      setImageData(data.image);
      setName(data.name);

      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
      setProgress(100);

      if (isCanceledRef.current) return;
      setLoading(false);
      toggle();
    } catch (error) {
      console.error("분석 중 오류 발생:", error);
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
  
      setLoading(false);
      setProgress(0);
      setIsToggled(false);
      alert("분석 중 오류가 발생했습니다. 다시 시도해주세요.");
    }
  };

  const cancelProgress = () => {
    isCanceledRef.current = true;
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
    }
    setProgress(0);
    setLoading(false);
    setIsToggled(false);
  };    

  return (
    <div className="home-container">
      <div className="overlay-content">
        <h1 className="main-title">추억 속 나를 만나다.</h1>
        <p className="sub-title">&lt;AI 활용 학교생활기록부 리마인더&gt;</p>
        
        <div className="instructions">
          <p className="instruction-text">
            {/* <span className="instruction-icon">ℹ️</span> */}
            학교생활기록부는 단순한 성적표가 아니라 한때의 노력과 성취, 성장의 기록이 담긴 특별한 문서입니다.<br/>
            목표를 위해 노력했던 그 시절의 나를 추억해 보아요.<br/><br/>
          <span className="warning-text">
            ※ '고등학교' 생활기록부가 아니거나, 재학 중인 경우 결과가 만족스럽지 않을 수도 있어요. ※<br/>
          </span>
          </p>
        </div>
      <div className="upload-form">
      {!loading ? (
        <form onSubmit={handleAnalyze} onDragEnter={handleDrag}>
          <div
            className={`file-upload-area ${dragActive ? "drag-active" : ""}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              type="file"
              ref={fileInputRef}
              id="pdf-upload"
              accept="application/pdf"
              onChange={handleFileChange}
              className="file-input"
              required={!file} // 파일이 이미 선택되어 있으면 required 속성을 false로 설정
            />

            <div className="upload-content">
              <button
                type="button"
                className="upload-button"
                onClick={handleButtonClick}
              >
                {/* <span className="plus-icon">+</span>  */}
                {file ? "파일 다시 찾기": "파일 찾기"}
              </button>
              <p className="drag-text">
                {file ? "": "또는 여기에 PDF 파일 끌어다 놓기"}
              </p>
            </div>

            {file && (
              <div className="selected-file">
                <div className="file-badge">
                  <svg
                    className="file-icon"
                    viewBox="0 0 24 24"
                    width="24"
                    height="24"
                  >
                    <path
                      d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"
                      fill="#4B0AFF"
                    />
                    <path
                      d="M12,17.5A1.5,1.5 0 0,1 10.5,16A1.5,1.5 0 0,1 12,14.5A1.5,1.5 0 0,1 13.5,16A1.5,1.5 0 0,1 12,17.5M12,10A1.5,1.5 0 0,1 10.5,8.5A1.5,1.5 0 0,1 12,7A1.5,1.5 0 0,1 13.5,8.5A1.5,1.5 0 0,1 12,10M12,13.75A1.5,1.5 0 0,1 10.5,12.25A1.5,1.5 0 0,1 12,10.75A1.5,1.5 0 0,1 13.5,12.25A1.5,1.5 0 0,1 12,13.75Z"
                      fill="#4B0AFF"
                    />
                  </svg>
                  <span className="selected-file-name">{file.name}</span>
                  <button
                    type="button"
                    className="remove-file"
                    onClick={() => {
                      setFile(null);
                      fileInputRef.current.value = "";
                    }}
                  >
                    <i className="fas fa-remove" title="X 버튼"/>
                  </button>
                </div>
              </div>
            )}
          </div>
          <div className="go-to-24">
            <span>내 생활기록부를 보고 싶다면?</span>
            <button
              type="button"
              className="go-to-24-button"
              onClick={() => window.open("https://www.gov.kr/mw/AA020InfoCappView.do?HighCtgCD=A04001;A04007&CappBizCD=13410000019&tp_seq=01", "_blank")}
            >
              <img 
                src="button.png" 
                className="img-button" 
                alt="정부24에서 생활기록부 발급받기"
              />
            </button>
          </div>
          <button
            type="submit"
            className="analyze-button"
            disabled={!file || loading}
          >
            결과 보기
          </button>
        </form>
      ) : (
        <div className="file-upload-area">
          <div className="loading-spinner">
          </div>
          <p className="progress-text">{Math.round(progress)}% 완료</p>
          <p className="loading-text">생활기록부를 분석 중입니다...<br/></p>
          <p className="tip">
            TIP: 알고 계셨나요? 배경의 칠판은 단순한 장식이 아니랍니다.
          </p>
          <div className="progress-container">
            <div
              className="progress-bar"
              style={{ width: `${progress}%` }}
            >
            </div>
          </div>
          <button
            type="button"
            className="cancel-button"
            onClick={cancelProgress}
          >
            중단
          </button>
        </div>
      )}
      </div>
    </div>
  </div>
  );
};

export default Home;
