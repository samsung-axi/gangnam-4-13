import os
from dotenv import load_dotenv
from langchain.agents import load_tools, initialize_agent
from langchain.llms import OpenAI
from langchain.agents import Tool
import inspect

from utilize_langchain.User import User as user
from . import funcList as funcs
import json

func_dict = {}
history = []  # 과거 기록을 저장할 리스트

# JSON 파일 경로
history_file = 'conversation_history.json'

def initialize_history():
    """Initialize or load conversation history from a JSON file."""
    if not os.path.exists(history_file):
        with open(history_file, 'w', encoding='utf-8') as f:
            json.dump([], f)
    with open(history_file, 'r', encoding='utf-8') as f:
        return json.load(f)


def save_history(history):
    """Save conversation history to a JSON file."""
    with open(history_file, 'w', encoding='utf-8') as f:
        json.dump(history, f, ensure_ascii=False, indent=2)

def load_functions():
    """함수를 로드하고 매개변수 정보를 파악합니다."""
    for name, obj in inspect.getmembers(funcs, inspect.isfunction):
        func_signature = inspect.signature(obj)
        func_dict[name] = {
            "func": obj,
            "params": list(func_signature.parameters.keys()),
            "param_types": {k: str(v.annotation) for k, v in func_signature.parameters.items()}
        }

def load_and_check_api_key():
    """Load and check the OpenAI API key."""
    load_dotenv()
    openai_api_key = os.getenv("OPENAI_API_KEY")
    if not openai_api_key:
        print("API 키를 로드할 수 없습니다. .env 파일을 확인하세요.")
        return None
    return openai_api_key


def initialize_tools(llm):
    """Initialize tools including user-defined functions."""
    tools = load_tools(["llm-math"], llm=llm)

    # User 클래스 인스턴스 생성
    user_instance = user()

    # User 인스턴스의 모든 메서드를 툴로 추가
    for name, method in inspect.getmembers(user_instance, predicate=inspect.isfunction):
        args = method.__code__.co_varnames[:method.__code__.co_argcount]
        tools.append(Tool(
            name=name,
            func=method,
            description=method.__doc__,
            args=args
        ))

    for func_name, func_info in func_dict.items():
        args = func_info["params"] if func_info["params"] else []
        tools.append(Tool(
            name=func_name,
            func=func_info["func"],
            description=func_info["func"].__doc__,
            args=args,
            param_types=func_info["param_types"]
        ))

    # 툴 설명 개선
    for tool in tools:
        if 'user' in tool.name.lower():
            tool.description += " 이 툴은 사용자 정보를 처리하는 데 사용됩니다."
        else:
            tool.description += " 이 툴은 수치 계산이나 기타 작업에 사용됩니다."

    return tools

def initialize_agent_with_tools(tools, llm):
    """Initialize the agent with the given tools and LLM."""
    return initialize_agent(
        tools=tools,
        llm=llm,
        agent="zero-shot-react-description",
        verbose=True,
        handle_parsing_errors=True
    )


def process_user_input(agent, history):
    """Process user input and run the agent."""
    while True:
        user_input = input("[User] ")
        if user_input.lower() == "exit":
            break

        # 시스템 메시지 개선
        system_message = "주어진 기능을 활용하여 사용자의 요청에 적절한 답을 해주세요. 모든 사용 가능한 툴을 전부 검토하여 최적의 결과를 도출하세요. 사용자 정보를 반환할 때는 User 관련 툴을 사용하세요."

        # history_message = "\n".join([f"User: {user}\nAgent: {agent_response}" for user, agent_response in history])
        # full_system_message = f"{system_message}\n\n=== 과거 기록 ===\n{history_message}"
        # combined_input = f"{full_system_message}\nUser: {user_input}"
        combined_input = f"{system_message}\nUser: {user_input}"

        try:
            result = agent.run(combined_input)
            print("[Agent] ", result)
            history.append((user_input, result))
            save_history(history)
        except Exception as e:
            print("에이전트 실행 중 오류가 발생했습니다:", str(e))
            break


def test():
    openai_api_key = load_and_check_api_key()
    if not openai_api_key:
        return

    llm = OpenAI(temperature=0.5)
    load_functions()
    tools = initialize_tools(llm)
    agent = initialize_agent_with_tools(tools, llm)
    history = initialize_history()
    process_user_input(agent, history)

if __name__ == "__main__":
    test()
