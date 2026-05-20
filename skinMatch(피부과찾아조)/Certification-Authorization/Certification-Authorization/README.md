# 🔐 Certification-Authorization Service

## 📖 개요

Skin Story Solver 피부 분석 플랫폼의 **사용자 인증 및 권한 관리** 서비스입니다. Spring Boot 3.3.5 기반으로 구축되었으며, JWT 토큰 기반 인증과 OAuth 2.0 소셜 로그인을 지원합니다.

## 🏗️ 기술 스택

- **Framework**: Spring Boot 3.3.5
- **Language**: Java 21
- **Database**: MySQL 8.0
- **Authentication**: JWT + OAuth 2.0 (Google, Naver)
- **ORM**: JPA/Hibernate
- **Documentation**: Swagger/OpenAPI 3.0
- **Build Tool**: Gradle

## 🚀 주요 기능

### 🔑 인증 시스템
- **일반 로그인**: 이메일/비밀번호 기반 회원가입 및 로그인
- **소셜 로그인**: Google, Naver OAuth 2.0 연동
- **JWT 토큰**: Access Token + Refresh Token 방식
- **보안**: 비밀번호 BCrypt 암호화, CORS 설정

### 👤 사용자 관리
- **프로필 관리**: 기본 정보, 피부 관련 정보, 의료 정보
- **권한 관리**: USER, ADMIN 역할 기반 접근 제어
- **계정 관리**: 프로필 수정, 계정 삭제

### 🌟 **중요 설계 원칙**
- **분석 데이터 비저장**: AI 피부 분석 결과는 실시간으로만 처리하고 DB에 저장하지 않음
- **심플한 구조**: 인증과 사용자 관리에만 집중된 최소한의 테이블 구조
- **확장 가능**: 향후 필요시 추가 테이블 확장 가능한 구조

## 🗄️ 데이터베이스 스키마

### 📊 현재 구현된 테이블

#### 👤 `users` - 사용자 정보 (통합 관리)
```sql
+------------------+------------------------+------+-----+---------+----------------+
| Field            | Type                   | Null | Key | Default | Extra          |
+------------------+------------------------+------+-----+---------+----------------+
| id               | bigint                 | NO   | PRI | NULL    | auto_increment |
| email            | varchar(255)           | NO   | UNI | NULL    |                |
| password         | varchar(255)           | YES  |     | NULL    |                |
| name             | varchar(255)           | NO   |     | NULL    |                |
| nickname         | varchar(255)           | YES  |     | NULL    |                |
| profile_image    | varchar(255)           | YES  |     | NULL    |                |
| gender           | varchar(255)           | YES  |     | NULL    |                |
| birth_year       | varchar(255)           | YES  |     | NULL    |                |
| nationality      | varchar(255)           | YES  |     | NULL    |                |
| address          | varchar(255)           | YES  |     | NULL    |                |
| allergies        | varchar(1000)          | YES  |     | NULL    |                |
| surgical_history | varchar(1000)          | YES  |     | NULL    |                |
| provider         | enum('GOOGLE','NAVER') | YES  |     | NULL    |                |
| provider_id      | varchar(255)           | YES  |     | NULL    |                |
| role             | enum('ADMIN','USER')   | NO   |     | NULL    |                |
| created_at       | datetime(6)            | NO   |     | NULL    |                |
| updated_at       | datetime(6)            | YES  |     | NULL    |                |
+------------------+------------------------+------+-----+---------+----------------+
```

**주요 특징:**
- **통합 관리**: 기본 정보 + 피부 관련 정보 + 의료 정보를 하나의 테이블에서 관리
- **OAuth 지원**: Google, Naver 소셜 로그인 완벽 지원
- **유연성**: 일반 로그인 사용자는 password 필드 사용, OAuth 사용자는 NULL

#### 🔄 `refresh_tokens` - JWT 토큰 관리
```sql
+------------+--------------+------+-----+---------+----------------+
| Field      | Type         | Null | Key | Default | Extra          |
+------------+--------------+------+-----+---------+----------------+
| id         | bigint       | NO   | PRI | NULL    | auto_increment |
| user_id    | bigint       | NO   | MUL | NULL    |                |
| token      | varchar(500) | NO   | UNI | NULL    |                |
| created_at | datetime(6)  | NO   |     | NULL    |                |
| expires_at | datetime(6)  | NO   |     | NULL    |                |
+------------+--------------+------+-----+---------+----------------+
```

**주요 특징:**
- **보안**: Refresh Token을 별도 테이블로 안전하게 관리
- **만료 관리**: 자동 만료 처리 및 정리
- **외래키**: `user_id` → `users(id)` 참조 무결성 보장

### 🔍 현재 데이터베이스 현황

#### 📈 **실제 테이블 상태** (2025-08-18 기준)
```bash
mysql> SHOW TABLES;
+-----------------------+
| Tables_in_skincare_db |
+-----------------------+
| refresh_tokens        |
| users                 |
+-----------------------+

mysql> SELECT COUNT(*) FROM users;
+----------+
| COUNT(*) |
+----------+
|        1 |
+----------+

# 실제 사용자 데이터
mysql> SELECT id, email, name, provider, role, created_at FROM users;
+----+----------------------+--------+----------+------+----------------------------+
| id | email                | name   | provider | role | created_at                 |
+----+----------------------+--------+----------+------+----------------------------+
|  1 | tjdals7071@gmail.com | 조성민 | GOOGLE   | USER | 2025-08-14 14:43:22.108047 |
+----+----------------------+--------+----------+------+----------------------------+
```

#### 🔐 **보안 및 제약조건**
- **Primary Keys**: 모든 테이블에 `id` 기본키
- **Unique Keys**: `users.email`, `refresh_tokens.token`
- **Foreign Keys**: `refresh_tokens.user_id` → `users.id` (CASCADE DELETE)
- **Indexes**: 이메일, 토큰 검색 최적화

## 📝 API 문서

### 🌐 Swagger UI
- **개발 서버**: `http://localhost:8081/swagger-ui/index.html`
- **API Docs**: `http://localhost:8081/v3/api-docs`

### 🔗 API 명세서

#### 🔐 **인증 관련 API**

##### 📝 **회원가입**
```http
POST /api/auth/signup
Content-Type: application/json

{
    "email": "user@example.com",
    "password": "password123",
    "name": "홍길동",
    "nickname": "길동이",
    "address": "서울시 강남구"
}
```

**응답:**
```json
{
    "success": true,
    "message": "회원가입이 완료되었습니다.",
    "data": {
        "userId": 1,
        "email": "user@example.com",
        "name": "홍길동"
    }
}
```

##### 🔑 **로그인**
```http
POST /api/auth/login
Content-Type: application/json

{
    "email": "user@example.com",
    "password": "password123"
}
```

**응답:**
```json
{
    "success": true,
    "message": "로그인 성공",
    "data": {
        "accessToken": "eyJhbGciOiJIUzI1NiJ9...",
        "refreshToken": "eyJhbGciOiJIUzI1NiJ9...",
        "user": {
            "id": 1,
            "email": "user@example.com",
            "name": "홍길동",
            "role": "USER"
        }
    }
}
```

##### 🔄 **토큰 갱신**
```http
POST /api/auth/refresh
Content-Type: application/json

{
    "refreshToken": "eyJhbGciOiJIUzI1NiJ9..."
}
```

**응답:**
```json
{
    "success": true,
    "message": "토큰 갱신 성공",
    "data": {
        "accessToken": "eyJhbGciOiJIUzI1NiJ9...",
        "refreshToken": "eyJhbGciOiJIUzI1NiJ9..."
    }
}
```

##### 🚪 **로그아웃**
```http
POST /api/auth/logout
Content-Type: application/json
Authorization: Bearer {accessToken}

{
    "refreshToken": "eyJhbGciOiJIUzI1NiJ9..."
}
```

##### 👤 **현재 사용자 정보**
```http
GET /api/auth/me
Authorization: Bearer {accessToken}
```

**응답:**
```json
{
    "success": true,
    "data": {
        "id": 1,
        "email": "user@example.com",
        "name": "홍길동",
        "nickname": "길동이",
        "profileImage": null,
        "gender": "MALE",
        "birthYear": "1990",
        "nationality": "한국",
        "address": "서울시 강남구",
        "allergies": "견과류",
        "surgicalHistory": null,
        "role": "USER",
        "createdAt": "2025-08-14T14:43:22.108047"
    }
}
```

#### 👤 **사용자 관리 API**

##### 📖 **프로필 조회**
```http
GET /api/users/profile
Authorization: Bearer {accessToken}
```

##### ✏️ **프로필 수정**
```http
PUT /api/users/profile
Content-Type: application/json
Authorization: Bearer {accessToken}

{
    "name": "홍길동",
    "nickname": "새로운닉네임",
    "profileImage": "https://example.com/profile.jpg",
    "gender": "MALE",
    "birthYear": "1990",
    "nationality": "한국",
    "address": "서울시 서초구",
    "allergies": "견과류, 해산물",
    "surgicalHistory": "없음"
}
```

**응답:**
```json
{
    "success": true,
    "message": "프로필이 업데이트되었습니다.",
    "data": {
        "id": 1,
        "email": "user@example.com",
        "name": "홍길동",
        "nickname": "새로운닉네임",
        "profileImage": "https://example.com/profile.jpg",
        "gender": "MALE",
        "birthYear": "1990",
        "nationality": "한국",
        "address": "서울시 서초구",
        "allergies": "견과류, 해산물",
        "surgicalHistory": "없음",
        "role": "USER",
        "updatedAt": "2025-08-18T15:30:00.000000"
    }
}
```

##### 🗑️ **계정 삭제**
```http
DELETE /api/users/account
Authorization: Bearer {accessToken}
```

#### 🔗 **OAuth 소셜 로그인**

##### 🌐 **Google 로그인**
```http
GET /oauth2/authorization/google
```
- 브라우저에서 Google 로그인 페이지로 리다이렉트
- 로그인 완료 후 콜백 URL로 authorization code 전달

##### 📱 **Naver 로그인**
```http
GET /oauth2/authorization/naver
```
- 브라우저에서 Naver 로그인 페이지로 리다이렉트
- 로그인 완료 후 콜백 URL로 authorization code 전달

#### 🚨 **에러 응답 형식**

모든 API에서 에러 발생 시 다음 형식으로 응답:

```json
{
    "success": false,
    "message": "에러 메시지",
    "errorCode": "VALIDATION_ERROR",
    "details": {
        "field": "email",
        "rejectedValue": "invalid-email",
        "message": "올바른 이메일 형식이 아닙니다."
    }
}
```

#### 📋 **주요 HTTP 상태 코드**

| 상태 코드 | 설명 | 사용 사례 |
|----------|------|----------|
| `200 OK` | 성공 | 조회, 수정 성공 |
| `201 Created` | 생성 성공 | 회원가입 성공 |
| `400 Bad Request` | 잘못된 요청 | 유효성 검증 실패 |
| `401 Unauthorized` | 인증 실패 | 토큰 없음/만료 |
| `403 Forbidden` | 권한 없음 | 접근 권한 부족 |
| `404 Not Found` | 리소스 없음 | 사용자 없음 |
| `409 Conflict` | 충돌 | 이메일 중복 |
| `500 Internal Server Error` | 서버 오류 | 예상치 못한 오류 |

## 🚀 실행 방법

### 1. **환경 설정**
```yaml
# application.yml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/skincare_db
    username: root
    password: 1234
  jpa:
    hibernate:
      ddl-auto: update  # 자동으로 테이블 생성
```

### 2. **OAuth 환경변수 설정**
```bash
# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Naver OAuth  
NAVER_CLIENT_ID=your_naver_client_id
NAVER_CLIENT_SECRET=your_naver_client_secret

# JWT Secret
JWT_SECRET=your_jwt_secret_key
```

### 3. **애플리케이션 실행**
```bash
# IntelliJ에서 AuthAppApplication.java 실행
# 또는 터미널에서:
./gradlew bootRun
```

### 4. **확인**
- **애플리케이션**: `http://localhost:8081`
- **Swagger UI**: `http://localhost:8081/swagger-ui/index.html`
- **Health Check**: `http://localhost:8081/actuator/health`

## 🔧 개발 환경

### ⚙️ **요구사항**
- **Java**: 21+
- **MySQL**: 8.0+
- **Gradle**: 8.0+

### 📁 **프로젝트 구조**
```
src/
├── main/
│   ├── java/com/example/authapp/
│   │   ├── config/          # 설정 (Swagger, Security, CORS)
│   │   ├── controller/      # REST API 컨트롤러
│   │   ├── entity/          # JPA 엔티티 (User, RefreshToken)
│   │   ├── repository/      # 데이터 접근 계층
│   │   ├── service/         # 비즈니스 로직
│   │   ├── dto/             # 데이터 전송 객체
│   │   ├── exception/       # 예외 처리
│   │   └── util/            # 유틸리티 (JWT, 암호화)
│   └── resources/
│       ├── application.yml  # 설정 파일
│       └── static/          # 정적 파일
└── test/                    # 테스트 코드
```

## 🌟 설계 철학

### 🔒 **보안 우선**
- **JWT**: Stateless 인증으로 확장성 확보
- **OAuth**: 소셜 로그인으로 사용자 편의성 증대
- **암호화**: BCrypt로 비밀번호 안전 저장

### 📈 **확장성 고려**
- **JPA**: Entity 추가로 쉬운 테이블 확장
- **모듈화**: 마이크로서비스 아키텍처 대응
- **API First**: RESTful API로 다양한 클라이언트 지원
