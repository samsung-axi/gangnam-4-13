from transformers import AutoModelForCausalLM, AutoTokenizer
import torch

model = None
tokenizer = None

# 기본 프롬프트와 스타일 지침 정의
base_prompt = """
당신은 문장 변환 전문가입니다.
주어진 문장을 지정된 스타일로 변환해주세요.
변환된 문장만 출력하세요. 다른 설명은 하지 마세요.
"""

style_instructions = {
    'formal': "격식있고 공식적인 어투로 변환해주세요.",
    'casual': "친근하고 편안한 어투로 변환해주세요.",
    'polite': "매우 공손하고 예의바른 어투로 변환해주세요.",
    'cute': "귀엽고 애교있는 어투로 변환해주세요."
}

"""
Qwen 모델과 토크나이저를 초기화하는 함수
- Qwen 1.5 4B Chat 모델을 로드
- 자동 데이터타입 설정 및 디바이스 매핑
"""
def init_pipeline():
    global model, tokenizer
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    print(f"Device: {device}")
    
    if device.type == "cuda":
        print(f"GPU 모델: {torch.cuda.get_device_name(0)}")
        print(f"사용 가능한 GPU 개수: {torch.cuda.device_count()}")
        print(f"현재 GPU 메모리 사용량: {torch.cuda.memory_allocated(0)/1024**2:.2f}MB")
    
    model = AutoModelForCausalLM.from_pretrained(
        "Qwen/Qwen1.5-4B-Chat",
        torch_dtype="auto",
        device_map="auto"
    )
    tokenizer = AutoTokenizer.from_pretrained("Qwen/Qwen1.5-4B-Chat")
    
    if device.type == "cuda":
        print(f"모델 로드 후 GPU 메모리 사용량: {torch.cuda.memory_allocated(0)/1024**2:.2f}MB")

"""
채팅 프롬프트를 생성하는 함수
Parameters:
    text (str): 변환할 텍스트
    style (str): 변환할 스타일 ('formal', 'casual', 'polite', 'cute')
Returns:
    str: 채팅 형식으로 포맷팅된 프롬프트
"""
def create_style_prompt(text, style):
    instruction = style_instructions.get(style, style_instructions['formal'])
    messages = [
        {"role": "system", "content": base_prompt},
        {"role": "user", "content": f"{instruction}\n\n문장: {text}"}
    ]
    return tokenizer.apply_chat_template(
        messages,
        tokenize=False,
        add_generation_prompt=True
    )

"""
주어진 프롬프트에 대한 응답을 생성하는 함수
Parameters:
    text (str): 입력 프롬프트
    max_new_tokens (int): 생성할 최대 토큰 수 (기본값: 512)
Returns:
    str: 생성된 응답 텍스트
"""
def generate_response(text, max_new_tokens=512):
    model_inputs = tokenizer([text], return_tensors="pt").to("cuda")
    
    generated_ids = model.generate(
        model_inputs.input_ids,
        max_new_tokens=max_new_tokens
    )
    
    generated_ids = [
        output_ids[len(input_ids):] for input_ids, output_ids 
        in zip(model_inputs.input_ids, generated_ids)
    ]
    
    return tokenizer.batch_decode(generated_ids, skip_special_tokens=True)[0]

"""
텍스트 스타일 변환 함수
Parameters:
    text (str): 변환할 텍스트
    style (str): 변환할 스타일
Returns:
    str: 변환된 텍스트
"""
def convert_style(text, style):
    prompt = create_style_prompt(text, style)
    return generate_response(prompt)