from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from pydantic import BaseModel
from converter_manager import convert_text, init_ai
from polite_converter import convert_to_polite

@asynccontextmanager
async def lifespan(app: FastAPI):
    try:
        init_ai()
        print("AI 모델 초기화 완료")
    except Exception as e:
        print(f"AI 모델 초기화 실패: {e}")
        print("기본 변환 로직을 사용합니다.")
    yield

app = FastAPI(lifespan=lifespan)
templates = Jinja2Templates(directory="src")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"]
)

class TextRequest(BaseModel):
    text: str
    style: str

@app.get("/")
async def read_root(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})

@app.get("/transform")
async def transform(request: Request):
    return templates.TemplateResponse("transform.html", {"request": request})

@app.post("/convert")
async def convert(request: TextRequest):
    converted_text = convert_text(request.text, request.style)
    return {"converted_text": converted_text}

@app.get("/styles")
async def get_styles():
    return {
        "styles": [
            {"id": "pretty", "name": "이쁘게"},
            {"id": "cute", "name": "귀엽게"},
            {"id": "polite", "name": "공손하게"},
            {"id": "formal", "name": "존댓말로"},
            {"id": "friendly", "name": "친근하게"}
        ]
    }

app.mount("/src", StaticFiles(directory="src"), name="src")