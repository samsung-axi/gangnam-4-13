<img width="1900" height="1023" alt="Image" src="https://github.com/user-attachments/assets/e3d8018b-6220-404d-bcc6-18e79cb5b00c" />

# Bask:EAT 회사 소개

## 🍳 회사 개요

**Bask:EAT**는 AI 기술을 활용한 스마트 요리 솔루션을 제공하는 혁신적인 푸드테크 회사입니다. 사용자에게 개인화된 레시피 추천, 재료 검색, 장바구니 자동 생성 등의 서비스를 통해 더 편리하고 똑똑한 요리 경험을 선사합니다.

## 🎯 미션

AI와 데이터 분석을 통해 개개인의 취향과 상황에 맞는 최적의 요리 솔루션을 제공하여, 누구나 쉽고 즐겁게 요리할 수 있는 세상을 만듭니다.

## 🚀 핵심 서비스

### **AI 레시피 어시스턴트**

- Google Gemini API와 LangChain 기반의 고도화된 AI 에이전트
- 사용자 질문에 따른 맞춤형 레시피 추천
- 유튜브 영상에서 자동 레시피 추출
- 재료 이미지 인식 및 검색 기능

### **스마트 쇼핑 기능**

- AI 추천 레시피 기반 자동 장바구니 생성
- 상품 정보 실시간 크롤링 및 관리
- 재료별 최적가 상품 매칭 시스템

### **개인화 서비스**

- Google OAuth 2.0 기반 소셜 로그인
- 사용자 맞춤형 레시피 북마크 및 히스토리 관리
- Firebase를 통한 안전한 데이터 저장

## 💻 기술 스택

### **Backend & AI**

- **Language**: Kotlin, Python
- **Framework**: Spring Boot 3.2.0, FastAPI
- **AI/ML**: Google Gemini API, LangChain, Jina CLIP v2
- **Database**: Google Firestore
- **Infrastructure**: Docker, Docker Compose

### **Frontend**

- **Framework**: React 19, Next.js 15
- **Language**: TypeScript
- **UI/UX**: TailwindCSS, Radix UI
- **State Management**: React Hooks

### **Data & Search**

- **Vector Search**: Firestore Vector Search
- **Embedding**: Multimodal RAG (텍스트/이미지/크로스모달)
- **Web Scraping**: BeautifulSoup, Selenium

## 🏗️ 아키텍처 및 시스템

### **마이크로서비스 아키텍처**

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │  Business API   │    │   LLM Agent     │
│   (React/Next)  │◄──►│  (Spring Boot)  │◄──►│   (Python)      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                 │                      │
                         ┌───────────────┐              │
                         │   Firebase    │◄─────────────┘
                         │  (Database)   │
                         └───────────────┘
                                 │
                    ┌─────────────────────────┐
                    │    Data Pipeline        │
                    │  (Crawler + Embedding)  │
                    └─────────────────────────┘
```

### **주요 컴포넌트**

#### 1. **Bask-EAT-Service-Backend** (Kotlin/Spring Boot)

- 비즈니스 로직 및 API 서버
- 사용자 인증 및 권한 관리
- 채팅 및 레시피 서비스

#### 2. **Bask-EAT-LLM-Agent** (Python/FastAPI)

- AI 의도 분류 및 라우팅
- 텍스트/영상 기반 레시피 처리
- 재료 검색 및 이미지 인식

#### 3. **Bask-EAT-Front-V2** (React/Next.js)

- 사용자 인터페이스
- 실시간 채팅 및 검색
- 반응형 웹 디자인

#### 4. **Bask-EAT-Crawl** (Python)

- 이마트몰 상품 정보 크롤링
- 자동 스케줄링 및 데이터 갱신
- 가격 히스토리 관리

#### 5. **Bask-EAT-Product-List-Embedding-API** (Python)

- 멀티모달 상품 검색 엔진
- 벡터 임베딩 및 유사도 검색
- 실시간 인덱싱 파이프라인

6. **Bask-EAT-Admin-Front** (React/Vite)

   - 관리자 대시보드
   - 시스템 모니터링 및 제어
   - 데이터 관리 도구

## 🔧 핵심 기술 특징

### **AI 및 머신러닝**

- **의도 분류**: 키워드 기반 + LLM 기반 하이브리드 분류 시스템
- **멀티모달 검색**: 텍스트, 이미지, 크로스모달 검색 지원
- **실시간 추천**: 사용자 히스토리 기반 개인화 추천

### **데이터 처리**

- **비동기 크롤링**: 대용량 상품 데이터 실시간 수집
- **벡터 데이터베이스**: Firestore 기반 고성능 유사도 검색
- **데이터 정규화**: 일관된 형식의 상품 정보 제공

### **보안 및 성능**

- **OAuth 2.0**: Google 소셜 로그인 연동
- **JWT 토큰**: 안전한 API 접근 제어
- **Docker 컨테이너화**: 일관된 배포 환경
- **CORS 설정**: 적절한 도메인 접근 제한

## 📊 주요 성과

- **AI 응답 속도**: 키워드 기반 분류로 25% 이상 성능 향상
- **멀티모달 검색**: 텍스트, 이미지, 복합 검색 지원
- **실시간 데이터**: 이마트몰 상품 정보 실시간 업데이트
- **사용자 경험**: 직관적인 UI/UX 및 반응형 디자인

## 🌟 차별점

1. **통합 솔루션**: 레시피 추천부터 재료 구매까지 원스톱 서비스
2. **AI 기반 개인화**: 사용자별 맞춤형 추천 시스템
3. **멀티모달 기술**: 텍스트와 이미지를 동시에 처리하는 고급 AI
4. **실시간 데이터**: 항상 최신 가격과 재료 정보 제공
5. **확장 가능 아키텍처**: 마이크로서비스 기반의 유연한 시스템

## 📞 연락처

- **GitHub 조직**: [https://github.com/Bask-EAT](https://github.com/Bask-EAT)

---

**Bask:EAT**과 함께 더 스마트하고 즐거운 요리 경험을 시작하세요! 🍳✨
