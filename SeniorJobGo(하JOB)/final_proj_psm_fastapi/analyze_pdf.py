import fitz
import cv2
import numpy as np
from PIL import Image
import os

def find_cell_boundaries(img_cv, text_rect, zoom):
    """'사진' 텍스트가 있는 셀의 테두리를 찾는 함수"""
    gray = cv2.cvtColor(img_cv, cv2.COLOR_BGR2GRAY)
    edges = cv2.Canny(gray, 50, 150)
    
    # 텍스트 주변 영역 확장
    x = int(text_rect.x0 * zoom)
    y = int(text_rect.y0 * zoom)
    
    # 텍스트 위치에서 위쪽으로 검색
    top = y
    while top > 0:
        if edges[top, x] > 0:  # 선 발견
            break
        top -= 1
    
    # 텍스트 위치에서 아래쪽으로 검색
    bottom = y
    while bottom < edges.shape[0]:
        if edges[bottom, x] > 0:
            break
        bottom += 1
    
    # 텍스트 위치에서 왼쪽으로 검색
    left = x
    while left > 0:
        if edges[y, left] > 0:
            break
        left -= 1
    
    # zoom 고려하여 실제 좌표 반환
    return (int(left/zoom), int(top/zoom), int((bottom-top)/zoom))

def analyze_pdf_layout(pdf_path):
    print("PDF 분석 시작...")
    
    doc = fitz.open(pdf_path)
    page = doc[0]
    
    # 시각화를 위한 이미지 변환
    zoom = 2
    mat = fitz.Matrix(zoom, zoom)
    pix = page.get_pixmap(matrix=mat)
    img = Image.frombytes("RGB", [pix.width, pix.height], pix.samples)
    img_cv = cv2.cvtColor(np.array(img), cv2.COLOR_RGB2BGR)
    
    fields = {}
    
    # PDF에서 '사진' 텍스트 찾기
    text_instances = page.search_for("사진")
    if text_instances:
        photo_rect = text_instances[0]
        
        # 셀 테두리 찾기
        left, top, height = find_cell_boundaries(img_cv, photo_rect, zoom)
        
        # 사진 크기를 셀 크기에 맞춤
        photo_width = height * 0.75  # 3:4 비율 유지
        
        # 셀 안에 사진 위치 지정
        fields['photo'] = (int(left + 5), int(top + 5), int(photo_width), int(height - 10))
        print(f"사진 영역 발견: {fields['photo']}")
    
    # '성명' 텍스트 찾기
    name_instances = page.search_for("성명")
    if name_instances:
        name_rect = name_instances[0]
        fields['name'] = (name_rect.x1 + 10, name_rect.y0 + 10)
        print(f"성명 필드 발견: {fields['name']}")
    
    print("찾은 필드:", fields)
    
    # 결과 시각화
    for field_name, coords in fields.items():
        if field_name == 'photo':
            x, y, w, h = coords
            cv2.rectangle(img_cv, 
                        (int(x*zoom), int(y*zoom)), 
                        (int((x+w)*zoom), int((y+h)*zoom)), 
                        (0, 255, 0), 2)
        else:
            x, y = coords
            cv2.circle(img_cv, (int(x*zoom), int(y*zoom)), 5, (0, 0, 255), -1)
    
    cv2.imwrite('analyzed_template.png', img_cv)
    print("분석 결과 이미지 저장됨: analyzed_template.png")
    
    return fields

if __name__ == "__main__":
    template_path = "templates/resume_template.pdf"
    print(f"템플릿 파일 경로: {template_path}")
    fields = analyze_pdf_layout(template_path) 