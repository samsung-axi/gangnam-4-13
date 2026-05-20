import { useState, useRef } from 'react';
import { voiceService } from '../api/voiceService';

export const useVoiceRecording = () => {
    const [isRecording, setIsRecording] = useState(false);
    const mediaRecorder = useRef(null);
    const audioChunks = useRef([]);
    const silenceTimer = useRef(null);
    const lastAudioTime = useRef(Date.now());

    const startRecording = () => {
        return new Promise(async (resolve) => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                mediaRecorder.current = new MediaRecorder(stream);
                audioChunks.current = [];

                mediaRecorder.current.ondataavailable = (event) => {
                    if (event.data.size > 0) {
                        audioChunks.current.push(event.data);
                        lastAudioTime.current = Date.now(); // 오디오 데이터 수신 시간 갱신
                    }
                };

                mediaRecorder.current.start(100); // 100ms 간격으로 데이터 수집
                setIsRecording(true);
                resolve();
            } catch (error) {
                console.error('Recording failed:', error);
                resolve();
            }
        });
    };

    const stopRecording = () => {
        return new Promise((resolve) => {
            if (mediaRecorder.current && isRecording) {
                mediaRecorder.current.onstop = () => {
                    const audioBlob = new Blob(audioChunks.current, { type: 'audio/webm' });
                    setIsRecording(false);
                    mediaRecorder.current.stream.getTracks().forEach(track => track.stop());
                    resolve(audioBlob);
                };
                mediaRecorder.current.stop();
            } else {
                resolve(null);
            }
        });
    };

    const checkSilence = (callback, silenceThreshold = 5000) => {
        if (silenceTimer.current) clearInterval(silenceTimer.current);
        
        silenceTimer.current = setInterval(() => {
            const timeSinceLastAudio = Date.now() - lastAudioTime.current;
            if (timeSinceLastAudio >= silenceThreshold) {
                stopRecording().then(callback);
                clearInterval(silenceTimer.current);
            }
        }, 1000);
    };

    return {
        isRecording,
        startRecording,
        stopRecording,
        checkSilence
    };
}; 