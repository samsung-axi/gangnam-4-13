"""
분석 백엔드 API 클라이언트
AI-Analysis-Backend(포트 8001)와 통신하여 분석 결과 조회 및 추가 정보 요청
"""

import httpx
import asyncio
import logging
from typing import Optional, Dict, Any, List

# 로깅 설정
logger = logging.getLogger(__name__)

class AnalysisAPIClient:
    """AI-Analysis-Backend API 클라이언트"""
    
    def __init__(self, base_url: str = "http://localhost:8001"):
        self.base_url = base_url.rstrip('/')
        self.timeout = 30.0
        self.max_retries = 3
        
    async def health_check(self) -> bool:
        """분석 백엔드 서버 상태 확인"""
        try:
            async with httpx.AsyncClient(timeout=5.0) as client:
                response = await client.get(f"{self.base_url}/health")
                return response.status_code == 200
        except Exception as e:
            logger.warning(f"Analysis backend health check failed: {e}")
            return False

    async def get_analysis_by_id(self, analysis_id: str) -> Optional[Dict[str, Any]]:
        """
        분석 ID로 결과 조회
        
        Args:
            analysis_id: 분석 ID
            
        Returns:
            분석 결과 또는 None
        """
        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                response = await client.get(
                    f"{self.base_url}/api/v1/analysis/{analysis_id}"
                )
                
                if response.status_code == 200:
                    return response.json()
                else:
                    logger.warning(f"Analysis lookup failed: {response.status_code}")
                    
        except Exception as e:
            logger.error(f"Analysis lookup error: {e}")
            
        return None

    async def get_hospital_recommendations(
        self, 
        diagnosis: str, 
        location: Optional[str] = None,
        specialty: Optional[str] = None
    ) -> Optional[List[Dict[str, Any]]]:
        """
        진단 결과를 기반으로 병원 추천 요청
        
        Args:
            diagnosis: 진단명
            location: 위치 정보
            specialty: 전문과목
            
        Returns:
            병원 목록 또는 None
        """
        try:
            params = {"diagnosis": diagnosis}
            if location:
                params["location"] = location
            if specialty:
                params["specialty"] = specialty
                
            async with httpx.AsyncClient(timeout=self.timeout) as client:
                response = await client.get(
                    f"{self.base_url}/api/v1/hospitals/recommend",
                    params=params
                )
                
                if response.status_code == 200:
                    result = response.json()
                    hospitals = result.get('hospitals', [])
                    logger.info(f"Retrieved {len(hospitals)} hospital recommendations")
                    return hospitals
                else:
                    logger.warning(f"Hospital API returned {response.status_code}: {response.text}")
                    
        except Exception as e:
            logger.error(f"Hospital recommendation API error: {e}")
            
        return None

    async def refine_user_symptoms(
        self, 
        original_text: str,
        context: Optional[Dict[str, Any]] = None
    ) -> Optional[Dict[str, Any]]:
        """
        사용자 증상 텍스트 정제 요청
        
        Args:
            original_text: 원본 증상 텍스트
            context: 추가 컨텍스트 정보
            
        Returns:
            정제된 증상 또는 None
        """
        try:
            data = {"original_text": original_text}
            if context:
                data["context"] = context
            
            async with httpx.AsyncClient(timeout=self.timeout) as client:
                response = await client.post(
                    f"{self.base_url}/api/v1/symptoms/refine",
                    json=data
                )
                
                if response.status_code == 200:
                    result = response.json()
                    logger.info("Symptoms refined successfully")
                    return result
                else:
                    logger.warning(f"Symptoms API returned {response.status_code}: {response.text}")
                    
        except Exception as e:
            logger.error(f"Symptoms refine API error: {e}")
            
        return None

    async def get_disease_information(
        self,
        diagnosis: str,
        detailed: bool = True
    ) -> Optional[Dict[str, Any]]:
        """
        질병 상세 정보 요청
        
        Args:
            diagnosis: 진단명
            detailed: 상세 정보 포함 여부
            
        Returns:
            질병 정보 또는 None
        """
        try:
            params = {"diagnosis": diagnosis, "detailed": detailed}
            
            async with httpx.AsyncClient(timeout=self.timeout) as client:
                response = await client.get(
                    f"{self.base_url}/api/v1/diseases/info",
                    params=params
                )
                
                if response.status_code == 200:
                    result = response.json()
                    logger.info(f"Retrieved disease information for: {diagnosis}")
                    return result
                else:
                    logger.warning(f"Disease info API returned {response.status_code}: {response.text}")
                    
        except Exception as e:
            logger.error(f"Disease information API error: {e}")
            
        return None

    async def get_similar_cases(
        self,
        diagnosis: str,
        symptoms: Optional[List[str]] = None,
        limit: int = 5
    ) -> Optional[List[Dict[str, Any]]]:
        """
        유사 사례 조회
        
        Args:
            diagnosis: 진단명
            symptoms: 증상 리스트
            limit: 최대 결과 수
            
        Returns:
            유사 사례 리스트 또는 None
        """
        try:
            data = {
                "diagnosis": diagnosis,
                "limit": limit
            }
            if symptoms:
                data["symptoms"] = symptoms
            
            async with httpx.AsyncClient(timeout=self.timeout) as client:
                response = await client.post(
                    f"{self.base_url}/api/v1/cases/similar",
                    json=data
                )
                
                if response.status_code == 200:
                    result = response.json()
                    cases = result.get('similar_cases', [])
                    logger.info(f"Retrieved {len(cases)} similar cases")
                    return cases
                else:
                    logger.warning(f"Similar cases API returned {response.status_code}: {response.text}")
                    
        except Exception as e:
            logger.error(f"Similar cases API error: {e}")
            
        return None

    async def enhance_diagnosis_context(
        self,
        session_context: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        세션 컨텍스트를 AI 분석 백엔드의 추가 정보로 보강
        
        Args:
            session_context: 기존 세션 컨텍스트
            
        Returns:
            보강된 컨텍스트
        """
        enhanced_context = session_context.copy()
        diagnosis = session_context.get('diagnosis', '')
        
        if not diagnosis:
            return enhanced_context
        
        try:
            # 병원 추천 정보 추가
            hospitals = await self.get_hospital_recommendations(
                diagnosis=diagnosis,
                location="서울"  # 기본값, 추후 사용자 위치 활용
            )
            if hospitals:
                enhanced_context['recommended_hospitals'] = hospitals[:3]  # 상위 3개

            # 질병 상세 정보 추가
            disease_info = await self.get_disease_information(diagnosis)
            if disease_info:
                enhanced_context['disease_details'] = disease_info

            # 유사 사례 추가
            similar_cases = await self.get_similar_cases(
                diagnosis=diagnosis,
                symptoms=session_context.get('refined_symptoms', '').split(',') if session_context.get('refined_symptoms') else None
            )
            if similar_cases:
                enhanced_context['similar_cases'] = similar_cases

            logger.info(f"Enhanced context for diagnosis: {diagnosis}")
            
        except Exception as e:
            logger.error(f"Failed to enhance diagnosis context: {e}")
            
        return enhanced_context


# 싱글톤 인스턴스
_client_instance: Optional[AnalysisAPIClient] = None

def get_analysis_client(base_url: str = None) -> AnalysisAPIClient:
    """분석 클라이언트 싱글톤 인스턴스 반환"""
    global _client_instance
    if _client_instance is None:
        if base_url is None:
            from app.core.config import settings
            base_url = settings.ANALYSIS_BACKEND_URL
        _client_instance = AnalysisAPIClient(base_url)
    return _client_instance


async def test_connection():
    """연결 테스트용 함수"""
    client = get_analysis_client()
    is_healthy = await client.health_check()
    print(f"Analysis Backend Health: {'✅ OK' if is_healthy else '❌ Failed'}")
    return is_healthy


if __name__ == "__main__":
    # 테스트 실행
    asyncio.run(test_connection())
