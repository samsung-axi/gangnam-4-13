FROM openjdk:17-jdk-slim

WORKDIR /app

# Gradle 빌드에 필요한 파일들 복사
COPY gradle gradle
COPY gradlew .
COPY gradle.properties .
COPY settings.gradle.kts .
COPY build.gradle.kts .

# 의존성 다운로드 (캐시 최적화)
RUN ./gradlew dependencies --no-daemon

# 소스 코드 복사
COPY src src

# 애플리케이션 빌드
RUN ./gradlew build --no-daemon -x test

# 빌드된 JAR 파일을 실행 가능한 위치로 이동
RUN cp build/libs/*.jar app.jar

# Firebase 서비스 계정 키를 위한 디렉토리 생성
RUN mkdir -p /app/config
RUN mkdir -p /app/logs

EXPOSE 8080

# 환경 변수
ENV SPRING_PROFILES_ACTIVE=prod

# 애플리케이션 실행
ENTRYPOINT ["java", "-jar", "app.jar"]
