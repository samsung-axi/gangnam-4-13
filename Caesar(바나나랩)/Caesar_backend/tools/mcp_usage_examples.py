"""
MCP Tools Wrapper 사용 예제
Caesar 에이전트를 위한 실제 사용 시나리오들
"""

import asyncio
import sys
import os
from datetime import datetime, timedelta

# 프로젝트 경로 추가
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from tools.mcp_wrapper import mcp_tools, init_mcp_tools, cleanup_mcp_tools


async def example_1_basic_file_operations():
    """예제 1: 기본 파일 작업"""
    print("\n📁 === 예제 1: Google Drive 파일 작업 ===")

    try:
        # 파일 목록 조회
        files = await mcp_tools.drive_list_files(max_results=5)
        print(f"📋 파일 목록: {len(files)}개")
        for file in files[:3]:
            print(
                f"   - {file.get('name', 'Unknown')} ({file.get('mimeType', 'Unknown')})"
            )

        # 파일 검색
        search_results = await mcp_tools.drive_search_files("xlsx")
        print(f"🔍 엑셀 파일 검색 결과: {len(search_results)}개")

        # 첫 번째 파일 정보 상세 조회
        if files:
            file_info = await mcp_tools.drive_get_file_info(files[0]["id"])
            print(
                f"📄 파일 상세 정보: {file_info.get('name')} - {file_info.get('size', 'Unknown')} bytes"
            )

    except Exception as e:
        print(f"❌ 파일 작업 오류: {e}")


async def example_2_calendar_management():
    """예제 2: 캘린더 관리"""
    print("\n📅 === 예제 2: Google Calendar 이벤트 관리 ===")

    try:
        # 캘린더 목록 조회
        calendars = await mcp_tools.calendar_list_calendars()
        print(f"📋 캘린더 목록: {len(calendars)}개")

        # 기존 이벤트 조회
        events = await mcp_tools.calendar_list_events(max_results=3)
        print(f"📝 최근 이벤트: {len(events)}개")

        # 새 테스트 이벤트 생성
        start_time = datetime.now() + timedelta(hours=2)
        end_time = start_time + timedelta(hours=1)

        new_event = await mcp_tools.calendar_create_event(
            summary="MCP Wrapper 테스트 이벤트",
            description="자동화된 테스트 이벤트입니다.",
            start_time=start_time,
            end_time=end_time,
        )

        if new_event:
            event_id = new_event.get("id")
            print(f"✅ 이벤트 생성 성공: {event_id}")

            # 생성한 이벤트 즉시 삭제 (테스트용)
            delete_result = await mcp_tools.calendar_delete_event(event_id)
            if delete_result:
                print("🗑️ 테스트 이벤트 삭제 완료")

    except Exception as e:
        print(f"❌ 캘린더 작업 오류: {e}")


async def example_3_slack_communication():
    """예제 3: Slack 커뮤니케이션"""
    print("\n💬 === 예제 3: Slack 메시지 및 채널 관리 ===")

    try:
        # 채널 목록 조회
        channels = await mcp_tools.slack_list_channels()
        print(f"📋 채널 목록: {len(channels)}개")

        # 공개 채널만 필터링
        public_channels = [ch for ch in channels if not ch.get("is_private", True)]
        print(f"🌐 공개 채널: {len(public_channels)}개")

        for channel in public_channels[:3]:
            print(
                f"   - #{channel.get('name', 'Unknown')} ({channel.get('num_members', 0)}명)"
            )

        # 사용자 목록 조회
        users = await mcp_tools.slack_get_users()
        active_users = [u for u in users if not u.get("deleted", False)]
        print(f"👥 활성 사용자: {len(active_users)}명")

        # 테스트 메시지 전송 (general 채널이 있다면)
        general_channel = next(
            (ch for ch in channels if ch.get("name") == "general"), None
        )
        if general_channel:
            message_result = await mcp_tools.slack_post_message(
                channel=general_channel["id"],
                text="🤖 MCP Wrapper 테스트 메시지입니다!",
            )
            if message_result:
                print("✅ 테스트 메시지 전송 성공")

    except Exception as e:
        print(f"❌ Slack 작업 오류: {e}")


async def example_4_notion_knowledge_base():
    """예제 4: Notion 지식베이스 관리"""
    print("\n📝 === 예제 4: Notion 데이터베이스 및 페이지 관리 ===")

    try:
        # 데이터베이스 목록 조회
        databases = await mcp_tools.notion_list_databases()
        print(f"📊 데이터베이스 목록: {databases}")

        # Notion 검색
        search_results = await mcp_tools.notion_search("프로젝트")
        print(f"🔍 '프로젝트' 검색 결과: {search_results}")

        # 전체 검색 (키워드 없이)
        all_results = await mcp_tools.notion_search("")
        print(
            f"📋 전체 페이지/DB 수: {len(all_results) if isinstance(all_results, list) else 'Unknown'}"
        )

    except Exception as e:
        print(f"❌ Notion 작업 오류: {e}")


async def example_5_cross_service_search():
    """예제 5: 서비스 간 통합 검색"""
    print("\n🔍 === 예제 5: 모든 서비스 통합 검색 ===")

    try:
        # 모든 서비스에서 "test" 검색
        search_results = await mcp_tools.search_across_services("test")

        for service, results in search_results.items():
            if isinstance(results, list):
                print(f"📁 {service}: {len(results)}개 결과")
            else:
                print(f"⚠️ {service}: {results}")

    except Exception as e:
        print(f"❌ 통합 검색 오류: {e}")


async def example_6_service_status_monitoring():
    """예제 6: 서비스 상태 모니터링"""
    print("\n📊 === 예제 6: 모든 서비스 상태 확인 ===")

    try:
        status = await mcp_tools.get_all_service_status()

        for service, info in status.items():
            service_name = service.replace("_", " ").title()
            if info.get("connected"):
                print(f"✅ {service_name}: 연결됨")

                # 서비스별 상세 정보
                if "file_count" in info:
                    print(f"   📁 파일: {info['file_count']}개")
                if "calendar_count" in info:
                    print(f"   📅 캘린더: {info['calendar_count']}개")
                if "channel_count" in info:
                    print(f"   💬 채널: {info['channel_count']}개")
                if "tool_count" in info:
                    print(f"   🔧 도구: {info['tool_count']}개")
            else:
                print(f"❌ {service_name}: 연결 실패")
                if "error" in info:
                    print(f"   오류: {info['error']}")

    except Exception as e:
        print(f"❌ 상태 확인 오류: {e}")


async def example_7_meeting_workflow():
    """예제 7: 회의 통합 워크플로우"""
    print("\n🚀 === 예제 7: 회의 통합 워크플로우 ===")

    try:
        # 회의 워크플로우 실행
        start_time = datetime.now() + timedelta(hours=3)
        end_time = start_time + timedelta(hours=1)

        # general 채널 ID 찾기
        channels = await mcp_tools.slack_list_channels()
        general_channel = next(
            (ch for ch in channels if ch.get("name") == "general"), None
        )
        slack_channel = general_channel["id"] if general_channel else None

        workflow_result = await mcp_tools.create_cross_service_workflow(
            workflow_type="meeting_workflow",
            title="MCP Wrapper 데모 회의",
            description="통합 워크플로우 테스트를 위한 데모 회의입니다.",
            start_time=start_time,
            end_time=end_time,
            slack_channel=slack_channel,
        )

        print(f"📋 워크플로우 결과: {workflow_result['status']}")
        if workflow_result["status"] == "success":
            print(f"✅ {workflow_result['message']}")

            # 생성된 이벤트 정리
            if "calendar_event" in workflow_result:
                event_id = workflow_result["calendar_event"].get("id")
                if event_id:
                    await mcp_tools.calendar_delete_event(event_id)
                    print("🗑️ 테스트 이벤트 정리 완료")
        else:
            print(f"❌ 오류: {workflow_result.get('error', 'Unknown')}")

    except Exception as e:
        print(f"❌ 회의 워크플로우 오류: {e}")


async def main():
    """모든 예제 실행"""
    print("🎯 MCP Tools Wrapper 사용 예제 시작")
    print("=" * 60)

    # 초기화
    success = await init_mcp_tools()
    if not success:
        print("❌ MCP Tools 초기화 실패")
        return

    # 모든 예제 실행
    examples = [
        example_1_basic_file_operations,
        example_2_calendar_management,
        example_3_slack_communication,
        example_4_notion_knowledge_base,
        example_5_cross_service_search,
        example_6_service_status_monitoring,
        example_7_meeting_workflow,
    ]

    for i, example in enumerate(examples, 1):
        try:
            await example()
        except Exception as e:
            print(f"❌ 예제 {i} 실행 오류: {e}")

        # 예제 간 잠시 대기
        await asyncio.sleep(1)

    print("\n" + "=" * 60)
    print("🎉 모든 예제 실행 완료!")

    # 정리
    await cleanup_mcp_tools()


if __name__ == "__main__":
    asyncio.run(main())
