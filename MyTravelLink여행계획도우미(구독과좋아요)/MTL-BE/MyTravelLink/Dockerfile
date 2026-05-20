# OpenJDK 17 기반 이미지 사용 (예: alpine 버전)
FROM openjdk:17-jdk-alpine

# 컨테이너 내부 작업 디렉토리 설정
WORKDIR /app

# Maven 빌드 후 생성된 jar 파일 복사
COPY target/api-mytravellink-0.0.1-SNAPSHOT.jar /app/api-mytravellink.jar

# 애플리케이션이 9000 포트에서 실행되도록 설정 (application-prod.yml의 server.port가 9000이면)
EXPOSE 9000

# 애플리케이션 실행
ENTRYPOINT ["java", "-jar", "/app/api-mytravellink.jar"]
