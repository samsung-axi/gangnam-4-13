from transformers import pipeline
import torch
from concurrent.futures import ThreadPoolExecutor, TimeoutError
import signal
import sys
import warnings
warnings.filterwarnings('ignore')  # 경고 메시지 숨기기

MODEL_NAME = "heegyu/kobart-text-style-transfer"
TIMEOUT_SECONDS = 10
_generator = None

def signal_handler(sig, frame):
    print('\n프로그램을 종료합니다...')
    sys.exit(0)

signal.signal(signal.SIGINT, signal_handler)

def create_generator():
    global _generator
    try:
        # GPU 메모리 문제 방지를 위한 설정
        if torch.cuda.is_available():
            torch.cuda.empty_cache()
            torch.backends.cudnn.benchmark = True
            
        _generator = pipeline(
            "text2text-generation",
            model=MODEL_NAME,
            device="cuda" if torch.cuda.is_available() else "cpu",
            model_kwargs={
                "torch_dtype": torch.float32,  # float32로 변경
                "low_cpu_mem_usage": True
            }
        )
    except KeyboardInterrupt:
        print('\n모델 초기화가 취소되었습니다.')
        sys.exit(0)
    except Exception as e:
        print(f'모델 초기화 중 오류 발생: {str(e)}')
        raise e

def convert_with_ai(style: str, text: str) -> str:        
    style_prompts = {
        "pretty": f"enfp 말투로 변환:{text}",  # enfp로 변경
        "cute": f"이모티콘 말투로 변환:{text}",  # 이모티콘으로 변경
        "friendly": f"구어체 말투로 변환:{text}"  # 구어체로 변경
    }
    
    try:
        prompt = style_prompts.get(style, f"변환: {text}")
        
        with ThreadPoolExecutor(max_workers=1) as executor:
            future = executor.submit(_generator, 
                prompt,
                max_length=64,  # test.py와 동일하게 변경
                num_return_sequences=1,
                temperature=0.7,
                do_sample=True,
                repetition_penalty=1.2,
                no_repeat_ngram_size=2
            )
            
            try:
                result = future.result(timeout=TIMEOUT_SECONDS)[0]["generated_text"].strip()
                print(f"[{style}] {result}")  # 스타일과 함께 결과 출력
                return result
                
            except TimeoutError:
                executor.shutdown(wait=False, cancel_futures=True)
                raise Exception("변환 시간이 너무 오래 걸립니다")
            except KeyboardInterrupt:
                executor.shutdown(wait=False, cancel_futures=True)
                print('\n변환이 취소되었습니다.')
                sys.exit(0)
            
    except Exception as e:
        if isinstance(e, KeyboardInterrupt):
            sys.exit(0)
        raise Exception(f"AI 변환 중 오류 발생: {str(e)}")