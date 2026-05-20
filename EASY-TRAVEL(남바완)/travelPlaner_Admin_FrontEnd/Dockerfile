# < step1: Node.js 환경에서 React 앱 빌드 >

# Node.js 환경을 builder라는 이름으로 설정 (멀티 스테이지 빌드)
FROM node:20 AS builder

# 작업 디렉토리 설정
WORKDIR /app

# 의존성 파일 복사
COPY package*.json ./

# npm 모듈 설치
RUN npm install

# 소스 코드 전체를 Docker 이미지로 복사
COPY . .

# React 앱 빌드 (build 폴더 생성)
RUN npm run build

# < step2: 빌드된 결과물을 Nginx 웹 서버로 배포 >

# Nginx 환경으로 배포
FROM nginx:stable-alpine

# Nginx 설정에 필요한 환경변수 선언
ARG DOMAIN
ARG BACKEND_URL
ENV DOMAIN=$DOMAIN
ENV BACKEND_URL=$BACKEND_URL

# 빌드 결과물만 Nginx HTML 디렉토리로 복사
COPY --from=builder /app/build /usr/share/nginx/html

# Nginx 설정 파일 복사 (React 라우팅을 위해 수정된 설정 적용)
COPY nginx/nginx.conf.template /etc/nginx/templates/default.conf.template

# Nginx 서버가 80번 포트로 외부 요청을 받도록 설정
EXPOSE 80

# Nignx 실행 (Foreground 모드: Docker 컨테이너가 종료되지 않도록 유지)
CMD ["nginx", "-g", "daemon off;"]
