import os
from dotenv import load_dotenv
import openai

# .env 파일에서 API 키 로드
load_dotenv()
openai.api_key = os.getenv("OPENAI_API_KEY")

def main():
    # 시스템 메시지 설정
    system_message = """
당신은 사용자의 요청에 따라 적절한 응답을 제공하고 필요하다면 기능을 수행할 함수를 제공하는 상담원입니다.
사용자의 요청을 보고 응답과 기능을 수행할 함수, 필요하다면 함수 내에 들어갈 매개변수를 json 형식으로 반환해주세요.
json 형식은 다음과 같습니다.
{
    response: \"응답 내용\",
    function: \"함수명\",
    parameter: {
        \"변수명\": 변수값,
        \"변수명\": 변수값,
        ...
    }
}
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
        # 응답을 JSON 형식으로 변환하여 출력
        print("response:", response.choices[0].message.content.strip())
    except Exception as e:
        print("전체 응답 값을 출력할 수 없습니다.", str(e))

if __name__ == "__main__":
    main()