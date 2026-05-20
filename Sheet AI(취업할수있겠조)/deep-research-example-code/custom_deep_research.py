import os
from dotenv import load_dotenv

# .env 파일 로드
load_dotenv()


import uuid
import asyncio
from typing import TypedDict, List, Annotated, Optional
from dataclasses import dataclass
from IPython.display import display, Markdown
import operator

from langchain.chat_models import init_chat_model
from langchain_core.messages import HumanMessage, SystemMessage
from langgraph.graph import StateGraph, START, END
from langgraph.checkpoint.memory import MemorySaver
from pydantic import BaseModel


# 1. 데이터 모델 정의
@dataclass
class Section:
    name: str
    description: str
    research_needed: bool
    content: str = ""


class SearchQuery(BaseModel):
    query: str


class SearchQueries(BaseModel):
    queries: List[SearchQuery]


class Sections(BaseModel):
    sections: List[Section]


# 2. 단순화된 상태 정의 (병렬 처리 문제 해결)
class ResearchState(TypedDict):
    topic: str
    sections: List[Section]
    current_section_index: int
    all_research_done: bool
    final_report: str


# 3. 프롬프트 템플릿
SECTION_PLANNER_PROMPT = """
주제: {topic}

위 주제에 대한 종합적인 보고서를 작성하기 위해 섹션을 계획해주세요.

다음 구조를 따르세요:
1. 소개 (연구 불필요)
2. 주요 본문 섹션들 (연구 필요)
3. 결론 (연구 불필요)

각 섹션은 다음을 포함해야 합니다:
- name: 섹션 제목
- description: 섹션 설명 (무엇을 다룰지)
- research_needed: 웹 검색이 필요한지 여부

5-6개 섹션으로 구성해주세요.
"""

QUERY_GENERATOR_PROMPT = """
주제: {topic}
섹션: {section_name}
섹션 설명: {section_description}

이 섹션을 작성하기 위해 필요한 웹 검색 쿼리 3개를 생성해주세요.
각 쿼리는 구체적이고 검색 가능한 형태여야 합니다.
"""

SECTION_WRITER_PROMPT = """
주제: {topic}
섹션 제목: {section_name}
섹션 설명: {section_description}

다음 검색 결과를 바탕으로 해당 섹션을 작성해주세요:

검색 결과:
{search_results}

요구사항:
- 마크다운 형식으로 작성
- 구체적이고 상세한 내용
- 검색 결과의 정보를 종합하여 작성
- 섹션 제목 포함 (## {section_name})
"""


# 4. 유틸리티 함수
async def search_web_tavily(queries: List[str]) -> str:
    """Tavily API를 사용한 웹 검색"""
    import os
    try:
        from tavily import TavilyClient
        
        api_key = os.getenv("TAVILY_API_KEY")
        if not api_key:
            return "Tavily API 키가 설정되지 않았습니다."
        
        client = TavilyClient(api_key=api_key)
        
        all_results = []
        for query in queries:
            try:
                response = client.search(query=query, max_results=3)
                results = response.get('results', [])
                
                for result in results:
                    content = f"제목: {result.get('title', '')}\n"
                    content += f"내용: {result.get('content', '')}\n"
                    content += f"URL: {result.get('url', '')}\n"
                    all_results.append(content)
            except Exception as e:
                print(f"검색 오류 ({query}): {e}")
                continue
        
        return "\n\n---\n\n".join(all_results)
    
    except ImportError:
        return f"검색 모의 결과: {', '.join(queries)}에 대한 검색 결과입니다."


def save_markdown_to_file(content: str, topic: str, output_dir: str = "reports"):
    """마크다운 내용을 파일로 저장"""
    from datetime import datetime
    
    # 출력 디렉토리 생성
    os.makedirs(output_dir, exist_ok=True)
    
    # 파일명 생성 (안전한 파일명으로 변환)
    safe_topic = "".join(c for c in topic if c.isalnum() or c in (' ', '-', '_')).rstrip()
    safe_topic = safe_topic.replace(' ', '_')[:50]  # 최대 50자로 제한
    
    # 타임스탬프 추가
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    filename = f"{safe_topic}_{timestamp}.md"
    filepath = os.path.join(output_dir, filename)
    
    # 파일 저장
    try:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        
        print(f"📁 보고서가 저장되었습니다: {filepath}")
        return filepath
        
    except Exception as e:
        print(f"❌ 파일 저장 실패: {e}")
        return None


# 5. 노드 함수들 (순차 처리 방식)
async def plan_sections(state: ResearchState) -> dict:
    """보고서 섹션 계획 생성"""
    print("📋 보고서 섹션 계획 중...")
    
    # LLM 초기화
    llm = init_chat_model(
        model="claude-3-5-haiku-latest",
        model_provider="anthropic"
    )
    
    structured_llm = llm.with_structured_output(Sections)
    
    # 프롬프트 생성
    prompt = SECTION_PLANNER_PROMPT.format(topic=state["topic"])
    
    # 섹션 생성
    response = await structured_llm.ainvoke([
        SystemMessage(content=prompt),
        HumanMessage(content="보고서 섹션을 계획해주세요.")
    ])
    
    sections = response.sections
    print(f"✅ {len(sections)}개 섹션 계획 완료")
    
    return {
        "sections": sections,
        "current_section_index": 0,
        "all_research_done": False
    }


async def process_research_sections(state: ResearchState) -> dict:
    """연구가 필요한 모든 섹션을 순차적으로 처리"""
    print("🔬 연구 섹션들 처리 시작...")
    
    sections = state["sections"]
    research_sections = [s for s in sections if s.research_needed]
    
    print(f"📊 총 {len(research_sections)}개 연구 섹션 처리 예정")
    
    # LLM 초기화 (한 번만)
    query_llm = init_chat_model(
        model="claude-3-5-haiku-latest",
        model_provider="anthropic"
    ).with_structured_output(SearchQueries)
    
    writer_llm = init_chat_model(
        model="claude-3-5-haiku-latest",
        model_provider="anthropic"
    )
    
    # 각 연구 섹션을 순차적으로 처리
    for i, section in enumerate(research_sections, 1):
        print(f"\n🔍 [{i}/{len(research_sections)}] '{section.name}' 섹션 처리 중...")
        
        try:
            # 1. 검색 쿼리 생성
            query_prompt = QUERY_GENERATOR_PROMPT.format(
                topic=state["topic"],
                section_name=section.name,
                section_description=section.description
            )
            
            query_response = await query_llm.ainvoke([
                SystemMessage(content=query_prompt),
                HumanMessage(content="검색 쿼리를 생성해주세요.")
            ])
            
            queries = [q.query for q in query_response.queries]
            print(f"  📝 {len(queries)}개 검색 쿼리 생성 완료")
            
            # 2. 웹 검색
            print(f"  🌐 웹 검색 실행 중...")
            search_results = await search_web_tavily(queries)
            print(f"  ✅ 검색 완료 ({len(search_results)} 문자)")
            
            # 3. 섹션 작성
            print(f"  ✍️ 섹션 내용 작성 중...")
            writer_prompt = SECTION_WRITER_PROMPT.format(
                topic=state["topic"],
                section_name=section.name,
                section_description=section.description,
                search_results=search_results
            )
            
            writer_response = await writer_llm.ainvoke([
                SystemMessage(content=writer_prompt),
                HumanMessage(content="섹션을 작성해주세요.")
            ])
            
            # 섹션 내용 업데이트
            section.content = writer_response.content
            print(f"  ✅ '{section.name}' 섹션 완료!")
        
        except Exception as e:
            print(f"  ❌ '{section.name}' 섹션 처리 중 오류: {e}")
            section.content = f"## {section.name}\n\n{section.description}\n\n(처리 중 오류가 발생했습니다: {e})"
    
    print(f"\n🎉 모든 연구 섹션 처리 완료!")
    return {
        "sections": sections,
        "all_research_done": True
    }


async def write_non_research_sections(state: ResearchState) -> dict:
    """연구가 필요하지 않은 섹션들 작성"""
    print("📝 소개/결론 섹션 작성 중...")
    
    sections = state["sections"]
    
    for section in sections:
        if not section.research_needed and not section.content:
            # 연구가 필요하지 않은 섹션은 간단히 작성
            if "소개" in section.name.lower() or "introduction" in section.name.lower():
                content = f"""## {section.name}

{section.description}

이 보고서는 {state['topic']}에 대한 종합적인 분석을 제공합니다."""
            else:  # 결론
                content = f"""## {section.name}

{section.description}

이상으로 {state['topic']}에 대한 분석을 마칩니다."""
            
            section.content = content
            print(f"✅ '{section.name}' 섹션 작성 완료")
    
    return {"sections": sections}


async def compile_final_report(state: ResearchState) -> dict:
    """최종 보고서 컴파일"""
    print("📊 최종 보고서 컴파일 중...")
    
    sections = state["sections"]
    
    # 섹션 내용 합치기
    sections_content = []
    for section in sections:
        if section.content:
            sections_content.append(section.content)
        else:
            # 빈 섹션이 있다면 기본 내용 추가
            sections_content.append(f"## {section.name}\n\n{section.description}")
    
    # 최종 보고서 생성
    final_report = "\n\n".join(sections_content)
    
    print("✅ 최종 보고서 컴파일 완료")
    return {"final_report": final_report}


# 6. 조건부 라우팅 함수
def should_continue_research(state: ResearchState) -> str:
    """연구가 완료되었는지 확인"""
    if state.get("all_research_done", False):
        return "write_non_research"
    else:
        return "process_research"


# 7. 단순화된 그래프 생성
def create_research_agent():
    """단순화된 자동 연구 에이전트 생성"""
    
    # 메인 그래프 (순차 처리)
    main_graph = StateGraph(ResearchState)
    
    main_graph.add_node("plan_sections", plan_sections)
    main_graph.add_node("process_research", process_research_sections)
    main_graph.add_node("write_non_research", write_non_research_sections)
    main_graph.add_node("compile_report", compile_final_report)
    
    # 엣지 연결 (순차적)
    main_graph.add_edge(START, "plan_sections")
    main_graph.add_conditional_edges(
        "plan_sections",
        should_continue_research,
        {
            "process_research": "process_research",
            "write_non_research": "write_non_research"
        }
    )
    main_graph.add_edge("process_research", "write_non_research")
    main_graph.add_edge("write_non_research", "compile_report")
    main_graph.add_edge("compile_report", END)
    
    return main_graph.compile(checkpointer=MemorySaver())


def visualize_graph(show_xray=True):
    """그래프 구조 시각화"""
    print("📊 그래프 구조 시각화 중...")
    
    try:
        # 그래프 생성
        graph = create_research_agent()
        
        # 그래프 이미지 생성
        if show_xray:
            # X-ray 모드: 서브그래프까지 자세히 보기
            graph_image = graph.get_graph(xray=1).draw_mermaid_png()
        else:
            # 기본 모드: 메인 노드만 보기
            graph_image = graph.get_graph().draw_mermaid_png()
        
        # 이미지 표시
        from IPython.display import Image, display
        display(Image(graph_image))
        
        print("✅ 그래프 시각화 완료!")
        
        return graph_image
    
    except Exception as e:
        print(f"❌ 그래프 시각화 실패: {e}")
        print("Mermaid 또는 graphviz 패키지가 필요할 수 있습니다.")
        return None


# 8. 사용 함수 (수정된 버전)
async def run_research_agent(topic: str, display_result: bool = True, save_to_file: bool = True):
    """연구 에이전트 실행"""
    print(f"🚀 연구 시작: {topic}")
    print("=" * 80)
    
    # 그래프 생성
    graph = create_research_agent()
    
    # 실행 설정
    config = {"configurable": {"thread_id": str(uuid.uuid4())}}
    
    # 초기 상태
    initial_state = {
        "topic": topic,
        "sections": [],
        "current_section_index": 0,
        "all_research_done": False,
        "final_report": ""
    }
    
    # 실행
    try:
        final_state = await graph.ainvoke(initial_state, config)
        
        print("=" * 80)
        print("🎉 연구 완료!")
        
        final_report = final_state.get("final_report", "")
        
        if display_result and final_report:
            print("\n📄 최종 보고서:")
            print("-" * 40)
            # Jupyter가 아닌 환경에서는 마크다운 내용을 직접 출력
            print(final_report)
        
        # 파일 저장
        if save_to_file and final_report:
            save_markdown_to_file(final_report, topic)
        
        return final_report
        
    except Exception as e:
        print(f"❌ 오류 발생: {e}")
        import traceback
        traceback.print_exc()
        return None


# 간단한 실행 함수 추가
def run_research_sync(topic: str, save_file: bool = True, show_output: bool = True):
    """동기적으로 연구 실행 (파일 저장 포함)"""
    return asyncio.run(run_research_agent(
        topic=topic, 
        display_result=show_output, 
        save_to_file=save_file
    ))


# 즉시 그래프 시각화 (선택사항)
def show_graph_now():
    """지금 즉시 그래프 보기"""
    print("🎨 그래프 구조 미리보기:")
    return visualize_graph(show_xray=False)


# 그래프 시각화 실행
show_graph_now()

# 그래프 생성
graph = create_research_agent()


# 9. 사용 예제
if __name__ == "__main__":
    print("사용법:")
    print("# 그래프 구조 보기")
    print("visualize_graph()")
    print("\n# 연구 실행 (비동기)")
    print("await run_research_agent(topic)")
    print("\n# 연구 실행 (동기)")
    print("run_research_sync(topic)")
    print("\n# 수동 실행")
    print("graph = create_research_agent()")
    print("result = await graph.ainvoke({'topic': topic, 'sections': [], 'current_section_index': 0, 'all_research_done': False, 'final_report': ''})")


if __name__ == "__main__":
    # 사용 예제
    topic_example = "Overview of Model Context Protocol (MCP), an Anthropic‑backed open standard for integrating external context and tools with LLMs"
    
    # 방법 1: 비동기 실행 (기존 방식)
    # asyncio.run(run_research_agent(topic_example))
    
    # 방법 2: 동기 실행 (새로운 방식, 권장)
    run_research_sync(topic_example)