import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import { fetchChatResponse } from '../../../module/ChatModule';
import { useChatHistory } from './useChatHistory';

/**
 * 채팅 메시지를 관리하는 Hook
 * 
 * 이 Hook은 다음과 같은 일을 합니다:
 * 1. 메시지 목록 관리 (AI와 사용자 메시지)
 * 2. 이미지 첨부 기능
 * 3. 메시지 전송과 응답 처리
 */
export const useMessages = () => {
    const dispatch = useDispatch();

    // 초기 AI 메시지를 위한 고정된 ID와 메시지 설정
    const INITIAL_MESSAGE_ID = '000000000000000000000000';
    const [messages, setMessages] = useState([{
        id: INITIAL_MESSAGE_ID,  // 고정된 ID 사용
        type: 'AI',
        content: '안녕하세요. 센티크입니다. 당신에게 어울리는 향을 찾아드리겠습니다.',
        mode: 'chat',
        isInitialMessage: true, // 초기 메시지 여부 플래그
        style: {
            fontSize: '20px',
            lineHeight: '1.6'
        }
    }]);

    // 채팅 기록 관련 함수와 상태를 가져옴 (채팅 기록 로드, 리셋 등)
    const { chatHistory, loadChatHistory, resetChatHistory } = useChatHistory();

    // 컴포넌트 마운트 시 채팅 기록을 초기화하고 새로 로드
    useEffect(() => {
        // 채팅 기록 초기화 후 새로 로드 (캐시된 데이터 제거)
        resetChatHistory();
        loadChatHistory();
        
        // 컴포넌트 언마운트 시에도 채팅 기록을 초기화 (메모리 누수 방지)
        return () => {
            resetChatHistory();
        };
    }, []);

    // 채팅 기록(chatHistory)이 로드되면 기존 메시지와 합쳐서 상태 업데이트
    useEffect(() => {
        if (chatHistory && chatHistory.length > 0) {
            setMessages(prevMessages => {
                // 기존 메시지 중 초기 메시지를 분리 (항상 상단에 위치)
                const initialMessage = prevMessages.find(msg => msg.isInitialMessage);
                // 초기 메시지를 제외한 나머지 메시지들
                const otherMessages = prevMessages.filter(msg => !msg.isInitialMessage);

                // 기존 메시지의 id 혹은 chatId를 모아둔 Set (중복 제거용)
                const existingIds = new Set(prevMessages.map(msg => msg.chatId || msg.id));
                // 새로운 채팅 기록에서 기존에 없는 메시지만 필터링
                const uniqueMessages = chatHistory
                    .filter(msg => !existingIds.has(msg.chatId || msg.id))
                    // 필요한 경우 데이터 형식을 변환 (예: 사용자 메시지에 imageUrl이 있을 경우)
                    .map(msg => {
                        if (msg.type === 'USER' && msg.imageUrl) {
                            return {
                                ...msg,
                                userImage: msg.imageUrl,       // 클라이언트 모델에 맞게 속성명 변환
                                images: [{ url: msg.imageUrl }] // 이미지 배열 형태로 변환
                            };
                        }
                        return msg;
                    });
                // 기존 사용자 메시지와 새로 추가할 메시지를 합침
                const allRegularMessages = [...otherMessages, ...uniqueMessages];
    
                // 초기 메시지가 존재하면 배열의 맨 앞에 배치하여 항상 최상단에 표시
                return initialMessage ? [initialMessage, ...allRegularMessages] : allRegularMessages;
            });
        }
    }, [chatHistory]);
    
    // 메시지 전송 중 로딩 상태 관리 및 재시도 가능 여부
    const [isLoading, setIsLoading] = useState(false);
    const [retryAvailable, setRetryAvailable] = useState(false);

    // 사용자가 선택한 이미지 파일들을 관리하는 상태
    const [selectedImages, setSelectedImages] = useState([]);

    /**
     * 이미지 업로드 처리 함수
     * - 파일 선택 시 미리보기 URL 생성 후 상태 업데이트
     */
    const handleImageUpload = (e) => {
        const file = e.target.files[0]; // 첫 번째 파일만 선택
        if (file) {
            // 파일 객체로부터 브라우저 내 미리보기 URL 생성
            const newImage = {
                url: URL.createObjectURL(file),
                file: file,      // 실제 파일 객체
                type: file.type, // 파일 타입 (예: image/png)
                name: file.name  // 파일 이름
            };
            // 기존 선택 이미지 대신 새 이미지로 교체
            setSelectedImages([newImage]);
        }
        // 파일 입력 필드를 초기화하여 같은 파일을 다시 선택할 수 있게 함
        e.target.value = '';
    };

    /**
     * 이미지 제거 함수
     * - 선택된 이미지 배열에서 지정한 인덱스의 이미지를 제거
     */
    const handleRemoveImage = (index) => {
        setSelectedImages(prev => prev.filter((_, i) => i !== index));
    };

    /**
     * 메시지 전송 함수
     * 1. 사용자 메시지를 먼저 추가하고
     * 2. 서버에 AI 응답을 요청한 후
     * 3. 응답이 오면 AI 메시지를 추가
     */
    const addMessage = async (content, images = []) => {
        console.log('useMessages에서 받은 데이터:', { content, images });
    
        // 전달할 이미지 파일 추출 (배열의 첫 번째 이미지 사용)
        const imageFile = images?.[0]?.file || null;
        console.log('전달될 이미지 파일:', imageFile);
    
        // 사용자 메시지 객체 생성
        const userMessage = {
            id: new Date().getTime().toString(), // 고유한 ID 생성 (타임스탬프 기반)
            type: 'USER',
            content,
            // 첨부된 이미지가 있을 경우 첫 번째 이미지의 URL을 사용
            userImage: images?.[0]?.url || null,
            // 선택된 모든 이미지를 배열 형태로 저장
            images: images.map(img => ({ 
                url: img.url,
                file: img.file
            })),
            mode: 'chat',
            timestamp: new Date().toISOString() // 메시지 생성 시간 기록
        };
        // 사용자 메시지를 기존 메시지 배열에 추가
        setMessages(prev => [...prev, userMessage]);
    
        // 메시지 전송 상태를 로딩으로 설정
        setIsLoading(true);
        try {
            // 서버에 AI 응답을 요청 (dispatch를 통해 redux action 호출)
            const response = await dispatch(fetchChatResponse(content, imageFile, null));
            console.log('API 응답 전체:', response);
    
            if (response) {
                // 응답을 받은 후, AI 메시지를 상태에 추가
                setMessages(prev => {
                    // 기존 메시지를 복사하여 업데이트할 준비
                    const updatedMessages = [...prev];
    
                    // 동일한 ID를 가진 메시지가 이미 있는지 확인하여 중복 방지
                    const isDuplicate = updatedMessages.some(msg => msg.id === response.id);
                    if (isDuplicate) {
                        console.warn('중복된 AI 메시지 추가 방지:', response.id);
                        return updatedMessages;
                    }
                    // 서버 응답 데이터를 클라이언트 모델에 맞게 변환하여 AI 메시지 객체 생성
                    const aiMessage = {
                        id: response.id,
                        type: 'AI',
                        content: response.content,
                        mode: response.mode || 'chat',
                        imageUrl: response.imageUrl || null, // 서버에서 제공한 이미지 URL
                        lineId: response.lineId || null,
                        recommendations: response.recommendations || null,
                        recommendationType: response.recommendationType || null,
                        timestamp: response.timeStamp || new Date().toISOString()
                    };
    
                    console.log('추가되는 AI 메시지:', aiMessage);
                    // 기존 메시지 배열에 AI 메시지를 추가하여 반환
                    return [...prev, aiMessage];
                });
    
                // 메시지 전송 성공 시 재시도 가능 상태를 해제
                setRetryAvailable(false);
            }
        } catch (error) {
            // 에러 발생 시 콘솔에 출력하고 재시도 가능 상태를 활성화
            console.error('메시지 전송 중 오류:', error);
            setRetryAvailable(true);
        } finally {
            // 로딩 상태를 종료
            setIsLoading(false);
        }
    };

    /**
     * 메시지 재전송 함수
     * - 마지막 메시지가 사용자 메시지일 경우, 해당 메시지와 첨부 이미지로 재시도
     */
    const handleRetry = () => {
        // 재시도 가능 상태이고 마지막 메시지가 사용자 메시지인 경우에만 실행
        if (retryAvailable && messages[messages.length - 1]?.type === 'USER') {
            const lastMessage = messages[messages.length - 1];
            // 마지막 메시지의 내용과 첨부된 이미지(첫 번째)를 이용하여 addMessage 함수 호출
            addMessage(lastMessage.content, lastMessage.images?.[0]);
        }
    };

    // 필요한 상태와 함수들을 반환하여 컴포넌트에서 사용 가능하도록 함
    return {
        messages,
        setMessages,
        isLoading,
        retryAvailable,
        selectedImages,
        setSelectedImages,
        handleImageUpload,
        handleRemoveImage,
        addMessage,
        handleRetry,
        resetChatHistory // 외부에서 채팅 기록 초기화가 필요할 경우 사용
    };
};
