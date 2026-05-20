import axios from 'axios';

const BASE_URL = 'http://localhost:8000/api/voice';  // /voice 추가

export const voiceService = {
    // TTS 기능 (로컬 Kokoro 모델)
    textToSpeech: async (text) => {
        try {
            const response = await axios.post(`${BASE_URL}/tts`, { text });
            return response.data.audioUrl;
        } catch (error) {
            console.error('TTS 에러:', error);
            throw error;
        }
    },

    // STT 기능 (로컬 Whisper 모델)
    async speechToText(audioBlob) {
        try {
            const formData = new FormData();
            formData.append('audio', audioBlob);
            
            const response = await axios.post(`${BASE_URL}/stt`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            
            return response.data.text;
        } catch (error) {
            console.error('STT 에러:', error);
            throw error;
        }
    },

    async matchAddress(voiceText) {
        try {
            console.log("주소 매칭 요청:", voiceText);  // 디버깅용
            const response = await axios.post(`${BASE_URL}/match_address`, {
                voice_text: voiceText
            });
            return response.data;
        } catch (error) {
            console.error('주소 매칭 오류:', error);
            throw error;
        }
    }
}; 