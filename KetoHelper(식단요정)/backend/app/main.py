# -*- coding: utf-8 -*-
"""
키토 식단 추천 웹앱 메인 애플리케이션
대화형 키토 식단 레시피 추천 + 주변 키토 친화 식당 찾기
"""
from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from contextlib import asynccontextmanager
import uvicorn
import os, re
from dotenv import load_dotenv
import asyncio

from app.domains.chat.api import chat
from app.shared.api.date_endpoints import router as date_parser_router
from app.domains.restaurant.api import places
from app.domains.meal.api import plans
from app.domains.profile.api import profile
from app.domains.admin.api import metrics as admin_metrics
from app.domains.admin.api.redis_status import router as redis_status_router
from app.shared.api import auth as auth_api
from app.core.config import settings
from app.core.database import init_db

@asynccontextmanager
async def lifespan(app: FastAPI):
    """애플리케이션 시작/종료 시 실행되는 함수"""
    # 시작 시
    print("🚀 키토 코치 API 서버 시작")
    
    # 데이터베이스 초기화
    asyncio.create_task(init_db())
    
    yield
    
    # 종료 시
    print("⏹️ 키토 코치 API 서버 종료")

# FastAPI 앱 생성
app = FastAPI(
    title="키토 코치 API",
    description="대화형 한국형 키토 식단 레시피 추천 + 주변 키토 친화 식당 찾기",
    version="1.0.0",
    lifespan=lifespan
)

origins =[
    os.getenv("FRONTEND_DOMAIN", "").rstrip("/"),
    "http://localhost:3000",    # next
    "http://localhost:5173",    # vite
    "http://127.0.0.1:3000",    # next (alternative)
    "http://127.0.0.1:5173",    # vite (alternative)
    "null"                      # file:// protocol for local testing
]

origins = list({o for o in origins if o})

project = os.getenv("VERCEL_PROJECT_NAME", "").strip()  # ex) keto-helper
preview_or_prod_regex = (
    rf"^https://{re.escape(project)}(?:-[a-z0-9-]+)?\.vercel\.app$"
    if project else None
)

# 가드레일 미들웨어 추가 (CORS보다 먼저)
from app.core.guard_middleware import GuardMiddleware
app.add_middleware(
    GuardMiddleware,
    whitelist_paths={
        "/health", "/docs", "/openapi.json", "/redoc",
        "/admin/guard-metrics", "/favicon.ico", "/"
    }
)

# CORS 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_origin_regex=preview_or_prod_regex,  # 프리뷰 자동 허용
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 환경 변수 로드
load_dotenv()

# 라우터 등록
print("DEBUG: 라우터 등록 중...")
app.include_router(chat.router, prefix="/api/v1")
app.include_router(date_parser_router, prefix="/api/v1", tags=["date-parsing"])
app.include_router(places.router, prefix="/api/v1")
app.include_router(plans.router, prefix="/api/v1")
app.include_router(profile.router, prefix="/api/v1")
app.include_router(admin_metrics.router, prefix="/api/v1")
app.include_router(redis_status_router, prefix="/api/v1", tags=["admin"])
app.include_router(auth_api.router, prefix="/api/v1")
print("✅ DEBUG: 모든 라우터 등록 완료")

@app.get("/")
async def root():
    """루트 엔드포인트 - 서비스 상태 확인"""
    return {
        "message": "키토 코치 API 서버가 실행 중입니다 🥑",
        "version": "1.0.0",
        "status": "healthy"
    }

@app.get("/health")
async def health_check():
    """헬스 체크 엔드포인트"""
    return {"status": "ok", "service": "keto-coach-api"}

if __name__ == "__main__":
    print("🚀 직접 실행으로 서버를 시작합니다...")
    uvicorn.run(
        app,
        host="0.0.0.0",
        port=8000,
        reload=False,
        log_level="info"
    )
