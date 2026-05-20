# 객체 감지
from fastapi import APIRouter, UploadFile, File, HTTPException, Form
from app.services.objectDetection import detect_objects
import os
import shutil
# 번역
from fastapi import APIRouter, Query, HTTPException
from app.services.translation import translate_text, translate_lang
# voice 파일 생성
from fastapi import APIRouter, Query, HTTPException
from fastapi.responses import FileResponse
from app.services.textToVoice import generate_tts
# zip 파일 생성
from fastapi.responses import StreamingResponse
from io import BytesIO
import zipfile

# MongoDB
from fastapi import FastAPI, HTTPException, APIRouter
from motor.motor_asyncio import AsyncIOMotorClient
from app.repository.db_repository import DBRepository
from app.services.dbtest import WordService
from app.model.word_model import wordModel
from datetime import datetime, timezone

router = APIRouter()

# MongoDB 연결 설정
MONGO_URI = "mongodb://192.168.0.236:27017"
client = AsyncIOMotorClient(MONGO_URI)
db = client["miniproject"]

# Repository 및 Service 초기화
repository = DBRepository(db)
ws = WordService(repository)


# 업로드 이미지 저장 경로
UPLOAD_DIR = "../database/images/"

@router.post("/scan/")
async def scan_in_image(file: UploadFile = File(...), lang: str = Form(...)):
    """
    이미지에서 객체 감지
    :param file: 업로드된 이미지
    :return: 감지된 객체 이름
    """
    print(f"Received file: {file.filename}")
    print(f"Received language: {lang}")

    if not os.path.exists(UPLOAD_DIR):
        os.makedirs(UPLOAD_DIR)
        
    try:
        # 업로드 파일 저장 
        file_path = os.path.join(UPLOAD_DIR, file.filename)
        with open(file_path, "wb") as f:
            shutil.copyfileobj(file.file, f)

        # 파일 스트림 명시적으로 닫기
        await file.close()
        
        # 이미지 처리
        detected_object = detect_objects(file_path).strip()

        # 확장자 추출
        file_extension = os.path.splitext(file.filename)[1]  # 예: ".jpg", ".png"
        new_file_name = f"{detected_object}{file_extension}"
        new_file_path = os.path.join(UPLOAD_DIR, new_file_name)

        # shutil.move()로 덮어쓰기 허용하며 이동
        shutil.move(file_path, new_file_path)

        # DB에 동일한 username으로 저장된 단어가 있는지 확인
        item_cnt = await ws.get_cnt_by_username("user100")
        print(f"item_cnt: {item_cnt}")

        # item_cnt가 20개 이상이면 가장 오래된 단어 삭제
        if item_cnt >= 20:
            items = await ws.get_item_by_username("user100")
            oldest_item = min(items, key=lambda x: x["update_at"])
            await ws.delete_item(oldest_item["_id"])

        # DB에 동일한 word가 있는지 확인
        item = await ws.get_item_by_word(detected_object)

        # DB에 저장 및 업데이트
        data = {"word": detected_object, "path": f"{detected_object}{file_extension}", "username": "user100", "update_at": datetime.now(timezone.utc), "create_at": datetime.now(timezone.utc)}
        if item:
            # 존재하는 단어 업데이트
            await ws.update_item(item["_id"], data)
        else:
            await ws.create_item(data)
    

    except FileNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except RuntimeError as e:
        raise HTTPException(status_code=500, detail=str(e))
    except PermissionError:
        raise HTTPException(
            status_code=500,
            detail="파일을 삭제할 수 없습니다. 다른 프로세스가 파일을 사용 중입니다."
        )
    
    # 번역
    kor = translate_text(detected_object, dest_lang='ko')
    if lang != 'en':
        if lang == 'ch':
            lang = 'zh-cn'
        elif lang == 'jp':
            lang = 'ja'
            
    trans = detected_object
    if lang != 'en':
        trans = translate_lang(detected_object, dest_lang=lang)

    # 음성 파일 생성  - 한국어

    kor_audio, trans_audio = None, None
    try:
        file_path = generate_tts(text=kor, lang='ko', file_name="kor.mp3")
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    
    # 음성 파일 생성  - 번역
    try:
        file_path = generate_tts(text=trans, lang=lang, file_name="trans.mp3")
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    
    # zip 파일 생성
    path = "app/static/"
    kor_audio = os.path.join(path, "kor.mp3")
    trans_audio = os.path.join(path, "trans.mp3")

    zip_buffer = BytesIO()
    with zipfile.ZipFile(zip_buffer, "w") as zf:
        # 텍스트 파일 추가
        zf.writestr("kor.txt", kor)
        zf.writestr("trans.txt", trans)

        # 음성 파일 추가 (파일 데이터를 읽어서 추가)
        with open(kor_audio, "rb") as audio_file:
            zf.writestr("kor.mp3", audio_file.read())
        with open(trans_audio, "rb") as audio_file:
            zf.writestr("trans.mp3", audio_file.read())

    # zip 파일 반환
    zip_buffer.seek(0)
    return StreamingResponse(
        zip_buffer, 
        media_type="application/zip", 
        headers={"Content-Disposition": "attachment; filename=files.zip"}
        )