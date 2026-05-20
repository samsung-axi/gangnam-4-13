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
            {"role": "system", "content": "You are an assistant that provides responses in JSON format. Include both the task and the response in the JSON."},
            {"role": "user", "content": f"{prompt}"}
        ]
    )

    # 응답 타입 확인
    print("response type:", isinstance(response, openai.types.chat.ChatCompletion))

    # 응답 출력
    try:
        response_json = {
            "task": "Analyze the input and provide a response.",
            "response": response.choices[0].message.content.strip()
        }
        print("response:", response_json)
    except Exception as e:
        print("전체 응답 값을 출력할 수 없습니다.", str(e))

if __name__ == "__main__":
    main()