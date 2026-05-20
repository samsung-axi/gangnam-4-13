from celery import Celery
import requests
import os
import openai
from openai import OpenAI
import logging

logger = logging.getLogger(__name__)

# ✅ 환경 변수에서 Gorani 서버 URL 가져오기
MODEL_SERVER_URL = os.getenv("MODEL_SERVER_URL")  # ✅ Gorani & LangGorani 모델 서버
CELERY_BROKER_URL = os.getenv("CELERY_BROKER_URL")
CELERY_RESULT_BACKEND = os.getenv("CELERY_RESULT_BACKEND")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

celery_app = Celery(
    "translation_worker",
    backend=CELERY_RESULT_BACKEND,
    broker=CELERY_BROKER_URL
)

# ✅ Celery 설정 업데이트
celery_app.conf.update(
    task_ignore_result=False,  # 작업 결과를 무시하지 않도록 설정
    result_expires=3600  # 작업 결과 유지 시간 (1시간)
)

# ✅ OpenAI 클라이언트 객체 생성
client = OpenAI(api_key=OPENAI_API_KEY)

# ✅ OpenAI 번역 요청 처리
def translate_with_openai(text, source_lang, target_lang):
    try:
        response = client.chat.completions.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": f"Translate from {source_lang} to {target_lang}."},
                {"role": "user", "content": text}
            ]
        )
        return response.choices[0].message.content.strip()

    except openai.OpenAIError as e:
        logger.error(f"❌ OpenAI API 오류: {str(e)}")
        return f"OpenAI 번역 오류: {str(e)}"
    except Exception as e:
        logger.error(f"❌ OpenAI 번역 실패: {str(e)}")
        return f"OpenAI 번역 실패: {str(e)}"

# ✅ Gorani & LangGorani 요청을 모델 서버로 전달
def request_model_server(text, source_lang, target_lang, model):
    try:
        # 모델에 따라 올바른 엔드포인트 설정
        if model == "Gorani":
            endpoint = f"{MODEL_SERVER_URL}/translate/Gorani"
        elif model == "LangGorani":
            endpoint = f"{MODEL_SERVER_URL}/translate/LangGorani"
        else:
            return "❌ 지원되지 않는 모델입니다."

        payload = {"text": text, "source_lang": source_lang, "target_lang": target_lang, "model": model}
        headers = {"Content-Type": "application/json"}
        
        logger.info(f"📡 {model} 번역 요청 전송: {endpoint} | 데이터: {payload}")

        response = requests.post(endpoint, json=payload, headers=headers, timeout=30)

        if response.status_code == 200:
            return response.json().get("answer", "번역 실패")  # ✅ FastAPI 라우터의 응답 형식과 일치해야 함
        else:
            logger.error(f"❌ 모델 서버 오류 ({model}): {response.status_code}")
            return f"모델 서버 오류 ({model}): {response.status_code}"

    except requests.RequestException as e:
        logger.error(f"❌ 모델 서버 연결 오류 ({model}): {str(e)}")
        return f"모델 서버 연결 오류 ({model}): {str(e)}"


@celery_app.task(bind=True)
def translate_task(self, text, source_lang, target_lang, model):
    logger.info(f"🚀 Celery Task 실행: {model} 번역 요청")
    
    if model == "OpenAI":
        return translate_with_openai(text, source_lang, target_lang)
    elif model in ["Gorani", "LangGorani"]:
        result = request_model_server(text, source_lang, target_lang, model)
        logger.info(f"✅ 번역 결과 ({model}): {result}")
        return result
    else:
        return "지원되지 않는 모델입니다."