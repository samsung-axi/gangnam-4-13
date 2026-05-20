# Caesar MCP 프로젝트

시저 팀의 MCP(Model Context Protocol) 기반 통합 에이전트 시스템입니다.

## 프로젝트 구조

```
Caesar/
├── agent_core/          # 에이전트 코어 (팀원 담당)
│   ├── agent.py         # ReactAgent 구현
│   └── workflow.py      # LangGraph 워크플로우
├── mcp_servers/         # MCP 서버 모듈
│   ├── google_drive_server.py
│   ├── google_calendar_server.py
│   ├── notion_server.py
│   └── slack_server.py
├── tools/               # MCP → Tool 변환
│   ├── mcp_adapter.py   # MCP Adapter
│   ├── tool_registry.py # Tool 레지스트리
│   └── rag_tool.py      # RAG Tool
├── rag/                 # RAG 시스템
│   ├── vector_store.py  # 벡터 스토어
│   └── retriever.py     # 검색 및 생성
├── app/                 # FastAPI 백엔드
│   ├── models/          # DB 모델
│   ├── routers/         # API 라우터
│   ├── features/        # 기능
│   ├── database.py      # DB 설정
│   └── main.py          # FastAPI 앱
├── main.py              # 메인 실행 진입점
├── requirements.txt     # 의존성
├── config.yaml          # 설정
└── .env.example         # 환경 변수 예시
```

## 설치 및 설정

### 1. 의존성 설치

```bash
pip install -r requirements.txt
```

### 2. 환경 변수 설정

```bash
cp .env.example .env
# .env 파일을 편집하여 API 키 및 토큰 설정
```

### 3. 자격 증명 설정

`credentials/` 디렉토리를 생성하고 다음 파일들을 배치:
- `google_drive_credentials.json`
- `google_calendar_credentials.json`

### 4. 데이터베이스 초기화

프로젝트 실행 시 자동으로 SQLite 데이터베이스가 생성됩니다.

## 실행 방법

### 1. 대화형 모드 (기본)

```bash
python main.py --mode chat
```

### 2. 백엔드 서버 모드

```bash
python main.py --mode server --host 0.0.0.0 --port 8000
```

### 3. 상태 확인

```bash
python main.py --mode status
```

## 주요 기능

### MCP 서버 연결
- ✅ Google Drive (파일 관리)
- ✅ Google Calendar (일정 관리)
- ✅ Notion (문서 관리)
- ✅ Slack (메시징)

### Tool 변환
- MCP 서버 → Tool 자동 변환
- Tool Registry를 통한 중앙 관리
- RAG 기능도 Tool로 통합

### Agent 기능
- create_react_agent 방식 구현
- 대화 맥락 유지
- 다중 도구 조합 사용

### Workflow 시나리오
- 회의실 예약 → 슬랙 알림 → 노션 기록
- 문서 업로드 → 공유 → 슬랙 알림

### RAG 시스템
- 벡터 DB 기반 문서 검색
- 컨텍스트 기반 답변 생성

### Backend API
- FastAPI 기반 CRUD 서버
- 사용자 관리
- 활동 로그 기록

## API 문서

백엔드 서버 실행 후 다음 URL에서 API 문서 확인:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## 개발 구조

### MCP 담당자 (귀하) 영역:
- `mcp_servers/`: MCP 서버 연결 모듈
- `tools/`: MCP → Tool 변환 로직
- `rag/`: RAG 시스템

### 팀원 담당 영역:
- `agent_core/`: Agent 코어 구현
- LangGraph 워크플로우 설계

### 공통 영역:
- `backend/`: FastAPI 백엔드
- `main.py`: 통합 실행 진입점

## TODO

### MCP 서버 구현 완료 필요:
- [ ] 실제 MCP 클라이언트 라이브러리 통합
- [ ] Google APIs 인증 플로우 구현
- [ ] Notion/Slack API 연동 구현

### RAG 시스템 개선:
- [ ] 실제 벡터 DB 연동 (Chroma/FAISS)
- [ ] 임베딩 모델 로드 구현
- [ ] 문서 청킹 최적화

### Agent 고도화 (팀원 담당):
- [ ] 실제 LLM 연동
- [ ] ReAct 로직 구현
- [ ] LangGraph 워크플로우 완성

## 라이센스

MIT License

#의존성 설치
pip install -r requirements.txt

# 환경 변수 설정 (env_example.txt를 .env로 복사 후 편집)
cp env_example.txt .env

# 대화형 모드로 실행
python main.py --mode chat

# 백엔드 서버 모드로 실행
python main.py --mode server --port 8000

# 시스템 상태 확인
python main.py --mode status
