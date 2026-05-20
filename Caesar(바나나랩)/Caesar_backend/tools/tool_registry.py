"""
Tool Registry - 모든 Tool들을 등록하고 관리하는 중앙 레지스트리
"""

from typing import Dict, Any, List, Callable
import asyncio

from .mcp_adapter import (
    GoogleDriveAdapter,
    GoogleCalendarAdapter,
    NotionAdapter,
    SlackAdapter,
)
from .rag_tool import RAGTool


class ToolRegistry:
    """Tool Registry 클래스"""

    def __init__(self):
        self.tools: Dict[str, Any] = {}
        self.adapters: Dict[str, Any] = {}

    async def initialize(self):
        """Tool Registry 초기화"""
        print("Tool Registry 초기화 중...")

        # RAG Tool 등록 (일시적으로 비활성화)
        # rag_tool = RAGTool()
        # await self._register_rag_tool(rag_tool)
        print("RAG Tool 등록 건너뜀 (비활성화됨)")

        # MCP Adapters 등록 - 실제 MCP 서버들 연결
        await self._register_mcp_adapters()

        print("Tool Registry 초기화 완료")

    async def _register_mcp_adapters(self):
        """MCP Adapters 등록 (실제 MCP 서버들과 연결)"""
        try:
            # Google Drive Adapter
            from mcp_servers.google_drive_mcp import GoogleDriveMCP

            google_drive = GoogleDriveMCP()
            if await google_drive.connect():
                await self._register_mcp_server_tools("google_drive", google_drive)
            else:
                print("⚠️ Google Drive MCP 연결 실패")

            # Google Calendar Adapter
            from mcp_servers.google_calendar_server import GoogleCalendarServer

            google_calendar = GoogleCalendarServer()
            if await google_calendar.connect():
                await self._register_mcp_server_tools(
                    "google_calendar", google_calendar
                )
            else:
                print("⚠️ Google Calendar MCP 연결 실패")

            # Slack Adapter
            from mcp_servers.slack_mcp import SlackMCP

            slack = SlackMCP()
            if await slack.connect():
                await self._register_mcp_server_tools("slack", slack)
            else:
                print("⚠️ Slack MCP 연결 실패")

            # Notion Adapter
            from mcp_servers.notion_mcp import NotionMCP

            notion = NotionMCP()
            if await notion.connect():
                await self._register_mcp_server_tools("notion", notion)
            else:
                print("⚠️ Notion MCP 연결 실패")

        except Exception as e:
            print(f"❌ MCP Adapters 등록 중 오류: {e}")

    async def _register_mcp_server_tools(self, server_name: str, mcp_server):
        """MCP 서버의 도구들을 등록"""
        try:
            # 각 서버별 사용 가능한 도구들 정의
            server_tools = {
                "google_drive": [
                    "list_files",
                    "search_files",
                    "get_file_info",
                    "upload_file",
                    "delete_file",
                ],
                "google_calendar": [
                    "list_calendars",
                    "create_event",
                    "delete_event",
                    "list_events",
                ],
                "slack": [
                    "send_message",
                    "list_channels",
                    "get_channel_history",
                    "create_channel",
                ],
                "notion": ["search", "create_page", "get_page"],
            }

            # 서버별 도구 목록 가져오기
            if hasattr(mcp_server, "get_available_tools"):
                try:
                    tools = await mcp_server.get_available_tools()
                except Exception as e:
                    print(
                        f"⚠️ {server_name} get_available_tools 호출 실패, 기본 도구 사용: {e}"
                    )
                    tools = server_tools.get(server_name, [])
            else:
                tools = server_tools.get(server_name, [])

            for tool_name in tools:
                full_tool_name = f"{server_name}_{tool_name}"
                self.tools[full_tool_name] = {
                    "definition": {
                        "name": full_tool_name,
                        "description": f"{server_name} {tool_name} 도구",
                        "parameters": {
                            "query": {"type": "string", "description": "도구 입력"}
                        },
                    },
                    "adapter": mcp_server,
                    "executor": self._create_mcp_executor(mcp_server, tool_name),
                }
                print(f"MCP Tool 등록됨: {full_tool_name}")

        except Exception as e:
            print(f"❌ {server_name} 도구 등록 실패: {e}")

    def _create_mcp_executor(self, mcp_server, tool_name):
        """MCP 서버 도구 실행기 생성"""

        async def executor(tool_name_param: str, **kwargs):
            try:
                # 도구명에서 접두사 제거하여 실제 메서드명 찾기
                actual_method_name = tool_name
                if "_" in tool_name:
                    # google_drive_list_files -> list_files
                    # slack_list_channels -> list_channels
                    # google_calendar_create_event -> create_event
                    parts = tool_name.split("_")
                    if len(parts) >= 2:
                        if parts[0] in ["google", "slack", "notion"] and parts[1] in [
                            "drive",
                            "calendar",
                        ]:
                            actual_method_name = "_".join(
                                parts[2:]
                            )  # google_drive_list_files -> list_files
                        elif parts[0] in ["slack", "notion"]:
                            actual_method_name = "_".join(
                                parts[1:]
                            )  # slack_list_channels -> list_channels
                        else:
                            actual_method_name = tool_name

                print(f"🔧 도구 실행: {tool_name} -> 메서드: {actual_method_name}")

                # MCP 서버의 메서드 호출
                if hasattr(mcp_server, actual_method_name):
                    method = getattr(mcp_server, actual_method_name)
                    if callable(method):
                        # query 파라미터를 적절한 파라미터로 변환
                        query = kwargs.get("query", "")

                        # JSON 형태의 입력 처리
                        if isinstance(query, dict):
                            # 이미 딕셔너리 형태인 경우
                            pass
                        elif query.startswith("{") and query.endswith("}"):
                            try:
                                import json

                                query_dict = json.loads(query)
                                # 채널 정보가 있는 경우 추출
                                if "channel" in query_dict:
                                    query = query_dict["channel"]
                                # 이름 정보가 있는 경우 추출 (채널 생성용)
                                elif "name" in query_dict:
                                    query = query_dict["name"]
                            except:
                                pass

                        # 도구별 파라미터 매핑 (실제 메서드명 기준)
                        if actual_method_name == "list_calendars":
                            return await method()
                        elif actual_method_name == "create_event":
                            # query에서 이벤트 정보 파싱
                            from datetime import datetime, timedelta
                            import json

                            try:
                                # JSON 형태로 파싱 시도
                                if query.startswith("{"):
                                    data = json.loads(query)
                                    summary = data.get("summary", "New Event")
                                    start_str = data.get("start", {}).get(
                                        "dateTime", ""
                                    )
                                    end_str = data.get("end", {}).get("dateTime", "")
                                else:
                                    # 간단한 텍스트 파싱
                                    parts = query.split(",") if query else []
                                    summary = (
                                        parts[0].strip()
                                        if len(parts) > 0
                                        else "New Event"
                                    )
                                    start_str = (
                                        parts[1].strip() if len(parts) > 1 else None
                                    )
                                    end_str = (
                                        parts[2].strip() if len(parts) > 2 else None
                                    )

                                # 현재 시간 기준으로 기본값 설정
                                now = datetime.now()
                                if start_str:
                                    try:
                                        # ISO 형태 파싱 시도
                                        start_time = datetime.fromisoformat(
                                            start_str.replace("Z", "+00:00").replace(
                                                "+09:00", ""
                                            )
                                        )
                                    except:
                                        start_time = now.replace(
                                            hour=18, minute=0, second=0, microsecond=0
                                        )
                                else:
                                    start_time = now.replace(
                                        hour=18, minute=0, second=0, microsecond=0
                                    )

                                if end_str:
                                    try:
                                        end_time = datetime.fromisoformat(
                                            end_str.replace("Z", "+00:00").replace(
                                                "+09:00", ""
                                            )
                                        )
                                    except:
                                        end_time = start_time + timedelta(hours=1)
                                else:
                                    end_time = start_time + timedelta(hours=1)

                                return await method(
                                    summary=summary,
                                    start_time=start_time,
                                    end_time=end_time,
                                    description=f"Created via Caesar Agent",
                                )
                            except Exception as e:
                                return f"이벤트 생성 파라미터 오류: {e}"
                        elif actual_method_name == "delete_event":
                            return await method(event_id=query)
                        elif actual_method_name == "list_events":
                            # query를 검색어로 사용
                            return (
                                await method(query=query) if query else await method()
                            )
                        elif actual_method_name == "list_files":
                            # list_files는 folder_id 파라미터 사용
                            return await method()
                        elif actual_method_name == "search_files":
                            # search_files는 query 파라미터 사용
                            return (
                                await method(query=query) if query else await method()
                            )
                        elif actual_method_name == "get_file_info":
                            return await method(file_id=query)
                        elif actual_method_name == "upload_file":
                            return await method(file_path=query)
                        elif actual_method_name == "delete_file":
                            return await method(file_id=query)
                        elif actual_method_name == "list_channels":
                            return await method()
                        elif actual_method_name == "get_channel_history":
                            return await method(channel=query, limit=20)
                        elif actual_method_name == "send_message":
                            # send_message는 channel과 text가 필요
                            if "," in query:
                                parts = query.split(",", 1)
                                channel = parts[0].strip()
                                text = parts[1].strip()
                                return await method(channel=channel, text=text)
                            else:
                                return "❌ send_message는 '채널,메시지' 형식으로 입력해주세요"
                        elif actual_method_name == "create_channel":
                            return await method(name=query)
                        elif actual_method_name == "get_user_info":
                            return await method(user_id=query)
                        elif actual_method_name == "search_messages":
                            return await method(query=query)
                        elif actual_method_name == "invite_to_channel":
                            # invite_to_channel는 channel과 users가 필요
                            if "," in query:
                                parts = query.split(",", 1)
                                channel = parts[0].strip()
                                users = [user.strip() for user in parts[1].split(",")]
                                return await method(channel=channel, users=users)
                            else:
                                return "❌ invite_to_channel는 '채널,사용자1,사용자2' 형식으로 입력해주세요"
                        elif actual_method_name == "upload_file":
                            # Slack upload_file는 channel과 file_path가 필요
                            if "," in query:
                                parts = query.split(",", 1)
                                channel = parts[0].strip()
                                file_path = parts[1].strip()
                                return await method(
                                    channel=channel, file_path=file_path
                                )
                            else:
                                return "❌ upload_file는 '채널,파일경로' 형식으로 입력해주세요"
                        elif actual_method_name == "set_status":
                            # set_status는 text와 emoji가 필요
                            if "," in query:
                                parts = query.split(",", 1)
                                text = parts[0].strip()
                                emoji = parts[1].strip()
                                return await method(text=text, emoji=emoji)
                            else:
                                return await method(text=query)
                        elif "slack_" in tool_name:
                            return (
                                await method(query=query) if query else await method()
                            )
                        elif "notion_" in tool_name:
                            return (
                                await method(query=query) if query else await method()
                            )
                        else:
                            # 기본적으로 query 파라미터 시도
                            return (
                                await method(query=query) if query else await method()
                            )
                else:
                    return f"❌ 메서드를 찾을 수 없습니다: {actual_method_name} (원본: {tool_name})"
            except Exception as e:
                return f"❌ 도구 실행 오류: {e}"

        return executor

    async def register_mcp_adapters(self, mcp_servers: Dict[str, Any]):
        """MCP Adapters 등록"""
        if "google_drive" in mcp_servers:
            adapter = GoogleDriveAdapter(mcp_servers["google_drive"])
            await adapter.connect()
            self.adapters["google_drive"] = adapter
            await self._register_adapter_tools("google_drive", adapter)

        if "google_calendar" in mcp_servers:
            adapter = GoogleCalendarAdapter(mcp_servers["google_calendar"])
            await adapter.connect()
            self.adapters["google_calendar"] = adapter
            await self._register_adapter_tools("google_calendar", adapter)

        if "notion" in mcp_servers:
            adapter = NotionAdapter(mcp_servers["notion"])
            await adapter.connect()
            self.adapters["notion"] = adapter
            await self._register_adapter_tools("notion", adapter)

        if "slack" in mcp_servers:
            adapter = SlackAdapter(mcp_servers["slack"])
            await adapter.connect()
            self.adapters["slack"] = adapter
            await self._register_adapter_tools("slack", adapter)

    async def _register_adapter_tools(self, adapter_name: str, adapter):
        """Adapter의 Tool들을 등록"""
        tool_definitions = adapter.get_tool_definitions()

        for tool_def in tool_definitions:
            tool_name = tool_def["name"]
            self.tools[tool_name] = {
                "definition": tool_def,
                "adapter": adapter,
                "executor": adapter.execute_tool,
            }
            print(f"Tool 등록됨: {tool_name}")

    async def _register_rag_tool(self, rag_tool):
        """RAG Tool 등록 (일시적으로 비활성화)"""
        print("RAG Tool 등록 스킵됨 (비활성화)")
        # tool_definitions = rag_tool.get_tool_definitions()
        # for tool_def in tool_definitions:
        #     tool_name = tool_def["name"]
        #     self.tools[tool_name] = {
        #         "definition": tool_def,
        #         "adapter": rag_tool,
        #         "executor": rag_tool.execute_tool,
        #     }
        #     print(f"RAG Tool 등록됨: {tool_name}")

    def get_all_tools(self) -> List[Dict[str, Any]]:
        """등록된 모든 Tool 정의 반환"""
        return [tool["definition"] for tool in self.tools.values()]

    def get_available_tools(self) -> List[Dict[str, Any]]:
        """사용 가능한 모든 도구 목록 반환 (get_all_tools와 동일)"""
        return self.get_all_tools()

    def get_tool_definition(self, tool_name: str) -> Dict[str, Any]:
        """특정 Tool 정의 반환"""
        if tool_name not in self.tools:
            raise ValueError(f"Tool not found: {tool_name}")
        return self.tools[tool_name]["definition"]

    async def get_tool_executor(self, tool_name: str):
        """특정 도구의 실행기 반환"""
        if tool_name not in self.tools:
            return None
        return self.tools[tool_name].get("executor")

    async def execute_tool(self, tool_name: str, **kwargs) -> Any:
        """Tool 실행"""
        if tool_name not in self.tools:
            raise ValueError(f"Tool not found: {tool_name}")

        tool_info = self.tools[tool_name]
        executor = tool_info["executor"]

        try:
            return await executor(tool_name, **kwargs)
        except Exception as e:
            print(f"Tool 실행 오류 ({tool_name}): {e}")
            raise

    def list_tools(self) -> List[str]:
        """등록된 Tool 이름 목록 반환"""
        return list(self.tools.keys())

    def get_tools_by_category(self, category: str) -> List[str]:
        """카테고리별 Tool 목록 반환"""
        tools = []
        for tool_name in self.tools.keys():
            if tool_name.startswith(category):
                tools.append(tool_name)
        return tools


# 전역 Tool Registry 인스턴스
tool_registry = ToolRegistry()
