# app/services/textToVoice.py
from gtts import gTTS
import os

def generate_tts(text: str, lang: str = 'en', file_name: str = "output.mp3") -> str:
    """
    텍스트를 음성으로 변환하여 MP3 파일로 저장
    - text: 변환할 텍스트
    - lang: 언어(기본값 'en')
    - file_name: 저장할 파일 이름 (기본값 'output.mp3')
    """
    try:
        tts = gTTS(text=text, lang=lang)
        file_path = f"app/static/{file_name}"
        tts.save(file_path)
        return file_path
    except Exception as e:
        raise ValueError(f"TTS 생성 중 오류 발생: {e}")
