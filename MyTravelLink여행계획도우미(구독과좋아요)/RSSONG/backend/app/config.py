from pydantic_settings import BaseSettings  # 수정된 임포트 경로

class Settings(BaseSettings):
    mongo_uri: str = "mongodb://192.168.0.236:27017"
    database_name: str = "miniproject"

    class Config:
        env_file = ".env"

settings = Settings()
