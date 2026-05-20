package com.bask_eat.business_backend.config

import com.fasterxml.jackson.databind.MapperFeature
import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.databind.SerializationFeature
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule
import com.fasterxml.jackson.module.kotlin.KotlinModule
import com.fasterxml.jackson.module.paramnames.ParameterNamesModule
import org.springframework.boot.autoconfigure.jackson.Jackson2ObjectMapperBuilderCustomizer
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration

@Configuration
class JacksonConfig {

  @Bean
  fun objectMapper(): ObjectMapper {
    return ObjectMapper()
      // Java 8 날짜/시간 모듈 등록
      .registerModule(JavaTimeModule())
      // Kotlin 클래스 직렬화 지원
      .registerModule(KotlinModule.Builder().build())
      // 생성자 파라미터명 모듈 등록
      .registerModule(ParameterNamesModule())
      // 타임스탬프가 아닌 ISO-8601 형식으로 직렬화
      .disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS)
      // 대소문자 무시(enum)
      .enable(MapperFeature.ACCEPT_CASE_INSENSITIVE_ENUMS)
  }

  @Bean
  fun jacksonCustomizer(): Jackson2ObjectMapperBuilderCustomizer =
    Jackson2ObjectMapperBuilderCustomizer { builder ->
      builder
        .modules(JavaTimeModule(), KotlinModule.Builder().build(), ParameterNamesModule())
        .featuresToDisable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS)
        .featuresToEnable(MapperFeature.ACCEPT_CASE_INSENSITIVE_ENUMS)
    }
}
