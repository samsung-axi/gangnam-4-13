"""
Caesar MCP 프로젝트 메인 실행 진입점
"""

import asyncio
import uvicorn
from typing import Dict, Any
import os
import sys

# 프로젝트 경로 추가
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from mcp_servers.google_drive_server import GoogleDriveServer
from mcp_servers.google_calendar_server import GoogleCalendarServer
from mcp_servers.notion_server import NotionServer
from mcp_servers.slack_server import SlackServer

from tools.tool_registry import tool_registry
from rag.vector_store import VectorStore, EmbeddingModel
from rag.retriever import DocumentRetriever, RAGGenerator

from agent_core.agent import ReactAgent
from agent_core.workflow import WorkflowEngine

from backend.main import app as fastapi_app


class CaesarApplication:
    """Caesar MCP 애플리케이션 메인 클래스"""

    def __init__(self):
        self.mcp_servers = {}
        self.agent = None
        self.workflow_engine = None
        self.is_initialized = False

    async def initialize(self):
        """애플리케이션 초기화"""
        print("=== Caesar MCP 프로젝트 초기화 시작 ===")

        try:
            # 1. MCP 서버 초기화
            await self._initialize_mcp_servers()

            # 2. Tool Registry 초기화
            await self._initialize_tools()

            # 3. RAG 시스템 초기화
            await self._initialize_rag()

            # 4. Agent 초기화
            await self._initialize_agent()

            # 5. Workflow Engine 초기화
            await self._initialize_workflow()

            self.is_initialized = True
            print("=== Caesar MCP 프로젝트 초기화 완료 ===")

        except Exception as e:
            print(f"초기화 중 오류 발생: {e}")
            raise

    async def _initialize_mcp_servers(self):
        """MCP 서버들 초기화"""
        print("MCP 서버들 초기화 중...")

        # Google Drive
        self.mcp_servers["google_drive"] = GoogleDriveServer()

        # Google Calendar
        self.mcp_servers["google_calendar"] = GoogleCalendarServer()

        # Notion
        self.mcp_servers["notion"] = NotionServer()

        # Slack
        self.mcp_servers["slack"] = SlackServer()

        # 각 서버 연결 시도
        for name, server in self.mcp_servers.items():
            try:
                await server.connect()
                print(f"{name} MCP 서버 연결 성공")
            except Exception as e:
                print(f"{name} MCP 서버 연결 실패: {e}")

    async def _initialize_tools(self):
        """Tool Registry 초기화"""
        print("Tool Registry 초기화 중...")
        await tool_registry.initialize()
        await tool_registry.register_mcp_adapters(self.mcp_servers)
        print(f"등록된 도구 수: {len(tool_registry.list_tools())}")

    async def _initialize_rag(self):
        """RAG 시스템 초기화"""
        print("RAG 시스템 초기화 중...")

        # Vector Store 초기화
        vector_store = VectorStore()
        await vector_store.initialize()

        # Embedding Model 초기화
        embedding_model = EmbeddingModel()
        await embedding_model.initialize()

        # Retriever 및 Generator 초기화
        retriever = DocumentRetriever(vector_store, embedding_model)
        rag_generator = RAGGenerator(retriever)

        print("RAG 시스템 초기화 완료")

    async def _initialize_agent(self):
        """Agent 초기화"""
        print("Agent 초기화 중...")
        self.agent = ReactAgent("Caesar Agent")
        await self.agent.initialize()
        print("Agent 초기화 완료")

    async def _initialize_workflow(self):
        """Workflow Engine 초기화"""
        print("Workflow Engine 초기화 중...")
        self.workflow_engine = WorkflowEngine()
        await self.workflow_engine.initialize()
        print("Workflow Engine 초기화 완료")

    async def start_backend_server(self, host: str = "0.0.0.0", port: int = 8000):
        """FastAPI 백엔드 서버 시작"""
        print(f"FastAPI 백엔드 서버 시작: http://{host}:{port}")

        config = uvicorn.Config(app=fastapi_app, host=host, port=port, log_level="info")
        server = uvicorn.Server(config)
        await server.serve()

    async def run_chat_mode(self):
        """대화형 모드 실행"""
        if not self.is_initialized:
            await self.initialize()

        print("\n=== Caesar Agent 대화형 모드 ===")
        print("종료하려면 'quit' 또는 'exit'를 입력하세요.")

        while True:
            try:
                user_input = input("\n사용자: ").strip()

                if user_input.lower() in ["quit", "exit", "종료"]:
                    print("대화를 종료합니다.")
                    break

                if not user_input:
                    continue

                # Agent를 통해 응답 생성
                response = await self.agent.chat(user_input)
                print(f"Agent: {response['content']}")

                if response.get("tools_used"):
                    print(f"사용된 도구: {', '.join(response['tools_used'])}")

            except KeyboardInterrupt:
                print("\n대화를 종료합니다.")
                break
            except Exception as e:
                print(f"오류 발생: {e}")

    def get_status(self) -> Dict[str, Any]:
        """시스템 상태 반환"""
        return {
            "initialized": self.is_initialized,
            "mcp_servers": list(self.mcp_servers.keys()),
            "tools_count": (
                len(tool_registry.list_tools()) if self.is_initialized else 0
            ),
            "agent_ready": self.agent is not None,
            "workflow_engine_ready": self.workflow_engine is not None,
        }


# 전역 애플리케이션 인스턴스
caesar_app = CaesarApplication()


async def main():
    """메인 실행 함수"""
    import argparse

    parser = argparse.ArgumentParser(description="Caesar MCP 프로젝트")
    parser.add_argument(
        "--mode", choices=["chat", "server", "status"], default="chat", help="실행 모드"
    )
    parser.add_argument("--host", default="0.0.0.0", help="서버 호스트")
    parser.add_argument("--port", type=int, default=8000, help="서버 포트")

    args = parser.parse_args()

    try:
        if args.mode == "status":
            # 상태 확인
            await caesar_app.initialize()
            status = caesar_app.get_status()
            print("\n=== 시스템 상태 ===")
            for key, value in status.items():
                print(f"{key}: {value}")

        elif args.mode == "server":
            # 백엔드 서버 모드
            await caesar_app.initialize()
            await caesar_app.start_backend_server(args.host, args.port)

        elif args.mode == "chat":
            # 대화형 모드 (기본값)
            await caesar_app.run_chat_mode()

    except Exception as e:
        print(f"실행 중 오류 발생: {e}")
        return 1

    return 0


if __name__ == "__main__":
    # 메인 실행
    exit_code = asyncio.run(main())
