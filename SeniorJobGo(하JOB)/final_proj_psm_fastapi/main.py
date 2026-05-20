from fastapi import FastAPI, HTTPException, Form, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from typing import Optional
from PyPDF2 import PdfReader, PdfWriter
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import A4
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
import pdfplumber
import io
import os

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def find_name_field(pdf_path):
    """pdfplumber로 '성명' 키워드와 오른쪽 필드의 위치를 찾음"""
    with pdfplumber.open(pdf_path) as pdf:
        first_page = pdf.pages[0]
        height = first_page.height
        words = first_page.extract_words()
        
        print("추출된 단어들:")
        for word in words:
            print(f"텍스트: {word['text']}")
            if '성' in word['text'] or '명' in word['text']:
                print(f"찾은 키워드: {word['text']}, 위치: x={word['x0']}, y={word['top']}")
                # 키워드 오른쪽에 입력 필드 위치 설정
                x0 = word['x1'] + 20  # 키워드 끝에서 10포인트 띄움
                y0 = height - word['top'] - 10  # PDF 좌표계로 변환
                width = 100  # 적당한 너비 설정
                return (x0, y0, width)
    return None

def fill_pdf_template(name):
    template_path = "templates/resume_template.pdf"
    output_path = f"generated_resumes/{name}_resume.pdf"
    
    # 성명 필드 위치 찾기
    field_info = find_name_field(template_path)
    if not field_info:
        raise ValueError("성명 필드를 찾을 수 없습니다.")
    
    x, y, width = field_info
    
    # 기존 PDF 읽기
    reader = PdfReader(template_path)
    writer = PdfWriter()
    
    # 새로운 PDF에 텍스트 추가
    packet = io.BytesIO()
    c = canvas.Canvas(packet, pagesize=A4)
    
    try:
        # 폰트 설정
        pdfmetrics.registerFont(TTFont('NanumGothic', 'fonts/NanumGothic.ttf'))
        c.setFont('NanumGothic', 12)
    except:
        c.setFont('Helvetica', 12)
    
    # 이름 입력 (가운데 정렬)
    text_width = c.stringWidth(name, 'NanumGothic', 12)
    x_centered = x + (width - text_width) / 2
    c.drawString(x_centered, y, name)
    c.save()
    
    # 새로운 PDF를 기존 PDF에 병합
    packet.seek(0)
    new_pdf = PdfReader(packet)
    page = reader.pages[0]
    page.merge_page(new_pdf.pages[0])
    writer.add_page(page)
    
    # 결과 PDF 저장
    with open(output_path, "wb") as output_file:
        writer.write(output_file)
    
    return output_path

@app.post("/resume")
async def create_resume(name: str = Form(...)):
    try:
        # 출력 디렉토리 생성
        os.makedirs("generated_resumes", exist_ok=True)
        
        # PDF 생성
        output_path = fill_pdf_template(name)
        
        return FileResponse(
            output_path,
            media_type='application/pdf',
            filename=f"{name}_resume.pdf"
        )

    except Exception as e:
        print(f"Error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)