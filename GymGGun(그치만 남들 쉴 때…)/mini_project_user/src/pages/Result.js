import React, { useState, useEffect } from "react";
import html2canvas from "html2canvas";
import "../styles/Result.css";
import { useAppContext } from "../AppContext";
import sample from "../response_1742266857586.json"

const Result = () => {
  const { imageData, toggle, setName } = useAppContext();
  const [imageUrl, setImageUrl] = useState("");

  // Update image URL when imageData changes
  useEffect(() => {
    if (imageData) {
      setImageUrl(`data:image/png;base64,${imageData}`);
    }
    if (sample.image) {
      setImageUrl(`data:image/png;base64,${sample.image}`);
    }
  }, [imageData]);

  const backToHome = () => {
    setName("ㅁㅁㅁ");
    toggle();
  }

  // Copy image URL to clipboard
  const handleCopyImageUrl = async () => {
    try {
      await navigator.clipboard.writeText(imageUrl);
      alert("이미지 URL이 클립보드에 복사되었습니다!");
    } catch (err) {
      console.error("클립보드 복사 실패: ", err);
    }
  };

  // Save image as PNG
  const handleSaveAsPNG = () => {
    const element = document.querySelector(".result-image");

    html2canvas(element, {
      useCORS: true,
      ignoreElements: (element) => element.classList.contains("no-capture"), // Ignore buttons
    }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = imgData;
      link.download = "result.png";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  };

  return (
    <div className="result-container">
      <div className="result-header">
        <p>분석 결과</p>
        <button className="back-button no-capture" onClick={backToHome}>
          다시하기
        </button>
      </div>
      <div className="result-scrollable-area">
        {imageUrl ? (
          <img src={imageUrl} alt="Processed Result" className="result-image" />
        ) : (
          <p>이미지 인식 실패</p>
        )}
      </div>

      <div className="result-actions no-capture">
        <button className="action-button" onClick={handleSaveAsPNG}>
          PNG로 저장
        </button>
        <button className="action-button" onClick={handleCopyImageUrl}>
          이미지 URL 복사
        </button>
      </div>
    </div>
  );
};

export default Result;
