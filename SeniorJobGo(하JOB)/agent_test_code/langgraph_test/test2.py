from langgraph.graph import StateGraph
from langgraph.graph.message import add_messages
from langchain.chat_models import ChatOpenAI
from langchain.schema import SystemMessage, HumanMessage
from dataclasses import dataclass
from typing import List

# 1. LLM 모델 설정
llm = ChatOpenAI()

# 2. 상태 정의
@dataclass(frozen=True)  # 불변 객체로 설정
class AgentState:
    messages: List[dict] = None  # 리스트로 초기화
    query_type: str = None  # 질문 유형 (chat or search)
    search_results: str = None  # 검색 결과 저장

    def __post_init__(self):
        if self.messages is None:
            object.__setattr__(self, 'messages', [])  # 초기화

# 3. LLM을 이용한 질문 유형 분석 노드
def classify_question(state: AgentState):
    """AI가 질문을 분석하여 대화(chat)인지 검색(search)인지 판단"""
    user_message = state.messages[-1]["content"]
    
    prompt = [
        SystemMessage(content="당신은 AI 분류기입니다. 사용자의 질문을 분석하여 'chat' 또는 'search'로 응답하세요."),
        HumanMessage(content=user_message)
    ]
    
    response = llm.invoke(prompt)
    predicted_type = response.content.strip().lower()

    if predicted_type in ["search", "chat"]:
        state.query_type = predicted_type
    else:
        state.query_type = "chat"  # 기본값

    return state

# 4. 일반 대화 응답 노드
def chat_agent(state: AgentState):
    """일반적인 대화 응답"""
    response = llm.invoke(state.messages)
    return add_messages(state, response)

# 5. 검색 실행 노드 (가상의 DB에서 결과 반환)
def search_database(state: AgentState):
    """사용자의 질문에 대한 검색 수행"""
    user_message = state.messages[-1]["content"]
    
    # 예제: 간단한 키워드 기반 검색 (실제 환경에서는 DB 연동 가능)
    fake_db = {
        "커피 원두 종류": "커피 원두는 아라비카, 로부스타, 리베리카 등이 있습니다.",
        "에스프레소 머신 추천": "가성비 좋은 머신으로는 Breville Barista Express가 있습니다."
    }

    state.search_results = fake_db.get(user_message, "검색 결과가 없습니다.")
    return state

# 6. 검색 결과 반환 노드
def return_search_results(state: AgentState):
    """검색 결과를 사용자에게 반환"""
    return add_messages(state, {"role": "assistant", "content": state.search_results})

def main():
    # 7. LangGraph 워크플로우 구성
    workflow = StateGraph(AgentState())  # 인스턴스 생성

    # 노드 추가
    workflow.add_node("classify", classify_question)
    workflow.add_node("chat", chat_agent)
    workflow.add_node("search", search_database)
    workflow.add_node("return_search", return_search_results)

    # 경로 설정: AI가 직접 판단한 query_type을 기반으로 경로 결정
    workflow.set_entry_point("classify")
    workflow.add_conditional_edges(
        "classify",
        lambda state: state.query_type  # AI가 결정한 query_type("chat" 또는 "search")에 따라 이동
    )
    workflow.add_edge("search", "return_search")  # 검색 후 결과 반환

    # 8. 실행
    app = workflow.compile()

    # 테스트 실행
    user_input = input("질문을 입력하세요: ")  # 예: 에스프레소 머신 추천해줘
    response = app.invoke({"messages": [{"role": "user", "content": user_input}]})

    print(response)

if __name__ == "__main__":
    main()