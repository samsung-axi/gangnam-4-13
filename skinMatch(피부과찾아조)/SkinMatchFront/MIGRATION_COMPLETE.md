# ✅ 기능 이식 완료!

개발 버전(skin-story-solver-main)의 핵심 기능들을 원본 프로젝트(skin-story-solver)에 성공적으로 이식했습니다.

## 🔧 설치해야 할 패키지

먼저 새로 추가한 axios 패키지를 설치해주세요:

```bash
npm install axios
# 또는
yarn add axios
# 또는 (bun을 사용하는 경우)
bun add axios
```

## 📂 이식된 파일들

### 🔐 인증 관련
- `src/services/authService.ts` - 로그인/회원가입/토큰 관리 API
- `src/contexts/AuthContext.tsx` - 전역 인증 상태 관리
- `src/hooks/use-auth.ts` - 인증 훅
- `src/pages/Login.tsx` - 로그인 페이지
- `src/pages/Signup.tsx` - 회원가입 페이지

### 🏥 병원 검색 관련
- `src/services/hospitalService.ts` - 병원 검색/지도 API
- `src/pages/HospitalSearch.tsx` - 병원 검색 페이지
- `src/types/naver-maps.d.ts` - 네이버 지도 TypeScript 타입 정의

### 🛠️ 유틸리티
- `src/hooks/use-mobile.tsx` - 모바일 감지 훅
- `src/hooks/use-toast.ts` - 토스트 알림 훅
- `.env` - 환경 변수 설정 (네이버 지도 API 키 포함)

## 🎯 주요 기능

### 1. 사용자 인증
- ✅ 이메일/비밀번호 로그인
- ✅ 회원가입 (유효성 검사 포함)
- ✅ JWT 토큰 기반 인증
- ✅ 자동 토큰 갱신
- ✅ 전역 인증 상태 관리

### 2. 병원 검색 및 지도
- ✅ 지역별 병원 검색
- ✅ 전문 분야별 필터링
- ✅ 거리 기반 정렬
- ✅ 네이버 지도 API 연동 준비
- ✅ 병원 상세 정보 표시
- ✅ 전화걸기 및 길찾기 기능

### 3. API 연동
- ✅ Axios 기반 HTTP 클라이언트
- ✅ 요청/응답 인터셉터
- ✅ 에러 핸들링
- ✅ 목업 데이터 지원 (개발용)

## 🚀 시작하기

1. **패키지 설치**
   ```bash
   npm install
   ```

2. **개발 서버 실행**
   ```bash
   npm run dev
   ```

3. **접속 가능한 페이지들**
   - `/` - 메인 페이지
   - `/login` - 로그인
   - `/signup` - 회원가입
   - `/hospital` - 병원 검색

## ⚙️ 환경 설정

`.env` 파일에서 다음 설정들을 확인하세요:

```env
# 네이버 지도 API 키
VITE_NAVER_MAP_CLIENT_ID=q2dfn4zxpx
VITE_NAVER_MAP_CLIENT_SECRET=GUrRsMZWkB3TTp9TNAAhKuokM7Mp0yRcKgHgdxf

# 백엔드 API URL
VITE_API_BASE_URL=http://localhost:8080
```

## 🔄 백엔드 연동

현재는 목업 데이터로 동작하지만, 백엔드 서버가 준비되면 다음 엔드포인트들과 연동됩니다:

### 인증 API
- `POST /api/auth/login` - 로그인
- `POST /api/auth/signup` - 회원가입
- `GET /api/auth/me` - 현재 사용자 정보
- `POST /api/auth/refresh` - 토큰 갱신
- `POST /api/auth/logout` - 로그아웃

### 병원 API
- `GET /api/hospitals/search` - 병원 검색
- `GET /api/hospitals/nearby` - 근처 병원 찾기
- `POST /api/hospitals/{id}/bookmark` - 북마크 토글

## 🎨 UI/UX 변경사항

- 원본 프로젝트의 기존 디자인 시스템 유지
- shadcn/ui 컴포넌트 활용
- 반응형 디자인 적용
- 접근성 고려한 폼 설계

## 🐛 알려진 제한사항

1. **네이버 지도**: 실제 지도 렌더링은 네이버 지도 스크립트 로드 후 가능
2. **백엔드 의존성**: 일부 기능은 백엔드 API 완성 후 정상 동작
3. **소셜 로그인**: OAuth 컴포넌트는 제외됨 (커스텀 구현 필요)

## 📝 다음 단계

1. **백엔드 API 연동**: auth-app 프로젝트와 연결
2. **네이버 지도 통합**: 실제 지도 컴포넌트 구현
3. **프로필 페이지**: 사용자 정보 수정 기능
4. **추가 페이지들**: Camera, Analysis, Profile 등

## 🤝 도움이 필요하다면

- 각 서비스 파일에 상세한 주석 포함
- TypeScript 타입 정의로 API 스펙 명확화
- 에러 핸들링 및 로깅 구현완료

기능 이식이 완료되었습니다! 🎉
