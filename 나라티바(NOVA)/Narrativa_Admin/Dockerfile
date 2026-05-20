# 1. Node.js 18 공식 이미지 사용
FROM node:18-slim AS builder

# 2. 작업 디렉토리 설정
WORKDIR /app

# 3. 먼저 package*.json 파일만 복사하여 의존성 설치
# 이렇게 하면 소스 코드가 변경되어도 캐시된 의존성을 재사용할 수 있음
COPY package*.json ./
COPY .env ./
COPY .babelrc ./

# 4. 의존성 설치 (npm ci는 package-lock.json을 엄격하게 따르며 더 빠름)
RUN npm ci --legacy-peer-deps

# 5. 나머지 소스 코드 복사
COPY . .

# 6. OpenSSL Legacy Provider 활성화 및 React 애플리케이션 빌드
ENV NODE_OPTIONS=--openssl-legacy-provider
RUN npm run build

# 7. 실행 단계: 더 작은 이미지 사용
FROM node:18-slim

WORKDIR /app

# 8. serve 패키지만 설치
RUN npm install -g serve

# 9. 빌드 결과물만 복사
COPY --from=builder /app/build ./build

# 10. 포트 설정
EXPOSE 3030

# 11. 실행 명령어 (환경 변수 추가)
ENV PORT=3030
ENV HOST=0.0.0.0
CMD ["serve", "-s", "build", "-l", "3030"]