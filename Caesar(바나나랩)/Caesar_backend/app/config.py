"""
환경설정 로더
- .env에서 AUTH_MODE, DB_URL(MySQL), ENC_KEY(AES 키) 로드
"""
import os, base64
from functools import lru_cache
from pathlib import Path
from dotenv import load_dotenv

# .env 자동 로드(backend/.env 우선)
try:
    from dotenv import load_dotenv
    load_dotenv(Path(__file__).with_name(".env"))
except Exception:
    pass


class Settings:
    # 인증 모드: DEV(간편 토큰) | FULL(실서비스: JWT 등으로 교체 예정)
    AUTH_MODE: str = os.getenv("AUTH_MODE", "DEV").upper()

    # MySQL 연결 문자열 (예시는 로컬)
    # mysql+pymysql://<user>:<password>@<host>:<port>/<db>?charset=utf8mb4
    DB_URL: str = os.getenv(
        "DB_URL",
        "mysql+pymysql://root:password@127.0.0.1:3306/caesar?charset=utf8mb4",
    )

    # Base64 인코딩된 32바이트 AES 키 (운영에선 KMS/Vault로 고정)
    ENC_KEY_B64: str | None = os.getenv("ENC_KEY")

    @property
    def enc_key(self) -> bytes:
        """암호화 키(bytes). 없으면 개발 편의상 임시 생성(재시작 시 바뀜!)"""
        if not self.ENC_KEY_B64:
            self.ENC_KEY_B64 = base64.b64encode(os.urandom(32)).decode()
        return base64.b64decode(self.ENC_KEY_B64)


@lru_cache
def get_settings() -> Settings:
    """Settings를 싱글톤으로 제공"""
    return Settings()
