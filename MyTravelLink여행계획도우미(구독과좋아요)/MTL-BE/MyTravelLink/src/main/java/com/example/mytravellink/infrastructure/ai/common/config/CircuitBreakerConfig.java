package com.example.mytravellink.infrastructure.ai.common.config;

import java.time.Duration;

import org.springframework.cloud.circuitbreaker.resilience4j.Resilience4JCircuitBreakerFactory;
import org.springframework.cloud.circuitbreaker.resilience4j.Resilience4JConfigBuilder;
import org.springframework.cloud.client.circuitbreaker.Customizer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import io.github.resilience4j.timelimiter.TimeLimiterConfig;

@Configuration
public class CircuitBreakerConfig {

    @Bean
    public Customizer<Resilience4JCircuitBreakerFactory> globalCustomConfiguration() {
        
        // Circuit Breaker 설정
        io.github.resilience4j.circuitbreaker.CircuitBreakerConfig circuitBreakerConfig = 
            io.github.resilience4j.circuitbreaker.CircuitBreakerConfig.custom()
            .failureRateThreshold(50)                // 실패율 임계값
            .waitDurationInOpenState(Duration.ofMillis(1000))  // Open 상태 지속 시간
            .slidingWindowSize(2)                    // 통계 수집 윈도우 크기
            .build();

        // 타임아웃 설정
        TimeLimiterConfig timeLimiterConfig = TimeLimiterConfig.custom()
            .timeoutDuration(Duration.ofSeconds(4))  // 타임아웃 시간
            .build();

        return factory -> factory.configureDefault(id -> new Resilience4JConfigBuilder(id)
            .circuitBreakerConfig(circuitBreakerConfig)
            .timeLimiterConfig(timeLimiterConfig)
            .build());
    }
}
