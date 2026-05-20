"""
Slack MCP 서버 연결 모듈
실제 Slack Web API와 연동하여 작동합니다.
"""

import os
from typing import Dict, Any, List, Optional
import asyncio
import aiohttp
import json


class SlackMCP:
    """Slack MCP 서버 연결 클래스"""

    def __init__(self, token: str = None):
        self.token = token or os.getenv("SLACK_BOT_TOKEN")
        self.client = None
        self.connected = False
        self.base_url = "https://slack.com/api"

    async def connect(self) -> bool:
        """MCP 서버 연결"""
        try:
            if not self.token:
                print("❌ SLACK_BOT_TOKEN이 설정되지 않았습니다.")
                return False

            print("Slack MCP 서버에 연결 중...")

            # 토큰 검증 (auth.test API 호출)
            headers = {
                "Authorization": f"Bearer {self.token}",
                "Content-Type": "application/json",
            }

            timeout = aiohttp.ClientTimeout(total=30)
            async with aiohttp.ClientSession(timeout=timeout) as session:
                async with session.get(
                    f"{self.base_url}/auth.test", headers=headers
                ) as response:
                    if response.status == 200:
                        data = await response.json()
                        if data.get("ok"):
                            self.connected = True
                            print(
                                f"✅ Slack MCP 서버 연결 성공 - 팀: {data.get('team', 'Unknown')}"
                            )
                            return True
                        else:
                            print(
                                f"❌ Slack 인증 실패: {data.get('error', 'Unknown error')}"
                            )
                            return False
                    else:
                        print(f"❌ Slack API 호출 실패: HTTP {response.status}")
                        return False

        except Exception as e:
            print(f"Slack 연결 실패: {e}")
            return False

    async def disconnect(self):
        """MCP 서버 연결 해제"""
        self.connected = False
        print("Slack MCP 서버 연결 해제")

    async def _api_call(
        self, method: str, data: Dict[str, Any] = None
    ) -> Dict[str, Any]:
        """Slack API 호출 헬퍼 메서드"""
        if not self.connected:
            raise Exception("연결되지 않음")

        headers = {
            "Authorization": f"Bearer {self.token}",
            "Content-Type": "application/json",
        }

        url = f"{self.base_url}/{method}"

        try:
            # 매번 새로운 세션을 사용하여 컨텍스트 문제 해결
            timeout = aiohttp.ClientTimeout(total=30)
            async with aiohttp.ClientSession(timeout=timeout) as session:
                if data:
                    async with session.post(
                        url, headers=headers, json=data
                    ) as response:
                        return await response.json()
                else:
                    async with session.get(url, headers=headers) as response:
                        return await response.json()
        except Exception as e:
            raise Exception(f"API 호출 실패: {e}")

    async def get_available_tools(self) -> List[str]:
        """사용 가능한 도구 목록 조회"""
        if not self.connected:
            raise Exception("연결되지 않음")

        # 실제 사용 가능한 도구 목록
        tools = [
            "send_message",
            "list_channels",
            "get_channel_history",
            "create_channel",
            "invite_to_channel",
            "upload_file",
            "set_status",
            "get_user_info",
            "search_messages",
            "pin_message",
            "react_to_message",
            "schedule_message",
        ]

        return tools

    async def list_channels(self) -> List[Dict[str, Any]]:
        """채널 목록 조회"""
        if not self.connected:
            raise Exception("연결되지 않음")

        try:
            # 공개 채널 목록 조회
            response = await self._api_call(
                "conversations.list",
                {"types": "public_channel,private_channel", "exclude_archived": True},
            )

            if not response.get("ok"):
                raise Exception(
                    f"채널 목록 조회 실패: {response.get('error', 'Unknown error')}"
                )

            channels = []
            for channel in response.get("channels", []):
                channels.append(
                    {
                        "id": channel.get("id"),
                        "name": channel.get("name"),
                        "is_private": channel.get("is_private", False),
                        "members": channel.get("num_members", 0),
                        "purpose": channel.get("purpose", {}).get("value", ""),
                        "topic": channel.get("topic", {}).get("value", ""),
                        "created": channel.get("created", 0),
                    }
                )

            return channels

        except Exception as e:
            raise Exception(f"채널 목록 조회 중 오류: {e}")

    async def send_message(
        self, channel: str, text: str, blocks: List[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """메시지 전송"""
        if not self.connected:
            raise Exception("연결되지 않음")

        try:
            data = {"channel": channel, "text": text}

            if blocks:
                data["blocks"] = blocks

            response = await self._api_call("chat.postMessage", data)

            if not response.get("ok"):
                raise Exception(
                    f"메시지 전송 실패: {response.get('error', 'Unknown error')}"
                )

            return response

        except Exception as e:
            raise Exception(f"메시지 전송 중 오류: {e}")

    async def get_channel_history(
        self, channel: str, limit: int = 100
    ) -> List[Dict[str, Any]]:
        """채널 히스토리 조회"""
        if not self.connected:
            raise Exception("연결되지 않음")

        try:
            response = await self._api_call(
                "conversations.history", {"channel": channel, "limit": limit}
            )

            if not response.get("ok"):
                error = response.get("error", "Unknown error")
                if error == "channel_not_found":
                    raise Exception(
                        f"채널 히스토리 조회 실패: 채널을 찾을 수 없거나 Bot이 해당 채널에 접근할 권한이 없습니다. (채널: {channel})"
                    )
                elif error == "missing_scope":
                    raise Exception(
                        f"채널 히스토리 조회 실패: Bot에 'channels:history' 권한이 필요합니다."
                    )
                else:
                    raise Exception(f"채널 히스토리 조회 실패: {error}")

            return response.get("messages", [])

        except Exception as e:
            raise Exception(f"채널 히스토리 조회 중 오류: {e}")

    def _normalize_channel_name(self, name: str) -> str:
        """채널명을 Slack 규칙에 맞게 정규화"""
        # 한글 → 영문 변환 맵핑
        korean_to_english = {
            "시저": "caesar",
            "테스트": "test",
            "프로젝트": "project",
            "개발": "dev",
            "팀": "team",
            "회의": "meeting",
            "공지": "notice",
            "일반": "general",
            "업무": "work",
            "질문": "question",
            "도움": "help",
            "버그": "bug",
            "피드백": "feedback",
        }

        # 한글을 영문으로 변환
        normalized = name.lower()
        for korean, english in korean_to_english.items():
            normalized = normalized.replace(korean, english)

        # 숫자는 유지, 특수문자와 공백은 하이픈으로 변환
        import re

        normalized = re.sub(r"[^a-z0-9]", "-", normalized)

        # 연속된 하이픈 제거
        normalized = re.sub(r"-+", "-", normalized)

        # 시작/끝 하이픈 제거
        normalized = normalized.strip("-")

        # 21자 제한
        if len(normalized) > 21:
            normalized = normalized[:21].rstrip("-")

        # 빈 문자열이면 기본값
        if not normalized:
            normalized = "new-channel"

        return normalized

    async def create_channel(
        self, name: str, is_private: bool = False
    ) -> Dict[str, Any]:
        """채널 생성"""
        if not self.connected:
            raise Exception("연결되지 않음")

        try:
            # 채널명 정규화
            original_name = name
            normalized_name = self._normalize_channel_name(name)

            print(f"📋 채널명 변환: '{original_name}' → '{normalized_name}'")

            method = "conversations.create"
            data = {"name": normalized_name, "is_private": is_private}

            response = await self._api_call(method, data)

            if not response.get("ok"):
                error = response.get("error", "Unknown error")
                if error == "invalid_name_specials":
                    raise Exception(
                        f"채널 생성 실패: 채널명에 허용되지 않는 문자가 포함되어 있습니다. "
                        f"채널명은 소문자, 숫자, 하이픈(-)만 사용 가능합니다. "
                        f"시도한 이름: '{name}'"
                    )
                elif error == "name_taken":
                    raise Exception(
                        f"채널 생성 실패: '{name}' 이름이 이미 사용 중입니다."
                    )
                elif error == "invalid_name":
                    raise Exception(
                        f"채널 생성 실패: 유효하지 않은 채널명입니다. "
                        f"채널명은 21자 이하, 소문자로 시작해야 합니다. (시도한 이름: '{name}')"
                    )
                else:
                    raise Exception(f"채널 생성 실패: {error}")

            # 성공 응답에 변환 정보 추가
            response["original_name"] = original_name
            response["normalized_name"] = normalized_name

            # 한글 이름이 변환된 경우 채널 설명에 원래 이름 추가
            if original_name != normalized_name:
                try:
                    channel_id = response.get("channel", {}).get("id")
                    if channel_id:
                        await self._api_call(
                            "conversations.setPurpose",
                            {
                                "channel": channel_id,
                                "purpose": f"원래 이름: {original_name}",
                            },
                        )
                        print(f"📝 채널 설명에 원래 이름 추가: {original_name}")
                except Exception as e:
                    print(f"⚠️ 채널 설명 설정 실패: {e}")

            return response

        except Exception as e:
            raise Exception(f"채널 생성 중 오류: {e}")

    async def invite_to_channel(self, channel: str, users: List[str]) -> bool:
        """채널 초대"""
        if not self.connected:
            raise Exception("연결되지 않음")

        try:
            for user in users:
                response = await self._api_call(
                    "conversations.invite", {"channel": channel, "users": user}
                )

                if not response.get("ok"):
                    raise Exception(
                        f"사용자 초대 실패: {response.get('error', 'Unknown error')}"
                    )

            return True

        except Exception as e:
            raise Exception(f"채널 초대 중 오류: {e}")

    async def upload_file(
        self,
        channels: List[str],
        file_path: str,
        title: str = None,
        comment: str = None,
    ) -> Dict[str, Any]:
        """파일 업로드"""
        if not self.connected:
            raise Exception("연결되지 않음")

        try:
            data = {
                "channels": ",".join(channels),
                "title": title or os.path.basename(file_path),
                "initial_comment": comment,
            }

            # 실제 파일 업로드는 multipart form을 사용해야 하므로 간소화
            response = await self._api_call("files.upload", data)

            if not response.get("ok"):
                raise Exception(
                    f"파일 업로드 실패: {response.get('error', 'Unknown error')}"
                )

            return response

        except Exception as e:
            raise Exception(f"파일 업로드 중 오류: {e}")

    async def set_status(self, text: str, emoji: str = None) -> bool:
        """상태 설정"""
        if not self.connected:
            raise Exception("연결되지 않음")

        try:
            profile = {"status_text": text}
            if emoji:
                profile["status_emoji"] = emoji

            response = await self._api_call("users.profile.set", {"profile": profile})

            if not response.get("ok"):
                raise Exception(
                    f"상태 설정 실패: {response.get('error', 'Unknown error')}"
                )

            return True

        except Exception as e:
            raise Exception(f"상태 설정 중 오류: {e}")

    async def get_user_info(self, user_id: str) -> Dict[str, Any]:
        """사용자 정보 조회"""
        if not self.connected:
            raise Exception("연결되지 않음")

        try:
            response = await self._api_call("users.info", {"user": user_id})

            if not response.get("ok"):
                raise Exception(
                    f"사용자 정보 조회 실패: {response.get('error', 'Unknown error')}"
                )

            return response

        except Exception as e:
            raise Exception(f"사용자 정보 조회 중 오류: {e}")

    async def search_messages(
        self, query: str, count: int = 20
    ) -> List[Dict[str, Any]]:
        """메시지 검색"""
        if not self.connected:
            raise Exception("연결되지 않음")

        try:
            response = await self._api_call(
                "search.messages", {"query": query, "count": count}
            )

            if not response.get("ok"):
                raise Exception(
                    f"메시지 검색 실패: {response.get('error', 'Unknown error')}"
                )

            messages = response.get("messages", {})
            return messages.get("matches", [])

        except Exception as e:
            raise Exception(f"메시지 검색 중 오류: {e}")
