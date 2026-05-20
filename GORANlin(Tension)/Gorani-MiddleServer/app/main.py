from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import logging
import asyncio
from contextlib import asynccontextmanager
from app.routes.glossary_router import router as glossary_router
from app.routes.translate import router as translate_router  # ✅ 번역 라우트 추가

# ✅ 로깅 설정 (uvicorn 포함)
logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")
logger = logging.getLogger(__name__)

# ✅ FastAPI 서버 실행 및 종료 관리
@asynccontextmanager
async def lifespan(app: FastAPI):
    try:
        logger.info("🚀 FastAPI 서버 시작됨!")
        yield
    except asyncio.CancelledError:
        logger.warning("⚠️ FastAPI 실행이 취소됨 (asyncio.CancelledError 발생)")
    except Exception as e:
        logger.error(f"❌ FastAPI 실행 중 예외 발생: {str(e)}")
    finally:
        logger.info("🛑 FastAPI 서버 종료됨.")

# ✅ FastAPI 앱 초기화 (lifespan 추가)
app = FastAPI(title="Translation Service", lifespan=lifespan)

# ✅ 라우터 포함
app.include_router(glossary_router)
app.include_router(translate_router)  # ✅ 번역 라우트 추가

# ✅ CORS 설정 (보안 강화 가능)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 필요 시 특정 도메인으로 제한 가능
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ 기본 라우트 (서버 상태 확인용)
@app.get("/")
async def root():
    return {"message": "FastAPI Translation Service is running!"}
