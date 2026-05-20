"""
MCP Adapter - MCP 서버를 Tool로 변환하는 어댑터
"""

from typing import Dict, Any, Callable, List
from abc import ABC, abstractmethod
import asyncio


class BaseMCPAdapter(ABC):
    """MCP Adapter 베이스 클래스"""

    def __init__(self, mcp_server):
        self.mcp_server = mcp_server
        self.is_connected = False

    async def connect(self):
        """MCP 서버 연결"""
        self.is_connected = await self.mcp_server.connect()
        return self.is_connected

    @abstractmethod
    def get_tool_definitions(self) -> List[Dict[str, Any]]:
        """Tool 정의 반환"""
        pass

    @abstractmethod
    async def execute_tool(self, tool_name: str, **kwargs) -> Any:
        """Tool 실행"""
        pass


class GoogleDriveAdapter(BaseMCPAdapter):
    """Google Drive MCP Adapter"""

    def get_tool_definitions(self) -> List[Dict[str, Any]]:
        return [
            {
                "name": "google_drive_list_files",
                "description": "구글 드라이브 파일 목록 조회",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "folder_id": {
                            "type": "string",
                            "description": "폴더 ID (선택사항)",
                        }
                    },
                },
            },
            {
                "name": "google_drive_upload_file",
                "description": "구글 드라이브에 파일 업로드",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "file_path": {
                            "type": "string",
                            "description": "업로드할 파일 경로",
                        },
                        "folder_id": {
                            "type": "string",
                            "description": "업로드할 폴더 ID (선택사항)",
                        },
                    },
                    "required": ["file_path"],
                },
            },
            {
                "name": "google_drive_create_folder",
                "description": "구글 드라이브에 폴더 생성",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "name": {"type": "string", "description": "폴더 이름"},
                        "parent_id": {
                            "type": "string",
                            "description": "부모 폴더 ID (선택사항)",
                        },
                    },
                    "required": ["name"],
                },
            },
        ]

    async def execute_tool(self, tool_name: str, **kwargs) -> Any:
        if not self.is_connected:
            await self.connect()

        if tool_name == "google_drive_list_files":
            return await self.mcp_server.list_files(kwargs.get("folder_id"))
        elif tool_name == "google_drive_upload_file":
            return await self.mcp_server.upload_file(
                kwargs["file_path"], kwargs.get("folder_id")
            )
        elif tool_name == "google_drive_create_folder":
            return await self.mcp_server.create_folder(
                kwargs["name"], kwargs.get("parent_id")
            )
        else:
            raise ValueError(f"Unknown tool: {tool_name}")


class GoogleCalendarAdapter(BaseMCPAdapter):
    """Google Calendar MCP Adapter"""

    def get_tool_definitions(self) -> List[Dict[str, Any]]:
        return [
            {
                "name": "google_calendar_list_events",
                "description": "구글 캘린더 이벤트 목록 조회",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "calendar_id": {
                            "type": "string",
                            "description": "캘린더 ID",
                            "default": "primary",
                        }
                    },
                },
            },
            {
                "name": "google_calendar_create_event",
                "description": "구글 캘린더 이벤트 생성",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "summary": {"type": "string", "description": "이벤트 제목"},
                        "start_time": {
                            "type": "string",
                            "description": "시작 시간 (ISO 형식)",
                        },
                        "end_time": {
                            "type": "string",
                            "description": "종료 시간 (ISO 형식)",
                        },
                        "description": {
                            "type": "string",
                            "description": "이벤트 설명 (선택사항)",
                        },
                    },
                    "required": ["summary", "start_time", "end_time"],
                },
            },
        ]

    async def execute_tool(self, tool_name: str, **kwargs) -> Any:
        if not self.is_connected:
            await self.connect()

        if tool_name == "google_calendar_list_events":
            return await self.mcp_server.list_events(
                kwargs.get("calendar_id", "primary")
            )
        elif tool_name == "google_calendar_create_event":
            from datetime import datetime

            start_time = datetime.fromisoformat(kwargs["start_time"])
            end_time = datetime.fromisoformat(kwargs["end_time"])
            return await self.mcp_server.create_event(
                kwargs["summary"], start_time, end_time, kwargs.get("description")
            )
        else:
            raise ValueError(f"Unknown tool: {tool_name}")


class NotionAdapter(BaseMCPAdapter):
    """Notion MCP Adapter"""

    def get_tool_definitions(self) -> List[Dict[str, Any]]:
        return [
            {
                "name": "notion_query_database",
                "description": "노션 데이터베이스 쿼리",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "database_id": {
                            "type": "string",
                            "description": "데이터베이스 ID",
                        }
                    },
                    "required": ["database_id"],
                },
            },
            {
                "name": "notion_create_page",
                "description": "노션 페이지 생성",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "parent_id": {
                            "type": "string",
                            "description": "부모 페이지/데이터베이스 ID",
                        },
                        "title": {"type": "string", "description": "페이지 제목"},
                        "content": {"type": "string", "description": "페이지 내용"},
                    },
                    "required": ["parent_id", "title"],
                },
            },
        ]

    async def execute_tool(self, tool_name: str, **kwargs) -> Any:
        if not self.is_connected:
            await self.connect()

        if tool_name == "notion_query_database":
            return await self.mcp_server.query_database(kwargs["database_id"])
        elif tool_name == "notion_create_page":
            properties = {"title": {"title": [{"text": {"content": kwargs["title"]}}]}}
            content = []
            if kwargs.get("content"):
                content = [
                    {
                        "object": "block",
                        "type": "paragraph",
                        "paragraph": {
                            "rich_text": [
                                {"type": "text", "text": {"content": kwargs["content"]}}
                            ]
                        },
                    }
                ]
            return await self.mcp_server.create_page(
                kwargs["parent_id"], properties, content
            )
        else:
            raise ValueError(f"Unknown tool: {tool_name}")


class SlackAdapter(BaseMCPAdapter):
    """Slack MCP Adapter"""

    def get_tool_definitions(self) -> List[Dict[str, Any]]:
        return [
            {
                "name": "slack_send_message",
                "description": "슬랙 메시지 전송",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "channel": {"type": "string", "description": "채널명 또는 ID"},
                        "text": {"type": "string", "description": "메시지 내용"},
                    },
                    "required": ["channel", "text"],
                },
            },
            {
                "name": "slack_list_channels",
                "description": "슬랙 채널 목록 조회",
                "parameters": {"type": "object", "properties": {}},
            },
        ]

    async def execute_tool(self, tool_name: str, **kwargs) -> Any:
        if not self.is_connected:
            await self.connect()

        if tool_name == "slack_send_message":
            return await self.mcp_server.send_message(kwargs["channel"], kwargs["text"])
        elif tool_name == "slack_list_channels":
            return await self.mcp_server.list_channels()
        else:
            raise ValueError(f"Unknown tool: {tool_name}")
