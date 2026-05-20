import React, { useRef, useState } from "react";
import styled from "styled-components";
import RecordIcon from "/images/record.svg";

const ButtonGroup = styled.div`
  margin-bottom: 1rem;
  display: flex;
  justify-content: center;
  gap: 8px;
  flex-wrap: wrap;
`;

// 녹음 시작 버튼 (원래 디자인)
const RecordButton = styled.button`
  font-size: 1rem;
  color: white;
  background-color: transparent;
  border: none;
  border-radius: 8px;
  padding: 0;
  cursor: pointer;

  &:hover {
    opacity: 0.8;
  }

  img {
    width: 24px;
    height: 24px;
  }
`;

// 컨트롤 버튼들 (작은 크기)
const ControlButton = styled.button<{ variant?: 'primary' | 'secondary' | 'danger' }>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  font-size: 0.8rem;
  font-weight: 500;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 6px 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
  min-width: 80px;
  
  background: ${({ variant }) => {
    switch (variant) {
      case 'primary':
        return 'linear-gradient(135deg, #351745 0%, #480b6a 100%)';
      case 'secondary':
        return 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)';
      case 'danger':
        return 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)';
      default:
        return 'linear-gradient(135deg, #351745 0%, #480b6a 100%)';
    }
  }};

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
    background: ${({ variant }) => {
      switch (variant) {
        case 'primary':
          return 'linear-gradient(135deg, #480b6a 0%, #5c1f7a 100%)';
        case 'secondary':
          return 'linear-gradient(135deg, #4b5563 0%, #374151 100%)';
        case 'danger':
          return 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)';
        default:
          return 'linear-gradient(135deg, #480b6a 0%, #5c1f7a 100%)';
      }
    }};
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
  }
`;

const AudioPlayer = styled.audio`
  width: 100%;
  margin-top: 1rem;
  border-radius: 12px;
  background: #f8f9fa;
  
  &::-webkit-media-controls-panel {
    background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
    border-radius: 12px;
  }
`;

const DownloadButton = styled.button`
  margin-top: 1rem;
  padding: 8px 18px;
  background: linear-gradient(135deg, #351745 0%, #480b6a 100%);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  font-size: 0.9rem;
  transition: all 0.2s ease;
  box-shadow: 0 1px 4px rgba(53, 23, 69, 0.2);
  width: 100%;

  &:hover {
    background: linear-gradient(135deg, #480b6a 0%, #5c1f7a 100%);
    transform: translateY(-1px);
    box-shadow: 0 2px 6px rgba(53, 23, 69, 0.3);
  }

  &:active {
    transform: translateY(0);
  }
`;

const FileNameDisplay = styled.div`
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #351745;
  text-align: center;
  padding: 6px 12px;
  background: linear-gradient(135deg, #f8f5ff 0%, #f3f0ff 100%);
  border-radius: 6px;
  border: 1px solid rgba(53, 23, 69, 0.1);
  font-size: 0.9rem;
`;

const RecordingStatus = styled.div<{ isRecording?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  margin-bottom: 8px;
  padding: 6px 12px;
  background: ${({ isRecording }) => 
    isRecording 
      ? 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)' 
      : 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)'
  };
  color: ${({ isRecording }) => isRecording ? '#dc2626' : '#16a34a'};
  border-radius: 6px;
  font-weight: 500;
  font-size: 0.8rem;
  
  &::before {
    content: '';
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: ${({ isRecording }) => isRecording ? '#dc2626' : '#16a34a'};
    ${({ isRecording }) => isRecording && `
      animation: blink 1s infinite;
    `}
  }
  
  @keyframes blink {
    0%, 50% { opacity: 1; }
    51%, 100% { opacity: 0.3; }
  }
`;

interface RecordUploadProps {
  setFile: React.Dispatch<React.SetStateAction<File | null>>;
}

const RecordInfoUpload: React.FC<RecordUploadProps> = ({ setFile }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null
  );
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const audioChunks = useRef<Blob[]>([]);

  // 날짜+시간 파일명 생성 함수
  const getCurrentFileName = () => {
    const now = new Date();
    const pad = (n: number) => n.toString().padStart(2, "0");
    const year = now.getFullYear();
    const month = pad(now.getMonth() + 1);
    const day = pad(now.getDate());
    const hour = pad(now.getHours());
    const min = pad(now.getMinutes());
    return `${year}.${month}.${day} ${hour}:${min}.webm`;
  };

  // 마이크 권한 요청 및 녹음 시작
  const startRecording = async () => {
    if (!navigator.mediaDevices) {
      alert("이 브라우저는 마이크 녹음을 지원하지 않습니다.");
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      audioChunks.current = [];
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunks.current.push(e.data);
        }
      };
      recorder.onstop = () => {
        const blob = new Blob(audioChunks.current, { type: "audio/webm" });
        setAudioBlob(blob);
        setAudioUrl(URL.createObjectURL(blob));
        const name = getCurrentFileName();
        setFileName(name);
        // Blob을 File로 변환해서 setFile로 부모에 전달
        const file = new File([blob], name, { type: "audio/webm" });
        setFile(file);
      };
      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
      setIsPaused(false);
    } catch (err) {
      alert("마이크 권한이 필요합니다.");
    }
  };

  // 녹음 일시정지
  const pauseRecording = () => {
    if (mediaRecorder && mediaRecorder.state === "recording") {
      mediaRecorder.pause();
      setIsPaused(true);
      setIsRecording(false);
    }
  };

  // 녹음 재개
  const resumeRecording = () => {
    if (mediaRecorder && mediaRecorder.state === "paused") {
      mediaRecorder.resume();
      setIsPaused(false);
      setIsRecording(true);
    }
  };

  // 녹음 중지 (파일만 생성)
  const stopRecording = async () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      // 스트림 정리
      const tracks = mediaRecorder.stream.getTracks();
      tracks.forEach(track => track.stop());
      setIsRecording(false);
      setIsPaused(false);
    }
  };

  // 녹음 취소 - 모든 데이터 완전 삭제
  const cancelRecording = () => {
    if (mediaRecorder) {
      // 녹음 중단
      if (mediaRecorder.state !== 'inactive') {
        mediaRecorder.stop();
      }
      // 스트림 정리
      const tracks = mediaRecorder.stream.getTracks();
      tracks.forEach(track => track.stop());
    }
    
    // URL 정리
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }
    
    // 모든 상태 초기화
    setIsRecording(false);
    setIsPaused(false);
    setAudioUrl(null);
    setAudioBlob(null);
    setFileName("");
    setFile(null); // 부모 컴포넌트의 파일 상태도 초기화
    setMediaRecorder(null);
    audioChunks.current = []; // 녹음 데이터 완전 삭제
  };

  // 녹음 파일 다운로드
  const downloadRecording = () => {
    if (audioBlob) {
      const url = window.URL.createObjectURL(audioBlob);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.download = fileName || "recorded_audio.webm";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }
  };

  return (
    <div>
      {/* 녹음 시작 버튼 (원래 디자인) */}
      {!isRecording && !isPaused && !audioBlob && (
        <ButtonGroup>
          <RecordButton onClick={startRecording}>
            <img src={RecordIcon} alt="녹음 시작" />
          </RecordButton>
        </ButtonGroup>
      )}
      
      {/* 녹음 중일 때 컨트롤 버튼들 */}
      {(isRecording || isPaused) && (
        <>
          <RecordingStatus isRecording={isRecording}>
            {isRecording ? '녹음 중...' : '일시정지됨'}
          </RecordingStatus>
          
          <ButtonGroup>
            {isRecording && (
              <ControlButton variant="secondary" onClick={pauseRecording}>
                ⏸ 일시정지
              </ControlButton>
            )}
            
            {isPaused && (
              <ControlButton variant="primary" onClick={resumeRecording}>
                ▶ 재개
              </ControlButton>
            )}
            
            <ControlButton variant="primary" onClick={stopRecording}>
              ⏹ 완료
            </ControlButton>
            
            <ControlButton variant="danger" onClick={cancelRecording}>
              ✕ 취소
            </ControlButton>
          </ButtonGroup>
        </>
      )}
      
      {/* 녹음 완료 후 플레이어 */}
      {audioUrl && (
        <div>
          <FileNameDisplay>
            📁 {fileName}
          </FileNameDisplay>
          <AudioPlayer src={audioUrl} controls />
          <DownloadButton onClick={downloadRecording}>
            💾 녹음 파일 다운로드
          </DownloadButton>
        </div>
      )}
    </div>
  );
};

export default RecordInfoUpload;
