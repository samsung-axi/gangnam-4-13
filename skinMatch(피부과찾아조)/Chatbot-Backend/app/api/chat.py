from fastapi import APIRouter, HTTPException
from typing import List, Dict, Any

from app.models.schemas import (
    InitSessionRequest, InitSessionResponse,
    ChatRequest, ChatResponse,
    SessionSnapshot, ResetRequest, AnalysisContext,
)
from app.services.memory import memory_store
from app.services.openai_client import build_system_prompt, build_context_message, chat_completion
from app.services.context_mapper import map_to_context
<<<<<<< Updated upstream
=======
from app.services.analysis_client import get_analysis_client
from services.context_manager import ContextManager
from services.dynamic_hospital_search import DynamicHospitalSearch

logger = logging.getLogger(__name__)

# RAG 시스템 및 분석 백엔드 클라이언트 인스턴스
context_manager = ContextManager()
dynamic_search = DynamicHospitalSearch()
analysis_client = get_analysis_client()
>>>>>>> Stashed changes


router = APIRouter()


@router.post("/session/init", response_model=InitSessionResponse)
def init_session(req: InitSessionRequest):
    try:
        ctx = AnalysisContext(
            diagnosis=req.diagnosis,
            summary=req.summary,
            similar_diseases=req.similar_diseases or [],
            refined_symptoms=req.refined_symptoms,
        )
        sess = memory_store.create(ctx)
        return InitSessionResponse(session_id=sess.id)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/session/init-from-analysis", response_model=InitSessionResponse)
def init_from_analysis(payload: Dict[str, Any]):
    """Initialize session by passing raw analysis payload from AI-Analysis-Backend or frontend.

    Accepts flexible keys (diagnosis, recommendations/summary, similar_* variants, refined_text...)
<<<<<<< Updated upstream
    """
    try:
        ctx = map_to_context(payload)
        sess = memory_store.create(ctx)
=======
    그리고 AI 분석 백엔드에서 추가 정보를 가져와서 컨텍스트를 보강합니다.
    """
    try:
        # 기본 세션 생성
        ctx = map_to_context(payload)
        sess = memory_store.create(ctx)
        
        # AI 분석 백엔드에서 추가 정보로 컨텍스트 보강
        try:
            enhanced_context = await analysis_client.enhance_diagnosis_context(
                sess.context.model_dump()
            )
            
            # 보강된 정보를 세션에 업데이트
            if 'recommended_hospitals' in enhanced_context:
                # 세션에 병원 정보 추가 (임시 저장)
                sess.context.summary += f"\n\n추천 병원: {', '.join([h.get('name', '') for h in enhanced_context['recommended_hospitals'][:3]])}"
                
            if 'disease_details' in enhanced_context:
                # 질병 상세 정보 추가
                disease_info = enhanced_context['disease_details']
                if disease_info.get('description'):
                    sess.context.summary += f"\n\n질병 정보: {disease_info['description'][:200]}..."
                    
            logger.info(f"Context enhanced with AI analysis backend data: {sess.id}")
            
        except Exception as enhancement_error:
            logger.warning(f"Failed to enhance context with AI backend: {enhancement_error}")
            # 보강 실패해도 기본 세션은 유지
        
        # RAG 시스템 초기화 (선제적 병원 검색: 설정에 따라)
        from app.core.config import settings
        if settings.HOSPITAL_PREFETCH:
            try:
                await context_manager.initialize_from_analysis(sess.id, payload)
                logger.info(f"RAG 시스템 초기화 완료(프리패치): {sess.id}")
            except Exception as rag_error:
                logger.warning(f"RAG 시스템 초기화 실패(프리패치): {rag_error}")
                # 프리패치 실패해도 기본 세션은 생성
        
>>>>>>> Stashed changes
        return InitSessionResponse(session_id=sess.id)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid analysis payload: {e}")


@router.post("/chat", response_model=ChatResponse)
def chat(req: ChatRequest):
    sess = memory_store.get(req.session_id)
    if not sess:
        raise HTTPException(status_code=404, detail="session not found")

<<<<<<< Updated upstream
    # Build message list: system + context + history + user
    messages: List[dict] = []
    messages.append({"role": "system", "content": build_system_prompt()})
    messages.append(build_context_message(sess.context.model_dump()))
    messages.extend(sess.messages)
    messages.append({"role": "user", "content": req.message})

=======
    # AI 분석 백엔드에서 추가 정보 확인 (필요시)
    enhanced_info = {}
    try:
        # 특정 키워드가 포함된 질문의 경우 AI 분석 백엔드에서 추가 정보 조회
        if any(keyword in req.message.lower() for keyword in ["병원", "치료", "증상", "예방", "관리"]):
            diagnosis = sess.context.diagnosis
            if diagnosis:
                if "병원" in req.message.lower():
                    hospitals = await analysis_client.get_hospital_recommendations(
                        diagnosis=diagnosis,
                        location="서울"  # 기본값
                    )
                    if hospitals:
                        enhanced_info['hospitals'] = hospitals[:5]
                
                if any(word in req.message.lower() for word in ["치료", "예방", "관리"]):
                    disease_info = await analysis_client.get_disease_information(
                        diagnosis=diagnosis,
                        detailed=True
                    )
                    if disease_info:
                        enhanced_info['disease_details'] = disease_info
                        
                if "증상" in req.message.lower():
                    similar_cases = await analysis_client.get_similar_cases(
                        diagnosis=diagnosis,
                        limit=3
                    )
                    if similar_cases:
                        enhanced_info['similar_cases'] = similar_cases
                        
                logger.info(f"Enhanced chat with AI backend info for query: {req.message[:50]}...")
                        
    except Exception as e:
        logger.warning(f"Failed to get enhanced info from AI backend: {e}")
    
    # AI 기반 통합 질의 분석 (병원 검색 vs 질환 정보)
    try:
        sess_ctx = sess.context.model_dump()
        # AI 백엔드에서 받은 정보를 컨텍스트에 추가
        if enhanced_info:
            sess_ctx['enhanced_info'] = enhanced_info
            
        rag_ctx = context_manager.get_context(req.session_id)
        cached_list = list((rag_ctx.recommended_hospitals or {}).values()) if rag_ctx else None
        
        # 통합 질의 분석
        unified_analysis = await dynamic_search.analyze_unified_query_intent(req.message, session_context=sess_ctx)
        query_type = unified_analysis.get("query_type", "hospital_search")
        
        # 질환 정보 질문 처리
        if query_type == "disease_info" and unified_analysis.get("confidence", 0) > 0.5:
            logger.info("질환 정보 RAG 경로 선택: disease_search 실행")
            disease_results = await dynamic_search.disease_search.search_disease_info(
                req.message, 
                max_results=6,
                session_context=sess_ctx
            )
            if disease_results.get("success", False):
                logger.info(
                    f"질환 RAG 응답: total_found={disease_results.get('total_found')}, "
                    f"enhanced='{disease_results.get('enhanced_query')}'"
                )
                reply = disease_results.get("response", "질병 정보를 찾을 수 없습니다.")
                memory_store.add_message(req.session_id, "user", req.message)
                memory_store.add_message(req.session_id, "assistant", reply)
                return ChatResponse(session_id=req.session_id, reply=reply)
        
        # 병원 검색 처리
        elif query_type == "hospital_search" and unified_analysis.get("confidence", 0) > 0.5:
            hospital_analysis = unified_analysis.get("hospital_analysis", {})
            max_hospitals = hospital_analysis.get("max_hospitals", 5)
            hospitals = await dynamic_search.search_hospitals_for_query(
                req.message,
                max_hospitals,
                session_context=sess_ctx,
                cached_hospitals=cached_list,
            )
            
            if hospitals:
                reply = await dynamic_search.generate_natural_response(hospitals, req.message)
                memory_store.add_message(req.session_id, "user", req.message)
                memory_store.add_message(req.session_id, "assistant", reply)
                return ChatResponse(session_id=req.session_id, reply=reply)
        
    except Exception as e:
        logger.error(f"동적 검색 실패: {e}")
    
    # 기본 LLM 응답 (폴백) - AI 백엔드 정보 포함
    logger.info("RAG 미적용: 기본 LLM 폴백 응답 생성")
    
    # AI 백엔드에서 받은 정보를 시스템 프롬프트에 포함
    system_context = sess.context.model_dump()
    if enhanced_info:
        system_context['ai_backend_info'] = enhanced_info
    
    messages: List[dict] = build_default_messages(
        system_context, sess.messages, req.message
    )
>>>>>>> Stashed changes
    reply = chat_completion(messages)

    # persist turn
    memory_store.add_message(req.session_id, "user", req.message)
    memory_store.add_message(req.session_id, "assistant", reply)

    return ChatResponse(session_id=req.session_id, reply=reply)


@router.get("/session/{session_id}", response_model=SessionSnapshot)
def get_session(session_id: str):
    sess = memory_store.get(session_id)
    if not sess:
        raise HTTPException(status_code=404, detail="session not found")
    return SessionSnapshot(session_id=sess.id, context=sess.context, messages=sess.messages)


@router.post("/session/reset")
def reset_session(req: ResetRequest):
    if req.mode == "all":
        memory_store.delete(req.session_id)
        return {"deleted": True}
    memory_store.reset_history(req.session_id)
    return {"history_cleared": True}


@router.post("/session/append-context")
def append_context(session_id: str, patch: Dict[str, Any]):
    """Append/merge additional context fields (e.g., add refined_symptoms later).

    - Only updates known fields; history untouched.
    """
    sess = memory_store.get(session_id)
    if not sess:
        raise HTTPException(status_code=404, detail="session not found")
    try:
        if "diagnosis" in patch and str(patch["diagnosis"]).strip():
            sess.context.diagnosis = str(patch["diagnosis"]).strip()
        if "summary" in patch and patch["summary"] is not None:
            sess.context.summary = str(patch["summary"]) if patch["summary"] != "" else None
        if "refined_symptoms" in patch and patch["refined_symptoms"] is not None:
            sess.context.refined_symptoms = str(patch["refined_symptoms"]) if patch["refined_symptoms"] != "" else None
        # Merge similar diseases if provided
        sim = patch.get("similar_diseases")
        if isinstance(sim, list):
            merged = list(dict.fromkeys([*sess.context.similar_diseases, *[str(s).strip() for s in sim if str(s).strip()]]))
            sess.context.similar_diseases = merged
        return {"updated": True}
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid patch: {e}")


@router.post("/consult/start")
def consult_start(payload: Dict[str, Any]):
    """Convenience endpoint: create session from analysis and optionally answer first question.

    Body example:
    {
      "analysis": { ... SkinDiagnosisResponse-like ... },
      "message": "첫 질문 내용"  # optional
    }
    """
    try:
        analysis = payload.get("analysis") or {}
        message = payload.get("message")
        # init session from analysis
        ctx = map_to_context(analysis)
        sess = memory_store.create(ctx)

        if not message:
            # Return a friendly greeting that summarizes the context
            greeting = (
                f"분석 결과는 '{ctx.diagnosis}'로 보이며, 궁금한 점을 물어보세요. "
                f"유사질환: {', '.join(ctx.similar_diseases) if ctx.similar_diseases else '없음'}."
            )
            memory_store.add_message(sess.id, "assistant", greeting)
            return {"session_id": sess.id, "reply": greeting}

        # Otherwise answer the user message
        messages: List[dict] = []
        messages.append({"role": "system", "content": build_system_prompt()})
        messages.append(build_context_message(sess.context.model_dump()))
        messages.append({"role": "user", "content": message})
        reply = chat_completion(messages)
        memory_store.add_message(sess.id, "user", message)
        memory_store.add_message(sess.id, "assistant", reply)
        return {"session_id": sess.id, "reply": reply}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/consult/message")
def consult_message(payload: Dict[str, Any]):
    """Convenience endpoint: send a message in an existing session.

    Body: { session_id, message }
    """
    sid = payload.get("session_id")
    msg = payload.get("message")
    if not sid or not msg:
        raise HTTPException(status_code=400, detail="session_id and message are required")

    sess = memory_store.get(sid)
    if not sess:
        raise HTTPException(status_code=404, detail="session not found")

    messages: List[dict] = []
    messages.append({"role": "system", "content": build_system_prompt()})
    messages.append(build_context_message(sess.context.model_dump()))
    messages.extend(sess.messages)
    messages.append({"role": "user", "content": msg})
    reply = chat_completion(messages)
    memory_store.add_message(sid, "user", msg)
    memory_store.add_message(sid, "assistant", reply)
    return {"session_id": sid, "reply": reply}


# ============= AI 분석 백엔드 연동 테스트 엔드포인트들 =============

@router.get("/analysis/health")
async def check_analysis_backend_health():
    """AI 분석 백엔드 연결 상태 확인"""
    try:
        is_healthy = await analysis_client.health_check()
        return {
            "analysis_backend_healthy": is_healthy,
            "backend_url": analysis_client.base_url,
            "status": "connected" if is_healthy else "disconnected"
        }
    except Exception as e:
        return {
            "analysis_backend_healthy": False,
            "error": str(e),
            "status": "error"
        }


@router.post("/analysis/enhance-context")
async def enhance_context_with_analysis(
    session_id: str,
    include_hospitals: bool = True,
    include_disease_info: bool = True,
    include_similar_cases: bool = True
):
    """세션 컨텍스트를 AI 분석 백엔드 정보로 보강"""
    try:
        sess = memory_store.get(session_id)
        if not sess:
            raise HTTPException(status_code=404, detail="Session not found")
        
        diagnosis = sess.context.diagnosis
        if not diagnosis:
            raise HTTPException(status_code=400, detail="No diagnosis found in session")
        
        enhanced_data = {}
        
        # 병원 추천 정보
        if include_hospitals:
            hospitals = await analysis_client.get_hospital_recommendations(
                diagnosis=diagnosis,
                location="서울"
            )
            if hospitals:
                enhanced_data['hospitals'] = hospitals
        
        # 질병 상세 정보
        if include_disease_info:
            disease_info = await analysis_client.get_disease_information(diagnosis)
            if disease_info:
                enhanced_data['disease_info'] = disease_info
        
        # 유사 사례
        if include_similar_cases:
            similar_cases = await analysis_client.get_similar_cases(diagnosis)
            if similar_cases:
                enhanced_data['similar_cases'] = similar_cases
        
        return {
            "session_id": session_id,
            "diagnosis": diagnosis,
            "enhanced_data": enhanced_data,
            "success": True
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Context enhancement failed: {e}")
        raise HTTPException(status_code=500, detail=f"Enhancement failed: {str(e)}")


@router.post("/analysis/refine-symptoms")
async def refine_user_symptoms(
    original_text: str,
    session_id: str = None
):
    """사용자 증상 텍스트를 AI 분석 백엔드에서 정제"""
    try:
        context = None
        if session_id:
            sess = memory_store.get(session_id)
            if sess:
                context = sess.context.model_dump()
        
        refined_result = await analysis_client.refine_user_symptoms(
            original_text=original_text,
            context=context
        )
        
        if refined_result:
            return {
                "original_text": original_text,
                "refined_result": refined_result,
                "success": True
            }
        else:
            return {
                "original_text": original_text,
                "error": "Failed to refine symptoms",
                "success": False
            }
            
    except Exception as e:
        logger.error(f"Symptoms refinement failed: {e}")
        raise HTTPException(status_code=500, detail=f"Refinement failed: {str(e)}")


@router.get("/analysis/diagnosis-info/{diagnosis}")
async def get_diagnosis_info(diagnosis: str):
    """진단명으로 AI 분석 백엔드에서 상세 정보 조회"""
    try:
        # 질병 정보
        disease_info = await analysis_client.get_disease_information(diagnosis, detailed=True)
        
        # 병원 추천
        hospitals = await analysis_client.get_hospital_recommendations(diagnosis, location="서울")
        
        # 유사 사례
        similar_cases = await analysis_client.get_similar_cases(diagnosis, limit=3)
        
        return {
            "diagnosis": diagnosis,
            "disease_info": disease_info,
            "recommended_hospitals": hospitals,
            "similar_cases": similar_cases,
            "success": True
        }
        
    except Exception as e:
        logger.error(f"Diagnosis info retrieval failed: {e}")
        raise HTTPException(status_code=500, detail=f"Info retrieval failed: {str(e)}")


@router.post("/chat/with-analysis-enhancement")
async def chat_with_analysis_enhancement(req: ChatRequest):
    """AI 분석 백엔드 정보를 적극 활용한 향상된 채팅"""
    try:
        sess = memory_store.get(req.session_id)
        if not sess:
            raise HTTPException(status_code=404, detail="session not found")
        
        diagnosis = sess.context.diagnosis
        enhanced_context = {}
        
        # 질문 유형에 따라 AI 분석 백엔드에서 관련 정보 조회
        if diagnosis:
            if any(keyword in req.message.lower() for keyword in ["병원", "의원", "진료", "상담"]):
                hospitals = await analysis_client.get_hospital_recommendations(diagnosis, location="서울")
                if hospitals:
                    enhanced_context['hospitals'] = hospitals[:3]
                    
            if any(keyword in req.message.lower() for keyword in ["치료", "치료법", "예방", "관리", "약", "연고"]):
                disease_info = await analysis_client.get_disease_information(diagnosis, detailed=True)
                if disease_info:
                    enhanced_context['treatment_info'] = disease_info
                    
            if any(keyword in req.message.lower() for keyword in ["증상", "비슷", "유사", "다른", "사례"]):
                similar_cases = await analysis_client.get_similar_cases(diagnosis, limit=3)
                if similar_cases:
                    enhanced_context['similar_cases'] = similar_cases
        
        # 향상된 컨텍스트를 포함한 시스템 메시지 생성
        system_context = sess.context.model_dump()
        system_context['ai_enhanced_info'] = enhanced_context
        
        # OpenAI 호출
        messages = build_default_messages(system_context, sess.messages, req.message)
        reply = chat_completion(messages)
        
        # 메시지 저장
        memory_store.add_message(req.session_id, "user", req.message)
        memory_store.add_message(req.session_id, "assistant", reply)
        
        return {
            "session_id": req.session_id,
            "reply": reply,
            "enhanced_with": list(enhanced_context.keys()),
            "success": True
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Enhanced chat failed: {e}")
        raise HTTPException(status_code=500, detail=f"Enhanced chat failed: {str(e)}")
