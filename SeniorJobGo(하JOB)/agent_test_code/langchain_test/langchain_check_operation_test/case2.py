import openai
import os

# OpenAI API 키 설정 (예: .env에서 가져오기)
openai.api_key = os.getenv("OPENAI_API_KEY")

def calculate(expression):
    """간단한 수학 식을 파이썬 eval로 계산"""
    try:
        return str(eval(expression))
    except Exception:
        return "계산 오류가 발생했습니다."

def run_agent(user_input):
    """
    1) 입력을 분석해 계산이 필요한지 판별
    2) 필요하면 calculate 함수로 결과를 얻음
    3) LLM에 최종 답변 작성을 시킴
    """
    # (예시) 간단히 "calculate:" 문구가 포함되면 계산이 필요하다고 가정
    if user_input.startswith("calculate:"):
        expression = user_input.replace("calculate:", "").strip()
        calc_result = calculate(expression)
        # LLM에 최종 응답 요청
        prompt = f"""
        사용자가 {expression} 계산을 요청했습니다.
        계산 결과: {calc_result}
        사용자에게 이 결과를 어떻게 전달하면 좋을지, 적절히 문장을 만들어주세요.
        """
    else:
        # 그냥 바로 LLM에게 답변 생성 요청
        prompt = f"""
        사용자가 다음 질문이나 요청을 했습니다: {user_input}
        이에 대해 적절히 답변해주세요.
        """

    response = openai.Completion.create(
        model="text-davinci-003",
        prompt=prompt,
        max_tokens=150
    )
    return response.choices[0].text.strip()

def test():
    while True:
        user_input = input("입력: ")
        if user_input.lower() in ["exit", "quit"]:
            break
        print("에이전트 응답:", run_agent(user_input))

if __name__ == "__main__":
    test()