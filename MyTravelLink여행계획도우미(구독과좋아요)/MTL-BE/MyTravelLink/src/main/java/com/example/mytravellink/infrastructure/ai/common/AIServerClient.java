package com.example.mytravellink.infrastructure.ai.common;

import org.springframework.cloud.client.circuitbreaker.CircuitBreaker;
import org.springframework.cloud.client.circuitbreaker.CircuitBreakerFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;

import com.example.mytravellink.infrastructure.ai.common.exception.AIServerException;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import jakarta.annotation.PostConstruct;

@Slf4j
@Component
@RequiredArgsConstructor
public class AIServerClient {

    private final WebClient webClient;
    private final CircuitBreakerFactory<?, ?> circuitBreakerFactory;
    
    private CircuitBreaker circuitBreaker;

    @PostConstruct
    public void init() {
        this.circuitBreaker = circuitBreakerFactory.create("ai-server");
    }

    public <T> T post(String url, Object request, Class<T> responseType) {
        return circuitBreaker.run(
            () -> webClient.post()
                .uri(url)
                .bodyValue(request)
                .retrieve()
                .bodyToMono(responseType)
                .block(),
            throwable -> handleFailure(throwable)
        );
    }

    private <T> T handleFailure(Throwable throwable) {
        log.error("AI 서버 호출 실패: {}", throwable.getMessage());
        throw new AIServerException("AI 서버 통신 실패", throwable);
    }
}
