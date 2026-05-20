from motor.motor_asyncio import AsyncIOMotorDatabase
from bson.objectid import ObjectId
import random

class DBRepository:
    def __init__(self, db: AsyncIOMotorDatabase):
        self.db = db

    async def create_item(self, collection: str, data: dict) -> str:
        """
        MongoDB에 새 단어를 생성합니다.
        """
        result = await self.db[collection].insert_one(data)
        return str(result.inserted_id)
    
    async def get_all_items(self, collection: str) -> list:
        """
        MongoDB에서 모든 단어를 조회합니다.
        """
        results = await self.db[collection].find().to_list(length=None)
    
        if results is None:  # 예외 상황 처리
            return []  # 빈 리스트 반환

        for result in results:
            result["_id"] = str(result["_id"])  # 각 문서의 ObjectId를 문자열로 변환
        return results
    
    async def get_cnt_by_username(self, collection: str, username: str) -> int:
        """
        사용자 이름을 기준으로 MongoDB에서 단어를 조회합니다.
        """
        result = await self.db[collection].count_documents({"username": username})
        return result

    async def get_item_by_word(self, collection: str, word: str) -> dict:
        """
        단어 이름을 기준으로 MongoDB에서 단어를 조회합니다.
        """
        result = await self.db[collection].find_one({"word": word})

        if result:
            result["_id"] = str(result["_id"])  # ObjectId를 문자열로 변환
        return result
    
    async def get_random_item(self, collection: str) -> dict:
        """
        모든 단어 중에서 랜덤으로 하나를 선택하고 필요한 처리를 수행합니다.
        """
        all_words = await self.get_all_items(collection)
        if not all_words:
            return None
        
        random_word = random.choice(all_words)

        # 필요한 처리를 여기에 추가
        random_word["_id"] = str(random_word["_id"])  # ObjectId를 문자열로 변환

        return random_word

    async def get_item_by_username(self, collection: str, username: str) -> list:
        """
        사용자 이름을 기준으로 MongoDB에서 단어를 조회합니다.
        """
        results = await self.db[collection].find({"username": username}).to_list(length=None)
        if results:
            for result in results:
                result["_id"] = str(result["_id"])  # 각 문서의 ObjectId를 문자열로 변환
        return results  # 수정된 부분: result → results

    async def update_item(self, collection: str, item_id: str, data: dict) -> bool:
        """
        ID를 기준으로 MongoDB 단어를 업데이트합니다.
        """
        result = await self.db[collection].update_one(
            {"_id": ObjectId(item_id)}, {"$set": data}
        )
        return result.modified_count > 0

    async def delete_item(self, collection: str, item_id: str) -> bool:
        """
        ID를 기준으로 MongoDB 단어를 삭제합니다.
        """
        result = await self.db[collection].delete_one({"_id": ObjectId(item_id)})
        return result.deleted_count > 0
