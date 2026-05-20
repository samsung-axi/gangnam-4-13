// src/services/integratedService.ts
import { aiService, AnalysisResult } from './aiService';
import { hospitalService, Hospital, HospitalSearchResponse } from './hospitalService';

export interface IntegratedAnalysisRequest {
  image: File | string;
  additional_info?: string;
  questionnaire_data?: Record<string, string>;
  location?: {
    latitude?: number;
    longitude?: number;
    address?: string;
  };
}

export interface IntegratedAnalysisResult {
  // AI 분석 결과
  aiAnalysis: AnalysisResult;
  // 추천 병원 목록
  recommendedHospitals: Hospital[];
  // 메타 정보
  meta: {
    searchStrategy: 'ai_diagnosis' | 'natural_query' | 'fallback';
    timing: {
      aiAnalysis: number; // ms
      hospitalSearch: number; // ms
      total: number; // ms
    };
  };
}

class IntegratedService {
  /**
   * AI 분석과 병원 검색을 통합 실행
   */
  async analyzeAndSearchHospitals(request: IntegratedAnalysisRequest): Promise<IntegratedAnalysisResult> {
    const startTime = performance.now();
    
    try {
      // 1. AI 분석 실행
      console.log('🔬 AI 피부 분석 시작...');
      const aiStartTime = performance.now();
      
      const aiAnalysis = await aiService.analyzeImage({
        image: request.image,
        additional_info: request.additional_info,
        questionnaire_data: request.questionnaire_data
      });
      
      const aiElapsed = performance.now() - aiStartTime;
      console.log(`✅ AI 분석 완료: ${aiElapsed.toFixed(0)}ms`);
      
      // 2. AI 분석 결과를 바탕으로 병원 검색
      console.log('🏥 병원 검색 시작...');
      const hospitalStartTime = performance.now();
      
      let hospitalSearchResult: HospitalSearchResponse;
      let searchStrategy: 'ai_diagnosis' | 'natural_query' | 'fallback' = 'ai_diagnosis';
      
      try {
        // AI 진단 결과 기반 병원 검색
        const similarDiseases = aiAnalysis.similar_diseases?.map(d => d.name) || [];
        
        console.log('🔍 Hospital-Location-Backend 검색 요청 데이터:', {
          diagnosis: aiAnalysis.predicted_disease,
          description: aiAnalysis.summary,
          similarDiseases: similarDiseases,
          confidence: aiAnalysis.confidence
        });
        
        hospitalSearchResult = await hospitalService.searchHospitalsByDiagnosis(
          aiAnalysis.predicted_disease,
          aiAnalysis.summary,
          similarDiseases,
          2 // 최대 2개 병원
        );
        
        console.log(`✅ AI 진단 기반 병원 검색 완료: ${hospitalSearchResult.hospitals.length}개 병원`);
        console.log('🏥 검색된 병원 목록:', hospitalSearchResult.hospitals.map(h => ({
          name: h.name,
          specialties: h.specialties,
          address: h.address
        })));
        
      } catch (error) {
        console.warn('❌ AI 진단 기반 검색 실패, 자연어 쿼리로 시도:', error);
        searchStrategy = 'natural_query';
        
        try {
          // 자연어 쿼리로 병원 검색
          const query = `${aiAnalysis.predicted_disease} 피부과 병원 추천`;
          hospitalSearchResult = await hospitalService.searchHospitalsByQuery(query, 5);
          
          console.log(`✅ 자연어 쿼리 병원 검색 완료: ${hospitalSearchResult.hospitals.length}개 병원`);
          
        } catch (fallbackError) {
          console.warn('자연어 쿼리 검색도 실패, 기본 검색으로 시도:', fallbackError);
          searchStrategy = 'fallback';
          
          // 기본 피부과 검색
          hospitalSearchResult = await hospitalService.searchHospitals({
            specialties: ['피부과'],
            limit: 5,
            sortBy: 'rating'
          });
          
          console.log(`✅ 기본 병원 검색 완료: ${hospitalSearchResult.hospitals.length}개 병원`);
        }
      }
      
      const hospitalElapsed = performance.now() - hospitalStartTime;
      const totalElapsed = performance.now() - startTime;
      
      console.log(`🎉 통합 분석 완료: 총 ${totalElapsed.toFixed(0)}ms`);
      
      return {
        aiAnalysis,
        recommendedHospitals: hospitalSearchResult.hospitals,
        meta: {
          searchStrategy,
          timing: {
            aiAnalysis: Math.round(aiElapsed),
            hospitalSearch: Math.round(hospitalElapsed),
            total: Math.round(totalElapsed)
          }
        }
      };
      
    } catch (error) {
      console.error('통합 분석 중 오류 발생:', error);
      throw error;
    }
  }

  /**
   * 병원 백엔드 연결 상태 확인
   */
  async checkHospitalBackendStatus(): Promise<{
    isConnected: boolean;
    status?: any;
    error?: string;
  }> {
    try {
      const status = await hospitalService.checkBackendHealth();
      return {
        isConnected: true,
        status
      };
    } catch (error) {
      return {
        isConnected: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * 전체 시스템 상태 확인 (AI + Hospital Backend)
   */
  async checkSystemHealth(): Promise<{
    ai: { isConnected: boolean; error?: string };
    hospital: { isConnected: boolean; status?: any; error?: string };
    overall: 'healthy' | 'degraded' | 'down';
  }> {
    const [aiHealth, hospitalHealth] = await Promise.allSettled([
      aiService.healthCheck(),
      this.checkHospitalBackendStatus()
    ]);

    const ai = {
      isConnected: aiHealth.status === 'fulfilled' ? aiHealth.value : false,
      error: aiHealth.status === 'rejected' ? aiHealth.reason?.message : undefined
    };

    const hospital = hospitalHealth.status === 'fulfilled' 
      ? hospitalHealth.value 
      : { isConnected: false, error: hospitalHealth.reason?.message };

    let overall: 'healthy' | 'degraded' | 'down';
    if (ai.isConnected && hospital.isConnected) {
      overall = 'healthy';
    } else if (ai.isConnected || hospital.isConnected) {
      overall = 'degraded';
    } else {
      overall = 'down';
    }

    return { ai, hospital, overall };
  }

  /**
   * 특정 병원의 상세 정보를 AI 분석 결과와 함께 반환
   */
  async getHospitalWithAnalysisContext(
    hospitalId: number, 
    aiAnalysis: AnalysisResult
  ): Promise<{
    hospital: Hospital;
    matchingReasons: string[];
    relevanceScore: number;
  }> {
    try {
      const hospital = await hospitalService.getHospitalDetail(hospitalId);
      
      // AI 분석 결과와 병원 전문분야 매칭도 계산
      const matchingReasons: string[] = [];
      let relevanceScore = 0;

      // 진단명과 병원 전문분야 매칭
      const diagnosis = aiAnalysis.predicted_disease.toLowerCase();
      const hospitalSpecialties = hospital.specialties.map(s => s.toLowerCase());
      
      if (hospitalSpecialties.some(specialty => 
        diagnosis.includes(specialty) || specialty.includes(diagnosis)
      )) {
        matchingReasons.push(`${aiAnalysis.predicted_disease} 전문 치료 가능`);
        relevanceScore += 40;
      }

      // 유사 질환과 매칭
      if (aiAnalysis.similar_diseases) {
        const similarMatches = aiAnalysis.similar_diseases.filter(similar =>
          hospitalSpecialties.some(specialty =>
            similar.name.toLowerCase().includes(specialty) ||
            specialty.includes(similar.name.toLowerCase())
          )
        );
        
        if (similarMatches.length > 0) {
          matchingReasons.push(`관련 질환(${similarMatches[0].name}) 치료 경험`);
          relevanceScore += 20;
        }
      }

      // 병원 평점 보너스
      if (hospital.rating >= 4.5) {
        matchingReasons.push('높은 평점 (4.5★ 이상)');
        relevanceScore += 15;
      }

      // 거리 보너스
      const distance = parseFloat(hospital.distance.replace('km', ''));
      if (distance <= 2) {
        matchingReasons.push('가까운 거리 (2km 이내)');
        relevanceScore += 10;
      }

      // 예약 가능 보너스
      if (hospital.reservationAvailable) {
        matchingReasons.push('온라인 예약 가능');
        relevanceScore += 5;
      }

      return {
        hospital,
        matchingReasons,
        relevanceScore: Math.min(relevanceScore, 100) // 최대 100점
      };
      
    } catch (error) {
      console.error('병원 상세 정보 조회 실패:', error);
      throw error;
    }
  }
}

export const integratedService = new IntegratedService();
export default integratedService;
