// frontend/src/components/SavedMyCard.jsx

import React, { useEffect, useState, useRef, useCallback } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Modal from 'react-modal';
import recordIcon from '../images/record.svg';

import '../css/savedMycard.css'; // 수정된 CSS 파일 임포트
import logo from '../images/logo.svg';

// SimpleAudioRecorder 임포트
import SimpleAudioRecorder from './simpleAudioRecorder';

Modal.setAppElement('#root'); // 접근성을 위해 필요

// 환경 변수에서 백엔드 URL을 가져옵니다.
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://127.0.0.1:8000';

const SavedMyCard = () => {
  const [words, setWords] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [recording, setRecording] = useState(false);
  const [audioURL, setAudioURL] = useState('');
  const mediaRecorderRef = useRef(null);
  const [userAudioBlob, setUserAudioBlob] = useState(null);
  const [isAudioModalOpen, setIsAudioModalOpen] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [transTtsUrl, settransTtsUrl] = useState(null);
  const [similarityScore, setSimilarityScore] = useState(null);
  const [similarityMessage, setSimilarityMessage] = useState('');
  const [similarityModalOpen, setSimilarityModalOpen] = useState(false);

  // 현재 단어를 정의 (useEffect 이전에 선언)
  const currentWord = words[currentIndex];

  // 단어 목록을 가져오는 함수
  const fetchMyWords = useCallback(async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/savedMyCard/mywords/`);
      setWords(response.data.items);
    } catch (error) {
      console.error('Error fetching my words:', error);
      alert('단어를 불러오는 데 문제가 발생했습니다.');
    }
  }, []);

  useEffect(() => {
    fetchMyWords();
  }, [fetchMyWords]);

  // currentWord가 변경될 때 transTtsUrl을 설정
  useEffect(() => {
    if (currentWord && currentWord.tts_en_url) {
      const url = `${BACKEND_URL}${currentWord.tts_en_url}`;
      settransTtsUrl(url);
      console.log('transTtsUrl set to:', url);
    } else {
      settransTtsUrl(null);
      console.log('transTtsUrl is null');
    }
  }, [currentWord]);

  // 오디오 재생 함수
  const playAudio = useCallback((url) => {
    if (!url) {
      console.error('No audio URL provided');
      return;
    }
    const audio = new Audio(url);
    audio.play().catch((err) => console.error('Audio playback error:', err));
  }, []);

  const openAudioModal = () => setIsAudioModalOpen(true);
  const closeAudioModal = () => setIsAudioModalOpen(false);

  const handleAudioStop = (blob) => {
    setAudioBlob(blob);
    console.log('녹음 완료:', blob);
  };

  const handleCheckSimilarity = async (uploadedBlob = null) => {
    console.log('transTtsUrl:', transTtsUrl);
    console.log('audioBlob:', audioBlob);
    
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
  
  // 다음 단어로 이동
  const handleNext = () => {
    setCurrentIndex((prevIndex) => Math.min(prevIndex + 1, words.length - 1));
    resetRecordingState();
  };

  // 이전 단어로 이동
  const handlePrevious = () => {
    setCurrentIndex((prevIndex) => Math.max(prevIndex - 1, 0));
    resetRecordingState();
  };

  // 녹음 상태 초기화
  const resetRecordingState = () => {
    setRecording(false);
    setAudioURL('');
    setUserAudioBlob(null);
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
  };

  const handleCloseSimilarityModal = () => {
    setSimilarityModalOpen(false);
  };

  // 녹음 중 컴포넌트 언마운트 시 정리
  useEffect(() => {
    return () => {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
      }
    };
  }, []);

  if (words.length === 0) {
    return (
      <>
        <div className="home-icon">
          <Link to="/">
            <img src={logo} alt="홈으로 이동" />
          </Link>
        </div>
        <div className="smc-saved-my-card">
          <p className="loading-message">단어를 불러오는 중입니다...</p>
        </div>
      </>
    );
  }

  return (
    <div className="smc-saved-my-card">
      {/* 홈 아이콘 */}
      <div className="home-icon">
        <Link to="/">
          <img src={logo} alt="홈으로 이동" />
        </Link>
      </div>

      <div className="smc-card">
        {/* 이미지 및 네비게이션 */}
        <div className="smc-image-container">
          <button
            className="smc-prev-button"
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            aria-label="이전 단어"
          >
            {/* 이전 화살표 아이콘 */}
          </button>
          <img
            src={`${BACKEND_URL}${currentWord.path}`}
            alt={currentWord.word}
            className="smc-main-img"
          />
          <button
            className="smc-next-button"
            onClick={handleNext}
            disabled={currentIndex === words.length - 1}
            aria-label="다음 단어"
          >
            {/* 다음 화살표 아이콘 */}
          </button>
        </div>

        
      </div>

      {/* 녹음 및 재생 섹션 */}
      <div className="result-container">
          <span
            className="object-en"
            onClick={() => playAudio(transTtsUrl)}
            role="button"
            tabIndex={0}
            aria-label={`${currentWord.word} 영어 발음 재생`}
            onKeyPress={(e) => {
              if (e.key === 'Enter') playAudio(transTtsUrl);
            }}
          >
            {currentWord.word}
          </span>

          {/* 녹음 버튼 */}
      
            <img src={recordIcon} onClick={openAudioModal} className="record-btn" alt="마이크" />
            
          

          <span
            className="object-ko"
            onClick={() => playAudio(`${BACKEND_URL}${currentWord.tts_ko_url}`)}
            role="button"
            tabIndex={0}
            aria-label={`${currentWord.translated_text} 한국어 발음 재생`}
            onKeyPress={(e) => {
              if (e.key === 'Enter') playAudio(`${BACKEND_URL}${currentWord.tts_ko_url}`);
            }}
          >
            {currentWord.translated_text}
          </span>
        </div>

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
      <Modal
        isOpen={similarityModalOpen}
        onRequestClose={handleCloseSimilarityModal}
        contentLabel="Similarity Result"
        className="smc-modal"
        overlayClassName="smc-overlay"
      >
        <div className="modal-content">
          <button
            onClick={handleCloseSimilarityModal}
            className="close-modal"
            aria-label="모달 닫기"
          >
            &times;
          </button>
          <h2>유사도 결과</h2>
          <p>유사도: {similarityScore !== null ? similarityScore.toFixed(2) : '계산 중...'}</p>
          <p>{similarityMessage}</p>
        </div>
      </Modal>
    </div>
  );
};

export default SavedMyCard;
