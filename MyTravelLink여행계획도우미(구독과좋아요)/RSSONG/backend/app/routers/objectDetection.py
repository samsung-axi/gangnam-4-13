# app/routers/objectDetection.py
from fastapi import APIRouter, UploadFile, File, HTTPException
from app.services.objectDetection import detect_objects
import os
import shutil

router = APIRouter()

# 업로드 이미지 저장 경로
UPLOAD_DIR = "app/static/"

@router.post("/detect/")
async def detect_object_in_image(file: UploadFile = File(...)):
    """
    이미지에서 객체 감지
    :param file: 업로드된 이미지
    :return: 감지된 객체 이름
    """
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
        detected_object = detect_objects(file_path)

        return {"detected_object": detected_object}
    except FileNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except RuntimeError as e:
        raise HTTPException(status_code=500, detail=str(e))
    except PermissionError:
        raise HTTPException(
            status_code=500,
            detail="파일을 삭제할 수 없습니다. 다른 프로세스가 파일을 사용 중입니다."
        )
