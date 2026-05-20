from fastapi import FastAPI, HTTPException, APIRouter
from motor.motor_asyncio import AsyncIOMotorClient
from app.repository.db_repository import DBRepository
from app.services.dbtest import WordService
from app.model.word_model import wordModel

router = APIRouter()

# MongoDB 연결 설정
MONGO_URI = "mongodb://192.168.0.236:27017"
client = AsyncIOMotorClient(MONGO_URI)
db = client["miniproject"]

# Repository 및 Service 초기화
repository = DBRepository(db)
ws = WordService(repository)


@router.post("/words/")
async def create_item(item: wordModel):
    """
    새 항목을 생성하는 엔드포인트.
    """
    data = {key: value for key, value in item}
    id = await ws.create_item(data)
    return {"message": "Item created successfully", "id": id}


@router.get("/words/{id}")
async def get_item(id: str):
    """
    ID를 기준으로 항목을 조회하는 엔드포인트.
    """
    item = await ws.get_item_by_id(id)
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    return item


@router.put("/words/{id}")
async def update_item(id: str, item: wordModel):
    """
    ID를 기준으로 항목을 업데이트하는 엔드포인트.
    """
    updated = await ws.update_item(id, item.dict())
    if not updated:
        raise HTTPException(status_code=404, detail="Item not found or not updated")
    return {"message": "Item updated successfully"}


@router.delete("/words/{id}")
async def delete_item(id: str):
    """
    ID를 기준으로 항목을 삭제하는 엔드포인트.
    """
    deleted = await ws.delete_item(id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Item not found or not deleted")
    return {"message": "Item deleted successfully"}
