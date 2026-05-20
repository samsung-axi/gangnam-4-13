import org.jetbrains.kotlin.gradle.tasks.KotlinCompile

plugins {
  id("org.springframework.boot") version "3.2.0"
  id("io.spring.dependency-management") version "1.1.4"
  kotlin("jvm") version "1.9.20"
  kotlin("plugin.spring") version "1.9.20"
}

group = "com.example"
version = "0.0.1-SNAPSHOT"

java {
  sourceCompatibility = JavaVersion.VERSION_17
}

repositories {
  mavenCentral()
}

dependencies {
  // Spring Boot Starters
  implementation("org.springframework.boot:spring-boot-starter-web")
  implementation("org.springframework.boot:spring-boot-starter-security")
  implementation("org.springframework.boot:spring-boot-starter-oauth2-client")
  implementation("org.springframework.boot:spring-boot-starter-validation")
  implementation("org.springframework.boot:spring-boot-starter-webflux") // for WebClient

  // Kotlin
  implementation("com.fasterxml.jackson.module:jackson-module-kotlin")
  implementation("org.jetbrains.kotlin:kotlin-reflect")
  implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core")
  implementation("org.jetbrains.kotlinx:kotlinx-coroutines-reactor")

  // Firebase Admin SDK
  implementation("com.google.firebase:firebase-admin:9.2.0")
  // JWT
  implementation("io.jsonwebtoken:jjwt-api:0.12.3")
  implementation("io.jsonwebtoken:jjwt-impl:0.12.3")
  implementation("io.jsonwebtoken:jjwt-jackson:0.12.3")

  // Development tools
  developmentOnly("org.springframework.boot:spring-boot-devtools")

  implementation("org.springframework.boot:spring-boot-starter-jdbc")
  implementation("com.fasterxml.jackson.datatype:jackson-datatype-jsr310")

//	runtimeOnly 'com.h2database:h2'

  // Testing
  testImplementation("org.springframework.boot:spring-boot-starter-test")
  testImplementation("org.springframework.security:spring-security-test")
  testImplementation("io.mockk:mockk:1.13.8")
  testImplementation("com.ninja-squad:springmockk:4.0.2")
}



tasks.withType<KotlinCompile> {
  kotlinOptions {
    freeCompilerArgs += "-Xjsr305=strict"
    jvmTarget = "17"
  }
}

tasks.withType<Test> {
  useJUnitPlatform()
}
