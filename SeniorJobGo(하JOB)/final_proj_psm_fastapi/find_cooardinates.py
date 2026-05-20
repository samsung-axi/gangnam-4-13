from PIL import Image
import fitz  # PyMuPDF
import os

def get_coordinates(pdf_path):
    print(f"PDF 파일 열기 시도: {pdf_path}")
    
    # PDF 파일이 존재하는지 확인
    if not os.path.exists(pdf_path):
        print(f"Error: PDF 파일을 찾을 수 없습니다: {pdf_path}")
        return
        
    # PDF 문서 열기
    doc = fitz.open(pdf_path)
    page = doc[0]  # 첫 페이지
    
    print("PDF 파일 열기 성공")
    print(f"페이지 크기: {page.rect}")
    
    # PDF를 이미지로 변환
    pix = page.get_pixmap()
    img = Image.frombytes("RGB", [pix.width, pix.height], pix.samples)
    
    # 이미지 저장
    img.save("temp_page.png")
    print("임시 이미지 파일 생성됨: temp_page.png")
    
    # 클릭 이벤트를 통해 좌표 얻기
    def on_click(event):
        print(f"클릭한 좌표: ({event.x}, {event.y})")
    
    # 이미지 표시 및 클릭 이벤트 바인딩
    import tkinter as tk
    from PIL import ImageTk
    
    root = tk.Tk()
    root.title("PDF 좌표 찾기")
    img_tk = ImageTk.PhotoImage(img)
    label = tk.Label(root, image=img_tk)
    label.bind('<Button-1>', on_click)
    label.pack()
    
    print("창이 열렸습니다. PDF를 클릭하면 좌표가 출력됩니다.")
    root.mainloop()
    
    doc.close()

if __name__ == "__main__":
    # PDF 파일의 절대 경로 출력
    template_path = os.path.abspath("templates/resume_template.pdf")
    print(f"찾고있는 PDF 파일 경로: {template_path}")
    
    # 좌표 찾기 실행
    get_coordinates(template_path)
