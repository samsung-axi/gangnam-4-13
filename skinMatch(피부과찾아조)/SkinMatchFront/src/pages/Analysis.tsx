import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Typography } from '@/components/ui/theme-typography';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import MarkdownMessage from '@/components/chat/MarkdownMessage';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Camera, TrendingUp, AlertCircle, Info, Loader2, RefreshCw, Clock, MapPin, Phone, Globe, MessageCircle, Send, X, ArrowLeft } from 'lucide-react';
import { aiService, AnalysisResult } from '@/services/aiService';
import { hospitalService, type Hospital } from '@/services/hospitalService';
import { chatbotService } from '@/services/chatbotService';
import { analysisStorage } from '@/utils/analysisStorage';
import { toast } from 'sonner';

const Analysis = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [isLoading, setIsLoading] = useState(true);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isFromStorage, setIsFromStorage] = useState(false);
  // Camera에서 전달된 증상 텍스트 및 정제 결과 상태
  const symptomText: string = location.state?.symptomText || '';
  const [refinedText, setRefinedText] = useState<string | null>(null);
  
  // 챗봇 상태
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatSessionId, setChatSessionId] = useState<string | null>(null);
  const [chatMessages, setChatMessages] = useState<Array<{id: string, text: string, isUser: boolean, timestamp: Date}>>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isBotTyping, setIsBotTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  // 추천 병원 상태 (백엔드 연동)
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  
  // 이전 페이지에서 전달받은 이미지 데이터
  const uploadedImage = location.state?.image || null;
  // 설문/추가정보는 더 이상 사용하지 않음
  const additionalInfo = '';
  const questionnaireData = null;

  useEffect(() => {
    initializeAnalysis();
  }, []);

  const initializeAnalysis = async () => {
    // 먼저 저장된 결과가 있는지 확인
    const storedResult = analysisStorage.getResult();
    
    if (storedResult && !uploadedImage) {
      // 새로운 분석 요청 없이 저장된 결과만 보여주는 경우
      setAnalysisResult(mapStoredToAnalysisResult(storedResult));
      setIsFromStorage(true);
      setIsLoading(false);
      toast.info('저장된 분석 결과를 불러왔습니다.');
      return;
    }

    if (!uploadedImage) {
      // 이미지가 없으면 빈 상태 표시
      setAnalysisResult(null);
      setIsLoading(false);
      return;
    }

    // 새로운 분석 실행
    await performAnalysis();
  };



  // 병원 추천 가져오기 (백엔드)
  const fetchHospitals = async (result: AnalysisResult | null) => {
    try {
      if (!result) {
        setHospitals([]);
        return;
      }
      const diagnosis = result.predicted_disease || '피부과';
      const description = result.summary || result.recommendation;
      const similar = result.similar_diseases?.map(s => s.name) || [];
      const { hospitals: list } = await hospitalService.searchHospitalsByDiagnosis(
        diagnosis,
        description,
        similar,
        2
      );
      setHospitals(list);
    } catch (e) {
      console.error('추천 병원 불러오기 실패:', e);
      setHospitals([]);
    }
  };

  const performAnalysis = async () => {
    try {
      setIsLoading(true);
      setError(null);
      setIsFromStorage(false);

      // AI 백엔드 연결 상태 확인
      const isHealthy = await aiService.healthCheck();
      if (!isHealthy) {
        throw new Error('AI 분석 서비스에 연결할 수 없습니다.');
      }

      // 이미지 분석 실행
      const result = await aiService.analyzeImage({
        image: uploadedImage
      });

      setAnalysisResult(result);
      // 병원 추천 호출
      fetchHospitals(result);
      
      // 증상 텍스트가 있는 경우 자동 정제 호출
      if (symptomText && symptomText.trim().length > 0) {
        try {
          const refined = await aiService.refineUtterance(symptomText.trim(), 'ko');
          setRefinedText(refined && refined.trim().length > 0 ? refined.trim() : null);
        } catch (e) {
          setRefinedText(null);
        }
      } else {
        setRefinedText(null);
      }

      // 분석 결과를 임시 저장
      analysisStorage.saveResult({
        id: analysisStorage.generateResultId(),
        diagnosis: result.predicted_disease || '진단 결과 없음',
        confidence_score: result.confidence,
        recommendations: result.recommendation,
        similar_conditions: result.similar_diseases?.map(d => d.name).join(', '),
        summary: result.summary, // 진단소견 추가
        image: uploadedImage instanceof File ? URL.createObjectURL(uploadedImage) : uploadedImage,
        // 설문/추가정보 저장 제거
      });

      toast.success('분석이 완료되었습니다!');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '분석 중 오류가 발생했습니다.';
      setError(errorMessage);
      toast.error(errorMessage);
      console.error('분석 오류:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // 저장된 결과로 진입한 경우에도 병원 추천 호출
  useEffect(() => {
    if (isFromStorage && analysisResult) {
      fetchHospitals(analysisResult);
    }
  }, [isFromStorage, analysisResult]);

  // 저장된 결과를 AnalysisResult 형태로 변환
  const mapStoredToAnalysisResult = (stored: any): AnalysisResult => {
    return {
      predicted_disease: stored.diagnosis,
      confidence: stored.confidence_score || 0,
      summary: stored.summary || '저장된 분석 결과입니다.',
      recommendation: stored.recommendations || '전문의 상담을 권장합니다.',
      similar_diseases: stored.similar_conditions ? 
        stored.similar_conditions.split(', ').map((name: string, index: number) => ({
          name,
          confidence: Math.max(0, (stored.confidence_score || 0) - (index + 1) * 10),
          description: `${name}와 유사한 증상을 보입니다.`
        })) : []
    };
  };

  // 상위 3개 질환에 대해 softmax temperature 적용 (격차 기반 자동 t 조절)
  const applySoftmaxToTop3 = (mainConfidence: number, similarDiseases: any[], temperature?: number) => {
    // 상위 3개의 confidence 값들을 모음 (인덱스 정합성을 위해 필터링하지 않음)
    const raw = [
      mainConfidence,
      ...(similarDiseases?.slice(0, 2).map(d => d.confidence) || [])
    ];

    // 모두 유효하지 않으면 원본 반환
    if (raw.length === 0) return { main: mainConfidence, similar: similarDiseases };

    // 스케일 자동 감지: 0~1 스케일 또는 0~100 스케일
    const maxRaw = Math.max(...raw.map(v => (Number.isFinite(v) ? v : 0)));
    const isFractionScale = maxRaw <= 1.5; // 1.0 근방이면 fraction으로 판단
    const toProb = (c: number) => {
      const v = Number.isFinite(c) ? c : 0;
      const p = isFractionScale ? v : v / 100;
      return Math.min(1, Math.max(0, p));
    };

    // 메인-2위 격차를 기반으로 temperature 자동 선택 (낮을수록 예리, 높을수록 완화)
    const p0 = toProb(raw[0] ?? 0);
    const p1 = toProb(raw[1] ?? 0); // 유사질환 중 최상위(있다면)
    const gap = Math.max(0, p0 - p1);
    const autoTemperature = (() => {
      if (p0 >= 0.90 && gap >= 0.50) return 0.55;
      if (p0 >= 0.85 && gap >= 0.35) return 0.6;
      if (p0 >= 0.80 && gap >= 0.25) return 0.7;

      // ✅ 이 부분을 추가합니다.
      // 1위 신뢰도가 50% 이상이고 2위와 격차가 어느 정도 있을 때,
      // 온도를 0.9로 설정하여 확률을 완만하게 증폭시킵니다.
      if (p0 >= 0.50 && gap >= 0.10) return 0.7;

      if (p0 >= 0.70 && gap >= 0.15) return 1.0;
      if (gap >= 0.10) return 1.2;
      return 1.4;
    })();
    const usedTemperature = Math.min(1.6, Math.max(0.5, temperature ?? autoTemperature));

    // 각 confidence를 0~1로 정규화 후 temperature 적용
    const logits = raw.map(c => Math.log(Math.max(toProb(c), 0.001))); // p -> log(p), 최소값 보장
    const adjustedLogits = logits.map(logit => logit / usedTemperature); // temperature 적용
    
    // softmax 계산
    const maxLogit = Math.max(...adjustedLogits);
    const expValues = adjustedLogits.map(logit => Math.exp(logit - maxLogit));
    const sumExp = expValues.reduce((sum, val) => sum + val, 0);
    let softmaxValues = expValues.map(val => val / (sumExp || 1));

    // 메인 가중치 살짝 부여하여 체감 신뢰도 상향
    const mainBoost = 1.1; // "조금 더 높게"를 위한 완만한 가중치
    const boosted = softmaxValues.map((v, idx) => (idx === 0 ? v * mainBoost : v));
    const boostedSum = boosted.reduce((a, b) => a + b, 0) || 1;
    softmaxValues = boosted.map(v => v / boostedSum);

    // 100% 기준으로 변환 (반올림)
    const adjustedConfidences = softmaxValues.map(val => Math.round(val * 100));
    // 합이 100이 아니면 마지막 항목을 조정해 합계 보정
    const total = adjustedConfidences.reduce((a, b) => a + b, 0);
    if (total !== 100 && adjustedConfidences.length > 0) {
      const diff = 100 - total;
      adjustedConfidences[adjustedConfidences.length - 1] = Math.max(
        0,
        adjustedConfidences[adjustedConfidences.length - 1] + diff
      );
    }
    
    return {
      main: adjustedConfidences[0] ?? mainConfidence,
      similar: (similarDiseases?.slice(0, 2) || []).map((disease, idx) => ({
        ...disease,
        confidence: adjustedConfidences[idx + 1] ?? disease.confidence
      }))
    };
  };

  // 분석 결과가 있을 때 softmax temperature 적용한 값들 계산
  const adjustedResults = analysisResult ? applySoftmaxToTop3(
    analysisResult.confidence, 
    analysisResult.similar_diseases || []
  ) : null;

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'text-green-600 bg-green-50 border-green-200 hover:bg-green-100 transition-colors duration-200';
    if (confidence >= 60) return 'text-yellow-600 bg-yellow-50 border-yellow-200 hover:bg-yellow-100 transition-colors duration-200';
    return 'text-red-600 bg-red-50 border-red-200 hover:bg-red-100 transition-colors duration-200';
  };

  const getImageUrl = () => {
    // 저장된 결과에서 온 경우
    if (isFromStorage) {
      const storedResult = analysisStorage.getResult();
      return storedResult?.image || '/placeholder.svg';
    }
    
    // 새로운 분석인 경우
    if (uploadedImage instanceof File) {
      return URL.createObjectURL(uploadedImage);
    }
    
    // 업로드된 이미지가 있는 경우
    if (uploadedImage) {
      return uploadedImage;
    }
    
    // 기본 플레이스홀더
    return '/placeholder.svg';
  };

  // 새로운 분석 시작
  const startNewAnalysis = () => {
    analysisStorage.clearResult();
    navigate('/camera');
  };

  // 챗봇 메시지 전송
  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    const text = newMessage;
    const userMessage = { id: Date.now().toString(), text, isUser: true, timestamp: new Date() };
    setChatMessages(prev => [...prev, userMessage]);
    setNewMessage('');
    setIsBotTyping(true);

    try {
      // 세션이 없으면 즉시 생성하면서 첫 질문까지 처리
      if (!chatSessionId) {
        const analysisPayload = (() => {
          if (analysisResult) {
            return {
              diagnosis: analysisResult.predicted_disease,
              recommendations: analysisResult.recommendation,
              summary: analysisResult.summary,
              similar_diseases: analysisResult.similar_diseases?.map(s => s.name),
              refined_text: refinedText || undefined,
            };
          }
          const stored = analysisStorage.getResult();
          if (stored) {
            return {
              diagnosis: stored.diagnosis,
              recommendations: stored.recommendations,
              summary: stored.summary,
              similar_diseases: (stored.similar_conditions || '').split(',').map((s: string) => s.trim()).filter(Boolean),
              refined_text: refinedText || undefined,
            };
          }
          return null;
        })();

        if (analysisPayload) {
          const res = await chatbotService.startConsult(analysisPayload, text);
          setChatSessionId(res.session_id);
          const botMessage = { id: (Date.now() + 1).toString(), text: res.reply || '상담을 시작했습니다. 질문을 이어서 해주세요.', isUser: false, timestamp: new Date() };
          setChatMessages(prev => [...prev, botMessage]);
          return;
        } else {
          throw new Error('상담을 시작할 분석 컨텍스트가 없습니다.');
        }
      }

      // 기존 세션이 있으면 일반 메시지 전송
      const { reply } = await chatbotService.sendMessage(chatSessionId, text);
      const botMessage = { id: (Date.now() + 1).toString(), text: reply, isUser: false, timestamp: new Date() };
      setChatMessages(prev => [...prev, botMessage]);
    } catch (e: any) {
      const botMessage = { id: (Date.now() + 1).toString(), text: '상담 서비스 연결에 실패했습니다. 잠시 후 다시 시도해주세요.', isUser: false, timestamp: new Date() };
      setChatMessages(prev => [...prev, botMessage]);
      console.error('Chat error:', e);
    } finally {
      setIsBotTyping(false);
    }
  };

  // AI 상담 창을 열 때 챗봇 세션 생성(한 번만)
  useEffect(() => {
    const bootstrapConsult = async () => {
      if (!isChatOpen || chatSessionId) return;
      try {
        setIsBotTyping(true);
        const healthy = await chatbotService.healthCheck();
        if (!healthy) {
          console.warn('Chatbot service is not healthy');
          return;
        }

        // 분석 결과 기반 컨텍스트 구성
        const analysis = (() => {
          if (analysisResult) {
            return {
              diagnosis: analysisResult.predicted_disease,
              recommendations: analysisResult.recommendation,
              summary: analysisResult.summary,
              similar_diseases: analysisResult.similar_diseases?.map(s => s.name),
              refined_text: refinedText || undefined,
            };
          }
          const stored = analysisStorage.getResult();
          if (stored) {
            return {
              diagnosis: stored.diagnosis,
              recommendations: stored.recommendations,
              summary: stored.summary,
              similar_diseases: (stored.similar_conditions || '').split(',').map((s: string) => s.trim()).filter(Boolean),
              refined_text: refinedText || undefined,
            };
          }
          return null;
        })();

        if (!analysis) return;
        const res = await chatbotService.startConsult(analysis);
        setChatSessionId(res.session_id);
        if (res.reply) {
          setChatMessages(prev => [
            ...prev,
            { id: (Date.now() + 1).toString(), text: res.reply!, isUser: false, timestamp: new Date() }
          ]);
        }
      } catch (e) {
        console.error('Failed to start consult:', e);
      } finally {
        setIsBotTyping(false);
      }
    };
    bootstrapConsult();
  }, [isChatOpen, analysisResult, refinedText]);

  // 메시지 추가/타이핑 상태 변경 시 자동 스크롤
  useEffect(() => {
    if (!isChatOpen) return;
    // 다음 프레임에서 스크롤하여 레이아웃 반영 후 이동
    const id = window.requestAnimationFrame(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
    });
    return () => window.cancelAnimationFrame(id);
  }, [chatMessages, isBotTyping, isChatOpen]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && !isBotTyping) {
      e.preventDefault();
      sendMessage();
    }
  };

  // 로딩 상태
  if (isLoading) {
    return (
      <div className="min-h-screen p-4 flex items-center justify-center bg-[hsl(280_60%_92%)]">
        <div className="text-center">
          <Loader2 className="w-16 h-16 mx-auto mb-4 animate-spin text-black" />
          <h2 className="text-2xl font-bold text-black mb-2">AI 분석 중...</h2>
          <p className="text-gray-600">잠시만 기다려주세요.</p>
        </div>
      </div>
    );
  }

  // 에러 상태 또는 결과 없음
  if (error) {
    return (
      <div className="min-h-screen bg-white p-4 pt-20 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-8 h-8 text-black" />
          </div>
          <h2 className="text-2xl font-bold text-black mb-4">분석에 실패했습니다</h2>
          <p className="text-gray-600 mb-6 leading-relaxed">{error}</p>
          <div className="space-y-3">
            <Button 
              onClick={performAnalysis} 
              disabled={!uploadedImage}
              variant="iosTint"
              size="lg"
              className="w-full h-12 text-lg"
            >
              <RefreshCw className="w-5 h-5 mr-2 relative z-10" />
              <span className="relative z-10">다시 시도</span>
            </Button>
            <Button 
              onClick={startNewAnalysis}
              variant="ios"
              size="lg"
              className="w-full h-12 text-lg"
            >
              <Camera className="w-5 h-5 mr-2 relative z-10" />
              <span className="relative z-10">새 사진 촬영</span>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  

  return (
    <div className="min-h-screen p-4 pt-20 bg-[hsl(280_60%_92%)]">
      <div className="max-w-4xl mx-auto">
        {/* 헤더 */}
        <div className="mb-8">
          <div className="text-center space-y-2">
            <Typography variant="h2" className="text-black">
              피부 분석 결과
            </Typography>
            <Typography variant="body" className="text-gray-600">
              AI가 분석한 환부의 상태입니다
            </Typography>
          </div>
        </div>

        {/* 사용자 업로드 이미지와 예상 질환 */}
        <Card className="mb-6 overflow-hidden">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* 업로드된 사진 */}
              <div className="space-y-4 flex flex-col">
                <h2 className="text-xl font-semibold mb-3 mx-[13px] my-0">분석 이미지</h2>
                <div className="liquid-glass rounded-2xl overflow-hidden flex-grow">
                  <div className="w-full h-full flex items-center justify-center relative overflow-hidden">
                    <img
                      src={getImageUrl()}
                      alt="분석 이미지"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        // 이미지 로드 실패시 placeholder 표시
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        const parent = target.parentElement;
                        if (parent) {
                          parent.innerHTML = `
                            <div class="flex flex-col items-center justify-center text-gray-400 w-full h-full">
                              <div class="w-16 h-16 mb-2">📷</div>
                              <p class="text-sm">이미지 로드 실패</p>
                            </div>
                          `;
                        }
                      }}
                    />
                    <div className="absolute top-3 left-3">
                      <Badge className="bg-black text-white">
                        {uploadedImage ? '환부 촬영' : '샘플 이미지'}
                      </Badge>
                    </div>
                    {/* chips removed per request */}
                  </div>
                </div>
              </div>

              {/* 예상 질환명과 점수 + 진단소견 */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold mb-3">분석 결과</h2>
                
                <div className="liquid-glass rounded-xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-lg">예상 질환</h3>
                    <Badge className="bg-gray-100 text-black border-gray-300 hover:bg-gray-200 transition-colors duration-200">
                      {adjustedResults?.main ?? analysisResult.confidence}% 일치
                    </Badge>
                  </div>
                  <p className="text-2xl font-bold text-black mb-2">
                    {analysisResult.predicted_disease}
                  </p>
                  
                  {/* 신뢰도 바 */}
<div className="mb-4">
  <div className="flex justify-between items-center mb-2">
    <span className="text-sm text-gray-600">신뢰도</span>
    <span className="font-semibold">{adjustedResults?.main ?? analysisResult.confidence}%</span>
  </div>
  <div className="w-full bg-gray-200 rounded-full h-2">
    <div 
      className="bg-blue-500 h-2 rounded-full transition-all duration-500" 
      style={{ width: `${adjustedResults?.main ?? analysisResult.confidence}%` }}
    ></div>
  </div>
</div>


                  {(adjustedResults?.main ?? analysisResult.confidence) < 70 && (
                    <div className="flex items-center gap-2 text-gray-700 text-sm p-3 rounded-lg bg-white/20 backdrop-blur-sm border border-white/30">
                      <AlertCircle className="w-4 h-4" />
                      <span>정확한 진단을 위해 전문의 상담을 권장합니다</span>
                    </div>
                  )}
                </div>

                {/* 진단 소견 */}
                <div className="liquid-glass rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Info className="w-4 h-4 text-black" />
                    <h3 className="font-semibold text-lg">진단 소견</h3>
                  </div>
                  <p className="text-gray-700 leading-relaxed mb-4 text-sm">
                    {analysisResult.summary}
                  </p>
                  <div className="rounded-lg p-3 bg-white/20 backdrop-blur-sm border border-white/30">
                    {refinedText ? (
                      <>
                        <p className="text-xs font-semibold text-gray-700 mb-1">의사에게는 이렇게 말하세요!</p>
                        <p className="text-sm text-gray-800 whitespace-pre-wrap">{refinedText}</p>
                      </>
                    ) : (
                      <p className="text-sm text-gray-600">{analysisResult.recommendation}</p>
                    )}
                  </div>
                </div>

                {/* 정제 결과 카드는 하단 영역에서 표시합니다 */}
              </div>
            </div>
          </CardContent>
        </Card>

      {/* 유사질환 박스 */}
{analysisResult.similar_diseases && analysisResult.similar_diseases.length > 0 && (
  <Card className="mb-8">
    <CardContent className="p-6">
      <div className="mb-4">
        <h2 className="text-xl font-semibold">유사질환</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {(adjustedResults?.similar || analysisResult.similar_diseases || []).slice(0, 2).map((item, index) => {
          const adjustedConfidence = item.confidence;
          const circleRadius = 18; // 그래프 크기
          const circleCircumference = 2 * Math.PI * circleRadius;
          const progress = (adjustedConfidence / 100) * circleCircumference;

          return (
            <div
              key={index}
              className="liquid-glass rounded-xl p-4 transition-all duration-200"
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium text-gray-800">{item.name}</h3>

                {/* 퍼센트 + 원형 그래프 + 신뢰도 */}
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600 font-sans">신뢰도</span>
                  <div className="relative w-12 h-12 flex-shrink-0">
                    <svg className="w-12 h-12">
                      <circle
                        className="text-gray-200"
                        strokeWidth="3"
                        stroke="currentColor"
                        fill="transparent"
                        r={circleRadius}
                        cx="24"
                        cy="24"
                      />
                      <circle
                        className="text-blue-500"
                        strokeWidth="3"
                        stroke="currentColor"
                        fill="transparent"
                        r={circleRadius}
                        cx="24"
                        cy="24"
                        strokeDasharray={circleCircumference}
                        strokeDashoffset={circleCircumference - progress}
                        strokeLinecap="round"
                        transform="rotate(-90 24 24)"
                      />
                    </svg>
                    <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-gray-800">
                      {adjustedConfidence}%
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-sm text-gray-600 leading-relaxed">{item.description}</p>
            </div>
          );
        })}
      </div>
    </CardContent>
  </Card>
)}


        {/* 병원 추천 */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="mb-4">
              <h2 className="text-xl font-semibold">추천 병원</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {hospitals.map((hospital, index) => (
                <div key={index} className="liquid-glass rounded-xl p-4 transition-all duration-200">
                  {/* 병원명과 배지 - 세로로 배치하여 공간 확보 */}
                  <div className="mb-3">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-gray-800 text-lg leading-tight pr-2 flex-1">
                        {hospital.name}
                      </h3>
                      <Badge variant="outline" className="text-xs bg-gray-100 text-black border-gray-300 whitespace-nowrap flex-shrink-0">
                        전문병원
                      </Badge>
                    </div>
                  </div>
                  
                  {/* 병원 정보들 - 각 라인별로 충분한 공간 확보 */}
                  <div className="space-y-3 mb-4">
                    <div className="flex items-start gap-3">
                      <MapPin className="w-4 h-4 text-gray-500 mt-1 flex-shrink-0" />
                      <span className="text-sm text-gray-600 leading-relaxed break-words flex-1">
                        {hospital.address}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <Phone className="w-4 h-4 text-gray-500 flex-shrink-0" />
                      <a href={`tel:${hospital.phone}`} className="text-sm text-black hover:underline break-all">
                        {hospital.phone}
                      </a>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <Globe className="w-4 h-4 text-gray-500 flex-shrink-0" />
                      <a 
                        href={hospital.website || '#'} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-sm text-black hover:underline truncate"
                      >
                        병원 웹사이트
                      </a>
                    </div>
                  </div>
                  
                  {/* 전문 분야 박스 */}
                  <div className="rounded-lg p-3 bg-white/20 backdrop-blur-sm border border-white/30">
                    <p className="text-xs text-gray-500 mb-1">전문 분야</p>
                    <p className="text-sm font-medium text-gray-700 leading-relaxed break-words">
                      {Array.isArray(hospital.specialties) ? hospital.specialties.join(', ') : ''}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        

        {/* 분석 관련 버튼들 */}
        <div className="mt-6 flex justify-center gap-3 flex-wrap">
          <Button 
            onClick={startNewAnalysis}
            size="lg"
            variant="ios"
            className="w-40"
          >
            <Camera className="w-5 h-5 relative z-10" />
            <span className="relative z-10">새 사진 분석</span>
          </Button>

          {/* 챗봇 버튼 (수동 오픈) */}
          <Dialog open={isChatOpen} onOpenChange={(v) => { if (!v) setIsChatOpen(false); }}>
            <Button 
              size="lg"
              variant="iosTint"
              className="w-40 relative overflow-hidden"
              onClick={() => setIsChatOpen(true)}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-gray-100/10 to-gray-200/10"></div>
              <MessageCircle className="w-5 h-5 relative z-10" />
              <span className="relative z-10">AI 상담</span>
            </Button>
            
            <DialogContent className="max-w-lg h-[90vh] flex flex-col p-0 liquid-glass">
              <DialogHeader className="p-4 border-b border-white/40 backdrop-blur-sm">
                <DialogTitle className="flex items-center gap-2">
                  <MessageCircle className="w-5 h-5 text-black" />
                  피부 분석 상담 챗봇
                </DialogTitle>
              </DialogHeader>
              
              {/* 채팅 메시지 영역 */}
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {chatMessages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] px-4 py-3 rounded-2xl ${
                          message.isUser
                            ? 'bg-gradient-to-r from-[hsl(222_89%_60%)] to-[hsl(259_94%_61%)] text-white shadow-md'
                            : 'bg-white text-gray-900 border border-black/10 shadow-md'
                        }`}
                      >
                        {message.isUser ? (
                          <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                        ) : (
                          <div className="text-sm">
                            <MarkdownMessage content={message.text} />
                          </div>
                        )}
                        <span className="text-xs opacity-70 mt-1 block">
                          {message.timestamp.toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </span>
                      </div>
                    </div>
                  ))}
                  {/* AI 타이핑 인디케이터 (카톡 스타일, 텍스트 제거) */}
                  {isBotTyping && (
                    <div className="flex justify-start">
                      <div className="px-3 py-2 rounded-2xl bg-white text-gray-800 border border-black/10 shadow-md">
                        <div className="flex items-center gap-1">
                          <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce" style={{animationDelay: '0ms'}} />
                          <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce" style={{animationDelay: '120ms'}} />
                          <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce" style={{animationDelay: '240ms'}} />
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>
              
              {/* 메시지 입력 영역 */}
              <div className="p-4 border-t border-white/40 backdrop-blur-sm">
                <div className="flex gap-2 items-center">
                  <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={isBotTyping ? 'AI가 답변을 생성하고 있어요...' : '궁금한 점을 물어보세요...'}
                    className="flex-1 bg-white/80 backdrop-blur-sm border border-black rounded-full h-11 px-4 text-sm focus:outline-none focus:ring-0 focus-visible:ring-0 focus:ring-offset-0 focus-visible:ring-offset-0"
                  />
                  <button
                    onClick={sendMessage}
                    disabled={!newMessage.trim() || isBotTyping}
                    className={`h-11 w-11 rounded-full flex items-center justify-center text-white shadow-md transition ${(!newMessage.trim() || isBotTyping) ? 'opacity-50 cursor-not-allowed' : 'hover:brightness-95'} bg-gradient-to-r from-[hsl(222_89%_60%)] to-[hsl(259_94%_61%)]`}
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* 저장된 결과 안내 */}
        {isFromStorage && (
          <div className="mt-4 p-3 bg-gray-100 rounded-xl border border-gray-300">
            <p className="text-sm text-gray-700 text-center flex items-center justify-center gap-2">
              <Clock className="w-4 h-4" />
              이 결과는 30분간 임시 저장됩니다. 새로운 분석을 원하시면 '새 사진 분석'을 클릭하세요.
            </p>
          </div>
        )}

        {/* 더미 데이터 안내 제거 */}

        {/* 정제 결과는 진단 소견 카드 내에서 조건부 표시됩니다 */}
      </div>
    </div>
  );
};

export default Analysis;
