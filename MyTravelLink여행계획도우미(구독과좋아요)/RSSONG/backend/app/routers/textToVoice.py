# app/routers/textToVoice.py
from fastapi import APIRouter, Query, HTTPException
from fastapi.responses import FileResponse
from app.services.textToVoice import generate_tts

router = APIRouter()

@router.get("/tts/")
async def text_to_voice(
    text: str = Query(..., description="변환할 텍스트"),
    lang: str = Query("en", description="언어 코드"),
    file_name: str = Query("output.mp3", description="저장할 파일 이름")
):
    """
    텍스트를 음성으로 변환하여 MP3 파일로 반환
    """
    try:
        file_path = generate_tts(text=text, lang=lang, file_name=file_name)
        return FileResponse(file_path, media_type="audio/mpeg", filename=file_name)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
