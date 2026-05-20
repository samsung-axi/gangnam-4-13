from langchain.agents import load_tools, initialize_agent
from langchain.llms import OpenAI

def test():
    # 1) LLM 정의
    llm = OpenAI(temperature=0.5)

    # 2) 사용할 도구 불러오기 (예: 검색, 계산기 등)
    tools = load_tools(["serpapi", "llm-math"], llm=llm)

    # 3) 에이전트 초기화
    agent = initialize_agent(
        tools=tools,
        llm=llm,
        agent="zero-shot-react-description",
        verbose=True
    )

    # 4) 에이전트 실행
    result = agent.run("서울의 현재 날씨가 어때?")
    print(result)
