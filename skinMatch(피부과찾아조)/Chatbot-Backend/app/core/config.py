from pydantic_settings import BaseSettings
from dotenv import load_dotenv
import os

load_dotenv()


class Settings(BaseSettings):
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")
    MODEL: str = os.getenv("MODEL", "gpt-4o-mini")
    LOG_LEVEL: str = os.getenv("LOG_LEVEL", "info")
    HOST: str = os.getenv("HOST", "0.0.0.0")
    PORT: int = int(os.getenv("PORT", "8010"))
    ALLOWED_ORIGINS: str = os.getenv("ALLOWED_ORIGINS", "http://localhost:5173,http://localhost:3000")
    
    # 분석 백엔드 연동 설정
    ANALYSIS_BACKEND_URL: str = os.getenv("ANALYSIS_BACKEND_URL", "http://localhost:8001")

    class Config:
        env_file = ".env"


settings = Settings()

