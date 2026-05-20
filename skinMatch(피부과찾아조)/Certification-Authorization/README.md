# SkinMatch Backend

SkinMatch 프로젝트의 백엔드 서버입니다.

## 🚀 시작하기

### 필수 요구사항
- Java 17 이상
- Gradle 7.0 이상
- MySQL 8.0+

### 설치 및 실행

1. **프로젝트 클론**
   ```bash
   git clone https://github.com/SkinMatchProject5/skinmatch-back.git
   cd skinmatch-back
   ```

2. **로컬 설정 파일 생성**
   
   `src/main/resources/application-local.yml` 파일을 생성하고 다음 내용을 추가:
   
   ```yaml
   spring:
     security:
       oauth2:
         client:
           registration:
             google:
               client-id: YOUR_GOOGLE_CLIENT_ID
               client-secret: YOUR_GOOGLE_CLIENT_SECRET
             naver:
               client-id: YOUR_NAVER_CLIENT_ID
               client-secret: YOUR_NAVER_CLIENT_SECRET

   jwt:
     secret: YOUR_JWT_SECRET_KEY_HERE_256_BITS_OR_MORE
   ```

3. **데이터베이스 설정**
   ```sql
   CREATE DATABASE skincare_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```

4. **애플리케이션 실행**
   ```bash
   ./gradlew bootRun
   ```

5. **접속**
   - 서버: http://localhost:8081
   - Swagger UI: http://localhost:8081/swagger-ui/index.html

## 🗃️ 데이터베이스 스키마

### 📊 사용자 테이블 (users)

| 컬럼명 | 타입 | 설명 | 제약조건 |
|--------|------|------|----------|
| `id` | BIGINT | 사용자 고유 ID | PK, AUTO_INCREMENT |
| `email` | VARCHAR(255) | 이메일 (로그인 ID) | NOT NULL, UNIQUE |
| `username` | VARCHAR(255) | 사용자명 (표시용 ID) | UNIQUE |
| `password` | VARCHAR(255) | 암호화된 비밀번호 | OAuth 사용자는 NULL |
| `name` | VARCHAR(255) | 사용자 이름 | NOT NULL |
| `nickname` | VARCHAR(255) | 닉네임 | |
| `profile_image` | VARCHAR(255) | 프로필 이미지 URL | |
| `gender` | VARCHAR(50) | 성별 | |
| `birth_year` | VARCHAR(4) | 출생년도 | |
| `nationality` | VARCHAR(100) | 국적 | |
| `allergies` | TEXT | 알레르기 정보 | |
| `surgical_history` | TEXT | 수술 이력 | |
| `address` | VARCHAR(500) | 주소 | |
| `provider` | ENUM('GOOGLE', 'NAVER') | OAuth 제공자 | |
| `provider_id` | VARCHAR(255) | 제공자별 고유 ID | |
| `role` | ENUM('USER', 'ADMIN') | 사용자 권한 | NOT NULL, DEFAULT 'USER' |
| `active` | BOOLEAN | 계정 활성 상태 | NOT NULL, DEFAULT TRUE |
| **`last_login_at`** | **TIMESTAMP** | **마지막 로그인 시간** | **NEW** |
| **`is_online`** | **BOOLEAN** | **현재 온라인 상태** | **NOT NULL, DEFAULT FALSE** |
| **`analysis_count`** | **INT** | **총 분석 횟수** | **NOT NULL, DEFAULT 0** |
| **`last_analysis_at`** | **TIMESTAMP** | **마지막 분석 시간** | **NEW** |
| `created_at` | TIMESTAMP | 계정 생성일 | DEFAULT CURRENT_TIMESTAMP |
| `updated_at` | TIMESTAMP | 정보 수정일 | ON UPDATE CURRENT_TIMESTAMP |

### 🔄 기타 테이블
- `refresh_tokens`: JWT 리프레시 토큰 관리
- `uploaded_files`: 파일 업로드 정보
- `skin_analysis_results`: AI 피부 분석 결과 (향후 구현)

## 🔐 OAuth 설정

### Google OAuth 설정
1. [Google Cloud Console](https://console.cloud.google.com/)에서 프로젝트 생성
2. OAuth 2.0 클라이언트 ID 생성
3. 승인된 리디렉션 URI 추가: `http://localhost:8081/login/oauth2/code/google`

### Naver OAuth 설정
1. [네이버 개발자 센터](https://developers.naver.com/)에서 애플리케이션 등록
2. 서비스 URL: `http://localhost:8081`
3. Callback URL: `http://localhost:8081/login/oauth2/code/naver`

## 📡 API 엔드포인트

### 🔑 Authentication (인증 관련)
- `POST /api/auth/signup` - 회원가입
- `POST /api/auth/login` - 로그인
- `GET /api/auth/me` - 현재 사용자 정보
- `POST /api/auth/refresh` - 토큰 갱신
- `POST /api/auth/logout` - 로그아웃

### 🔗 OAuth (소셜 로그인)
- `GET /api/oauth/providers` - 지원 OAuth 제공자 목록
- `GET /api/oauth/url/{provider}` - OAuth 로그인 URL 조회
- `GET /oauth2/authorization/google` - Google 로그인
- `GET /oauth2/authorization/naver` - Naver 로그인

### 👤 User Management (사용자 관리)
- `GET /api/users/profile` - 프로필 조회
- `PUT /api/users/profile` - 프로필 전체 업데이트
- `PUT /api/users/profile/basic` - 기본 정보 업데이트

### 🛠️ Admin Management (관리자 기능) ⭐ NEW
- `GET /api/admin/stats` - 관리자 통계 정보 조회
- `GET /api/admin/users` - 사용자 목록 조회 (검색, 필터링, 페이징)
- `POST /api/admin/users/{userId}/toggle-status` - 사용자 상태 토글
- `DELETE /api/admin/users/{userId}` - 사용자 삭제
- `POST /api/admin/users/{userId}/profile-image` - 프로필 이미지 변경

### 🔧 Development (개발용 API) ⭐ NEW
- `GET /api/dev/users` - 모든 사용자 조회
- `POST /api/dev/create-admin` - 관리자 계정 생성/승격
- `POST /api/dev/create-default-admin` - 기본 관리자 계정 생성
- `POST /api/dev/fix-online-status` - 사용자 데이터 수정

## 📊 새로운 관리자 기능

### 실시간 사용자 통계
```json
{
  "totalUsers": 150,
  "onlineUsers": 25,          // 현재 접속 중인 사용자
  "recentlyActiveUsers": 45,  // 최근 5분 이내 활동
  "newUsersToday": 5,
  "totalAnalyses": 1250,      // 총 분석 수 (향후 AI 연동)
  "analysesToday": 35
}
```

### 사용자 관리 기능
- **검색 및 필터링**: 이름, 이메일, 상태별 검색
- **실시간 접속 상태**: 온라인/오프라인 표시
- **분석 통계**: 사용자별 분석 횟수 및 마지막 분석일
- **계정 관리**: 활성화/비활성화, 삭제, 프로필 이미지 변경

## 🛡️ 보안 설정

- JWT 기반 인증 시스템
- CORS 설정으로 프론트엔드 연동 지원
- OAuth 2.0 소셜 로그인 지원 (Google, Naver)
- 관리자 권한 기반 접근 제어
- 개발환경 전용 API 분리 (`@Profile("!prod")`)

## 📝 환경변수

### 개발환경
프로덕션 환경에서는 다음 환경변수를 설정하세요:

```bash
export GOOGLE_CLIENT_ID=your_google_client_id
export GOOGLE_CLIENT_SECRET=your_google_client_secret
export NAVER_CLIENT_ID=your_naver_client_id
export NAVER_CLIENT_SECRET=your_naver_client_secret
export JWT_SECRET=your_jwt_secret_key
export SPRING_PROFILES_ACTIVE=prod
```

## 🚀 Quick Start for Admin

### 1. 관리자 계정 생성
```bash
POST http://localhost:8081/api/dev/create-default-admin
```
- 이메일: `admin@skincarestory.com`
- 비밀번호: `admin123`

### 2. 관리자 로그인
```bash
POST http://localhost:8081/api/auth/login
{
  "email": "admin@skincarestory.com",
  "password": "admin123"
}
```

### 3. 관리자 통계 확인
```bash
GET http://localhost:8081/api/admin/stats
Authorization: Bearer {access_token}
```

## 🔧 개발자 정보

### 기술 스택
- **Framework**: Spring Boot 3.3.5
- **Security**: Spring Security 6.3.4 + JWT
- **Database**: MySQL 8.0+ with Spring Data JPA
- **Authentication**: JWT + OAuth 2.0
- **Documentation**: SpringDoc OpenAPI 3
- **Build Tool**: Gradle 8.x

### 주요 업데이트 (v1.0.1)
- ✅ 사용자 온라인 상태 실시간 추적
- ✅ 피부 분석 횟수 및 마지막 분석일 기록
- ✅ 관리자 대시보드 통계 API
- ✅ 사용자 검색, 필터링, 페이징 기능
- ✅ 계정 상태 관리 (활성화/비활성화)
- ✅ 개발용 API 도구 제공

|