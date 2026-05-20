import os
from dotenv import load_dotenv
import openai

# .env 파일에서 API 키 로드
load_dotenv()
openai.api_key = os.getenv("OPENAI_API_KEY")

# 함수 정의
def get_weather():
    return "서울의 현재 날씨는 맑음입니다."

def get_time():
    return "현재 시간은 오후 3시입니다."

def main():
    # 사용자 입력
    prompt = "서울의 날씨를 알려줘"

    # OpenAI API를 사용하여 입력 분석
    response = openai.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": "You are a helpful assistant."},
            {"role": "user", "content": f"다음 요청에 대해 어떤 함수를 실행해야 하는지 판단해줘: {prompt}\n\n1. get_weather\n2. get_time\n\n함수 이름만 반환해줘."}
        ]
    )

    # 응답 타입 확인
    print("response type:", isinstance(response, openai.types.chat.ChatCompletion))

    # 응답 출력
    try:
        print("response:", response)
    except:
        print("응답 값을 출력할 수 없습니다.")

    # API 응답에서 함수 이름 추출
    function_name = response.choices[0].message.content.strip()

    # 함수 실행
    if function_name == "get_weather":
        result = get_weather()
    elif function_name == "get_time":
        result = get_time()
    else:
        result = "알 수 없는 요청입니다."

    print("Result:", result)

if __name__ == "__main__":
    main()

