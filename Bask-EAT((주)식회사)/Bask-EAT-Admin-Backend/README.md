개발중 수정 예정


# edge-service

Spring Cloud Gateway(WebFlux) 기반의 **엣지 서비스**. Firebase 인증으로 관리자 세션을 만들고, 프론트(관리 콘솔)와 백엔드 API들을 프록시/라우팅합니다.

## Tech Stack
- Spring Boot **3.3.2**
- Spring Cloud (BOM) **2023.0.3**
- Java **21**
- Spring Cloud Gateway (WebFlux)
- Spring Security + OAuth2 Resource Server (JWT)
- (Client) Firebase Web Auth (Google)

## 프로젝트 구조
```
edge-service/
  build.gradle
  settings.gradle
  src/main/java/com/example/edgeservice/...
  src/main/resources/application.yml
  src/main/resources/static/admin-login.html
```
> `admin-login.html`은 Firebase Web SDK(compat)로 Google 로그인 팝업을 열고, 발급된 **ID 토큰을 /auth/session**으로 보내 **HttpOnly 쿠키**를 발급받습니다.

## 빌드 & 실행
```bash
./gradlew clean bootRun
# 또는
./gradlew bootJar && java -jar build/libs/*.jar
```
- 포트: `server.port=9001`

## 설정 요약 (`application.yml`)
- **OAuth2 Resource Server (JWT)**
  - `issuer-uri`: `https://securetoken.google.com/bask-eat`
  - `jwk-set-uri`: `https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com`

- **Global CORS**
  - allowedOrigins: ['http://localhost:5173', 'http://127.0.0.1:5173', 'https://bask-eat.web.app', 'https://bask-eat.firebaseapp.com', 'https://admin.your.dom']
  - allowedMethods: *
  - allowedHeaders: *
  - allowCredentials: True

- **앱 보안(app.security)**  
  - audience: `bask-eat`
  - cookie-name: `ADMIN_ID_TOKEN`
  - cookie-secure: `False` (운영 HTTPS에선 `true` 권장)

## Gateway 라우팅
| id | predicate | uri | filters |
|---|---|---|---|
| `admin-ui-root` | `Path=/admin,/admin/` | `${ADMIN_SERVICE_URL:http://127.0.0.1:5173}` | `SetPath=/admin/, RemoveRequestHeader=Authorization` |
| `admin-ui` | `Path=/admin/**` | `${ADMIN_SERVICE_URL:http://127.0.0.1:5173}` | `RemoveRequestHeader=Authorization` |
| `embed-service` | `Path=/embed/**` | `http://localhost:8000` | `StripPrefix=1` |
| `scrape-service` | `Path=/scrape/**` | `http://localhost:8420` | `StripPrefix=1` |
| `ops-embed-service` | `Path=/ops/embed/**` | `http://localhost:8000` | `StripPrefix=2` |
| `ops-scrape-service` | `Path=/ops/scrape/**` | `http://localhost:8420` | `StripPrefix=2` |


### Admin UI 프록시
- `ADMIN_SERVICE_URL` 환경변수(default: `http://127.0.0.1:5173`)를 통해 Vite/SPA 개발 서버를 프록시합니다.
- `/admin`, `/admin/**` 경로로 접속하면 프론트로 라우팅되며, `Authorization` 헤더는 제거됩니다.

## 보안
- 설정 클래스: `src/main/java/com/example/edgeservice/security/SecurityConfig.java`
- **permitAll** 경로 블록:
  - /**
  - /, /admin-login.html, /auth/session, /auth/logout, /actuator/**, /favicon.ico, /static/**

- 나머지 요청은 기본적으로 `oauth2ResourceServer(jwt)` 인증을 요구합니다.
- 인증 토큰 소스: 
  1) Authorization: `Bearer <token>` 헤더
  2) HttpOnly 쿠키(`<app.security.cookie-name>`, 기본 `ADMIN_ID_TOKEN`)

### 관리자 권한 판별 (AuthController)
JWT 클레임이 아래 중 하나를 만족해야 `/auth/session`이 세션을 발급합니다.
- `roles` 배열에 `"ADMIN"` 포함
- 혹은 `admin: true`

## API 개요
- `GET /config/firebase.json` : 프론트 초기화용 Firebase 공개 설정(JSON). 키: `apiKey, authDomain, projectId, storageBucket, messagingSenderId, appId, measurementId`
- `POST /auth/session` : 본문 `{"idToken":"<Firebase ID Token>"}` → 유효성/권한 검증 후 **HttpOnly 세션 쿠키** 발급
- `GET /auth/logout` : 세션 쿠키 만료
- `GET /auth/me` : 현재 인증 컨텍스트/클레임 확인(200/401)

## Admin 정적 페이지
- `src/main/resources/static/admin-login.html`
- 시작 시 `fetch("/config/firebase.json")`로 설정을 로드하고, Firebase Auth 팝업으로 로그인 후 `/auth/session`에 토큰을 보냅니다.

## 운영 체크리스트 (하드닝)
- **CORS**: 운영 도메인만 `allowedOrigins`에 남기세요.
- **쿠키 보안**: `app.security.cookie-secure=true`(HTTPS), `cookie-samesite`=`Lax`/`Strict` 고려, `cookie-domain` 설정(필요 시)
- **공개 엔드포인트 점검**: `/config/firebase.json`은 로그인 전 접근이 필요하므로 `permitAll` 목록에 포함되어야 합니다. (현재 SecurityConfig에는 `/config/**`가 포함되어 있지 않음 → 추가 권장)
- **권한 부여**: `permitAll` 경로가 과도하지 않은지 다시 확인하세요.

## 트러블슈팅
- **gRPC 관련 부팅 오류**:  
  `NoClassDefFoundError: io.grpc.netty.NettyChannelBuilder` 발생 시(Spring Cloud Gateway가 gRPC 브리지 빈을 스캔함)
  - 해결 1) 의존성 추가
    ```gradle
    implementation platform("io.grpc:grpc-bom:1.64.0")
    implementation "io.grpc:grpc-netty"
    ```
  - 해결 2) gRPC 브리지 비활성화(버전별 상이) 또는 사용하지 않으면 관련 자동구성 차단

- **GitHub Push Protection 차단(GH013)**:  
  `firebase/service-account.json` 등 시크릿이 히스토리에 있으면 푸시가 거부됩니다.  
  - 키 회전/폐기(GCP) → `git filter-repo`로 히스토리에서 제거 → `--force-with-lease`로 푸시
  - `.gitignore`에 `firebase/*.json`, `**/service-account.json` 추가

- **CRLF 경고(LF→CRLF)**:  
  루트에 `.gitattributes`를 두고 `* text=auto eol=lf`로 **LF 고정**, Windows 스크립트만 CRLF 허용.

## 라이선스
조직 정책에 맞게 라이선스 문구를 추가하세요.
