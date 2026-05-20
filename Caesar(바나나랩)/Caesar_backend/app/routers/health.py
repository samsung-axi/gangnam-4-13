"""
헬스체크 라우터
- /health       : 앱 상태
- /health/db    : DB 연결/버전 확인(MySQL 쿼리)
"""
from fastapi import APIRouter
from sqlalchemy import text
from ..database import SessionLocal

router = APIRouter(prefix="/health", tags=["health"])


@router.get("")
def health():
    return {"status": "ok"}


@router.get("/db")
def health_db():
    try:
        with SessionLocal() as s:
            row = s.execute(text("SELECT database() as db, version() as v")).mappings().first()
        return {"status": "ok", "db": row["db"], "version": row["v"]}
    except Exception as e:
        return {"status": "ng", "error": type(e).__name__, "message": str(e)}
