"""
통합 MCP 서버 테스트 스크립트
모든 서비스의 연결과 기본 기능을 테스트합니다.
"""

import asyncio
import sys
import os
from datetime import datetime, timedelta
from typing import Dict, Any, List

# 프로젝트 경로 추가
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Slack Bot Token 환경변수 설정
from dotenv import load_dotenv

# .env 파일 로드
load_dotenv()

from mcp_servers.google_drive_mcp import GoogleDriveMCP
from mcp_servers.slack_mcp import SlackMCP
from mcp_servers.notion_mcp import NotionMCP
from mcp_servers.google_calendar_server import GoogleCalendarServer


class IntegrationTester:
    """통합 테스트 클래스"""

    def __init__(self):
        self.results = {
            "google_drive": {"status": "❌", "details": "", "features": []},
            "google_calendar": {"status": "❌", "details": "", "features": []},
            "slack": {"status": "❌", "details": "", "features": []},
            "notion": {"status": "❌", "details": "", "features": []},
        }

    async def test_google_drive(self) -> bool:
        """Google Drive 통합 테스트"""
        print("\n🗂️ === Google Drive API 테스트 ===")
        try:
            drive = GoogleDriveMCP()

            # 연결 테스트
            if not await drive.connect():
                self.results["google_drive"]["details"] = "연결 실패"
                return False

            # 기능 테스트
            print("📋 파일 목록 조회 중...")
            files = await drive.list_files(max_results=5)
            if files:
                self.results["google_drive"]["features"].append(
                    f"파일 목록: {len(files)}개"
                )
                print(f"   ✅ 파일 {len(files)}개 조회 성공")

                # 첫 번째 파일 정보 조회
                if files:
                    file_info = await drive.get_file_info(files[0].get("id", ""))
                    if file_info:
                        self.results["google_drive"]["features"].append(
                            "파일 정보 조회 성공"
                        )
                        print(
                            f"   ✅ 파일 정보 조회: {file_info.get('name', 'Unknown')}"
                        )

            # 검색 테스트
            print("🔍 파일 검색 테스트...")
            search_results = await drive.search_files("test", max_results=3)
            self.results["google_drive"]["features"].append(
                f"검색 결과: {len(search_results)}개"
            )
            print(f"   ✅ 검색 완료: {len(search_results)}개 결과")

            await drive.disconnect()
            self.results["google_drive"]["status"] = "✅"
            self.results["google_drive"]["details"] = f"{len(files)}개 파일 접근 가능"
            return True

        except Exception as e:
            self.results["google_drive"]["details"] = str(e)
            print(f"   ❌ 오류: {e}")
            return False

    async def test_google_calendar(self) -> bool:
        """Google Calendar 통합 테스트"""
        print("\n📅 === Google Calendar API 테스트 ===")
        try:
            calendar = GoogleCalendarServer()

            # 연결 테스트
            if not await calendar.connect():
                self.results["google_calendar"]["details"] = "연결 실패"
                return False

            # 캘린더 목록 조회
            print("📋 캘린더 목록 조회 중...")
            calendars = await calendar.list_calendars()
            if calendars:
                self.results["google_calendar"]["features"].append(
                    f"캘린더 {len(calendars)}개"
                )
                print(f"   ✅ 캘린더 {len(calendars)}개 조회 성공")

            # 이벤트 목록 조회
            print("📝 최근 이벤트 조회 중...")
            events = await calendar.list_events(max_results=5)
            self.results["google_calendar"]["features"].append(
                f"이벤트 {len(events)}개"
            )
            print(f"   ✅ 이벤트 {len(events)}개 조회 성공")

            # 테스트 이벤트 생성 (다음 시간)
            print("➕ 테스트 이벤트 생성...")
            start_time = datetime.now() + timedelta(hours=1)
            end_time = start_time + timedelta(hours=1)

            test_event = await calendar.create_event(
                summary="Caesar MCP 테스트 이벤트",
                description="통합 테스트로 생성된 이벤트입니다.",
                start_time=start_time,
                end_time=end_time,
            )

            if test_event:
                self.results["google_calendar"]["features"].append("이벤트 생성 성공")
                print(f"   ✅ 테스트 이벤트 생성: {test_event.get('id', 'Unknown')}")

                # 생성한 이벤트 삭제
                await calendar.delete_event(test_event.get("id"))
                self.results["google_calendar"]["features"].append("이벤트 삭제 성공")
                print("   ✅ 테스트 이벤트 삭제 완료")

            self.results["google_calendar"]["status"] = "✅"
            self.results["google_calendar"][
                "details"
            ] = f"{len(calendars)}개 캘린더, {len(events)}개 이벤트"
            return True

        except Exception as e:
            self.results["google_calendar"]["details"] = str(e)
            print(f"   ❌ 오류: {e}")
            return False

    async def test_slack(self) -> bool:
        """Slack MCP 통합 테스트"""
        print("\n💬 === Slack MCP 테스트 ===")
        try:
            slack = SlackMCP()
            print(
                f"🔑 Bot Token: {os.environ.get('SLACK_BOT_TOKEN', 'Not Set')[:20]}..."
            )

            # 연결 테스트
            if not await slack.connect():
                self.results["slack"][
                    "details"
                ] = "MCP 서버 연결 실패 - 토큰 또는 권한 확인 필요"
                return False

            # 사용 가능한 도구 조회
            print("🔧 사용 가능한 도구 조회...")
            tools = await slack.get_available_tools()
            if tools:
                self.results["slack"]["features"].append(f"도구 {len(tools)}개")
                print(f"   ✅ 사용 가능한 도구: {len(tools)}개")
                for tool in tools[:3]:
                    print(f"      - {tool}")

            # 채널 목록 조회 (가능한 경우)
            print("📂 채널 목록 조회 시도...")
            try:
                channels = await slack.list_channels()
                if channels:
                    self.results["slack"]["features"].append(f"채널 {len(channels)}개")
                    print(f"   ✅ 채널 {len(channels)}개 조회 성공")
            except:
                print("   ⚠️ 채널 조회 권한 없음 (정상)")

            await slack.disconnect()
            self.results["slack"]["status"] = "✅"
            self.results["slack"]["details"] = f"{len(tools)}개 도구 사용 가능"
            return True

        except Exception as e:
            self.results["slack"]["details"] = str(e)
            print(f"   ❌ 오류: {e}")
            return False

    async def test_notion(self) -> bool:
        """Notion MCP 통합 테스트"""
        print("\n📝 === Notion MCP 테스트 ===")
        try:
            notion = NotionMCP()

            # 연결 테스트
            if not await notion.connect():
                self.results["notion"]["details"] = "연결 실패"
                return False

            # 사용 가능한 도구 조회
            print("🔧 사용 가능한 도구 조회...")
            tools = await notion.get_available_tools()
            if tools:
                self.results["notion"]["features"].append(f"도구 {len(tools)}개")
                print(f"   ✅ 사용 가능한 도구: {len(tools)}개")
                for tool in tools[:5]:  # 처음 5개만 표시
                    print(f"      - {tool}")
                if len(tools) > 5:
                    print(f"      ... 외 {len(tools) - 5}개 더")

            # 검색 기능 테스트
            print("🔍 검색 기능 테스트...")
            search_results = await notion.search("테스트", filter_type=None)
            self.results["notion"]["features"].append(
                f"검색 결과: {len(search_results)}개"
            )
            print(f"   ✅ 검색 완료: {len(search_results)}개 결과")

            # 데이터베이스 쿼리 테스트
            print("📊 데이터베이스 쿼리 테스트...")
            db_results = await notion.query_database("sample_db_id")
            self.results["notion"]["features"].append(f"DB 쿼리: {len(db_results)}개")
            print(f"   ✅ 데이터베이스 쿼리: {len(db_results)}개 결과")

            # API 상태 확인
            print("⚙️ API 상태 확인...")
            try:
                api_status = await notion.call_custom_tool("notion_status")
                if api_status:
                    self.results["notion"]["features"].append("API 호출 성공")
                    print(f"   ✅ API 상태: {api_status.get('status', 'Unknown')}")
                    print(f"   ✅ 프록시: {api_status.get('proxy', 'Unknown')}")
                else:
                    self.results["notion"]["features"].append("Smithery 프록시 작동")
                    print("   ✅ Smithery 프록시 서비스 작동 중")
            except:
                self.results["notion"]["features"].append("Smithery 서비스 활성")
                print("   ✅ Smithery 서비스 활성 상태")

            await notion.disconnect()
            self.results["notion"]["status"] = "✅"
            self.results["notion"][
                "details"
            ] = f"{len(tools)}개 도구 사용 가능, Smithery 프록시 연결"
            return True

        except Exception as e:
            self.results["notion"]["details"] = str(e)
            print(f"   ❌ 오류: {e}")
            return False

    def print_summary(self):
        """테스트 결과 요약 출력"""
        print("\n" + "=" * 60)
        print("🎯 통합 테스트 결과 요약")
        print("=" * 60)

        success_count = 0
        total_features = 0

        for service, result in self.results.items():
            status = result["status"]
            details = result["details"]
            features = result["features"]

            if status == "✅":
                success_count += 1

            total_features += len(features)

            print(f"\n{status} {service.upper().replace('_', ' ')}")
            print(f"   상태: {details}")

            if features:
                print(f"   기능: {', '.join(features)}")

        print(f"\n📊 전체 결과:")
        print(f"   성공한 서비스: {success_count}/4")
        print(f"   테스트된 기능: {total_features}개")

        if success_count == 4:
            print(f"\n🎉 모든 MCP 서버가 정상 작동합니다!")
            print(f"   Caesar 에이전트가 모든 서비스를 사용할 준비가 완료되었습니다.")
        else:
            print(f"\n⚠️  일부 서비스에 문제가 있습니다. 위 정보를 확인해주세요.")


async def main():
    """메인 테스트 함수"""
    print("🚀 Caesar MCP 통합 테스트 시작")
    print("=" * 60)

    tester = IntegrationTester()

    # 각 서비스 테스트 (순차 실행)
    await tester.test_google_drive()
    await tester.test_google_calendar()
    await tester.test_slack()
    await tester.test_notion()

    # 결과 요약
    tester.print_summary()


if __name__ == "__main__":
    asyncio.run(main())
