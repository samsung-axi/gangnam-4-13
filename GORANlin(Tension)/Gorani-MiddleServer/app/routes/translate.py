from fastapi import APIRouter, Depends, HTTPException
from app.models.schemas import TranslateRequest
from app.celery_worker import translate_task
from celery.result import AsyncResult
import logging

router = APIRouter()

logger = logging.getLogger(__name__)

@router.post("/translate")
async def translate_request(request: TranslateRequest):
    """
    OpenAI, Gorani, LangGorani 번역 요청을 Celery Worker에 추가
    """
    if request.model not in ["OpenAI", "Gorani", "LangGorani"]:
        raise HTTPException(status_code=400, detail="지원되지 않는 모델입니다.")

    task = translate_task.delay(request.text, request.source_lang, request.target_lang, request.model)
    return {"task_id": task.id, "message": "Translation request queued."}


@router.get("/translate/status/{task_id}")
async def get_translation_status(task_id: str):
    """
    Celery 비동기 작업 상태 확인
    """
    task_result = AsyncResult(task_id)

    if task_result.state == 'PENDING':
        return {"status": "pending", "message": "번역이 아직 완료되지 않았습니다."}
    
    elif task_result.state == 'FAILURE':
        return {"status": "failed", "message": "번역 작업이 실패했습니다."}

    elif task_result.state == 'SUCCESS':
        return {"status": "completed", "result": task_result.result}

    return {"status": "unknown", "message": "작업 상태를 확인할 수 없습니다."}