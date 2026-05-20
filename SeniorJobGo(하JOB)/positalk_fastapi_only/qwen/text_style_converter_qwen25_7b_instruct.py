from transformers import AutoModelForCausalLM, AutoTokenizer
import torch
from typing import Dict

model = None
tokenizer = None
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

base_prompt = """
당신은 문장 변환 전문가입니다.
주어진 문장을 지정된 스타일로 변환해주세요.
변환된 문장만 출력하세요. 다른 설명은 하지 마세요.
원문의 의미는 되도록 유지될 수 있도록 해주세요.
"""

# 스타일별 시스템 프롬프트와 지시사항
style_settings: Dict[str, Dict[str, str]] = {
    'formal': {
        'persona': """당신은 격식과 예의를 중시하는 전문가입니다.
비격식적인 표현을 격식있고 공식적인 표현으로 변환하는 전문성을 가지고 있습니다.""",
        'instruction': "격식있고 공식적인 어투로 변환해주세요."
    },
    'casual': {
        'persona': """당신은 편안하고 친근한 말투를 구사하는 20대입니다.
어떤 문장이든 자연스럽고 친근한 일상 대화체로 바꿀 수 있습니다.""",
        'instruction': "친근하고 편안한 어투로 변환해주세요."
    },
    'polite': {
        'persona': """당신은 예의 바른 말투를 구사하는 서비스업 종사자입니다.
항상 상대방을 존중하고 공손한 표현을 사용합니다.""",
        'instruction': "매우 공손하고 예의바른 어투로 변환해주세요."
    },
    'cute': {
        'persona': """당신은 귀엽고 사랑스러운 말투를 구사하는 아이돌입니다.
어떤 문장이든 귀엽고 애교있는 표현으로 바꿀 수 있습니다.""",
        'instruction': "귀엽고 애교있는 어투로 변환해주세요."
    }
}

def init_pipeline(model_path: str = "Qwen/Qwen2.5-7B-Instruct") -> None:
    """모델과 토크나이저 초기화"""
    global model, tokenizer
    
    if device.type == "cuda":
        torch.backends.cudnn.benchmark = True
    
    model = AutoModelForCausalLM.from_pretrained(
        model_path,
        torch_dtype=torch.float16 if device.type == "cuda" else torch.float32,
        device_map="auto",
        low_cpu_mem_usage=True
    )
    tokenizer = AutoTokenizer.from_pretrained(model_path)

def create_style_prompt(text: str, style: str) -> str:
    """스타일 변환을 위한 프롬프트 생성"""
    if style not in style_settings:
        raise ValueError(f"지원하지 않는 스타일입니다: {style}")
        
    setting = style_settings[style]
    system_prompt = f"""
{setting['persona']}

당신은 문장 변환 전문가입니다.
주어진 문장을 지정된 스타일로 변환해주세요.
변환된 문장만 출력하세요. 다른 설명은 하지 마세요.
원문의 의미는 되도록 유지될 수 있도록 해주세요.
"""

    messages = [
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": f"{setting['instruction']}\n\n문장: {text}"}
    ]
    return tokenizer.apply_chat_template(
        messages,
        tokenize=False,
        add_generation_prompt=True
    )

@torch.inference_mode()
def generate_response(text: str, max_new_tokens: int = 512) -> str:
    """응답 생성"""
    # 입력 텍스트 토큰화 및 attention mask 생성
    inputs = tokenizer(
        [text],
        return_tensors="pt",
        padding=True,
        return_attention_mask=True  # attention mask 반환
    ).to(device)
    
    outputs = model.generate(
        inputs.input_ids,
        attention_mask=inputs.attention_mask,  # attention mask 전달
        max_new_tokens=max_new_tokens,
        do_sample=True,
        temperature=0.7,
        top_p=0.9,
        repetition_penalty=1.2
    )
    
    generated_ids = [
        output_ids[len(input_ids):] for input_ids, output_ids 
        in zip(inputs.input_ids, outputs)
    ]
    
    return tokenizer.batch_decode(generated_ids, skip_special_tokens=True)[0]

def convert_style(text: str, style: str) -> str:
    """스타일 변환 실행"""
    if model is None:
        init_pipeline()
        
    prompt = create_style_prompt(text, style)
    return generate_response(prompt) 

if __name__ == "__main__":
    init_pipeline()
    
    # 테스트
    test_text = """2025년은 AI가 폭발적으로 성장하는 한 해가 될거야.
왜냐하면 AUNT가 본격적으로 프로젝트를 실행한 해니까."""
    
    print("원문:", test_text)
    print("\n각 스타일별 변환 결과:")
    
    for style in style_settings.keys():
        print(f"\n[{style} 스타일]")
        print(convert_style(test_text, style))
        print("-" * 50)