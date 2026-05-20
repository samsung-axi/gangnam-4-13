from transformers import pipeline
import torch
from concurrent.futures import ThreadPoolExecutor, TimeoutError

MODEL_NAME = "9unu/gentle_speech_translation"
TIMEOUT_SECONDS = 10
_generator = None

def init_polite_generator():
    global _generator
    if not _generator:
        device = "cuda" if torch.cuda.is_available() else "cpu"
        if device == "cuda":
            torch.backends.cudnn.benchmark = True  # CUDA 성능 최적화
        
        _generator = pipeline(
            "text2text-generation",
            model=MODEL_NAME,
            device=device,
            model_kwargs={
                "torch_dtype": torch.float16,
                "low_cpu_mem_usage": True  # 메모리 사용 최적화
            }
        )

def _generate_with_timeout(text: str) -> str:
    with ThreadPoolExecutor(max_workers=1) as executor:
        future = executor.submit(
            _generator,
            text,
            max_length=256,
            num_return_sequences=1,
            temperature=0.7,
            do_sample=True,
            repetition_penalty=1.2,  # 반복 방지
            no_repeat_ngram_size=2  # 2-gram 반복 방지
        )
        
        try:
            return future.result(timeout=TIMEOUT_SECONDS)[0]["generated_text"].strip()
        except TimeoutError:
            executor.shutdown(wait=False, cancel_futures=True)
            raise Exception("변환 시간이 너무 오래 걸립니다")

def convert_to_polite(text: str) -> str:
    if not _generator:  # 초기화 확인 추가
        init_polite_generator()
        
    try:
        return _generate_with_timeout(text)
        
    except Exception as e:
        raise Exception(f"정중체 변환 중 오류 발생: {str(e)}") 