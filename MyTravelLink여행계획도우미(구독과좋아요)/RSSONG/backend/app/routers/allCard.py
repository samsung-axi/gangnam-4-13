from fastapi import APIRouter, HTTPException
from app.services.allCard_service import SavedAllCard
from app.repository.db_repository import DBRepository
from motor.motor_asyncio import AsyncIOMotorClient
from app.config import settings  # 환경 변수 설정
import os

router = APIRouter()

# MongoDB 연결 설정
client = AsyncIOMotorClient(settings.mongo_uri)
db = client[settings.database_name]
repository = DBRepository(db)
service = SavedAllCard(repository)

# 업로드 파일 저장 디렉토리
UPLOAD_DIR = "app/static/recordings/"

# 업로드 디렉토리 생성
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.get("/allcard/")
async def get_mywords():
    """
    모든 단어를 조회 한다.
    """
    try:
        processed_items = await service.get_allwords_with_processing()
        if not processed_items:
            raise HTTPException(status_code=404, detail="모든 단어를 조회할 수 없습니다.")
        return {"items": processed_items}
    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"오류 발생: {str(e)}")