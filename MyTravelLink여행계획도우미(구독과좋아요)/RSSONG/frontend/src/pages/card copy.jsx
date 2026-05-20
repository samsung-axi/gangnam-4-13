import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import Webcam from 'react-webcam';
import { isMobile } from 'react-device-detect';
import { useLanguage } from '../context/LanguageContext';

// CSS 파일 임포트
import '../../src/css/card.css';

// 이미지 임포트
import logo from '../images/logo.svg';
import resetBtn from '../images/ResetBtn.jpg';
import recordIcon from '../images/record.svg';

// SimpleAudioRecorder 임포트
import SimpleAudioRecorder from './simpleAudioRecorder';

// 환경 변수 사용
  // const BACKEND_URL = isMobile
  // ? 'http://192.168.0.129:8000'
  // : 'http://localhost:8000';
  
  const BACKEND_URL = 'http://192.168.0.236:8000';

const Card = () => {
  const location = useLocation();
  const webcamRef = useRef(null);
  const fileInputRef = useRef(null);

  // 상태
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewURL, setPreviewURL] = useState(null);
  const [audioBlob, setAudioBlob] = useState(null);
  const [isAudioModalOpen, setIsAudioModalOpen] = useState(false);
  const [isRetaking, setIsRetaking] = useState(false);
  const { language } = useLanguage();

  // 객체 감지 결과 (영어) & 번역 결과 (한국어)
  const [detectedObjectEn, setDetectedObjectEn] = useState('');
  const [detectedObjectKo, setDetectedObjectKo] = useState('');

  // TTS 재생용 URL (영어, 한국어)
  const [englishTtsUrl, setEnglishTtsUrl] = useState(null);
  const [koreanTtsUrl, setKoreanTtsUrl] = useState(null);

  // 유사도 체크 결과
  const [similarityScore, setSimilarityScore] = useState(null);
  const [similarityModalOpen, setSimilarityModalOpen] = useState(false);
  const [similarityMessage, setSimilarityMessage] = useState('');

  // Define videoConstraints
  const videoConstraints = {
    facingMode: 'environment', // 후면 카메라 사용
  };

  // location.state.photo(파일) 있으면 이미지 세팅
  useEffect(() => {
    if (location.state && location.state.photo) {
      const photo = location.state.photo;
      setSelectedImage(photo);
      setPreviewURL(URL.createObjectURL(photo));
    }
  }, [location.state]);

  // 페이지 로드 시 데스크탑이면 웹캠 모달 열기
  useEffect(() => {
    if (!isMobile) {
      if (location.state && location.state.openCamera) {
        setIsRetaking(true);
      }
    }
  }, [location.state]); // isMobile 제거

  // 이미지 선택 핸들러
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      setPreviewURL(URL.createObjectURL(file));
    }
  };

  // ------------------------------------------
  // (1) 이미지 업로드 & 객체 감지 & 번역 & TTS
  // ------------------------------------------
  const handleUploadImage = async () => {
    if (!selectedImage) return;

    try {
      // 1) 객체 감지
      const formData = new FormData();
      formData.append('file', selectedImage);

      const detectResponse = await axios.post(
        `${BACKEND_URL}/detect/`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      const detectedEn = detectResponse.data.detected_object || 'unknown';
      console.log('객체 감지 결과(영어):', detectedEn);
      setDetectedObjectEn(detectedEn);

      // 2) 영어 → 한국어 번역 (백엔드 번역 API 호출)
      const translateResponse = await axios.get(
        `${BACKEND_URL}/translate/`,
        {
          params: {
            text: detectedEn,
            lang: 'ko',
          },
        }
      );
      const koWord = translateResponse.data.translated_text;
      console.log('번역 결과(한국어):', koWord);
      setDetectedObjectKo(koWord);

      // 3) 영어, 한국어 각각 TTS 파일 받기
      //   (응답은 blob 형태 - gTTS가 생성한 mp3)
      //   * 영어
      const enTtsRes = await axios.get(
        `${BACKEND_URL}/tts/`,
        {
          params: {
            text: detectedEn,
            lang: 'en',
            file_name: 'en.mp3',
          },
          responseType: 'blob',
        }
      );
      const enTtsBlobUrl = URL.createObjectURL(enTtsRes.data);
      setEnglishTtsUrl(enTtsBlobUrl);

      //   * 한국어
      const koTtsRes = await axios.get(
        `${BACKEND_URL}/tts/`,
        {
          params: {
            text: koWord,
            lang: 'ko',
            file_name: 'ko.mp3',
          },
          responseType: 'blob',
        }
      );
      const koTtsBlobUrl = URL.createObjectURL(koTtsRes.data);
      setKoreanTtsUrl(koTtsBlobUrl);

      alert('객체 감지 + 번역 + TTS 완료!');
    } catch (error) {
      console.error('이미지 업로드/객체 감지/TTS 실패:', error);
      alert('업로드/감지/TTS 중 오류가 발생했습니다.');
    }
  };

  // ------------------------------------------
  // (2) "다시찍기" (웹캠 또는 모바일 파일 선택)
  // ------------------------------------------
  const handleRetake = () => {
    if (!isMobile) {
      setIsRetaking(true);
    } else {
      // 모바일에서는 파일 입력을 다시 열기 전에 기존 값을 초기화
      if (fileInputRef.current) {
        fileInputRef.current.value = null; // 기존 파일 초기화
        fileInputRef.current.click(); // 내장 카메라 앱 실행
      }
    }
  };

  const capture = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    if (imageSrc) {
      fetch(imageSrc)
        .then((res) => res.blob())
        .then((blob) => {
          const file = new File([blob], 'captured_image.jpg', { type: 'image/jpeg' });
          setSelectedImage(file);
          setPreviewURL(URL.createObjectURL(file));
          setIsRetaking(false);
        });
    }
  };

  // ------------------------------------------
  // (3) 음성 녹음 & 업로드 + 유사도 체크
  // ------------------------------------------
  const handleAudioStop = (blob) => {
    setAudioBlob(blob);
    console.log('녹음 완료:', blob);
  };

  // 새로운 "확인 하기" 버튼 핸들러 추가
  const handleConfirmAudio = async () => {
    if (!audioBlob) {
      alert('녹음된 오디오가 없습니다.');
      return;
    }

    try {
      // 오디오 업로드
      const formData = new FormData();
      formData.append('file', audioBlob, 'recorded_audio.webm');

      const res = await axios.post(`${BACKEND_URL}/upload-audio/`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      console.log('오디오 업로드 성공:', res.data);
      alert('오디오 업로드 완료! 유사도 체크 중입니다.');

      // 유사도 체크 자동 수행
      await handleCheckSimilarity(audioBlob);
    } catch (error) {
      console.error('오디오 업로드 실패:', error);
      alert('오디오 업로드 실패');
    }
  };

  const openAudioModal = () => setIsAudioModalOpen(true);
  const closeAudioModal = () => setIsAudioModalOpen(false);

  // ------------------------------------------
  // (4) 영어 TTS 음성과 사용자 음성 similarity 체크
  // ------------------------------------------
  const handleCheckSimilarity = async (uploadedBlob = null) => {
    if (!englishTtsUrl || (!audioBlob && !uploadedBlob)) {
      alert('영어 TTS 음성 또는 사용자 음성이 준비되지 않았습니다.');
      return;
    }

    try {
      // 영어 TTS 음성을 Blob으로 가져오기
      const ttsBlob = await fetch(englishTtsUrl).then((r) => r.blob());
      const userBlob = uploadedBlob || audioBlob;

      // FormData 생성
      const formData = new FormData();
      formData.append('file1', ttsBlob, 'tts_en.mp3'); // 필드 이름: file1
      formData.append('file2', userBlob, 'recorded_audio.webm'); // 필드 이름: file2

      // Axios 요청
      console.log("Sending FormData:", {
        file1: 'tts_en.mp3',
        file2: 'recorded_audio.webm'
      });
      const response = await axios.post(`${BACKEND_URL}/similarity/`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      console.log("Similarity response:", response.data);

      const similarity = response.data.similarity;
      setSimilarityScore(similarity);

      if (similarity >= 60) { // 임계값 설정 (예: 60)
        setSimilarityMessage('참 잘했어요~');
      } else {
        setSimilarityMessage('다시 해보세요~');
      }

      setSimilarityModalOpen(true);
    } catch (error) {
      console.error('유사도 체크 실패:', error);
      alert('유사도 체크 실패');
    }
  };

  const handleCloseSimilarityModal = () => {
    setSimilarityModalOpen(false);
  };

  // ------------------------------------------
  // (5) TTS 재생 (영어 / 한국어)
  // ------------------------------------------
  const playAudio = (audioUrl) => {
    if (!audioUrl) return;
    const audio = new Audio(audioUrl);
    audio.play().catch((err) => console.error('오디오 재생 오류', err));
  };

  return (
    <div>
      {/* 홈 아이콘 */}
      <div className="home-icon">
        <Link to="/">
          <img src={logo} alt="home" />
        </Link>
      </div>

      {/* 이미지 업로드 섹션 */}
      <div
        className="image-container"
        onClick={() => {
          // Card에서 직접 파일 선택
          if (!isRetaking && fileInputRef.current) {
            fileInputRef.current.click();
          }
        }}
      >
        {previewURL ? (
          <>
            <img className="main-img" src={previewURL} alt="Uploaded" />
            {/* 다시찍기 버튼을 모바일과 데스크탑 모두에서 표시 */}
            <div className="retake-btn-container">
              <button
                className="retake-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRetake();
                }}
              >
                <img src={resetBtn} alt="다시찍기" />
                다시찍기
              </button>
            </div>
          </>
        ) : (
          <>
            <input
              type="file"
              accept="image/*"
              capture={isMobile ? 'environment' : undefined}
              onChange={handleImageChange}
              style={{ display: 'none' }}
              ref={fileInputRef}
            />
            <div className="upload-label">
              <span>이미지 업로드</span>
            </div>
          </>
        )}
      </div>

      {/* 이미지 업로드 버튼 */}
      {selectedImage && (
        <button className="upload-btn" onClick={handleUploadImage}>
          이미지 업로드 → 객체 감지 + 번역 + TTS
        </button>
      )}

      {/* 감지된 결과 & TTS 플레이 영역 */}
      {/* 예: apple / 사과  */}
      {detectedObjectEn && (
        <div className="result-container">
          {/* 영어 단어 & 재생 버튼 */}
          <span className="object-en">{detectedObjectEn}</span>
          <button onClick={() => playAudio(englishTtsUrl)} className="tts-btn">
            스피커(영어)
          </button>

          {/* 녹음 버튼 */}
          <button onClick={openAudioModal} className="record-btn">
            <img src={recordIcon} alt="마이크" />
            녹음
          </button>

          {/* 한국어 단어 & 재생 버튼 */}
          <span className="object-ko">{detectedObjectKo}</span>
          <button onClick={() => playAudio(koreanTtsUrl)} className="tts-btn">
            스피커(한국어)
          </button>
        </div>
      )}

      {/* (A) 오디오 녹음 모달 */}
      {isAudioModalOpen && (
        <div className="modal" onClick={closeAudioModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <span className="close-modal" onClick={closeAudioModal}>
              &times;
            </span>
            <h2>오디오 녹음</h2>
            <SimpleAudioRecorder onStop={handleAudioStop} />
            {audioBlob && (
              <div className="audio-controls">
                <audio src={URL.createObjectURL(audioBlob)} controls />
                <button
                  className="confirm-audio-btn"
                  onClick={handleConfirmAudio}
                >
                  확인 하기
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* (B) 유사도 결과 모달 */}
      {similarityModalOpen && (
        <div className="modal" onClick={handleCloseSimilarityModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <span className="close-modal" onClick={handleCloseSimilarityModal}>
              &times;
            </span>
            <h2>유사도 결과</h2>
            <p>유사도: {similarityScore !== null ? similarityScore.toFixed(2) : '계산 중...'}</p>
            <p>{similarityMessage}</p>
          </div>
        </div>
      )}

      {/* 웹캠 모달 (데스크탑) */}
      {isRetaking && !isMobile && (
        <div className="modal" onClick={() => setIsRetaking(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <span className="close-modal" onClick={() => setIsRetaking(false)}>
              &times;
            </span>
            <h2>이미지 촬영</h2>
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              videoConstraints={videoConstraints} // 별도의 변수 사용
            />
            <button onClick={capture} className="upload-btn" style={{ marginTop: '10px' }}>
              촬영
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Card;
