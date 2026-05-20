"""
Agent Core - LangChain create_react_agent 기반 실제 구현
"""

# python agent_core/agent.py

import os
import sys
from typing import Dict, Any, List, Optional, Callable
import asyncio

# 프로젝트 루트 경로를 sys.path에 추가 (import 전에 실행)
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from dotenv import load_dotenv
from langchain.agents import create_react_agent, AgentExecutor
from langchain.tools import Tool
from langchain_core.prompts import PromptTemplate
from langchain_openai import ChatOpenAI
from langchain_community.llms import Ollama
from tools.tool_registry import tool_registry
from datetime import datetime
from zoneinfo import ZoneInfo

today_str = datetime.now(ZoneInfo("Asia/Seoul")).strftime("%Y-%m-%d")
# .env 파일 로드
load_dotenv()


class ReactAgent:
    """LangChain create_react_agent 기반 실제 구현"""

    def __init__(self, name: str = "Caesar Agent", model_type: str = "openai"):
        self.name = name
        self.model_type = model_type
        self.llm = ChatOpenAI(model="gpt-4o-mini", temperature=0.7)
        self.agent = None
        self.agent_executor = None
        self.tools = []
        self.conversation_history = []

    async def initialize(self):
        """에이전트 초기화 - LLM과 도구들 설정"""
        print(f"{self.name} 초기화 중...")

        # 1. LLM 설정
        self._setup_llm()

        # 2. 도구들 로드
        await self._setup_tools()

        # 3. ReAct 에이전트 생성
        self._create_react_agent()

        print(f"✅ {self.name} 초기화 완료 - {len(self.tools)}개 도구 로드됨")
        return True

    def _setup_llm(self):
        """LLM 설정 - OpenAI만 사용 (실패 시 예외 발생)"""
        api_key = os.getenv("OPENAI_API_KEY")
        if not api_key or not api_key.startswith("sk-"):
            raise RuntimeError(
                "❌ OPENAI_API_KEY가 없거나 잘못되었습니다. .env 파일을 확인하세요."
            )

        self.llm = ChatOpenAI(
            model="gpt-4o-mini",
            temperature=0.7,
            api_key=api_key,
            max_tokens=2048,
        )
        print("✅ OpenAI GPT-4o-mini 모델 설정 완료")

    async def _setup_tools(self):
        """도구들 설정 - Tool Registry에서 LangChain Tool로 변환"""
        try:
            # Tool Registry 초기화
            await tool_registry.initialize()
            registry_tools = tool_registry.get_all_tools()

            # LangChain Tool 형식으로 변환
            langchain_tools = []

            for tool_def in registry_tools:
                # Tool Registry의 도구 정의를 LangChain Tool로 변환
                tool_name = tool_def.get("name", "unknown_tool")
                tool_description = tool_def.get("description", f"{tool_name} 도구")

                langchain_tool = Tool(
                    name=tool_name,
                    description=tool_description,
                    func=self._create_tool_wrapper(tool_name),
                )
                langchain_tools.append(langchain_tool)

            self.tools = langchain_tools
            print(f"📧 {len(self.tools)}개 도구 변환 완료")

        except Exception as e:
            print(f"❌ 도구 설정 실패: {e}")
            import traceback

            traceback.print_exc()
            self.tools = []

    def _create_tool_wrapper(self, tool_name: str) -> Callable:
        """Tool Registry 도구를 LangChain에서 사용할 수 있도록 래핑"""

        async def tool_wrapper(input_str: str) -> str:
            try:
                # Tool Registry를 통해 도구 실행
                result = await tool_registry.execute_tool(tool_name, query=input_str)
                return str(result)
            except Exception as e:
                return f"도구 실행 오류: {e}"

        # 비동기 함수를 동기 함수로 래핑
        def sync_wrapper(input_str: str) -> str:
            try:
                loop = asyncio.get_event_loop()
                return loop.run_until_complete(tool_wrapper(input_str))
            except:
                # 새 이벤트 루프 생성
                return asyncio.run(tool_wrapper(input_str))

        return sync_wrapper

    def _create_react_agent(self):
        """create_react_agent 기반 에이전트 생성"""
        try:
            if not self.tools:
                print("⚠️ 사용 가능한 도구가 없어서 기본 에이전트를 생성합니다.")
                self.agent = None
                self.agent_executor = None
                return

            # 현재 날짜 정보 생성
            from datetime import datetime
            import pytz

            seoul_tz = pytz.timezone("Asia/Seoul")
            now = datetime.now(seoul_tz)
            from datetime import timedelta

            today = now.strftime("%Y-%m-%d")
            tomorrow = (now + timedelta(days=1)).strftime("%Y-%m-%d")
            yesterday = (now - timedelta(days=1)).strftime("%Y-%m-%d")
            current_datetime = now.strftime("%Y-%m-%dT%H:%M:%S+09:00")

            # ReAct 프롬프트 템플릿 정의 (LangChain 표준)
            react_prompt = PromptTemplate.from_template(
                f"""
You are Caesar AI Assistant. Always answer in Korean.

**CURRENT DATE & TIME INFORMATION:**
- 오늘 (Today): {today}
- 내일 (Tomorrow): {tomorrow}  
- 어제 (Yesterday): {yesterday}
- 현재 시간: {current_datetime}
- 시간대: Asia/Seoul (UTC+9)

You have access to the following tools:
{{tools}}

**CRITICAL DATE HANDLING RULES:**
- When user says "오늘" (today) → ALWAYS use {today}
- When user says "내일" (tomorrow) → ALWAYS use {tomorrow}
- When user says "어제" (yesterday) → ALWAYS use {yesterday}
- NEVER use 2023 or any hardcoded old year - ALWAYS use the current dates shown above
- For times: 점심=12:00, 저녁=18:00, 아침=08:00, 오후=PM, 오전=AM

**IMPORTANT INSTRUCTIONS:**
- If you can answer the question using your own knowledge WITHOUT needing tools, go directly to Final Answer
- Only use tools when they are specifically needed for the task
- For general questions (like weather, news, facts), provide helpful answers using your knowledge
- When no tool can help, still provide the most helpful answer possible

**SLACK CHANNEL NAMING RULES:**
- Channel names must be lowercase letters, numbers, and hyphens (-) only
- No spaces, underscores, special characters, or Korean characters allowed
- Maximum 21 characters
- Must start with a letter
- Examples: "caesar-test", "project-alpha", "team-dev"

**CRITICAL FORMAT RULES:**
- ALWAYS follow the exact format below
- After each Thought, you MUST either use Action OR provide Final Answer
- NEVER write free text without proper format keywords
- If you have enough information, immediately provide Final Answer

Use the following format:

Question: the input question you must answer
Thought: you should always think about what to do
Action: the action to take, should be one of [{{tool_names}}]
Action Input: the input to the action
Observation: the result of the action
... (this Thought/Action/Action Input/Observation can repeat N times)
Thought: I now know the final answer
Final Answer: the final answer in Korean

**WHEN TO USE FINAL ANSWER:**
- When you have enough information to answer the question
- When no more tools are needed
- ALWAYS start Final Answer with "Final Answer:" keyword

Begin!

Question: {{input}}
Thought:{{agent_scratchpad}}
"""
            )

            # create_react_agent로 에이전트 생성
            self.agent = create_react_agent(
                llm=self.llm, tools=self.tools, prompt=react_prompt
            )

            # AgentExecutor로 래핑
            self.agent_executor = AgentExecutor(
                agent=self.agent,
                tools=self.tools,
                verbose=True,
                handle_parsing_errors="Check your output and make sure it conforms to the format! Use 'Final Answer:' to conclude.",
                max_iterations=8,
                max_execution_time=60,
                return_intermediate_steps=False,
            )

            print("✅ create_react_agent 기반 에이전트 생성 완료")

        except Exception as e:
            print(f"❌ create_react_agent 생성 실패: {e}")
            import traceback

            traceback.print_exc()
            self.agent = None
            self.agent_executor = None

    async def chat(self, message: str, user_id: str = None) -> Dict[str, Any]:
        """대화형 채팅 인터페이스"""
        print(f"💬 사용자 메시지: {message}")

        # 대화 히스토리에 추가
        self.conversation_history.append(
            {"type": "human", "content": message, "user_id": user_id}
        )

        try:
            if not self.agent_executor:
                # 도구가 없는 경우 기본 LLM으로 직접 응답
                if self.llm:
                    return await self._chat_without_tools(message)
                else:
                    return {
                        "content": "❌ 에이전트가 초기화되지 않았습니다. initialize()를 먼저 호출하세요.",
                        "tools_used": [],
                        "success": False,
                    }

            # 도구가 필요없는 일반적인 질문들을 감지 (날씨, 뉴스, 일반 지식 등)
            general_keywords = [
                "날씨",
                "기온",
                "비",
                "눈",
                "뉴스",
                "시간",
                "오늘",
                "어제",
                "내일",
                "언제",
                "왜",
                "어떻게",
                "무엇",
            ]
            tool_keywords = [
                "파일",
                "캘린더",
                "구글",
                "google",
                "슬랙",
                "slack",
                "노션",
                "notion",
                "문서",
                "이벤트",
                "일정",
                "메시지",
                "전송",
                "업로드",
                "저장",
                "생성",
                "추가",
            ]

            message_lower = message.lower()
            has_general = any(keyword in message_lower for keyword in general_keywords)
            has_tool = any(keyword in message_lower for keyword in tool_keywords)

            print(f"🔍 키워드 분석: general={has_general}, tool={has_tool}")
            print(f"🔍 메시지: {message_lower}")

            if has_tool:
                # 🛠️ 도구 관련 키워드가 있으면 무조건 ReAct 에이전트 실행
                print("🛠️ 도구 사용 질문으로 판단 - ReAct 에이전트 실행")
                response = await self._execute_agent(message)
            else:
                # 🤖 도구 관련 없으면 LLM 직접 응답
                print("🤖 일반 질문으로 판단 - LLM 직접 응답")
                response = await self._chat_without_tools(message)

            # 응답을 히스토리에 추가
            self.conversation_history.append(
                {"type": "assistant", "content": response["content"]}
            )

            return response

        except Exception as e:
            error_msg = f"❌ 에이전트 실행 중 오류: {e}"
            print(error_msg)
            return {"content": error_msg, "tools_used": [], "success": False}

    async def _chat_without_tools(self, message: str) -> Dict[str, Any]:
        """도구 없이 기본 LLM으로 채팅"""
        try:
            # 기본 LLM으로 직접 응답 생성
            response = await asyncio.get_event_loop().run_in_executor(
                None,
                lambda: self.llm.invoke(
                    f"당신은 Caesar AI Assistant입니다. 한국어로 대답해주세요.\n\n사용자: {message}\n\nCaesar:"
                ),
            )

            content = (
                response.content if hasattr(response, "content") else str(response)
            )

            return {"content": content, "tools_used": [], "success": True}

        except Exception as e:
            return {
                "content": f"기본 LLM 응답 생성 오류: {e}",
                "tools_used": [],
                "success": False,
            }

    async def _execute_agent(self, message: str) -> Dict[str, Any]:
        """ReAct 에이전트 실행"""
        try:
            # AgentExecutor 실행 (비동기로 처리)
            result = await asyncio.get_event_loop().run_in_executor(
                None, lambda: self.agent_executor.invoke({"input": message})
            )

            return {
                "content": result.get("output", "응답을 생성하지 못했습니다."),
                "tools_used": self._extract_tools_used(result),
                "success": True,
            }

        except Exception as e:
            return {
                "content": f"에이전트 실행 오류: {e}",
                "tools_used": [],
                "success": False,
            }

    def _extract_tools_used(self, result: Dict[str, Any]) -> List[str]:
        """실행 결과에서 사용된 도구들 추출"""
        tools_used = []
        try:
            # LangChain 결과에서 사용된 도구 정보 추출
            if "intermediate_steps" in result:
                for step in result["intermediate_steps"]:
                    if len(step) >= 1 and hasattr(step[0], "tool"):
                        tools_used.append(step[0].tool)
        except:
            pass
        return tools_used

    def get_conversation_history(self) -> List[Dict[str, Any]]:
        """대화 히스토리 반환"""
        return self.conversation_history

    def clear_history(self):
        """대화 히스토리 초기화"""
        self.conversation_history = []
        print("🗑️ 대화 히스토리가 초기화되었습니다.")

    def get_available_tools(self) -> List[str]:
        """사용 가능한 도구 목록 반환"""
        return [tool.name for tool in self.tools]


# 직접 실행을 위한 테스트 코드
async def main():
    """Caesar Agent 직접 실행 및 테스트"""
    print("🚀 Caesar Agent 직접 실행 모드")
    print("=" * 50)

    # 환경 변수 확인
    api_key = os.getenv("OPENAI_API_KEY")
    print(f"🔑 OpenAI API Key 상태: {'설정됨' if api_key else '미설정'}")
    if api_key and api_key.startswith("sk-"):
        print(f"   Key Preview: {api_key[:10]}...{api_key[-4:]}")

    # 에이전트 생성 및 초기화
    agent = ReactAgent(name="Caesar Agent", model_type="openai")

    try:
        print("\n🔧 에이전트 초기화 중...")
        success = await agent.initialize()

        if not success:
            print("❌ 에이전트 초기화 실패")
            return

        print(f"\n✅ 에이전트 준비 완료!")
        print(f"   LLM: {type(agent.llm).__name__}")
        print(f"   사용 가능한 도구: {len(agent.tools)}개")

        # 대화형 모드 시작
        print("\n💬 대화형 모드 시작 (종료: 'quit' 또는 'exit')")
        print("-" * 50)

        while True:
            try:
                # 사용자 입력 받기
                user_input = input("\n사용자: ").strip()

                if user_input.lower() in ["quit", "exit", "종료", "q"]:
                    print("👋 Caesar Agent를 종료합니다.")
                    break

                if not user_input:
                    continue

                print("Caesar Agent가 생각 중...")

                # 에이전트 응답 생성
                response = await agent.chat(user_input)

                print(f"\nCaesar: {response['content']}")

                if response["tools_used"]:
                    print(f"🔧 사용된 도구: {', '.join(response['tools_used'])}")

                if not response["success"]:
                    print("⚠️ 응답 생성 중 일부 문제가 발생했습니다.")

            except KeyboardInterrupt:
                print("\n\n👋 사용자에 의해 종료되었습니다.")
                break
            except Exception as e:
                print(f"❌ 오류 발생: {e}")
                continue

    except Exception as e:
        print(f"❌ 에이전트 실행 중 오류: {e}")
        import traceback

        traceback.print_exc()


# 직접 실행 시 대화형 모드 시작
if __name__ == "__main__":
    print("🎯 Caesar Agent를 직접 실행합니다...")
    asyncio.run(main())
