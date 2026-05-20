import os
from dotenv import load_dotenv
import openai
import json

# .env 파일에서 API 키 로드
load_dotenv()
openai.api_key = os.getenv("OPENAI_API_KEY")

# JSON 파일에서 함수 리스트 로드
def load_functions():
    with open('prompt_modification_test/json_functionality_test/functions.json', 'r', encoding='utf-8') as f:
        return json.load(f)

# 함수 리스트 로드
functions_list = load_functions()

def main():
    # 시스템 메시지 설정
    system_message = f"""
당신은 사용자의 요청에 따라 적절한 응답을 제공하고 필요하다면 기능을 수행할 함수를 제공하는 상담원입니다.
사용자의 요청을 보고 응답과 기능을 수행할 함수, 필요하다면 함수 내에 들어갈 매개변수를 반드시 JSON 형식으로 반환해주세요.
다음은 사용할 수 있는 함수 목록입니다:
{json.dumps(functions_list, ensure_ascii=False, indent=2)}
반드시 JSON 형식은 다음과 같아야 합니다. 다른 형식으로 응답하지 마세요.
{{
    \"response\": \"응답 내용\",
    \"function\": \"함수명\",
    \"parameter\": {{
        \"변수명\": 변수값,
        \"변수명\": 변수값,
        ...
    }}
}}
가능한 경우, 사용자의 요청에 따라 적절한 함수와 매개변수를 제공하세요.
매개변수의 자료형은 임의로 정해주세요.
존댓말을 사용해주세요.
"""

    # 사용자 입력
    prompt = input("입력: ")

    # OpenAI API를 사용하여 입력 분석
    response = openai.chat.completions.create(
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
    try:
        # 응답 내용 디버깅
        print("Raw response content:", response.choices[0].message.content.strip())

        # JSON 응답 생성
        response_content = response.choices[0].message.content.strip()
        response_json = json.loads(response_content)

        # 함수와 매개변수 채우기
        for func in functions_list:
            if func['function'] == response_json.get('function'):
                response_json['parameter'] = func.get('parameters', {})
                break

        print("response:", json.dumps(response_json, ensure_ascii=False))
    except Exception as e:
        print("전체 응답 값을 출력할 수 없습니다.", str(e))

if __name__ == "__main__":
    main()