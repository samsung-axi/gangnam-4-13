# Docker 가이드 (edge-service)

이 문서는 Spring Cloud Gateway 기반 `edge-service`를 Docker로 빌드/실행하는 방법을 설명합니다.

## 사전 준비
- Docker 또는 Docker Desktop
- (옵션) Docker BuildKit 활성화
  - Linux/macOS: `export DOCKER_BUILDKIT=1`
  - Windows PowerShell: `$env:DOCKER_BUILDKIT=1`

## 구성 파일
- `Dockerfile` : 멀티스테이지(Gradle 빌드 → JRE 런타임) 이미지
- `.dockerignore` : 불필요 파일/폴더 빌드 제외
- `docker-compose.yml` : 단일 컨테이너 실행 템플릿
- `.env.example` : 환경 변수 샘플

## 빌드
프로젝트 루트(본 파일과 동일 폴더)에서 실행:
```bash
docker build -t edge-service:local .
```

> Gradle 캐시는 BuildKit의 캐시 마운트를 사용합니다. 첫 빌드 후에는 빠르게 재빌드됩니다.

## 실행
1) `.env` 파일을 생성하고 필요한 값을 설정합니다. (샘플: `.env.example`)
2) 다음 명령으로 컨테이너를 실행합니다.
```bash
docker compose up -d --build
```

### 주요 환경 변수
- `ADMIN_SERVICE_URL`  
  - `/admin` 경로로 들어오는 트래픽을 프론트엔드로 프록시합니다.
  - 로컬 개발 중 Vite(5173 포트)를 호스트에서 실행한다면:
    - Windows/Mac: `http://host.docker.internal:5173`
    - Linux: 호스트 IP(예: `http://172.17.0.1:5173`)를 직접 지정하세요.

- `JAVA_TOOL_OPTIONS`  
  - (선택) JVM 메모리/GC 튜닝 플래그를 전달합니다.

### 포트
- 호스트:컨테이너 = `9001:9001`

## 헬스체크
Spring Actuator 기본 노출을 따라 `/actuator/health`가 활성화되어 있다면:
```bash
curl http://localhost:9001/actuator/health
```

## 문제 해결
- **프론트엔드 프록시 404/타임아웃**
  - `ADMIN_SERVICE_URL`이 접근 가능한 주소인지 확인하세요.
  - 컨테이너 네트워크에서 호스트 접근이 필요하면 OS별 호스트명/주소를 올바르게 설정합니다.
- **JWT/OAuth 구성**
  - 본 서비스는 Firebase 인증(JWT)을 리소스 서버로 검증합니다. 런타임 비밀키를 이미지에 포함하지 마세요.
- **빌드 실패(Gradle)**
  - 네트워크 문제로 의존성 다운로드가 실패할 수 있습니다. 재시도하거나 프록시 설정을 확인하세요.
