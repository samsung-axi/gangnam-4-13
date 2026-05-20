from transformers import pipeline
from multiprocessing import freeze_support
import torch
import warnings
warnings.filterwarnings('ignore')  # 경고 메시지 숨기기

styles = ['문어체','구어체','안드로이드','아재','채팅',
    '초등학생','이모티콘','enfp','신사','할아버지','할머니','중학생',
    '왕','나루토','선비','소심한','번역기']

other_styles = ['이쁘게', '귀엽게', '공손하게', '존댓말로', '친근하게']

def create_model():
    # GPU 메모리 문제 방지를 위한 설정
    torch.cuda.empty_cache()
    
    # 모델 설정
    model_name = "heegyu/kobart-text-style-transfer"
    try:
        return pipeline(
            'text2text-generation',
            model=model_name,
            device=0 if torch.cuda.is_available() else -1,
            model_kwargs={"torch_dtype": torch.float32}
        )
    except Exception as e:
        print(f"GPU 로딩 실패, CPU로 시도합니다: {e}")
        return pipeline(
            'text2text-generation',
            model=model_name,
            device=-1,
            model_kwargs={"torch_dtype": torch.float32}
        )

def transfer_text_style(model, text, target_style, **kwargs):
    input = f"{target_style} 말투로 변환:{text}"
    out = model(input, max_length=64, **kwargs)
    print(f"[{target_style}] {out[0]['generated_text']}")  # 스타일과 변환된 텍스트만 출력

if __name__ == "__main__":
    # Windows에서 multiprocessing 지원을 위해 필요
    freeze_support()
    
    # 모델 생성
    model = create_model()
    
    # 텍스트 변환 실행
    text = input("변환하시려는 문장을 입력해주세요: ")
    for style in styles:
        transfer_text_style(model, text, style)
    
    print("--------------------------------")
    
    # 텍스트 변환 실행
    for style in other_styles:
        transfer_text_style(model, text, style)