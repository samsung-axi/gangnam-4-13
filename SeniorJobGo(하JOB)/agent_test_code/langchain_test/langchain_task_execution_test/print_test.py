import os
from dotenv import load_dotenv
import openai

# .env 파일에서 API 키 로드
load_dotenv()
openai.api_key = os.getenv("OPENAI_API_KEY")

def main():
    # 사용자 입력
    prompt = input("입력: ")

    # OpenAI API를 사용하여 입력 분석
    response = openai.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": "당신은 저와 친구에요. 저의 말을 잘 이해해줘요."},
            {"role": "user", "content": f"{prompt}"}
        ]
    )

    # 응답 타입 확인
    print("response type:", isinstance(response, openai.types.chat.ChatCompletion))

    # 응답 출력
    try:
        print("response:", response)
    except:
        print("전체 응답 값을 출력할 수 없습니다.")

    # API 응답에서 함수 이름 추출
    result = response.choices[0].message.content.strip()

    print("Result:", result)

if __name__ == "__main__":
    main()

