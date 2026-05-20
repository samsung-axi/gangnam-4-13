// 분석 결과 임시 저장소
interface AnalysisResult {
  id: string;
  diagnosis: string;
  confidence_score?: number;
  recommendations?: string;
  similar_conditions?: string;
  summary?: string; // 진단소견 추가
  image?: string;
  timestamp: number;
}

class AnalysisStorage {
  private static instance: AnalysisStorage;
  private currentResult: AnalysisResult | null = null;
  private readonly STORAGE_KEY = 'skinmatch_analysis_result';
  private readonly EXPIRY_TIME = 30 * 60 * 1000; // 30분

  public static getInstance(): AnalysisStorage {
    if (!AnalysisStorage.instance) {
      AnalysisStorage.instance = new AnalysisStorage();
    }
    return AnalysisStorage.instance;
  }

  // 분석 결과 저장
  public saveResult(result: Omit<AnalysisResult, 'timestamp'>): void {
    const resultWithTimestamp: AnalysisResult = {
      ...result,
      timestamp: Date.now()
    };
    
    this.currentResult = resultWithTimestamp;
    
    // sessionStorage에도 저장 (브라우저 새로고침 대응)
    try {
      sessionStorage.setItem(this.STORAGE_KEY, JSON.stringify(resultWithTimestamp));
    } catch (error) {
      console.warn('SessionStorage 저장 실패:', error);
    }
  }

  // 분석 결과 가져오기
  public getResult(): AnalysisResult | null {
    // 메모리에서 먼저 확인
    if (this.currentResult && this.isValid(this.currentResult)) {
      return this.currentResult;
    }

    // sessionStorage에서 확인
    try {
      const stored = sessionStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const result = JSON.parse(stored) as AnalysisResult;
        if (this.isValid(result)) {
          this.currentResult = result;
          return result;
        } else {
          this.clearResult();
        }
      }
    } catch (error) {
      console.warn('SessionStorage 읽기 실패:', error);
      this.clearResult();
    }

    return null;
  }

  // 결과 유효성 검사 (30분 내)
  private isValid(result: AnalysisResult): boolean {
    return Date.now() - result.timestamp < this.EXPIRY_TIME;
  }

  // 분석 결과 삭제
  public clearResult(): void {
    this.currentResult = null;
    try {
      sessionStorage.removeItem(this.STORAGE_KEY);
    } catch (error) {
      console.warn('SessionStorage 삭제 실패:', error);
    }
  }

  // 결과가 있는지 확인
  public hasResult(): boolean {
    return this.getResult() !== null;
  }

  // 결과 ID 생성
  public generateResultId(): string {
    return `analysis_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

export const analysisStorage = AnalysisStorage.getInstance();
export type { AnalysisResult };
