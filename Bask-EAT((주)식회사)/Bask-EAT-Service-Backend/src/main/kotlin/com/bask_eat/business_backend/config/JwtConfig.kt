package com.bask_eat.business_backend.config


import org.springframework.boot.context.properties.ConfigurationProperties
import org.springframework.context.annotation.Configuration

@Configuration
@ConfigurationProperties(prefix = "jwt")
class JwtConfig {
  var secret: String = ""
  var expiration: Long = 86400000 // 24 hours
}
