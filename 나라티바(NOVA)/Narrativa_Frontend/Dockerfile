# Node.js를 기반으로 빌드 및 실행
FROM node:18

# 작업 디렉토리 설정
WORKDIR /app

# 의존성 설치
COPY package.json package-lock.json ./
RUN npm install

# 애플리케이션 복사
COPY . .

# 앱 실행 포트
EXPOSE 3000

# React 개발 서버 실행 (개발용)
CMD ["npm", "start"]