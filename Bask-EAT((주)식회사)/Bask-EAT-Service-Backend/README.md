# Bask-EAT Business Backend

Kotlin과 Spring Boot 3.2.0을 기반으로 한 AI 레시피 어시스턴트 백엔드 시스템입니다. Google OAuth2, Firebase Authentication, 그리고 LLM 모듈과의 통합을 통해 사용자 인증, 채팅, 레시피 추천, 장바구니 생성 등의 기능을 제공합니다.

## 🚀 주요 기능

### 🔐 **인증 및 보안**
- **Google OAuth 2.0**: 소셜 로그인 지원
- **Firebase Authentication**: 안전한 사용자 인증
- **JWT 토큰**: 보안된 API 접근 제어
- **Spring Security**: 엔드포인트 보안 및 권한 관리

### 💬 **AI 채팅 시스템**
- **실시간 채팅**: 사용자와 AI 간의 자연스러운 대화
- **컨텍스트 유지**: 대화 히스토리 기반 연속성 있는 응답
- **레시피 추천**: AI가 분석한 맞춤형 레시피 제공
- **재료 정보**: 상세한 재료 및 영양 정보

### 🛒 **장바구니 및 쇼핑**
- **자동 장바구니 생성**: AI가 추천한 레시피 기반 재료 목록
- **상품 검색**: 재료명으로 관련 상품 자동 검색
- **북마크 기능**: 사용자가 선호하는 레시피 저장

### 🎥 **유튜브 레시피 분석**
- **영상 분석**: 유튜브 링크에서 레시피 자동 추출
- **비동기 처리**: 대용량 영상 분석을 위한 작업 큐 시스템
- **실시간 상태 확인**: 분석 진행 상황 폴링

### 🔍 **검색 및 추천**
- **벡터 검색**: 임베딩 기반 유사 레시피 검색
- **개인화 추천**: 사용자 선호도 기반 맞춤형 추천
- **카테고리 분류**: 음식 유형별 체계적 분류

## 🛠️ 기술 스택

### **Backend Framework**
- **언어**: Kotlin 1.9.20
- **프레임워크**: Spring Boot 3.2.0
- **Java 버전**: JDK 17
- **빌드 도구**: Gradle Kotlin DSL

### **보안 및 인증**
- **Spring Security**: 웹 보안 프레임워크
- **OAuth 2.0**: Google 소셜 로그인
- **Firebase Admin SDK**: 사용자 인증 및 관리
- **JWT**: JSON Web Token 기반 인증

### **데이터베이스 및 저장소**
- **Google Firestore**: NoSQL 클라우드 데이터베이스
- **Spring Data**: 데이터 접근 계층
- **비동기 처리**: Kotlin Coroutines + WebFlux

### **외부 서비스 연동**
- **WebClient**: 비동기 HTTP 클라이언트
- **LLM 모듈**: AI 레시피 분석 서비스
- **임베딩 서비스**: 벡터 검색 엔진

### **개발 도구**
- **Spring Boot DevTools**: 개발 편의성
- **SLF4J + Logback**: 로깅 시스템
- **JUnit 5 + MockK**: 테스트 프레임워크

## 📋 요구사항

### **시스템 요구사항**
- **JDK**: 17 이상
- **메모리**: 최소 2GB RAM (권장 4GB+)
- **저장공간**: 최소 1GB 여유 공간

### **외부 서비스**
- **Google Cloud Console**: OAuth 2.0 클라이언트 설정
- **Firebase 프로젝트**: Authentication 및 Firestore 설정
- **LLM 모듈 서버**: AI 레시피 분석 서비스 (포트 8001)

## 🚀 설치 및 실행

### 1. 저장소 클론 및 빌드

```bash
git clone <repository-url>
cd Bask-EAT-Service-Backend

# Gradle 래퍼를 통한 빌드
./gradlew build

# 또는 Windows에서
gradlew.bat build
```

### 2. 환경 변수 설정

프로젝트 루트에 `.env` 파일을 생성하거나 환경 변수를 설정하세요:

```bash
# Google OAuth 설정
export GOOGLE_CLIENT_ID=your_google_client_id
export GOOGLE_CLIENT_SECRET=your_google_client_secret

# JWT 설정
export JWT_SECRET_KEY=your_jwt_secret_key

# LLM 모듈 설정
export LLM_MODULE_BASE_URL=http://localhost:8001

# Firebase 설정 (Docker 사용 시)
export FIREBASE_SERVICE_ACCOUNT_KEY_PATH=./firebase-service-account-key.json
```

### 3. Firebase 서비스 계정 키 설정

Firebase Console에서 서비스 계정 키를 다운로드하여 프로젝트 루트에 배치:

```bash
# firebase-service-account-key.json 파일을 프로젝트 루트에 배치
cp /path/to/firebase-service-account-key.json ./
```

### 4. 애플리케이션 실행

#### **로컬 실행**
```bash
# 개발 모드로 실행
./gradlew bootRun

# 또는 JAR 파일로 실행
./gradlew bootJar
java -jar build/libs/business-backend-0.0.1-SNAPSHOT.jar
```

#### **Docker 실행**
```bash
# Docker Compose로 전체 시스템 실행
docker-compose up -d

# 백엔드만 실행
docker-compose up backend
```

### 5. 서비스 접속

```
백엔드 API: http://localhost:8080
LLM 모듈: http://localhost:8001
API 문서: http://localhost:8080/swagger-ui.html (개발 모드)
```

## 🏗️ 프로젝트 구조

```
src/main/kotlin/com/bask_eat/business_backend/
├── BusinessBackendApplication.kt    # 🚀 메인 애플리케이션 클래스
├── config/                          # ⚙️ 설정 클래스들
│   ├── SecurityConfig.kt           # Spring Security 설정
│   ├── WebClientConfig.kt          # WebClient 설정
│   └── FirebaseConfig.kt           # Firebase 설정
├── controller/                      # 🌐 REST API 컨트롤러
│   ├── AuthController.kt           # 인증 관련 API
│   ├── ChatController.kt           # 채팅 및 레시피 API
│   ├── UserController.kt           # 사용자 관리 API
│   ├── BookmarkController.kt       # 북마크 API
│   └── HealthController.kt         # 헬스체크 API
├── service/                         # 🔧 비즈니스 로직 서비스
│   ├── AuthService.kt              # 인증 서비스
│   ├── ChatService.kt              # 채팅 처리 서비스
│   ├── LlmService.kt               # LLM 모듈 연동 서비스
│   ├── FirestoreService.kt         # Firestore 데이터 서비스
│   ├── UserService.kt              # 사용자 관리 서비스
│   ├── BookmarkService.kt          # 북마크 서비스
│   └── EmbeddingService.kt         # 임베딩 검색 서비스
├── repository/                      # 💾 데이터 접근 계층
│   └── FirestoreRepository.kt      # Firestore 데이터 접근
├── model/                          # 📊 데이터 모델
│   ├── entity/                     # 엔티티 클래스
│   ├── dto/                        # DTO 클래스
│   └── enums/                      # 열거형 클래스
├── security/                       # 🔒 보안 관련 클래스
│   └── JwtAuthenticationFilter.kt  # JWT 인증 필터
├── exception/                      # ⚠️ 예외 처리 클래스
│   ├── ChatException.kt            # 채팅 관련 예외
│   └── LlmException.kt             # LLM 모듈 예외
└── util/                           # 🛠️ 유틸리티 클래스
    └── ValidationUtil.kt           # 검증 유틸리티
```

## 🎯 API 엔드포인트

### **인증 API** (`/api/auth`)

```http
# Google OAuth 로그인
POST /api/auth/google
Authorization: Bearer {firebase_id_token}

# 토큰 갱신
POST /api/auth/refresh
Authorization: Bearer {jwt_token}

# 로그아웃
POST /api/auth/logout
Authorization: Bearer {jwt_token}
```

### **채팅 API** (`/api`)

```http
# 새 채팅 생성
POST /api/chat/create
Authorization: Bearer {jwt_token}

# 채팅 목록 조회
GET /api/chat/list
Authorization: Bearer {jwt_token}

# 채팅 메시지 전송
POST /api/chat/send
Authorization: Bearer {jwt_token}
Content-Type: multipart/form-data

# 채팅 히스토리 조회
GET /api/chat/{chatId}/history
Authorization: Bearer {jwt_token}
```

### **사용자 API** (`/api/user`)

```http
# 사용자 정보 조회
GET /api/user/profile
Authorization: Bearer {jwt_token}

# 사용자 정보 업데이트
PUT /api/user/profile
Authorization: Bearer {jwt_token}
```

### **북마크 API** (`/api/bookmark`)

```http
# 북마크 목록 조회
GET /api/bookmark/list
Authorization: Bearer {jwt_token}

# 북마크 추가
POST /api/bookmark/add
Authorization: Bearer {jwt_token}
```

### **헬스체크 API**

```http
# 서비스 상태 확인
GET /api/health
```

## ⚙️ 설정 옵션

### **application.yml 설정**

```yaml
spring:
  profiles:
    active: dev
  
  security:
    oauth2:
      client:
        registration:
          google:
            client-id: ${GOOGLE_CLIENT_ID}
            client-secret: ${GOOGLE_CLIENT_SECRET}

llm:
  module:
    base-url: ${LLM_MODULE_BASE_URL:http://localhost:8001}
    polling:
      interval: 1000
      max-attempts: 60

firebase:
  service-account-key-path: ${FIREBASE_SERVICE_ACCOUNT_KEY_PATH}
  project-id: ${FIREBASE_PROJECT_ID}

jwt:
  secret-key: ${JWT_SECRET_KEY}
  expiration: 86400000  # 24시간
```

### **환경별 프로필**

```bash
# 개발 환경
export SPRING_PROFILES_ACTIVE=dev

# 운영 환경
export SPRING_PROFILES_ACTIVE=prod

# 테스트 환경
export SPRING_PROFILES_ACTIVE=test
```

## 🔧 개발 가이드

### **새로운 API 엔드포인트 추가**

1. **컨트롤러 생성**
```kotlin
@RestController
@RequestMapping("/api/example")
class ExampleController(
    private val exampleService: ExampleService
) {
    @GetMapping("/list")
    suspend fun getList(): ResponseEntity<List<ExampleDto>> {
        return ResponseEntity.ok(exampleService.getList())
    }
}
```

2. **서비스 클래스 생성**
```kotlin
@Service
class ExampleService {
    suspend fun getList(): List<ExampleDto> {
        // 비즈니스 로직 구현
        return emptyList()
    }
}
```

3. **DTO 및 엔티티 클래스 생성**
```kotlin
data class ExampleDto(
    val id: String,
    val name: String
)

@Entity
data class Example(
    @Id val id: String,
    val name: String
)
```

### **테스트 작성**

```kotlin
@SpringBootTest
@AutoConfigureTestDatabase
class ExampleServiceTest {
    
    @Autowired
    private lateinit var exampleService: ExampleService
    
    @Test
    fun `getList should return empty list`() = runTest {
        val result = exampleService.getList()
        assertThat(result).isEmpty()
    }
}
```

## 🐳 Docker 배포

### **Docker 이미지 빌드**

```bash
# 이미지 빌드
docker build -t bask-eat-backend:latest .

# 이미지 실행
docker run -p 8080:8080 \
  -e GOOGLE_CLIENT_ID=$GOOGLE_CLIENT_ID \
  -e GOOGLE_CLIENT_SECRET=$GOOGLE_CLIENT_SECRET \
  -e JWT_SECRET_KEY=$JWT_SECRET_KEY \
  bask-eat-backend:latest
```

### **Docker Compose**

```bash
# 전체 시스템 실행
docker-compose up -d

# 로그 확인
docker-compose logs -f backend

# 시스템 중지
docker-compose down
```

## 🔍 모니터링 및 로깅

### **로깅 설정**

```yaml
logging:
  level:
    com.bask_eat.business_backend: DEBUG
    org.springframework.security: DEBUG
    org.springframework.web: DEBUG
  
  pattern:
    console: "%d{yyyy-MM-dd HH:mm:ss} [%thread] %-5level %logger{36} - %msg%n"
    file: "%d{yyyy-MM-dd HH:mm:ss} [%thread] %-5level %logger{36} - %msg%n"
  
  file:
    name: logs/application.log
    max-size: 100MB
    max-history: 30
```

### **헬스체크 및 모니터링**

```bash
# 서비스 상태 확인
curl http://localhost:8080/api/health

# 로그 확인
tail -f logs/application.log

# Docker 컨테이너 상태 확인
docker ps
docker stats
```

## 🚀 성능 최적화

### **비동기 처리**

- **Kotlin Coroutines**: 비동기 작업 처리
- **WebFlux**: 반응형 웹 스택
- **비동기 HTTP 클라이언트**: 외부 서비스 호출 최적화

### **캐싱 전략**

```kotlin
@Cacheable("user-profile")
suspend fun getUserProfile(userId: String): UserProfile {
    return firestoreService.getUserProfile(userId)
}
```

### **데이터베이스 최적화**

- **Firestore 인덱싱**: 쿼리 성능 향상
- **배치 작업**: 대량 데이터 처리 최적화
- **연결 풀링**: 데이터베이스 연결 효율성

## 🔒 보안 고려사항

### **인증 및 권한**

- **JWT 토큰 검증**: 모든 API 요청에 대한 토큰 검증
- **Firebase ID Token**: Google OAuth2 기반 안전한 인증
- **Spring Security**: 엔드포인트별 접근 권한 제어

### **데이터 보안**

- **입력 검증**: 사용자 입력에 대한 철저한 검증
- **SQL 인젝션 방지**: Firestore 사용으로 자동 방지
- **XSS 방지**: 응답 데이터 이스케이프 처리

### **환경 변수 관리**

```bash
# 민감한 정보는 환경 변수로 관리
export GOOGLE_CLIENT_SECRET=your_secret_key
export JWT_SECRET_KEY=your_jwt_secret

# .env 파일은 .gitignore에 추가
echo ".env" >> .gitignore
```

## 🐛 문제 해결

### **일반적인 문제**

1. **포트 충돌**
   ```bash
   # 사용 중인 포트 확인
   netstat -tulpn | grep :8080
   
   # 다른 포트로 실행
   java -jar app.jar --server.port=8081
   ```

2. **Firebase 연결 오류**
   ```bash
   # 서비스 계정 키 파일 확인
   ls -la firebase-service-account-key.json
   
   # 환경 변수 확인
   echo $FIREBASE_SERVICE_ACCOUNT_KEY_PATH
   ```

3. **LLM 모듈 연결 오류**
   ```bash
   # LLM 모듈 서버 상태 확인
   curl http://localhost:8001/health
   
   # 환경 변수 확인
   echo $LLM_MODULE_BASE_URL
   ```

### **로그 분석**

```bash
# 에러 로그 확인
grep "ERROR" logs/application.log

# 특정 사용자 로그 확인
grep "user123" logs/application.log

# 성능 로그 확인
grep "execution time" logs/application.log
```

## 🚀 향후 개선 계획

- [ ] **실시간 알림**: WebSocket을 통한 실시간 알림 시스템
- [ ] **API 버전 관리**: API 버전별 호환성 관리
- [ ] **메트릭 수집**: Prometheus + Grafana 모니터링
- [ ] **로드 밸런싱**: 여러 인스턴스 간 부하 분산
- [ ] **데이터 백업**: 자동화된 데이터 백업 시스템
- [ ] **마이크로서비스**: 서비스별 독립적 배포 및 확장
- [ ] **CI/CD 파이프라인**: 자동화된 빌드 및 배포
- [ ] **성능 테스트**: 부하 테스트 및 성능 최적화

## 📞 지원 및 기여

### **이슈 등록**

프로젝트에 문제가 발생하거나 개선 제안이 있으시면 GitHub Issues에 등록해주세요.

### **기여하기**

1. 프로젝트를 Fork하세요
2. 새로운 기능 브랜치를 생성하세요 (`git checkout -b feature/amazing-feature`)
3. 변경사항을 커밋하세요 (`git commit -m 'Add amazing feature'`)
4. 브랜치에 Push하세요 (`git push origin feature/amazing-feature`)
5. Pull Request를 생성하세요

### **개발 환경 설정**

```bash
# 개발 환경 설정
./gradlew idea  # IntelliJ IDEA 프로젝트 생성
./gradlew eclipse  # Eclipse 프로젝트 생성

# 코드 품질 검사
./gradlew check
./gradlew test
```

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자세한 내용은 [LICENSE](LICENSE) 파일을 참조하세요.

## 🙏 감사의 말

- [Spring Boot](https://spring.io/projects/spring-boot) - 강력한 Java 백엔드 프레임워크
- [Kotlin](https://kotlinlang.org/) - 현대적이고 안전한 JVM 언어
- [Google Firebase](https://firebase.google.com/) - 클라우드 백엔드 서비스
- [Google Cloud](https://cloud.google.com/) - 클라우드 인프라 및 서비스

---

**Bask-EAT Business Backend**로 더 스마트한 요리 경험을 시작하세요! 🍳✨
