import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Typography } from '@/components/ui/theme-typography';
import { Upload, RotateCcw, AlertCircle, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { useCamera } from '@/hooks/useCamera';

const Camera = () => {
  const navigate = useNavigate();

  // useCamera 훅 사용
  const {
    isActive,
    error,
    capturedImage,
    deviceInfo,
    faceDetection,
    countdown,
    isConnected,
    videoRef,
    canvasRef,
    startCamera,
    stopCamera,
    capturePhoto,
    manualCapture,
    retake,
    setImageFromFile
  } = useCamera();

  // 디버깅용 - 컴포넌트 마운트 시 디바이스 정보 출력
  useEffect(() => {
    console.log('Camera component mounted');
    console.log('Device info:', deviceInfo);
    console.log('Is camera active:', isActive);
    console.log('Error:', error);
  }, [deviceInfo, isActive, error]);

  // 컴포넌트 언마운트 시 카메라 정지
  useEffect(() => {
    return () => {
      console.log('Camera component unmounting - stopping camera');
      if (isActive) {
        stopCamera();
      }
    };
  }, [isActive, stopCamera]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = e => {
        const imageUrl = e.target?.result as string;
        setImageFromFile(imageUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  const isComplete = capturedImage !== null;
  const [symptomText, setSymptomText] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);

  const readFileAsDataURL = (file: File) =>
    new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = e => resolve((e.target?.result as string) || '');
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const handleDrop: React.DragEventHandler<HTMLDivElement> = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      try {
        const dataUrl = await readFileAsDataURL(file);
        setImageFromFile(dataUrl);
        toast.success('이미지를 불러왔습니다.');
      } catch (err) {
        console.error('드래그 앤 드롭 실패:', err);
        toast.error('이미지 불러오기에 실패했습니다.');
      }
    }
  };

  // 사용자 피드백 메시지 렌더링
  const renderFeedbackMessage = () => {
    if (!isActive) return null;
    if (deviceInfo?.isDesktop) {
      // 웹에서는 얼굴 감지 상태 표시
      return (
        <div className="text-center p-4 bg-white rounded-xl mb-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-center mb-2">
            <div className={`w-2 h-2 rounded-full mr-2 ${isConnected ? 'animate-pulse bg-black' : 'bg-gray-400'}`} />
            <span className="text-sm font-sans text-black">
              {isConnected ? 'AI 얼굴 감지 연결됨' : '연결 중...'}
            </span>
          </div>
          
          <p className="font-medium mb-2 font-sans text-black">
            {countdown.isActive ? `자동 촬영까지 ${countdown.remaining}초` : '얼굴을 인식하고 있습니다'}
          </p>
          
          <p className="text-sm font-sans text-gray-600">
            {faceDetection?.feedback || '카메라 앞에 얼굴을 위치시켜 주세요'}
          </p>
          
          {faceDetection && (
            <div className="mt-2 text-xs text-gray-400">
              감지된 얼굴: {faceDetection.face_count}개 | 
              신뢰도: {(faceDetection.confidence * 100).toFixed(1)}%
            </div>
          )}
        </div>
      );
    } else {
      // 모바일에서는 수동 촬영 안내
      return (
        <div className="text-center p-4 bg-white rounded-xl mb-6 shadow-sm border border-gray-200">
          <p className="font-medium mb-2 font-sans text-black">
            환부를 프레임 안에 맞춰주세요
          </p>
          <p className="text-sm font-sans text-gray-600">
            아래 촬영 버튼을 눌러 사진을 찍어주세요
          </p>
        </div>
      );
    }
  };

  return (
    <div className="min-h-screen p-6 pt-20 bg-[hsl(280_60%_92%)]">

    <div className="max-w-2xl mx-auto">
        {/* 헤더 */}
        <div className="mb-10">
          <div className="text-center space-y-3">
            <h1 className="text-3xl font-bold font-sans text-black">
              환부 촬영
            </h1>
            <p className="font-sans text-gray-600">
              정확한 분석을 위해 환부를 정면에서 촬영해주세요
            </p>
          </div>
        </div>

        {/* 진행 상황 */}
        <div className="flex justify-center mb-10">
          <div className="flex items-center">
            
          </div>
        </div>

        {!isComplete ? (
          /* 촬영 화면 */
          <div className="mb-8 overflow-hidden">
            <div
              className={`aspect-[4/3] relative flex items-center justify-center overflow-hidden rounded-2xl liquid-glass ${isDragOver ? 'ring-2 ring-black' : ''}`}
              onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
              onDragLeave={(e) => { e.preventDefault(); setIsDragOver(false); }}
              onDrop={handleDrop}
            >
              {/* 실제 카메라 비디오 스트림 */}
              <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                muted 
                className={`absolute inset-0 w-full h-full object-cover transform ${isActive ? 'block' : 'hidden'}`} 
                style={{
                  transform: deviceInfo?.isDesktop ? 'scaleX(-1)' : 'none' // 전면 카메라 미러링
                }} 
                onError={e => {
                  console.error('Video error:', e);
                  toast.error('비디오 스트림 오류가 발생했습니다');
                }} 
                onLoadedMetadata={() => {
                  console.log('Video metadata loaded');
                  if (videoRef.current) {
                    console.log('Video dimensions:', videoRef.current.videoWidth, 'x', videoRef.current.videoHeight);
                  }
                }} 
              />
              <canvas ref={canvasRef} className="hidden" width="1280" height="720" />
              
              {/* 카메라가 비활성 상태일 때 */}
              {!isActive && (
                <div className="absolute inset-0 grid place-items-center">
                  <div className="flex flex-col items-center gap-3 text-center">
                    <div className={`w-16 h-16 rounded-full border-2 ${isDragOver ? 'border-black bg-black/5' : 'border-white/30 bg-white/30'} backdrop-blur-sm flex items-center justify-center`}>
                      <Upload className={`w-7 h-7 ${isDragOver ? 'text-black' : 'text-gray-500'}`} />
                    </div>
                    <p className="text-black font-medium font-sans">이미지 끌어다 놓기</p>
                  </div>
                </div>
              )}

              {/* 웹에서의 얼굴 감지 가이드라인 */}
              {deviceInfo?.isDesktop && isActive && (
                <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                  <div className="w-72 h-72 border-2 border-dashed border-black/40 rounded-2xl flex items-center justify-center bg-white/5 backdrop-blur-sm">
                    <div className="text-center">
                      {countdown.isActive ? (
                        <div className="bg-black/90 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4 border border-white/50">
                          <span className="text-3xl font-bold text-white">{countdown.remaining}</span>
                        </div>
                      ) : (
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-300">
                          <div className="w-8 h-8 rounded bg-gray-400"></div>
                        </div>
                      )}
                      
                      <div className="bg-white/95 rounded-lg p-4 border border-gray-200 max-w-xs shadow-sm">
                        <p className="text-black font-medium mb-1 font-sans">
                          {countdown.isActive ? '촬영 준비 중...' : '얼굴 인식 중'}
                        </p>
                        <p className="text-sm text-gray-500 font-sans">
                          {faceDetection?.feedback || '얼굴을 카메라 앞에 위치시켜 주세요'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 모바일에서의 촬영 가이드 */}
              {!deviceInfo?.isDesktop && isActive && (
                <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                  <div className="w-80 h-80 border-2 border-dashed border-black/40 rounded-2xl flex items-center justify-center bg-white/5 backdrop-blur-sm">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-300">
                        <div className="w-8 h-8 rounded bg-gray-400"></div>
                      </div>
                      <div className="bg-white/95 rounded-lg p-4 border border-gray-200 shadow-sm">
                        <p className="text-black font-medium mb-1 font-sans">
                          환부를 프레임 안에 맞춰주세요
                        </p>
                        <p className="text-sm text-gray-500 font-sans">
                          촬영 버튼을 눌러 사진을 찍어주세요
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* 촬영 완료 미리보기 */
          <div className="mb-8">
            <div className="p-6">
              <h2 className="text-xl font-bold text-center mb-6 text-black font-sans">촬영 완료</h2>
              <div className="flex justify-center mb-6">
                <div className="relative group max-w-xs">
                  <div className="aspect-square liquid-glass rounded-2xl overflow-hidden">
                    <div className="w-full h-full flex items-center justify-center relative overflow-hidden">
                      <img src={capturedImage} alt="촬영된 이미지" className="w-full h-full object-cover rounded-xl" />
                      <div className="absolute top-3 left-3">
                        <Badge className="bg-black text-white text-sm font-sans">
                          환부 촬영
                        </Badge>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="absolute top-3 right-3 bg-white/70 backdrop-blur-sm hover:bg-white border-white/40 text-black font-sans" 
                        onClick={retake}
                      >
                        <RotateCcw className="w-4 h-4 mr-1" />
                        재촬영
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-500 font-sans">
                  환부가 선명하게 촬영되었는지 확인해주세요
                </p>
              </div>
            </div>
          </div>
        )}

        {/* 에러 메시지 */}
        {error && (
          <div className="mb-4 p-4 bg-gray-50 border border-gray-300 rounded-lg flex items-start">
            <AlertCircle className="w-5 h-5 text-black mr-2 mt-0.5" />
            <div>
              <p className="text-black text-sm font-medium font-sans">{error}</p>
              <p className="text-gray-600 text-xs mt-1 font-sans">
                문제가 지속되면 페이지를 새로고침하거나 브라우저 설정에서 카메라 권한을 확인해주세요.
              </p>
            </div>
          </div>
        )}

        {/* 디버깅 정보 제거 */}

        {/* 상태 메시지 */}
        {renderFeedbackMessage()}

        {/* 액션 버튼 */}
        <div className="space-y-4">
          {!isComplete ? (
            <>
              {!isActive ? (
                <Button 
                  variant="iosTint"
                  size="lg"
                  className="w-full h-12 text-lg"
                  onClick={() => {
    console.log('Camera start button clicked');
    startCamera();
  }}
>
  카메라 시작
</Button>
              ) : !deviceInfo?.isDesktop ? (
                // 모바일: 수동 촬영 버튼
                <Button 
                  variant="iosTint"
                  size="lg"
                  className="w-full h-12 text-lg"
                  onClick={() => {
                    console.log('Manual capture button clicked');
                    manualCapture();
                  }} 
                  disabled={countdown.isActive}
                >
                  {countdown.isActive ? `촬영까지 ${countdown.remaining}초` : '촬영하기'}
                </Button>
              ) : (
                // 웹에서 카메라 활성 시 중지 버튼 추가
                <Button 
                  variant="iosOutline"
                  size="lg"
                  className="w-full h-12 text-lg" 
                  onClick={() => {
                    console.log('Stop camera button clicked');
                    stopCamera();
                  }}
                >
                  카메라 중지
                </Button>
              )}
              
              {/* 파일 업로드는 모든 플랫폼에서 사용 가능 */}
              {!countdown.isActive && (
                <>
                  {/* '또는' 구분 텍스트 제거 */}
                  
                  <Button 
                    variant="liquid"
                    size="lg"
                    className="w-full h-12 text-lg"
                    onClick={() => document.getElementById('file-input')?.click()}
                  >
                    <Upload className="w-5 h-5" />
                    <span className="text-lg">갤러리에서 선택</span>
                  </Button>


                  
                  <input id="file-input" type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
                </>
              )}
            </>
          ) : (
            <div className="space-y-3">
              {/* 증상 입력 필드: 분석 버튼 위에 배치 */}
              <div className="p-4 liquid-glass rounded-xl">
                <label className="block text-sm font-medium text-black mb-2">증상 설명</label>
                <textarea
                  value={symptomText}
                  onChange={(e) => setSymptomText(e.target.value)}
                  rows={3}
                  placeholder="최근 증상, 기간, 통증/가려움 정도, 악화/완화 요인을 적어주세요. (선택)"
                  className="w-full p-3 rounded-lg text-sm bg-white/20 backdrop-blur-md border border-white/30 text-black placeholder-black/60 focus:outline-none focus:ring-2 focus:ring-black/30 focus:border-white/50"
                />
              </div>

             <Button 
               variant="iosTint"
               size="lg"
               className="w-full h-12 text-lg"
               onClick={() => navigate('/analysis', {
    state: {
      image: capturedImage,
      symptomText: symptomText
    }
  })}
>
  <span className="relative z-10">바로 분석하기</span>
</Button>

            </div>
          )}
          
          {/* 재촬영 버튼 (촬영 완료 시에만 표시) */}
          {isComplete && (
            <Button 
              variant="liquid"
              size="lg"
              className="w-full h-12 text-lg mt-3"
              onClick={() => {
                console.log('Retake button clicked');
                retake();
              }}
>
  <RotateCcw className="w-5 h-5 mr-2" />
  <span>다시 촬영하기</span>
</Button>
          )}
        </div>
        
        {/* 촬영 가이드 */}
        <div className="mt-8 p-4 liquid-glass rounded-xl">
          <h3 className="font-medium text-black mb-2 font-sans">촬영 가이드</h3>
          <ul className="text-sm text-gray-600 space-y-1 font-sans">
            <li>• 충분한 조명이 있는 곳에서 촬영해주세요</li>
            <li>• 환부가 선명하게 보이도록 가까이서 촬영해주세요</li>
            <li>• 손이나 그림자로 가리지 않도록 주의해주세요</li>
            {deviceInfo?.isDesktop && <li>• 얼굴이 인식되면 자동으로 3초 후 촬영됩니다</li>}
            {!deviceInfo?.isDesktop && <li>• 후면 카메라로 고화질 촬영이 진행됩니다</li>}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Camera;
