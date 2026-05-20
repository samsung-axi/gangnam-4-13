from fastapi import APIRouter, HTTPException
from app.services.random_service import randomCardService
from app.repository.db_repository import DBRepository
from motor.motor_asyncio import AsyncIOMotorClient
from app.config import settings  # 환경 변수 설정
import os

router = APIRouter()

# MongoDB 연결 설정
client = AsyncIOMotorClient(settings.mongo_uri)
db = client[settings.database_name]
repository = DBRepository(db)
service = randomCardService(repository)

# 업로드 파일 저장 디렉토리
UPLOAD_DIR = "app/static/recordings/"

# 업로드 디렉토리 생성
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.get("/random/")
async def get_random_word():
    """
    모든 단어중에 랜덤으로 조회 한다.
    """
    try:
        random_word = await service.get_random_word_with_processing("items")
        if not random_word:
            raise HTTPException(status_code=404, detail="모든 단어중에 랜덤으로 조회할 수 없습니다.")
        return {"items": random_word}
    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"오류 발생: {str(e)}")