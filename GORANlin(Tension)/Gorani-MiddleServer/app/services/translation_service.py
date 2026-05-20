import logging
import requests
import os
from app.models.translation import setup_translation_chain

# 로깅 설정
logger = logging.getLogger(__name__)

# ✅ Gorani 서버 URL 설정 (ngrok 주소 사용)
GORANI_SERVER_URL = os.getenv("GORANI_SERVER_URL")

# GPT 번역 체인 초기화
translation_chain = setup_translation_chain()

def translate_text(text: str, source_lang: str = "ko", target_lang: str = "en", model: str = "OpenAI") -> str:
    """
    선택한 모델 (OpenAI 또는 Gorani)을 사용하여 번역 수행
    """
    try:
        if model == "OpenAI":
            # GPT 번역 체인을 실행하여 번역 수행
            result = translation_chain.invoke({
                "text": text,
                "source_lang": source_lang,
                "target_lang": target_lang,
            })
            return result
        elif model == "Gorani":
            return translate_with_gorani(text, source_lang, target_lang)
        else:
            logger.error("❌ 지원되지 않는 모델 요청")
            return "지원되지 않는 모델입니다."
    except Exception as e:
        logger.error(f"Translation error: {str(e)}")
        return "Translation failed"

def translate_with_gorani(text, source_lang, target_lang):
    """
    Gorani (ngrok을 통해 연결된 서버)에서 번역 수행
    """
    try:
        payload = {
            "text": text,
            "source_lang": source_lang,
            "target_lang": target_lang
        }
        headers = {
            "Content-Type": "application/json"
        }
        response = requests.post(GORANI_SERVER_URL, json=payload, headers=headers, timeout=30)

        if response.status_code == 200:
            return response.json().get("answer", "번역 실패")
        elif response.status_code == 404:
            logger.error("❌ Gorani 서버 엔드포인트를 찾을 수 없습니다. URL을 확인하세요.")
            return "Gorani 서버 엔드포인트 오류 (404)"
        elif response.status_code == 500:
            logger.error("❌ Gorani 서버 내부 오류 (500)")
            return "Gorani 서버 내부 오류"
        else:
            logger.error(f"❌ Gorani 서버 오류: {response.status_code}")
            return f"번역 서버 오류: {response.status_code}"

    except requests.Timeout:
        logger.error("❌ Gorani 서버 요청 타임아웃")
        return "Gorani 서버 응답 시간 초과"
    except requests.ConnectionError:
        logger.error("❌ Gorani 서버 연결 실패. 서버가 실행 중인지 확인하세요.")
        return "Gorani 서버 연결 실패"
    except requests.RequestException as e:
        logger.error(f"❌ Gorani 서버 연결 오류: {str(e)}")
        return f"Gorani 서버 연결 오류: {str(e)}"
