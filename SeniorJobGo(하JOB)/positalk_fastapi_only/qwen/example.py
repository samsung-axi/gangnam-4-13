from transformers import AutoModelForCausalLM, AutoTokenizer
import torch

model = None
tokenizer = None

"""
Qwen 모델과 토크나이저를 초기화하는 함수
- Qwen 1.5 4B Chat 모델을 로드
- 자동 데이터타입 설정 및 디바이스 매핑
"""
def init_pipeline():
    # 모델과 토크나이저 초기화
    global model, tokenizer
    model = AutoModelForCausalLM.from_pretrained(
        "Qwen/Qwen1.5-4B-Chat",
        torch_dtype="auto",
        device_map="auto"
    )
    tokenizer = AutoTokenizer.from_pretrained("Qwen/Qwen1.5-4B-Chat")

"""
채팅 프롬프트를 생성하는 함수
Parameters:
    text (str): 사용자 입력 텍스트
    system_prompt (str): 시스템 프롬프트 (기본값: "You are a helpful assistant.")
Returns:
    str: 채팅 형식으로 포맷팅된 프롬프트
"""
def create_chat_prompt(text, system_prompt="You are a helpful assistant."):
    messages = [
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": text}
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
    # 입력 텍스트를 토큰화
    model_inputs = tokenizer([text], return_tensors="pt").to("cuda")
    
    # 텍스트 생성
    generated_ids = model.generate(
        model_inputs.input_ids,
        max_new_tokens=max_new_tokens
    )
    
    # 입력 텍스트 부분 제외하고 생성된 텍스트만 추출
    generated_ids = [
        output_ids[len(input_ids):] for input_ids, output_ids 
        in zip(model_inputs.input_ids, generated_ids)
    ]
    
    # 토큰을 텍스트로 디코딩
    return tokenizer.batch_decode(generated_ids, skip_special_tokens=True)[0]

"""
대화형 채팅 인터페이스 함수
Parameters:
    prompt (str): 사용자 입력 메시지
    system_prompt (str): 시스템 프롬프트 (기본값: "You are a helpful assistant.")
Returns:
    str: 모델이 생성한 응답
"""
def chat(prompt, system_prompt="You are a helpful assistant."):
    # 채팅 형식의 프롬프트 생성
    text = create_chat_prompt(prompt, system_prompt)
    # 응답 생성
    return generate_response(text)

if __name__ == "__main__":
    init_pipeline()
    
    # 테스트
    prompt = "Give me a short introduction to large language model."
    response = chat(prompt)
    print("프롬프트:", prompt)
    print("응답:", response) 