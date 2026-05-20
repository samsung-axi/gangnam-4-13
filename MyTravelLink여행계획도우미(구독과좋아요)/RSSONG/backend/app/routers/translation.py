# app/routers/translation.py
from fastapi import APIRouter, Query, HTTPException
from app.services.translation import translate_text

router = APIRouter()

@router.get("/translate/")
async def translate(
    text: str = Query(..., description="번역할 영어 텍스트"),
    lang: str = Query("ko", description="번역할 언어 코드 (예: 'ko' for Korean)")
):
    """
    영어 텍스트를 지정된 언어로 번역하여 반환합니다.
    :param text: 번역할 영어 텍스트
    :param lang: 번역할 언어 코드
    :return: 번역된 텍스트
    """
    translated = translate_text(text, dest_lang=lang)
    if translated:
        return {"translated_text": translated}
    else:
        raise HTTPException(status_code=500, detail="번역 중 오류가 발생했습니다.")
