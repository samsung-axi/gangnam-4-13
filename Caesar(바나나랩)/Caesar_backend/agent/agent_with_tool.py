import os
import sys
from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langgraph.prebuilt import create_react_agent
from langchain.agents import AgentExecutor
from langchain_core.messages import HumanMessage
# 프로젝트 루트 경로를 sys.path에 추가
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from rag.notion_rag_tool.notion_rag_tool import notion_rag_search
from rag.internal_data_rag.internal_retrieve import rag_search_tool

load_dotenv()

openai_client = ChatOpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# LangSmith 설정
os.environ["LANGCHAIN_TRACING_V2"] = "true"
if os.getenv("LANGCHAIN_API_KEY") is None:
    print("경고: LANGCHAIN_API_KEY 환경 변수가 설정되지 않았습니다.")
if os.getenv("LANGCHAIN_PROJECT") is None:
    print("경고: LANGCHAIN_PROJECT 환경 변수가 설정되지 않았습니다.")


llm = ChatOpenAI(model="gpt-4o-mini", temperature=0)
tools = [notion_rag_search, rag_search_tool]
prompt = """
Respond to the human as helpfully and accurately as possible.
    """

agent = create_react_agent(llm, tools)

def run_agent(query):
    """에이전트를 실행하고 최종 결과를 출력하는 함수"""
    # 에이전트는 HumanMessage 형태의 입력을 받습니다.
    inputs = {"messages": [HumanMessage(content=query)]}

    # stream()을 사용하여 중간 과정을 실시간으로 확인할 수 있습니다.
    # 최종 결과만 보려면 .invoke()를 사용하세요.
    print(f"[{query}] 에 대한 답변을 생성합니다.\n---")
    # result = agent.invoke(inputs)
    # print(result)
    final_response = None
    for s in agent.stream(inputs):
        # AIMessage가 포함된 단계 찾기
        if 'agent' in s and 'messages' in s['agent']:
            messages = s['agent']['messages']
            for msg in messages:
                if hasattr(msg, 'content') and msg.content and 'AI' in str(type(msg)):
                    final_response = msg.content
    
    # 최종 AI 응답만 출력
    if final_response:
        print(f"Final Answer: {final_response}")
    else:
        print("No AI response found")

run_agent("이재용이 다닌 대학원은 뭐야?")