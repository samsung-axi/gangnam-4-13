# app/routers/audio.py
from fastapi import APIRouter, UploadFile, File, HTTPException
import os
import shutil

router = APIRouter()

UPLOAD_DIR = "app/static/audio/"  # 업로드 파일 저장 경로

# 업로드 디렉토리 생성
if not os.path.exists(UPLOAD_DIR):
    os.makedirs(UPLOAD_DIR)

@router.post("/upload-audio/")
async def upload_audio(file: UploadFile = File(...)):
    """
    오디오 파일을 서버에 업로드합니다.
    """
    try:
        file_path = os.path.join(UPLOAD_DIR, file.filename)
        with open(file_path, "wb") as f:
            shutil.copyfileobj(file.file, f)
        return {"file_path": file_path, "message": "오디오 업로드 성공"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"오디오 업로드 실패: {str(e)}")
