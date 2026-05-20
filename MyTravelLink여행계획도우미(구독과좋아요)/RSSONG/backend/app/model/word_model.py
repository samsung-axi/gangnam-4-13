from pydantic import BaseModel, Field
from datetime import datetime, timezone
class wordModel(BaseModel):
    # 문자열 : word, path, username
    # timestamps : update_at, create_at
    word: str
    path: str
    username: str 
    # timestamps 필드
    update_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    create_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))