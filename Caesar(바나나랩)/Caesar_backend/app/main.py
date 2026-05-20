# backend/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .features.login.routes import router as login_router
from .routers.health import router as health_router
from .database import init_db_and_seed  # 새 스키마에서는 수동으로 테이블 생성하므로 필요시에만 사용

app = FastAPI(title="Caesar Backend (MySQL / DEV Auth)", version="0.2.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], allow_methods=["*"], allow_headers=["*"], allow_credentials=True,
)

app.include_router(health_router)
app.include_router(login_router)

@app.on_event("startup")
def _startup():
    # 새 스키마: SQL로 수동 생성된 테이블 사용
    # 기존 DB와 호환성을 위해 임시로 비활성화
    # init_db_and_seed()  # 개발용 - ORM으로 테이블 생성 및 시드 데이터 주입
    pass  # MySQL 연결 없이도 서버 실행 가능하도록 비활성화
