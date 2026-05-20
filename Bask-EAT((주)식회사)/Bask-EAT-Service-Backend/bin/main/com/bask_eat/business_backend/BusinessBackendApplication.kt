package com.bask_eat.business_backend

import jakarta.annotation.PostConstruct
import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication
import org.springframework.security.core.context.SecurityContextHolder

@SpringBootApplication
class BusinessBackendApplication {

  @PostConstruct
  fun init() {
    // MODE_INHERITABLETHREADLOCAL 로 변경
    SecurityContextHolder.setStrategyName(SecurityContextHolder.MODE_INHERITABLETHREADLOCAL)
  }
}

fun main(args: Array<String>) {
  runApplication<BusinessBackendApplication>(*args)
}
