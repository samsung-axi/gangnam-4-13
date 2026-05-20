#FROM eclipse-temurin:17
#RUN mkdir /opt/app
#COPY build/libs/back-0.0.1-SNAPSHOT.jar /opt/app/bangkoo.jar
#CMD ["java", "-jar", "/opt/app/bangkoo.jar"]
#EXPOSE 8080

# 멀티 스테이지 빌드용
# ─────────────────────────────────────────────────────────────────────────────
# 1) Build 단계: Gradle 빌드
# ─────────────────────────────────────────────────────────────────────────────
FROM eclipse-temurin:17 AS builder
WORKDIR /workspace

# 1. Gradle 래퍼와 설정 파일 복사
COPY gradlew .
COPY gradle gradle
COPY build.gradle settings.gradle ./

# 2. 의존성만 다운로드 (캐시 활용)
RUN chmod +x gradlew \
 && ./gradlew dependencies --no-daemon

# 3. 소스 복사 후 실제 빌드 (테스트는 생략)
COPY src src
RUN chmod +x gradlew \
 && ./gradlew clean bootJar -x test --no-daemon

# ─────────────────────────────────────────────────────────────────────────────
# 2) Run 단계: 빌드된 JAR 만 복사해서 최소 이미지 생성
# ─────────────────────────────────────────────────────────────────────────────
FROM eclipse-temurin:17
WORKDIR /opt/app

# 빌더 컨테이너에서 생성된 JAR만 복사
COPY --from=builder /workspace/build/libs/*.jar app.jar

# Actuator 기본 포트
EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
