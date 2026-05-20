package com.bask_eat.business_backend.config

import org.springframework.beans.factory.annotation.Value
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.web.reactive.function.client.WebClient

@Configuration
class RestClientConfig {

  @Value("\${llm.module.base-url}")
  private lateinit var llmBaseUrl: String

  @Value("\${llm.module.timeout.connect}")
  private var connectTimeout: Long = 5000

  @Value("\${llm.module.timeout.read}")
  private var readTimeout: Long = 30000

  @Bean
  fun webClient(): WebClient {
    return WebClient.builder()
      .baseUrl(llmBaseUrl)
      .codecs { configurer ->
        configurer.defaultCodecs().maxInMemorySize(10 * 1024 * 1024) // 10MB
      }
      .build()
  }
}
