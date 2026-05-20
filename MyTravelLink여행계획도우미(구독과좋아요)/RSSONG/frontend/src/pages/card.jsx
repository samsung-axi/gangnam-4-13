// src/pages/card.jsx
import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation ,useNavigate } from 'react-router-dom';
import axios from 'axios';
import JSZip from 'jszip';
import Webcam from 'react-webcam';
import { isMobile } from 'react-device-detect';
import { useLanguage } from '../context/LanguageContext';

// CSS 파일 임포트
import '../css/card.css';

// SimpleAudioRecorder 임포트
import SimpleAudioRecorder from './simpleAudioRecorder';

// 이미지 임포트
import logo from '../images/logo.svg';
import resetBtn from '../images/ResetBtn.jpg';
import recordIcon from '../images/record.svg';


// 환경 변수 사용
  // const BACKEND_URL = isMobile
  // ? 'http://192.168.0.129:8000'
  // : 'http://localhost:8000';
  
  const BACKEND_URL = 'http://127.0.0.1:8000';

const Card = () => {
  // 모달
  const [recording, setRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  // 유사도 다음 모달
  const [isNextModalOpen, setIsNextModalOpen] = useState(false);
  const closeNextModal = () => setIsNextModalOpen(false);

  // 녹음 시작 함수
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      mediaRecorderRef.current.start();
      setRecording(true);

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setAudioBlob(blob);
        audioChunksRef.current = [];
      };
    } catch (error) {
      console.error('녹음 시작 실패:', error);
      alert('오디오 녹음을 시작할 수 없습니다. 마이크 접근을 허용해주세요.');
    }
  };

  // 녹음 중지 함수
  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setRecording(false);
    }
  };

  // ========================================================================
  const location = useLocation();
  const webcamRef = useRef(null);
  const fileInputRef = useRef(null);

  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const navigate = useNavigate();

  // 상태
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewURL, setPreviewURL] = useState(null);
  const [audioBlob, setAudioBlob] = useState(null);
  const [isAudioModalOpen, setIsAudioModalOpen] = useState(false);
  const [isRetaking, setIsRetaking] = useState(false);
  const { language } = useLanguage();

  // 로딩중..
  const [isLoading, setIsLoading] = useState(false);
  const [isUploaded, setIsUploaded] = useState(false);  // 업로드 완료 상태 추가

   // 객체 감지 결과 (영어) & 번역 결과 (한국어)
   const [detectedObjectLan, setdetectedObjectLan] = useState('');
   const [detectedObjectKo, setDetectedObjectKo] = useState('');
 
   // TTS 재생용 URL (영어, 한국어)
   const [transTtsUrl, settransTtsUrl] = useState(null);
   const [koreanTtsUrl, setKoreanTtsUrl] = useState(null);
 
   // 유사도 체크 결과
   const [similarityScore, setSimilarityScore] = useState(null);
   const [similarityModalOpen, setSimilarityModalOpen] = useState(false);
   const [similarityMessage, setSimilarityMessage] = useState('');
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
  // eslint-disable-next-line react-hooks/exhaustive-deps

  // 이미지 선택 핸들러
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      setPreviewURL(URL.createObjectURL(file));
    }
  };

   // ------------------------------------------
  // 기능 1) 이미지 업로드 & 객체 감지 & 번역 & TTS
  // ------------------------------------------
  const handleUploadImage = async () => {
    if (!selectedImage) return;
    setIsLoading(true); // 로딩 시작

    try {
      // 1) scan API 호출 zip 파일 받기
      const formData = new FormData();
      formData.append('file', selectedImage);
      formData.append('lang', language);

      const response = await axios.post(
        `${BACKEND_URL}/scan/`,
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
          responseType: 'arraybuffer', // 바이너리 데이터로 처리
        }
      );

      // 2) zip 파일 받아서 JSZip 인스턴스 생성 및 파일 로드
      const zip = new JSZip();
      const loadedZip = await zip.loadAsync(response.data);

      // 3) 파일 내용 읽기
      for (const filename of Object.keys(loadedZip.files)) {
        const fileData = await loadedZip.files[filename].async('blob'); // 파일 데이터 읽기

        // 파일 이름으로 언어 구분
        if (filename.startsWith('kor'))
          if (filename.endsWith('.mp3')){
            setKoreanTtsUrl(URL.createObjectURL(fileData));
            console.log(`파일 이름: ${filename}, 크기: ${fileData.size}, MIME 타입: ${fileData.type}`);
          }
          else{
            setDetectedObjectKo(await fileData.text());
            console.log(`파일 이름: ${filename}, 크기: ${fileData.size}, MIME 타입: ${fileData.type}`);
          }
        else{
          if (filename.endsWith('.mp3')){
            settransTtsUrl(URL.createObjectURL(fileData));
            console.log(`파일 이름: ${filename}, 크기: ${fileData.size}, MIME 타입: ${fileData.type}`);
          }
          else{
            setdetectedObjectLan(await fileData.text());
            console.log(`파일 이름: ${filename}, 크기: ${fileData.size}, MIME 타입: ${fileData.type}`);
          }
        }
      }      
      setIsLoading(false); // 성공/실패 상관없이 로딩 종료
      setIsUploaded(true); // 사진 업로드 완료
      alert('사진이 확인되었습니다!');
    } catch (error) {
        console.error('이미지 업로드/객체 감지/TTS 실패:', error);
        alert(error.message || '업로드/감지/TTS 중 오류가 발생했습니다.');
    } finally {
        setIsLoading(false); // 성공/실패 상관없이 로딩 종료
    }
  };

  // ------------------------------------------
  // (2) "다시찍기" (웹캠)
  // ------------------------------------------
  const handleRetake = () => {
    if (!isMobile) {
      setIsRetaking(true);
      setSelectedImage(null);
      setIsUploaded(false);  // 업로드 상태 초기화
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

      const res = await axios.post('http://localhost:8000/upload-audio/', formData, {
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
    if (!transTtsUrl || (!audioBlob && !uploadedBlob)) {
      alert('영어 TTS 음성 또는 사용자 음성이 준비되지 않았습니다.');
      return;
    }
  
    try {
      // 영어 TTS 음성을 Blob으로 가져오기
      const transBlob = await fetch(transTtsUrl, { cache: "no-store" }).then((r) => r.blob());
      const transFile = new File([transBlob], 'trans.mp3', { type: 'audio/mpeg' });
  
      const userBlob = uploadedBlob || audioBlob;
      const userFile = new File([userBlob], 'recorded_audio.webm', { type: 'audio/webm' });
  
      // FormData 생성
      const formData = new FormData();
      formData.append('file1', transFile, transFile.name); // 필드 이름: file1
      formData.append('file2', userFile, userFile.name); // 필드 이름: file2
  
      console.log("Sending similarity check with:", {
        file1: transFile,
        file2: userFile
      });
  
      const response = await axios.post(`${BACKEND_URL}/similarity/`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
  
      console.log("Similarity response:", response.data);
  
      const similarity =response.data.similarity;
      setSimilarityScore(similarity);
  
      if (similarity >= 30) { // 임계값 설정 (예: 60)
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
  // ====================================================================================================

  const handleRetry = () => {
    setAudioBlob(null);  // 기존 오디오 초기화
    setSimilarityModalOpen(false);  // 유사도 모달 닫기
    setIsAudioModalOpen(true);  // 오디오 모달 열기
};

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
  const closeAllModals = () => {
    setIsAudioModalOpen(false);
    setSimilarityModalOpen(false);
    setIsNextModalOpen(false);
  };

// 모든 상태를 초기화하는 함수 추가
const resetAllStates = () => {
  closeAllModals();  // 모든 모달 닫기
  setSelectedImage(null);  // 선택된 이미지 초기화
  setPreviewURL(null);    // 미리보기 URL 초기화
  setIsRetaking(true);    // 다시 찍기 상태로 설정
  setIsUploaded(false);   // 업로드 상태 초기화
  setDetectedObjectKo(''); // 감지된 객체 초기화
  setdetectedObjectLan('');
  setKoreanTtsUrl(null);  // TTS URL 초기화
  settransTtsUrl(null);
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
            {!isMobile && (
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
            )}
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
      {selectedImage && !isLoading && !isUploaded && (
        <button className="upload-btn" onClick={handleUploadImage}>
          이 사진으로 할래요!
        </button>
      )}

      {isLoading && (
          <div className="loading-message">
              <div className="loading-spinner"></div>
              <p>사진 확인중...</p>
          </div>
      )}

      {/* 감지된 결과 & TTS 플레이 영역 */}
      {/* 예: apple / 사과  */}
      {detectedObjectLan && (
        <div className="result-container">
          {/* 영어 단어 & 재생 버튼 */}
          <button onClick={() => playAudio(transTtsUrl)} className="tts-btn"> {detectedObjectLan}
          </button>
          {/* 녹음 버튼 */}
          <img src={recordIcon} alt="마이크" onClick={openAudioModal} className="record-btn" />
          {/* 한국어 단어 & 재생 버튼 */}
          <button onClick={() => playAudio(koreanTtsUrl)} className="tts-btn">{detectedObjectKo}
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
      {/* ===================================================================================== */}

  {similarityModalOpen && (
    <div className="modal" onClick={handleCloseSimilarityModal}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <span className="close-modal" onClick={handleCloseSimilarityModal}>
                &times;
            </span>
            <h2>유사도 결과</h2>
            <p>유사도: {similarityScore !== null ? similarityScore.toFixed(2) : '계산 중...'}</p>
            <p className="stars-container">
                {similarityScore !== null && (
                    <>
                        <span className={`star ${similarityScore >= 0 ? 'filled' : 'empty'}`}>
                            ★
                        </span>
                        <span className={`star ${similarityScore >= 30 ? 'filled' : 'empty'}`}>
                            ★
                        </span>
                        <span className={`star ${similarityScore >= 60 ? 'filled' : 'empty'}`}>
                            ★
                        </span>
                    </>
                )}
            </p>
            <p>{similarityMessage}</p>
            <div className="modal-buttons">
              <button className="next-modal-btn" onClick={handleRetry}> 다시 녹음하기 </button>
              <button className="next-modal-btn" onClick={() => setIsNextModalOpen(true)}> 다음으로 </button>              
            </div>
        </div>
  </div>
)}

      {/* 유사도 다음 모달 */}
      {isNextModalOpen && (
        <div className="modal" onClick={closeNextModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>⭐️참 잘했어요⭐️</h2>
            <h2>나랑 더 놀까?</h2>
                        {/** 
                       * 모바일: 버튼 클릭 시 먼저 사진을 찍은 후, card로 이동 
                       * 데스크탑: 기존 방식대로 card로 이동하며 openCamera: true 전달 
                       */}
                      {isMobile ? (
                        // 모바일
                        <>
                            <input
                            type="file"
                            accept="image/*"
                            capture="environment"
                            style={{ display: 'none' }}
                            ref={fileInputRef}
                            onChange={(e) => {
                              resetAllStates();  // 모든 상태 초기화
                              handleFileChange(e);

                          }}
                          />
                        </>
                      ) : (
                        // 데스크탑
                        <Link to="/card" state={{ openCamera: true }}>
                        <button 
                            className="next-modal-btn"
                            onClick={resetAllStates}  // 모든 모달 닫기
                            
                        >
                            응!
                        </button>
                    </Link>
                      )}
                    <Link to="/">  <button 
                            className="next-modal-btn"
                            onClick={resetAllStates}  // 홈으로 갈 때도 모든 모달 닫기
                        >
                            그만놀래!
                        </button></Link>
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
            <h2>사진 촬영</h2>
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              videoConstraints={{ facingMode: 'user' }}
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


