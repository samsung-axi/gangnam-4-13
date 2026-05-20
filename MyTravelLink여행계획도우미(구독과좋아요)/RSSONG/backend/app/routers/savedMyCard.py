from fastapi import APIRouter, HTTPException, UploadFile, File
from app.services.savedMyCard_service import SavedMyCardService
from app.repository.db_repository import DBRepository
from motor.motor_asyncio import AsyncIOMotorClient
from app.config import settings  # 환경 변수 설정
import os
import shutil

router = APIRouter()

# MongoDB 연결 설정
client = AsyncIOMotorClient(settings.mongo_uri)
db = client[settings.database_name]
repository = DBRepository(db)
service = SavedMyCardService(repository)

# 업로드 파일 저장 디렉토리
UPLOAD_DIR = "app/static/recordings/"

# 업로드 디렉토리 생성
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.get("/savedMyCard/mywords/")
async def get_mywords():
    """
    username이 'user1'인 모든 단어를 번역, TTS 생성 후 반환하는 엔드포인트.
    """
    try:
        processed_items = await service.get_mywords_with_processing()
        if not processed_items:
            raise HTTPException(status_code=404, detail="해당 사용자의 단어를 찾을 수 없습니다.")
        return {"items": processed_items}
    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"오류 발생: {str(e)}")

@router.post("/savedMyCard/similarity/")
async def check_similarity(file1: UploadFile = File(...), file2: UploadFile = File(...)):
    """
    두 음성 파일을 비교하여 유사도를 계산하는 엔드포인트.
    """
    try:
        file1_path = os.path.join(UPLOAD_DIR, file1.filename)
        file2_path = os.path.join(UPLOAD_DIR, file2.filename)

        # 파일 저장
        with open(file1_path, "wb") as f1, open(file2_path, "wb") as f2:
            shutil.copyfileobj(file1.file, f1)
            shutil.copyfileobj(file2.file, f2)

        # 유사도 계산
        similarity = await service.compare_audio_files(file1_path, file2_path)

        # 저장된 파일 삭제
        os.remove(file1_path)
        os.remove(file2_path)

        return {"similarity": similarity}
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"오류 발생: {str(e)}")
