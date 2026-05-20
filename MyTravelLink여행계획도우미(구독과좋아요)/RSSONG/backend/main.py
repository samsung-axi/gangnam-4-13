# backend/main.py

from fastapi import FastAPI, Request
from fastapi.staticfiles import StaticFiles
from fastapi import FastAPI
from app.routers import textToVoice, similarity, objectDetection, audio, translation,dbtest, card, allCard, random

from fastapi.middleware.cors import CORSMiddleware
from starlette.responses import Response
from app.routers import (
    savedMyCard,
    textToVoice,
    similarity,
    objectDetection,
    audio,
    translation,
    dbtest,
    allCard,
    random,
    # 다른 라우터가 있다면 여기에 추가
)
from pathlib import Path

app = FastAPI()

# 라우터 포함
app.include_router(textToVoice.router)
app.include_router(similarity.router)
app.include_router(objectDetection.router)
app.include_router(audio.router)
app.include_router(translation.router)  # translation 라우터 추가
app.include_router(dbtest.router)  # dbtest 라우터 추가
app.include_router(card.router)  # card 라우터 추가
app.include_router(random.router)

# CORS 설정
# origins = [
#     "http://localhost:3000",  # React 개발 서버
#     "http://192.168.0.129:3000",
#     "http://192.168.219.227:8000/docs",
#     "http://127.0.0.1:8000",
#     "http://localhost:8000",
#     "http://localhost:8000/docs/"
# ]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 필요에 따라 도메인 제한
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 정적 파일 서빙 설정
# 기존 /static 마운트
app.mount("/static", StaticFiles(directory="app/static"), name="static")

# BASE_DIR을 프로젝트 루트로 설정 (RSSONG 디렉토리)
BASE_DIR = Path(__file__).resolve().parent.parent  # backend/의 상위 디렉토리로 이동

IMAGES_DIR = BASE_DIR / "database" / "images"

# 디렉토리가 실제로 존재하는지 확인
if not IMAGES_DIR.exists():
    raise Exception(f"이미지 디렉토리 경로가 존재하지 않습니다: {IMAGES_DIR}")

# 새로운 /database/images 마운트
app.mount("/database/images", StaticFiles(directory=str(IMAGES_DIR)), name="database_images")

# 라우터 포함
# 라우터 포함 (한 번만 포함)
app.include_router(textToVoice.router)
app.include_router(similarity.router)
app.include_router(objectDetection.router)
app.include_router(audio.router)
app.include_router(translation.router)
app.include_router(dbtest.router)
app.include_router(card.router)
app.include_router(savedMyCard.router)
app.include_router(allCard.router)
app.include_router(random.router)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000,reload=True)