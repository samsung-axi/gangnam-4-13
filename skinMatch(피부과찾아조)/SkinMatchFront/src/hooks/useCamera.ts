import { useState, useRef, useCallback, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { cameraService } from '@/services/cameraService';

interface CameraConfig {
  facingMode: 'user' | 'environment';
  width?: number;
  height?: number;
}

interface DeviceInfo {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isIOS: boolean;
  isAndroid: boolean;
  supportsCamera: boolean;
}

interface FaceDetectionResult {
  detected: boolean;
  confidence: number;
  face_count: number;
  ready_for_capture: boolean;
  feedback: string;
}

interface CountdownState {
  isActive: boolean;
  remaining: number;
  total: number;
}

export const useCamera = () => {
  const location = useLocation();
  const [isActive, setIsActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo | null>(null);
  const [faceDetection, setFaceDetection] = useState<FaceDetectionResult | null>(null);
  const [countdown, setCountdown] = useState<CountdownState>({
    isActive: false,
    remaining: 0,
    total: 3
  });
  const [isConnected, setIsConnected] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const sessionIdRef = useRef<string | null>(null);
  const detectionIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // 디바이스 정보 감지
  const detectDevice = useCallback((): DeviceInfo => {
    const userAgent = navigator.userAgent.toLowerCase();
    const isIOS = /iphone|ipad|ipod/.test(userAgent);
    const isAndroid = /android/.test(userAgent);
    const isMobile = isIOS || isAndroid || /mobile/.test(userAgent);
    const isTablet = /tablet|ipad/.test(userAgent) || (isAndroid && !/mobile/.test(userAgent));
    const isDesktop = !isMobile && !isTablet;
    
    return {
      isMobile,
      isTablet,
      isDesktop,
      isIOS,
      isAndroid,
      supportsCamera: 'mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices
    };
  }, []);

  // WebSocket 연결
  const connectWebSocket = useCallback((sessionId: string) => {
    // 기존 연결이 있으면 먼저 정리
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }

    const wsUrl = cameraService.getWebSocketUrl(sessionId);
    console.log('Connecting to WebSocket:', wsUrl);
    
    const ws = new WebSocket(wsUrl);
    
    ws.onopen = () => {
      console.log('Camera WebSocket connected successfully');
      setIsConnected(true);
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log('WebSocket message received:', data);
        
        switch (data.type) {
          case 'face_detection_result':
            setFaceDetection({
              detected: data.detected,
              confidence: data.confidence,
              face_count: data.face_count,
              ready_for_capture: data.ready_for_capture,
              feedback: data.feedback
            });
            break;

          case 'countdown_started':
            console.log('Countdown started:', data.duration);
            setCountdown({
              isActive: true,
              remaining: data.duration,
              total: data.duration
            });
            break;

          case 'countdown_tick':
            setCountdown(prev => ({
              ...prev,
              remaining: data.remaining
            }));
            break;

          case 'countdown_stopped':
            setCountdown(prev => ({
              ...prev,
              isActive: false
            }));
            break;

          case 'capture_command':
            console.log('Capture command received');
            capturePhoto();
            setCountdown(prev => ({
              ...prev,
              isActive: false
            }));
            break;

          case 'error':
            // 일부 에러는 무시 (pong 관련 에러 등)
            if (data.message && data.message.includes('pong')) {
              console.warn('Ignoring pong-related error:', data.message);
            } else {
              console.error('WebSocket error:', data.message);
              setError(data.message);
            }
            break;

          case 'ping':
            // Ping 응답
            console.log('Received ping, sending pong');
            ws.send(JSON.stringify({ type: 'pong' }));
            break;
            
          case 'pong':
            // Pong 응답 (서버에서 ping에 대한 응답)
            console.log('Received pong from server');
            break;

          case 'connected':
            console.log('WebSocket connection confirmed');
            break;

          default:
            console.warn('Unknown WebSocket message type:', data.type);
            break;
        }
      } catch (err) {
        console.error('Failed to parse WebSocket message:', err);
      }
    };

    ws.onclose = (event) => {
      console.log('Camera WebSocket disconnected:', event.code, event.reason);
      setIsConnected(false);
      
      // 정상 종료가 아니고 카메라가 활성 상태일 때만 재연결 시도
      if (event.code !== 1000 && event.code !== 1001 && sessionIdRef.current && isActive) {
        console.log('Attempting to reconnect WebSocket in 5 seconds...');
        setTimeout(() => {
          if (sessionIdRef.current && isActive) {
            connectWebSocket(sessionIdRef.current);
          }
        }, 5000);
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket connection error:', error);
      setError('실시간 얼굴 감지 연결에 실패했습니다. 서버 상태를 확인해주세요.');
      setIsConnected(false);
    };

    wsRef.current = ws;
  }, [isActive]); // isActive 의존성 추가

  // 얼굴 감지 프레임 전송
  const sendFrameForDetection = useCallback(() => {
    if (!videoRef.current || !canvasRef.current || !wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      return;
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return;

    // 비디오 프레임을 캔버스에 그리기
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0);

    // Base64로 변환해서 WebSocket으로 전송
    const imageData = canvas.toDataURL('image/jpeg', 0.8);
    
    wsRef.current.send(JSON.stringify({
      type: 'face_detection',
      image: imageData
    }));
  }, []);

  // 카메라 시작
  const startCamera = useCallback(async (config?: CameraConfig) => {
    try {
      setError(null);
      const device = detectDevice();
      setDeviceInfo(device);

      if (!device.supportsCamera) {
        throw new Error('이 기기는 카메라를 지원하지 않습니다');
      }

      console.log('Starting camera with device info:', device);

      // 플랫폼별 카메라 설정
      const constraints: MediaStreamConstraints = {
        video: device.isDesktop ? {
          // 웹: 전면 카메라 (얼굴 인식용)
          facingMode: 'user',
          width: { ideal: 1280, min: 640 },
          height: { ideal: 720, min: 480 }
        } : {
          // 모바일: 후면 카메라
          facingMode: 'environment',
          width: { ideal: 1920, min: 1280 },
          height: { ideal: 1080, min: 720 }
        },
        audio: false
      };

      console.log('Requesting camera access with constraints:', constraints);

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      console.log('Camera stream obtained:', stream);
      
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        
        // 비디오 로드 대기
        await new Promise((resolve, reject) => {
          if (videoRef.current) {
            videoRef.current.onloadedmetadata = () => {
              console.log('Video metadata loaded successfully');
              resolve(undefined);
            };
            videoRef.current.onerror = (e) => {
              console.error('Video loading error:', e);
              reject(new Error('비디오 로드 실패'));
            };
            
            // 타임아웃 설정 (5초)
            setTimeout(() => {
              reject(new Error('비디오 로드 타임아웃'));
            }, 5000);
          } else {
            reject(new Error('Video element not found'));
          }
        });

        // 비디오 재생 시작
        try {
          await videoRef.current.play();
          console.log('Video playback started');
        } catch (playError) {
          console.error('Video play error:', playError);
          // 자동 재생 실패는 사용자 상호작용 후 재시도 가능
        }
      }

      setIsActive(true);
      console.log('Camera activated successfully');

      // 세션 ID 생성 및 WebSocket 연결 (웹에서만)
      if (device.isDesktop) {
        const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        sessionIdRef.current = sessionId;
        connectWebSocket(sessionId);

        // 실시간 얼굴 감지 시작
        if (!detectionIntervalRef.current) {
          // 약간의 지연 후 시작 (비디오 안정화 대기)
          setTimeout(() => {
            detectionIntervalRef.current = setInterval(sendFrameForDetection, 200); // 5fps
          }, 1000);
        }
      }

    } catch (err: any) {
      console.error('Camera start error:', err);
      
      let errorMessage = '카메라에 접근할 수 없습니다';
      
      if (err.name === 'NotAllowedError') {
        errorMessage = '카메라 권한이 거부되었습니다. 브라우저 설정에서 카메라 권한을 허용해주세요.';
      } else if (err.name === 'NotFoundError') {
        errorMessage = '카메라를 찾을 수 없습니다. 카메라가 연결되어 있는지 확인해주세요.';
      } else if (err.name === 'NotReadableError') {
        errorMessage = '카메라가 다른 프로그램에서 사용 중입니다.';
      } else if (err.name === 'OverconstrainedError') {
        errorMessage = '요청한 카메라 설정을 지원하지 않습니다.';
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
    }
  }, [detectDevice, connectWebSocket, sendFrameForDetection]);

  // 카메라 중지
  const stopCamera = useCallback(() => {
    console.log('Stopping camera...');
    
    // 세션 ID 정리 (재연결 방지)
    sessionIdRef.current = null;
    
    // 얼굴 감지 인터벌 정리
    if (detectionIntervalRef.current) {
      clearInterval(detectionIntervalRef.current);
      detectionIntervalRef.current = null;
      console.log('Face detection interval cleared');
    }

    // WebSocket 연결 종료 (강제 종료)
    if (wsRef.current) {
      if (wsRef.current.readyState === WebSocket.OPEN || wsRef.current.readyState === WebSocket.CONNECTING) {
        wsRef.current.close(1000, 'User stopped camera'); // 정상 종료 코드
      }
      wsRef.current = null;
      console.log('WebSocket connection closed');
    }

    // 미디어 스트림 중지
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => {
        track.stop();
        console.log(`Track stopped: ${track.kind} - ${track.label}`);
      });
      streamRef.current = null;
      console.log('Media stream stopped');
    }

    // 비디오 요소 정리
    if (videoRef.current) {
      videoRef.current.srcObject = null;
      videoRef.current.load(); // 비디오 요소 완전 리셋
      console.log('Video element cleared');
    }

    // 상태 초기화
    setIsActive(false);
    setIsConnected(false);
    setFaceDetection(null);
    setCountdown({ isActive: false, remaining: 0, total: 3 });
    setError(null);
    
    console.log('Camera stopped successfully');
  }, []);

  // 사진 촬영
  const capturePhoto = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) {
      setError('촬영할 수 없습니다');
      return;
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return;

    // 고해상도로 캔버스 설정
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    // 비디오 프레임 캡처
    ctx.drawImage(video, 0, 0);
    
    // Base64 이미지로 변환
    const imageData = canvas.toDataURL('image/jpeg', 0.95);
    setCapturedImage(imageData);
    
    // 카메라 중지
    stopCamera();
  }, [stopCamera]);

  // 수동 촬영 (모바일용)
  const manualCapture = useCallback(() => {
    if (deviceInfo?.isDesktop) {
      // 웹에서는 얼굴 감지 결과에 따라 처리
      if (faceDetection?.ready_for_capture) {
        // 이미 준비된 상태면 바로 촬영
        capturePhoto();
      } else {
        setError('얼굴을 인식할 수 없습니다. 다시 시도해주세요.');
      }
    } else {
      // 모바일에서는 바로 촬영
      capturePhoto();
    }
  }, [deviceInfo, faceDetection, capturePhoto]);

  // 파일에서 이미지 설정
  const setImageFromFile = useCallback((imageData: string) => {
    setCapturedImage(imageData);
    stopCamera(); // 카메라 중지
  }, [stopCamera]);

  // 재촬영
  const retake = useCallback(() => {
    setCapturedImage(null);
    setError(null);
    startCamera();
  }, [startCamera]);

  // 컴포넌트 언마운트 시 정리
  useEffect(() => {
    return () => {
      console.log('Camera hook cleanup - stopping camera and WebSocket');
      stopCamera();
    };
  }, [stopCamera]);

  // 페이지 이동 감지 및 정리
  useEffect(() => {
    const handleBeforeUnload = () => {
      console.log('Page unload - stopping camera');
      stopCamera();
    };

    const handleVisibilityChange = () => {
      if (document.hidden && isActive) {
        console.log('Page hidden - stopping camera');
        stopCamera();
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isActive, stopCamera]);

  // 라우트 변경 감지 - Camera 페이지를 벗어날 때 카메라 중지
  useEffect(() => {
    return () => {
      // 페이지가 변경될 때 (카메라 페이지를 벗어날 때) 카메라 중지
      if (location.pathname !== '/camera' && isActive) {
        console.log('Route changed - stopping camera');
        stopCamera();
      }
    };
  }, [location.pathname, isActive, stopCamera]);

  return {
    // 상태
    isActive,
    error,
    capturedImage,
    deviceInfo,
    faceDetection,
    countdown,
    isConnected,
    
    // 참조
    videoRef,
    canvasRef,
    
    // 메서드
    startCamera,
    stopCamera,
    capturePhoto,
    manualCapture,
    retake,
    setImageFromFile,
    
    // 유틸리티
    detectDevice
  };
};
