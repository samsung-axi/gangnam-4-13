# AI 피부 진단 챗봇 백엔드 (FastAPI)

## 개요
- **목적**: 피부 분석 결과(진단, 요약, 유사 질환, 정제된 증상)를 세션별 메모리에 저장하고 OpenAI를 활용하여 사용자 질문에 답변
- **기술 스택**: FastAPI, Pydantic, OpenAI Python SDK, 인메모리 세션 저장소 (추후 Redis 연동 가능)

## 실행 방법
```bash
# 필요 조건: Python 3.10+
pip install -r requirements.txt

# .env.example을 참고하여 .env 파일 생성 후 OPENAI_API_KEY 설정
cp .env.example .env

# 서버 시작
uvicorn app.main:app --reload --port 8003
```

## 환경변수 설정 (.env)
```
OPENAI_API_KEY=your_openai_api_key_here
MODEL=gpt-4o-mini
LOG_LEVEL=info
HOST=0.0.0.0
PORT=8003
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
```

<<<<<<< Updated upstream
=======
참고: 이전에 사용하던 `CHILDREN_COLLECTION`/`PARENTS_COLLECTION`는 유지해도 되지만, 
현재 검색 파이프라인은 단일 `MEDICAL_COLLECTION`을 사용합니다.

## 🔗 AI-Analysis-Backend 연동 아키텍처

### 올바른 데이터 플로우
```
사용자 → Frontend(5173) → AI-Analysis-Backend(8001) → 분석 결과
                ↓                                        ↓
        분석 결과 전달                                 분석 완료
                ↓                                        
        Chatbot-Backend(8003) ← 분석 결과 + 사용자 질문
                ↓
        RAG 검색(Qdrant) + OpenAI 답변 생성
                ↓
        Frontend ← 답변 반환
```

### 연동 플로우
1. **Frontend** → **AI-Analysis-Backend**: 이미지 업로드 및 분석 요청
2. **AI-Analysis-Backend**: 이미지 분석 및 결과 반환
3. **Frontend** → **Chatbot-Backend**: 분석 결과로 세션 초기화 (`/session/init-from-analysis`)
4. **Frontend** → **Chatbot-Backend**: 사용자 질문 전송 (`/chat`)
5. **Chatbot-Backend**: 분석 컨텍스트 + RAG + OpenAI로 답변 생성
6. **Frontend**: 답변 표시

>>>>>>> Stashed changes
## API 엔드포인트

### 1) 세션 초기화
**POST** `/api/v1/session/init`
- **요청**: `{ diagnosis, summary, similar_diseases, refined_symptoms }`
- **응답**: `{ session_id, stored: true }`
- **목적**: 분석 결과를 미리 로드하여 챗봇이 기억하도록 함

### 2) 채팅
**POST** `/api/v1/chat`
- **요청**: `{ session_id, message }`
- **응답**: `{ reply, session_id }`
- **기능**: 시스템 프롬프트 + 저장된 분석 컨텍스트 + 이전 대화를 사용하여 OpenAI 호출

### 3) 세션 조회
**GET** `/api/v1/session/{id}`
- **응답**: `{ session_id, context, messages }`

### 4) 세션 리셋
**POST** `/api/v1/session/reset`
- **요청**: `{ session_id }`
- **기능**: 메시지 기록은 지우지만 분석 컨텍스트는 유지

### 5) 분석 결과로 세션 초기화 ⭐
**POST** `/api/v1/session/init-from-analysis`
- **요청**: AI-Analysis-Backend의 SkinDiagnosisResponse 또는 프론트엔드 변환 결과 JSON
- **응답**: `{ session_id }`
- **기능**: 자동 키 매핑 (diagnosis|predicted_disease, recommendations|summary 등)
- **사용법**: 프론트엔드에서 AI 분석 완료 후 이 엔드포인트로 결과 전달

### 6) 컨텍스트 추가
**POST** `/api/v1/session/append-context`
- **쿼리**: `session_id`
- **요청**: `{ diagnosis?, summary?, refined_symptoms?, similar_diseases?[] }`
- **기능**: 기록을 지우지 않고 컨텍스트 필드 병합/업데이트

### 7) 상담 시작 ⭐
**POST** `/api/v1/consult/start`
- **요청**: `{ analysis: <SkinDiagnosisResponse 형태 JSON>, message?: string }`
- **응답**: `{ session_id, reply }`
- **기능**: 원스톱 부트스트랩 - 분석으로부터 세션 생성 및 선택적 첫 질문 답변
- **사용법**: 분석 결과와 첫 질문을 동시에 처리

### 8) 상담 메시지
**POST** `/api/v1/consult/message`
- **요청**: `{ session_id: string, message: string }`
- **응답**: `{ session_id, reply }`
- **기능**: /chat의 편의 래퍼

## 분석 백엔드 컨텍스트 매핑
- `diagnosis`: SkinDiagnosisResponse.diagnosis
- `summary`: SkinDiagnosisResponse.recommendations (또는 파생된 요약)
- `similar_diseases`: SkinDiagnosisResponse.metadata.similar_diseases_scored[] (similar_conditions 문자열로 폴백)
- `refined_symptoms`: UtteranceRefineResponse.refined_text

## 프론트엔드 연동
- `VITE_CHATBOT_API_BASE_URL` 환경변수 추가 (예: http://localhost:8003)
- 분석 완료 시 `/session/init-from-analysis` 또는 `/consult/start`를 호출하고 session_id 보관
- 사용자 질문을 session_id와 함께 `/chat` 또는 `/consult/message`로 라우팅

## 보안
- MVP용으로 CORS가 적용된 공개 엔드포인트 제공
- 추후 인증 서버와 연동하여 JWT (Authorization: Bearer) 추가 예정

## 🧪 테스트

### 기본 테스트 실행
```bash
# 1. 의존성 설치
pip install -r requirements.txt

# 2. 환경 설정 (.env 파일 생성)
cp .env.example .env
# .env 파일에서 필요한 값들 설정

# 3. 서버 실행
uvicorn app.main:app --reload --port 8003

# 4. 통합 테스트 (선택사항)
python test_integration.py
```

### 수동 테스트 예시
```bash
# 1. 분석 결과로 세션 초기화
curl -X POST "http://localhost:8003/api/v1/session/init-from-analysis" \
  -H "Content-Type: application/json" \
  -d '{
    "diagnosis": "아토피 피부염",
    "recommendations": "보습제 사용 및 피부과 상담 권장",
    "similar_diseases": ["습진", "접촉성 피부염"]
  }'

# 2. 채팅 테스트
curl -X POST "http://localhost:8003/api/v1/chat" \
  -H "Content-Type: application/json" \
  -d '{
    "session_id": "your_session_id",
    "message": "이 진단에 대해 자세히 알려주세요"
  }'
```

## 헬스체크
**GET** `/health` → `{ status: "ok", service: "chatbot" }`
