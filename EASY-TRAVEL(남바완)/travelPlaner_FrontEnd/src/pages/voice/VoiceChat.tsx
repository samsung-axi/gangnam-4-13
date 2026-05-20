// VoiceChat.tsx
import React, { useState, useRef } from 'react';
import styles from './VoiceChat.module.css';

interface ChatResponse {
  success: boolean;
  user_text: string;
  ai_text: string;
  audio_base64: string;
  error?: string;
}

const VoiceChat: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [response, setResponse] = useState<ChatResponse | null>(null);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder.current = new MediaRecorder(stream);
      audioChunks.current = [];

      mediaRecorder.current.ondataavailable = (event) => {
        audioChunks.current.push(event.data);
      };

      mediaRecorder.current.onstop = async () => {
        const audioBlob = new Blob(audioChunks.current, { type: 'audio/wav' });
        await sendAudioToServer(audioBlob);
      };

      mediaRecorder.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder.current && isRecording) {
      mediaRecorder.current.stop();
      setIsRecording(false);
    }
  };

  const sendAudioToServer = async (audioBlob: Blob) => {
    try {
      const formData = new FormData();
      formData.append('audio', audioBlob, 'recording.wav');

      const response = await fetch('http://localhost:8000/voice/chat', {
        method: 'POST',
        body: formData,
      });

      const data: ChatResponse = await response.json();
      setResponse(data);

      if (data.success && data.audio_base64) {
        const audioBytes = new Uint8Array(
          data.audio_base64.match(/.{1,2}/g)!.map(byte => parseInt(byte, 16))
        );
        const audioBlob = new Blob([audioBytes], { type: 'audio/mp3' });
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);
        audio.play();
      }
    } catch (error) {
      console.error('Error sending audio:', error);
    }
  };

  return (
    <div className={styles.voiceChat}>
      <button 
        onClick={isRecording ? stopRecording : startRecording}
        className={`${styles.button} ${isRecording ? styles.recording : ''}`}
      >
        {isRecording ? 'Stop Recording' : 'Start Recording'}
      </button>

      {response && (
        <div className={styles.response}>
          <p><strong>사용자:</strong> {response.user_text}</p>
          <p><strong>남바완AI:</strong> {response.ai_text}</p>
        </div>
      )}

      {response?.error && (
        <div className={styles.error}>
          Error: {response.error}
        </div>
      )}
    </div>
  );
};

export default VoiceChat;