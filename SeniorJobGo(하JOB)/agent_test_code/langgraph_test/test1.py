from langgraph.graph import StateGraph
from langgraph.graph.message import add_messages
from langchain.chat_models import ChatOpenAI
from dataclasses import dataclass
from typing import List

# 1. LLM 모델 정의
llm = ChatOpenAI()

# 2. 상태 정의
@dataclass(frozen=True)  # 불변 객체로 설정
class AgentState:
    messages: List[dict] = None  # 리스트로 초기화

    def __post_init__(self):
        if self.messages is None:
            object.__setattr__(self, 'messages', [])  # 초기화

# 3. 노드 함수 정의
def chat_agent(state: AgentState):
    response = llm.invoke(state.messages)  # 리스트를 그대로 사용
    return add_messages(state, response)

def main():
    # 4. LangGraph 워크플로우 구성
    workflow = StateGraph(AgentState())  # 인스턴스 생성
    workflow.add_node("chat", chat_agent)
    workflow.set_entry_point("chat")

    # 5. 실행
    app = workflow.compile()
    response = app.invoke({"messages": [{"role": "user", "content": "안녕!"}]})

    print(response)

if __name__ == "__main__":
    main()