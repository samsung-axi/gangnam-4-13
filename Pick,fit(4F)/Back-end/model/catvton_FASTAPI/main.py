from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.staticfiles import StaticFiles #URL 접근 위한 정적 파일 제공 모듈 
from contextlib import asynccontextmanager #비동기처리
import base64
import json
from io import BytesIO
from PIL import Image, ImageFilter
from datetime import datetime
import torch
import numpy as np
from huggingface_hub import snapshot_download
from model.cloth_masker import AutoMasker
from model.pipeline import CatVTONPipeline
import os

output_image_dir = "output/"
os.makedirs(output_image_dir, exist_ok=True)
seed = 555

@asynccontextmanager
async def lifespan(app: FastAPI): # 메모리에 로드 시켜 재 실행 시 모델 로드를 두번 하지 않음
    repo_path = snapshot_download(repo_id="zhengchong/CatVTON")

    app.state.repo_path = repo_path
    automasker = AutoMasker(
        densepose_ckpt=os.path.join(repo_path, "DensePose"),
        schp_ckpt=os.path.join(repo_path, "SCHP"),
        device="cuda")

    @torch.no_grad()
    def load_catvton_pipeline():
        return CatVTONPipeline(
            attn_ckpt_version="mix",
            attn_ckpt=repo_path,
            base_ckpt="booksforcharlie/stable-diffusion-inpainting",
            weight_dtype=torch.float32,
            device="cuda",
            skip_safety_check=True,
            use_tf32=True,
            compile=False)

    catvton_pipeline = load_catvton_pipeline()
    app.state.automasker = automasker # 한번 업로드하고 전역적으로 사용 가능
    app.state.catvton_pipeline = catvton_pipeline
    yield
    print("SET")

app = FastAPI(lifespan=lifespan)
app.mount("/static", StaticFiles(directory=output_image_dir), name="static") #이미지 저장! 추후 db, s3에서 접근 가능 -> 가져가면 삭제하는 로직도 추후 필요

@app.get("/")
async def read_root():
    return {"message": "Welcome to the API!"}

def decode_base64_to_image(base64_data: str) -> Image.Image:
    image_data = base64.b64decode(base64_data)
    return Image.open(BytesIO(image_data))

def generate_mask_in_memory(automasker: AutoMasker, person_image: Image.Image) -> Image.Image:
    mask = automasker(person_image)['mask']
    return mask

def repaint(person: Image.Image, mask: Image.Image, result: Image.Image) -> Image.Image: # 이것 때문에 잔상이 아주 조금 어색하게 남지만 없으면 어색함이 생김
    _, h = result.size
    kernal_size = h // 100
    if kernal_size % 2 == 0: #픽셀의 가중평균 중심값 좌우대칭이어야함 3,3 행렬이면 1,1 이 중심점 
        kernal_size += 1
    mask = mask.filter(ImageFilter.GaussianBlur(kernal_size)) #중심에 더 높은 가중치를 준다. 부드럽고 자연스럽다. 정규분포
    mask = mask.resize(person.size, Image.BILINEAR)
    result = result.resize(person.size, Image.BILINEAR)
    person_np = np.array(person)
    result_np = np.array(result)
    mask_np = np.array(mask) / 255
    mask_np = np.expand_dims(mask_np, axis=-1) # 차원추가
    mask_np = np.repeat(mask_np, 3, axis=-1) # (height, width, 3) 3차원 통일
    repaint_result = person_np * (1 - mask_np) + result_np * mask_np
    return Image.fromarray(repaint_result.astype(np.uint8))

def apply_virtual_tryon(catvton_pipeline, person_image: Image.Image, clothing_image: Image.Image, mask_image: Image.Image, output_path: str) -> str: #call
    generator = torch.Generator(device="cuda").manual_seed(seed)
    results = catvton_pipeline(
        person_image,
        clothing_image,
        mask_image,
        num_inference_steps=50, # 50번추론 
        guidance_scale=2.5, # 높으면 더 자유도 없이 강하게 비교! 아웃터 할 때 조정 필요! 
        height=1024,
        width=768,
        generator=generator, #동일한 시드로 같은 결과 값 생성
        eta=1.0) # 노이즈 적절히 추가
    repaint_result = repaint(person_image, mask_image, results[0])
    repaint_result.save(output_path)
    return output_path

@app.post("/upload/")
async def upload_images(file: UploadFile = File(...)):
    contents = await file.read()
    data = json.loads(contents)
    person_base64 = data.get("person_base64")
    cloth_base64 = data.get("cloth_base64")

    person_image = decode_base64_to_image(person_base64)
    clothing_image = decode_base64_to_image(cloth_base64)
    big_category = data.get("category_analysis", {}).get("big_category")  
    
    category_to_mask_type = {"top":"upper","bottom": "lower","outer": "outer","onepiece": "overall"}
    mask_type = category_to_mask_type.get(big_category)

    mask_image = app.state.automasker(person_image, mask_type=mask_type)['mask']

    timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
    output_file_name = f"{timestamp}_output.jpg"
    output_path = os.path.join(output_image_dir, output_file_name)

    apply_virtual_tryon(app.state.catvton_pipeline, person_image, clothing_image, mask_image, output_path)

    return {"message": "Done", "url": f"/static/{output_file_name}"}