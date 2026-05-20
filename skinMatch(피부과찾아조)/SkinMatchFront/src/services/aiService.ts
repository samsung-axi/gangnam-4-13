// src/services/aiService.ts
import { API_ENDPOINTS } from '@/utils/constants';

const AI_API_BASE_URL = import.meta.env.VITE_AI_API_BASE_URL || 'http://localhost:8001';

export interface AnalysisRequest {
  image: File | string;
  additional_info?: string;
  questionnaire_data?: Record<string, string>;
}

export interface AnalysisResult {
  predicted_disease: string;
  confidence: number;
  summary: string;
  recommendation: string;
  similar_diseases?: Array<{
    name: string;
    confidence: number;
    description: string;
  }>;
}

export interface RefineUtteranceResponse {
  refined_text?: string;
  data?: { refined_text?: string };
}

export interface SkinDiagnosisRequest {
  image_data: string; // base64 encoded image
  user_symptoms?: string;
  age?: number;
  gender?: string;
  questionnaire_data?: Record<string, string>;
}

class AIService {
  private baseURL: string;

  constructor() {
    this.baseURL = AI_API_BASE_URL;
  }

  // 이미지를 base64로 변환
  private async fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        // "data:image/jpeg;base64," 부분을 제거하고 순수 base64만 반환
        const base64 = result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = (error) => reject(error);
    });
  }

  // 일반 분석 API 호출 (기존 엔드포인트 활용)
  async analyzeImage(request: AnalysisRequest): Promise<AnalysisResult> {
    try {
      // FormData 생성
      const formData = new FormData();
      
      // 이미지 처리
      if (request.image instanceof File) {
        formData.append('image', request.image);
      } else {
        // base64 문자열을 Blob으로 변환
        const base64Data = request.image.includes(',') ? request.image.split(',')[1] : request.image;
        const byteCharacters = atob(base64Data);
        const byteNumbers = new Array(byteCharacters.length);
        
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: 'image/jpeg' });
        formData.append('image', blob, 'uploaded_image.jpg');
      }

      // 추가 정보
      if (request.additional_info) {
        formData.append('additional_info', request.additional_info);
      }

      // 설문조사 데이터 (JSON 문자열로 전송)
      if (request.questionnaire_data && Object.keys(request.questionnaire_data).length > 0) {
        formData.append('questionnaire_data', JSON.stringify(request.questionnaire_data));
      }

      const response = await fetch(`${this.baseURL}${API_ENDPOINTS.AI.SKIN_DIAGNOSIS}`, {
        method: 'POST',
        body: formData, // FormData는 Content-Type 헤더를 자동으로 설정
      });

      if (!response.ok) {
        throw new Error(`AI 분석 실패: ${response.status}`);
      }

      const data = await response.json();
      return this.convertBackendResponse(data);
    } catch (error) {
      console.error('AI 분석 중 오류 발생:', error);
      throw error;
    }
  }

  // 백엔드 응답을 프론트엔드 형식으로 변환
  private convertBackendResponse(backendData: any): AnalysisResult {
    console.log('백엔드 응답 데이터:', backendData); // 디버깅용
    
    // 백엔드가 이미 구조화된 JSON을 보내는 경우 (새 버전)
    if (backendData.predicted_disease && backendData.confidence !== undefined) {
      return {
        predicted_disease: backendData.predicted_disease,
        confidence: backendData.confidence,
        summary: backendData.summary || '진단 소견이 제공되지 않았습니다.',
        recommendation: backendData.recommendation || '전문의와 상담하시기 바랍니다.',
        similar_diseases: backendData.similar_diseases || []
      };
    }
    
    // 백엔드가 XML 형식으로 응답하는 경우 (이전 버전 호환성)
    const result = backendData.result || '';
    
    // 간단한 XML 파싱 (정규식 사용)
    const labelMatch = result.match(/<label id_code="(\d+)" score="([^"]+)">([^<]+)<\/label>/);
    const summaryMatch = result.match(/<summary>([^<]+)<\/summary>/);
    const similarLabelsMatch = result.match(/<similar_labels>(.*?)<\/similar_labels>/s);
    
    let similar_diseases: Array<{ name: string; confidence: number; description: string }> = [];
    
    if (similarLabelsMatch) {
      const similarLabelRegex = /<similar_label id_code="(\d+)" score="([^"]+)">([^<]+)<\/similar_label>/g;
      let match;
      while ((match = similarLabelRegex.exec(similarLabelsMatch[1])) !== null) {
        similar_diseases.push({
          name: match[3],
          confidence: parseFloat(match[2]) || 0,
          description: `유사한 피부 질환입니다.`
        });
      }
    }

    return {
      predicted_disease: labelMatch ? labelMatch[3] : '진단 불가',
      confidence: labelMatch ? parseFloat(labelMatch[2]) || 0 : 0,
      summary: summaryMatch ? summaryMatch[1] : '분석 결과를 가져올 수 없습니다.',
      recommendation: '※ 해당 결과는 AI 진단이므로 정확한 진단은 근처 병원에 방문하여 받아보시길 바랍니다.',
      similar_diseases: similar_diseases
    };
  }

  // 피부 진단 API 호출
  async diagnoseSkin(request: SkinDiagnosisRequest): Promise<AnalysisResult> {
    try {
      const response = await fetch(`${this.baseURL}${API_ENDPOINTS.AI.SKIN_DIAGNOSIS}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error(`피부 진단 실패: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('피부 진단 중 오류 발생:', error);
      throw error;
    }
  }

  // 텍스트 분석 API 호출
  async analyzeText(text: string): Promise<any> {
    try {
      const response = await fetch(`${this.baseURL}${API_ENDPOINTS.AI.TEXT_ANALYSIS}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        throw new Error(`텍스트 분석 실패: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('텍스트 분석 중 오류 발생:', error);
      throw error;
    }
  }

  // 텍스트 정제 API 호출
  async refineUtterance(text: string, language?: string): Promise<string | null> {
    try {
      const response = await fetch(`${this.baseURL}${API_ENDPOINTS.AI.TEXT_ANALYSIS}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, language }),
      });
      if (!response.ok) {
        return null;
      }
      const data: RefineUtteranceResponse = await response.json();
      const refined = data.refined_text || data.data?.refined_text || '';
      return refined.trim().length > 0 ? refined : null;
    } catch (error) {
      console.error('텍스트 정제 중 오류 발생:', error);
      return null;
    }
  }

  // AI 백엔드 헬스체크
  async healthCheck(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseURL}/`);
      return response.ok;
    } catch (error) {
      console.error('AI 백엔드 연결 실패:', error);
      return false;
    }
  }
}

export const aiService = new AIService();
export default aiService;
