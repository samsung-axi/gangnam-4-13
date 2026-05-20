import os
from dotenv import load_dotenv
import openai
import inspect
from . import funcList as funcs
import json

# .env 파일에서 API 키 로드
load_dotenv()
openai.api_key = os.getenv("OPENAI_API_KEY")

# 함수 딕셔너리
func_dict = {}

# 함수 로드
def load_functions():
    for name, obj in inspect.getmembers(funcs, inspect.isfunction):
        func_signature = inspect.signature(obj)
        func_dict[name] = {
            "func": obj,
            "params": list(func_signature.parameters.keys())
        }

# 시스템 메시지 설정
def set_system_message(func_dict):
    return f"""
    당신은 사용자의 요청에 따라 적절한 응답을 제공하고 필요하다면 기능을 수행할 함수를 제공하는 상담원입니다.
    사용자의 요청을 보고 응답과 기능을 수행할 함수, 필요하다면 함수 내에 들어갈 매개변수를 반드시 JSON 형식으로 반환해주세요.
    다음은 사용할 수 있는 함수 목록입니다:
    {str(func_dict)}
    반드시 JSON 형식은 다음과 같아야 합니다. 다른 형식으로 응답하지 마세요.
    {{
        \"response\": \"응답 내용\",
        \"funcList\": [
            {{
                \"function\": \"함수명\",
                \"parameter\": {{
                    \"변수명\": 변수값,
                    \"변수명\": 변수값,
                    ...
                }}
            }},
            ...
        ]
    }}
    가능한 경우, 사용자의 요청에 따라 적절한 함수와 매개변수를 제공하세요.
    제공된 함수 목록에 없는 함수는 제공하지 않아도 됩니다.
    만약 여러 함수를 제공해야 한다면 funcList 내의 요소를 여러 개 제공해주세요.
    매개변수의 자료형은 임의로 정해주세요.
    존댓말을 사용해주세요.
    """

# OpenAI API를 사용하여 입력 분석
def analyze_input(system_message, prompt):
    return openai.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {
                "role": "system",
                "content": system_message
            },
            {
                "role": "user",
                "content": prompt
            }
        ]
    )

# 응답 출력
def print_response(response):
    response_data = json.loads(response.choices[0].message.content.strip())

    # 응답 출력
    print("[all response]", response_data)

    # 응답 디버깅
    print("[Agent]", response_data.get("response"))

    # 함수 실행
    func_list = response_data.get("funcList")
    for func in func_list:
        function_name = func.get("function")
        if function_name in func_dict:
            result = func_dict[function_name]["func"](**func.get("parameter", {}))
            print("함수 실행 결과:\n", result)
        else:
            print("지정된 함수가 존재하지 않습니다.")

def main():
    # 함수 로드
    load_functions()

    # 사용자 입력
    prompt = input("[User] ")

    # OpenAI API를 사용하여 입력 분석
    response = analyze_input(set_system_message(func_dict), prompt)

    try:
        # 응답 출력
        print_response(response)
    except Exception as e:
        print("전체 응답 값을 출력할 수 없습니다.", str(e))

if __name__ == "__main__":
    main()