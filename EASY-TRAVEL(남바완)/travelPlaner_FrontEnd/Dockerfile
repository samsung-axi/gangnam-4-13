# Node.js 이미지 사용
FROM node:20

# 작업 디렉토리 설정
WORKDIR /app

# 의존성 파일 복사
COPY package*.json ./

# npm 모듈 설치
RUN npm install

# 소스 파일 복사
COPY . .

# 애플리케이션 빌드 (필요 시)
RUN npm run build

# 컨테이너 실행 명령 설정
CMD ["npm", "start"]

# 사용할 포트 명시
EXPOSE 3000