# 🔬 SkinMatch - AI 피부 진단 및 병원 추천 서비스

> AI 기반 피부 상태 분석을 통한 맞춤형 피부과 병원 추천 플랫폼

[![GitHub Stars](https://img.shields.io/github/stars/SkinMatchProject5?style=social)](https://github.com/SkinMatchProject5)
[![Development Status](https://img.shields.io/badge/status-MVP%20Development-orange)](https://github.com/orgs/SkinMatchProject5/projects/1)

## 📱 서비스 소개

**SkinMatch**는 사용자가 업로드한 피부 이미지를 AI로 분석하여 피부 상태를 진단하고, 개인 맞춤형 피부과 병원을 추천해주는 통합 헬스케어 플랫폼입니다.

### 🎯 핵심 기능

#### 🤖 AI 피부 분석
- **이미지 기반 진단**: 카메라 촬영 또는 갤러리 업로드를 통한 피부 상태 분석
- **파인튜닝 모델**: 피부과 전문 데이터로 학습된 맞춤형 AI 모델
- **신뢰도 점수**: 분석 결과에 대한 AI 신뢰도 제공
- **다양한 피부 질환**: 종양, 여드름, 아토피, 기미, 주근깨 등 다종 질환 지원

#### 🏥 맞춤형 병원 추천
- **지능형 매칭**: AI 진단 결과 기반 전문 병원 추천
- **위치 기반 서비스**: 사용자 위치 중심 근거리 병원 우선 제공
- **전문분야 필터링**: 피부과 세분화된 검색
- **실시간 정보**: 영업시간, 진료 가능 여부, 연락처 정보 제공

#### 💬 AI 상담 어시스턴트
- **맞춤형 질문**: 진단 결과 기반 추가 상담 제공
- 
#### 👤 개인화 서비스
- **진단 히스토리**: 개인별 피부 상태 변화 추적
- **맞춤형 추천**: 사용자 피부 타입별 병원 및 치료법 제안
- **소셜 로그인**: Google, Naver 간편 로그인 지원

## 🏗️ 시스템 아키텍처

<img width="1150" height="548" alt="스크린샷 2025-08-16 오후 11 49 33" src="https://github.com/user-attachments/assets/f9ec26f9-02b7-4488-a29c-49ed6e0908f4" />



## 🚀 기술 스택

### Frontend
- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **State Management**: React Context API
- **HTTP Client**: Axios

### Backend
- **AI Service**: FastAPI + LangChain + OpenAI API
- **Auth Service**: Spring Boot + Spring Security + OAuth2
- **Hospital Service**: Spring Boot + JPA
- **Image Processing**: Python + OpenCV

### Database & Storage
- **RDBMS**: MySQL 8.0
- **Vector DB**: Qdrant

### AI & ML
- **Base Model**: Qwen2.5-7B
- **Fine-tuning**: LoRA (Low-Rank Adaptation)
- **Vector Embedding**: 한국어 텍스트 임베딩 모델
- **Image Processing**: OpenCV + PIL

### DevOps & Infrastructure
- **Deployment**: Docker + Docker Compose
- **API Gateway**: Nginx (예정)

## 📂 프로젝트 구조

```
SkinMatchProject5/
├── 📁 AI-Analysis-Backend/          # AI 분석 서비스 8001
├── 📁 Certification-Authorization/   # 인증/인가 서비스 8081
├── 📁 Hospital-Location-Backend/     # 병원 정보 서비스 8002
├── 📁 Camera-Shooting/              # 이미지 처리 서비스 8000
├── 📁 Chatbot-Backend/              # AI 챗봇 , Agent 서비스 8003
├── 📁 SkinMatchFront/               # React 프론트엔드 5173
├── 📁 docs/                        # 프로젝트 문서
│   ├── 📄 WBS.md                   # 주간 업무 계획
│   ├── 📄 ARCHITECTURE.md          # 시스템 아키텍처
│   └── 📄 API_SPEC.md              # API 명세서
└── 📄 README.md                    # 프로젝트 소개
```

## 🎯 현재 개발 상태

### ✅ 완료된 기능
- [x] **AI 모델**: 피부과 데이터셋 기반 파인튜닝 완료
- [x] **인증 시스템**: OAuth2 기반 소셜 로그인 구현
- [x] **프론트엔드**: React 기본 UI 구현 (90% 완료)
- [x] **지도 연동**: 네이버 지도 API 연동 완료
- [x] **데이터**: 피부과 병원 정보 50개 수집 완료

### 🔄 진행 중인 기능
- [ ] **AI Backend**: FastAPI + LangChain 파이프라인 구축
- [ ] **데이터베이스**: H2 → MySQL 전환
- [ ] **Vector DB**: Qdrant 기반 병원 추천 시스템
- [ ] **통합 테스트**: 전체 플로우 연동

### 📋 예정된 기능
- [ ] **RAG 시스템**: 병원 정보 검색 고도화
- [ ] **AI 에이전트**: 지능형 상담 어시스턴트
- [ ] **모바일 앱**: React Native 버전
- [ ] **관리자 페이지**: 병원 정보 관리 시스템

## 🚀 빠른 시작

### 사전 요구사항
- Node.js 18+
- Python 3.9+
- Java 17+
- MySQL 8.0+
- Docker (선택사항)

### 로컬 개발 환경 설정

1. **저장소 클론**
```bash
git clone https://github.com/SkinMatchProject5/SkinMatchFront.git
git clone https://github.com/SkinMatchProject5/AI-Analysis-Backend.git
git clone https://github.com/SkinMatchProject5/Certification-Authorization.git
```

2. **환경변수 설정**
```bash
# AI 서비스
export OPENAI_API_KEY="your-openai-api-key"
export QDRANT_URL="http://localhost:6333"

# 지도 서비스  
export NAVER_CLIENT_ID="your-naver-client-id"
export NAVER_CLIENT_SECRET="your-naver-client-secret"

# 데이터베이스
export DB_HOST="localhost:3306"
export DB_NAME="skinmatch"
export DB_USER="root"
export DB_PASSWORD="password"
```

3. **서비스 실행**
```bash
# 프론트엔드 (포트: 5173)
cd SkinMatchFront
npm install && npm run dev

# AI 분석 서비스 (포트: 8082)
cd AI-Analysis-Backend  
pip install -r requirements.txt
uvicorn main:app --port 8082

# 인증 서비스 (포트: 8080)
cd Certification-Authorization
./gradlew bootRun
```

## 📚 문서

- **[📋 WBS (업무 분해 구조)](./WBS.md)** - 주간 개발 계획 및 일정
- **[📡 API 명세서](./docs/API_SPEC.md)** - REST API 문서
- **[📝 회의록](https://www.notion.so/5-22f000f5781980c8b665dcb6f88f9711?pvs=11)** - 멘토링 및 팀 회의 기록

## 👥 팀 구성

| 역할 | 이름 | 담당 영역 | GitHub |
|------|------|-----------|---------|
| **PM/Full-Stack** | Dorian | 프로젝트 관리, AI Backend, 통합 | [@DorianKim-dev](https://github.com/DorianKim-dev) |
| **AI/Backend** | 석우 | AI 모델링, 데이터셋, Backend | [@sonsukwoo](https://github.com/sonsukwoo) |
| **Backend** | 성민 | Spring Boot, 인증, 데이터베이스 | [@penguin1127](https://github.com/penguin1127) |
| **Frontend** | 경복 | React, 데이터 처리 ,UI/UX, 사용자 인터페이스 | [@gyeongbokko](https://github.com/gyeongbokko) |
| **Frontend** | 민지 | React, 데이터 처리, 프론트 연동 | [@lminjii](https://github.com/lminjii) |

## 📊 프로젝트 진행 현황

현재 **Sprint 1** 진행 중입니다. 상세한 진행 상황은 [GitHub Projects](https://github.com/orgs/SkinMatchProject5/projects/1)에서 확인하실 수 있습니다.

### 이번 주 목표 (8/18-8/22)
- ✅ **MVP 백엔드-프론트엔드 연동** 완성
- ✅ **AI 분석 플로우** 구현 (이미지 업로드 → 분석 → 결과 표시)
- ✅ **병원 추천 시스템** 기본 기능
- ✅ **사용자 인증** 시스템 완성

자세한 주간 계획은 **[📋 WBS.md](./WBS.md)**를 참고해주세요.


- **프로젝트 홈페이지**: [SkinMatch.dev](https://skinmatch.dev) (준비 중)

---

<p align="center">
  <strong>🔬 SkinMatch - AI로 더 건강한 피부를 위한 첫걸음</strong>
</p>

<p align="center">
  Made with ❤️ by <a href="https://github.com/SkinMatchProject5">SkinMatch Team</a>
</p>
