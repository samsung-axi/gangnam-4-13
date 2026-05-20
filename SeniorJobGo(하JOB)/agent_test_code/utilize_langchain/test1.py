import os
from dotenv import load_dotenv
from langchain.agents import load_tools, initialize_agent
from langchain.llms import OpenAI
from langchain.agents import Tool
import inspect
from . import funcList as funcs

func_dict = {}

system_message = "주어진 기능을 활용하여 사용자의 요청에 적절한 답을 해주세요."

def load_functions():
    """함수를 로드하고 매개변수 정보를 파악합니다."""
    for name, obj in inspect.getmembers(funcs, inspect.isfunction):
        func_signature = inspect.signature(obj)
        func_dict[name] = {
            "func": obj,
            "params": list(func_signature.parameters.keys()),
            "param_types": {k: str(v.annotation) for k, v in func_signature.parameters.items()}
        }

def test():
    # .env 파일에서 API 키 로드
    load_dotenv()
    openai_api_key = os.getenv("OPENAI_API_KEY")

    # 1) LLM 정의
    llm = OpenAI(temperature=0.5)

    # 2) 함수 로드
    load_functions()

    # 3) 사용할 도구 불러오기 (예: 검색, 계산기 등)
    tools = load_tools(["llm-math"], llm=llm)

    # 4) 사용자 정의 도구 추가
    for func_name, func_info in func_dict.items():
        # 인자가 없는 함수는 빈 리스트로 args 설정
        args = func_info["params"] if func_info["params"] else []
        tools.append(Tool(
            name=func_name,
            func=func_info["func"],
            description=f"{func_name} 함수입니다.",
            args=args,  # 인자가 없으면 빈 리스트
            param_types=func_info["param_types"]
        ))

    # 5) 에이전트 초기화
    agent = initialize_agent(
        tools=tools,
        llm=llm,
        agent="zero-shot-react-description",
        verbose=True
    )

    # 6) 사용자 입력
    user_input = input("[User] ")

    # 7) 에이전트 실행
    result = agent.run(user_input)
    print("[Agent] ", result)

if __name__ == "__main__":
    test()
