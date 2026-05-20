
from app.repository.db_repository import DBRepository


class WordService:
    def __init__(self, repository: DBRepository):
        self.repository = repository

    async def create_item(self, data: dict) -> str:
        """
        새 항목을 생성하고 ID를 반환합니다.
        """
        return await self.repository.create_item("items", data)
    
    async def get_cnt_by_username(self, username: str) -> int:
        """
        사용자 이름을 기준으로 항목을 조회합니다.
        """
        return await self.repository.get_cnt_by_username("items", username)
    
    async def get_item_by_word(self, word: str) -> dict:
        """
        단어 이름을 기준으로 항목을 조회합니다.
        """
        return await self.repository.get_item_by_word("items", word)
    
    async def get_item_by_username(self, username: str) -> list:
        """
        내 단어 유무를 기준으로 항목을 조회합니다.
        """
        return await self.repository.get_item_by_username("items", username)

    async def update_item(self, item_id: str, data: dict) -> bool:
        """
        항목 데이터를 업데이트합니다.
        """
        return await self.repository.update_item("items", item_id, data)
    
    async def delete_item(self, item_id: str) -> bool:
        """
        항목을 삭제합니다.
        """
        return await self.repository.delete_item("items", item_id)


