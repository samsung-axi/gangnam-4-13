"""
통합 연동 테스트 스크립트
AI-Analysis-Backend와 Chatbot-Backend 간의 연동을 테스트
"""

import asyncio
import httpx
import json
import logging
from pathlib import Path

# 로깅 설정
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# 설정
ANALYSIS_BACKEND_URL = "http://localhost:8001"
CHATBOT_BACKEND_URL = "http://localhost:8003"

async def test_analysis_backend_health():
    """분석 백엔드 헬스체크"""
    try:
        async with httpx.AsyncClient(timeout=5.0) as client:
            response = await client.get(f"{ANALYSIS_BACKEND_URL}/health")
            if response.status_code == 200:
                logger.info("✅ AI-Analysis-Backend 연결 성공")
                return True
            else:
                logger.error(f"❌ AI-Analysis-Backend 연결 실패: {response.status_code}")
                return False
    except Exception as e:
        logger.error(f"❌ AI-Analysis-Backend 연결 오류: {e}")
        return False

async def test_chatbot_backend_health():
    """챗봇 백엔드 헬스체크"""
    try:
        async with httpx.AsyncClient(timeout=5.0) as client:
            response = await client.get(f"{CHATBOT_BACKEND_URL}/health")
            if response.status_code == 200:
                logger.info("✅ Chatbot-Backend 연결 성공")
                return True
            else:
                logger.error(f"❌ Chatbot-Backend 연결 실패: {response.status_code}")
                return False
    except Exception as e:
        logger.error(f"❌ Chatbot-Backend 연결 오류: {e}")
        return False

async def test_chatbot_to_analysis_connection():
    """챗봇 백엔드 → AI 분석 백엔드 연결 테스트"""
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(f"{CHATBOT_BACKEND_URL}/api/v1/analysis/health")
            
            if response.status_code == 200:
                result = response.json()
                if result.get("analysis_backend_healthy"):
                    logger.info("✅ 챗봇 → AI 분석 백엔드 연결 성공")
                    logger.info(f"   Backend URL: {result.get('backend_url')}")
                    return True
                else:
                    logger.error("❌ 챗봇에서 AI 분석 백엔드 연결 실패")
                    logger.error(f"   Status: {result.get('status')}")
                    return False
            else:
                logger.error(f"❌ 연결 테스트 실패: {response.status_code}")
                return False
                
    except Exception as e:
        logger.error(f"❌ 챗봇 → AI 분석 백엔드 연결 오류: {e}")
        return False

async def test_session_with_analysis_enhancement():
    """분석 결과를 이용한 세션 생성 및 AI 백엔드 정보 보강 테스트"""
    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            # 1. 분석 결과로 세션 초기화
            logger.info("1. 분석 결과로 세션 초기화 테스트...")
            analysis_payload = {
                "diagnosis": "아토피 피부염",
                "recommendations": "보습제 사용 및 피부과 상담을 권장합니다.",
                "similar_diseases": ["습진", "접촉성 피부염", "지루성 피부염"],
                "refined_symptoms": "건조하고 가려운 피부, 붉은 발진"
            }
            
            response = await client.post(
                f"{CHATBOT_BACKEND_URL}/api/v1/session/init-from-analysis",
                json=analysis_payload
            )
            
            if response.status_code == 200:
                result = response.json()
                session_id = result["session_id"]
                logger.info(f"✅ 세션 초기화 성공: {session_id}")
                
                # 2. AI 분석 백엔드 정보로 컨텍스트 보강 테스트
                logger.info("2. 컨텍스트 보강 테스트...")
                enhance_response = await client.post(
                    f"{CHATBOT_BACKEND_URL}/api/v1/analysis/enhance-context",
                    params={"session_id": session_id}
                )
                
                if enhance_response.status_code == 200:
                    enhance_result = enhance_response.json()
                    logger.info(f"✅ 컨텍스트 보강 성공")
                    logger.info(f"   Enhanced data keys: {list(enhance_result.get('enhanced_data', {}).keys())}")
                else:
                    logger.warning(f"⚠️ 컨텍스트 보강 실패: {enhance_response.status_code}")
                
                # 3. 향상된 채팅 테스트
                logger.info("3. AI 분석 백엔드 정보 활용 채팅 테스트...")
                
                test_questions = [
                    "이 진단에 대해 자세히 설명해주세요",
                    "추천 병원을 알려주세요",
                    "치료법은 무엇인가요?",
                    "비슷한 사례가 있나요?"
                ]
                
                for i, question in enumerate(test_questions, 1):
                    logger.info(f"   질문 {i}: {question}")
                    
                    chat_response = await client.post(
                        f"{CHATBOT_BACKEND_URL}/api/v1/chat/with-analysis-enhancement",
                        json={"session_id": session_id, "message": question}
                    )
                    
                    if chat_response.status_code == 200:
                        chat_result = chat_response.json()
                        logger.info(f"   ✅ 답변 생성 성공 (길이: {len(chat_result.get('reply', ''))})")
                        logger.info(f"   향상된 정보: {chat_result.get('enhanced_with', [])}")
                    else:
                        logger.warning(f"   ⚠️ 답변 생성 실패: {chat_response.status_code}")
                
                return True
                
            else:
                logger.error(f"❌ 세션 초기화 실패: {response.status_code}")
                
    except Exception as e:
        logger.error(f"❌ 세션 테스트 오류: {e}")
        
    return False

async def test_diagnosis_info_retrieval():
    """진단 정보 조회 테스트"""
    try:
        async with httpx.AsyncClient(timeout=15.0) as client:
            test_diagnosis = "아토피 피부염"
            logger.info(f"진단 정보 조회 테스트: {test_diagnosis}")
            
            response = await client.get(
                f"{CHATBOT_BACKEND_URL}/api/v1/analysis/diagnosis-info/{test_diagnosis}"
            )
            
            if response.status_code == 200:
                result = response.json()
                logger.info("✅ 진단 정보 조회 성공")
                
                info_types = []
                if result.get('disease_info'):
                    info_types.append("질병정보")
                if result.get('recommended_hospitals'):
                    info_types.append("병원추천")
                if result.get('similar_cases'):
                    info_types.append("유사사례")
                    
                logger.info(f"   조회된 정보 유형: {', '.join(info_types)}")
                return True
            else:
                logger.warning(f"⚠️ 진단 정보 조회 실패: {response.status_code}")
                
    except Exception as e:
        logger.error(f"❌ 진단 정보 조회 오류: {e}")
        
    return False

async def test_symptoms_refinement():
    """증상 정제 테스트"""
    try:
        async with httpx.AsyncClient(timeout=15.0) as client:
            test_symptoms = "피부가 너무 가렵고 빨갛게 되었어요. 계속 긁게 되고 건조한 것 같아요."
            logger.info(f"증상 정제 테스트: {test_symptoms[:30]}...")
            
            response = await client.post(
                f"{CHATBOT_BACKEND_URL}/api/v1/analysis/refine-symptoms",
                params={"original_text": test_symptoms}
            )
            
            if response.status_code == 200:
                result = response.json()
                if result.get('success'):
                    logger.info("✅ 증상 정제 성공")
                    refined_result = result.get('refined_result', {})
                    if refined_result:
                        logger.info(f"   정제 결과 키: {list(refined_result.keys())}")
                    return True
                else:
                    logger.warning("⚠️ 증상 정제 실패 (success: false)")
            else:
                logger.warning(f"⚠️ 증상 정제 실패: {response.status_code}")
                
    except Exception as e:
        logger.error(f"❌ 증상 정제 오류: {e}")
        
    return False

async def test_full_integration():
    """전체 통합 테스트"""
    logger.info("=== AI 분석 백엔드 ↔ 챗봇 백엔드 통합 테스트 시작 ===")
    
    # 순차적 테스트
    tests = [
        ("AI-Analysis-Backend Health", test_analysis_backend_health),
        ("Chatbot-Backend Health", test_chatbot_backend_health),
        ("챗봇 → AI 분석 백엔드 연결", test_chatbot_to_analysis_connection),
        ("진단 정보 조회", test_diagnosis_info_retrieval),
        ("증상 정제 기능", test_symptoms_refinement),
        ("세션 + AI 백엔드 정보 보강", test_session_with_analysis_enhancement),
    ]
    
    results = []
    
    for test_name, test_func in tests:
        logger.info(f"\n--- {test_name} 테스트 ---")
        try:
            result = await test_func()
            results.append((test_name, result))
        except Exception as e:
            logger.error(f"테스트 실행 오류: {e}")
            results.append((test_name, False))
    
    # 결과 요약
    logger.info("\n=== 테스트 결과 요약 ===")
    passed = 0
    total = len(results)
    
    for test_name, result in results:
        status = "✅ PASS" if result else "❌ FAIL"
        logger.info(f"{test_name}: {status}")
        if result:
            passed += 1
    
    logger.info(f"\n총 {passed}/{total} 테스트 통과")
    
    if passed == total:
        logger.info("🎉 모든 테스트 통과! AI 분석 백엔드 ↔ 챗봇 백엔드 연동 완료")
    elif passed >= total * 0.7:
        logger.info("🔶 대부분 테스트 통과. 일부 기능에서 문제가 있을 수 있습니다.")
    else:
        logger.warning("⚠️ 다수 테스트 실패. 연동 설정을 확인하세요.")
    
    return passed == total

if __name__ == "__main__":
    # 환경 설정 확인
    logger.info("환경 설정:")
    logger.info(f"  AI-Analysis-Backend: {ANALYSIS_BACKEND_URL}")
    logger.info(f"  Chatbot-Backend: {CHATBOT_BACKEND_URL}")
    
    # 통합 테스트 실행
    asyncio.run(test_full_integration())
