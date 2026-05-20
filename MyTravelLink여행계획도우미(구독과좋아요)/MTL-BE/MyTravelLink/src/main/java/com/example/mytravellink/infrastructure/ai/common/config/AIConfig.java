package com.example.mytravellink.infrastructure.ai.common.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.ExchangeFilterFunction;
import reactor.core.publisher.Mono;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.client.circuitbreaker.CircuitBreakerFactory;
import lombok.extern.slf4j.Slf4j;
import com.example.mytravellink.infrastructure.ai.common.AIServerClient;

@Slf4j
@Configuration
@RequiredArgsConstructor
public class AIConfig {
    
    @Value("${ai.server.url}")  // application.yml에서 설정
    private String aiServerUrl;
    
    @Bean
    public WebClient webClient() {
        return WebClient.builder()
            .baseUrl(aiServerUrl)
            .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
            .defaultHeader(HttpHeaders.ACCEPT, MediaType.APPLICATION_JSON_VALUE)
            .filter(ExchangeFilterFunction.ofRequestProcessor(
                clientRequest -> {
                    log.debug("Request: {} {}", clientRequest.method(), clientRequest.url());
                    return Mono.just(clientRequest);
                }
            ))
            .build();
    }

    @Bean
    public AIServerClient aiServerClient(WebClient webClient, CircuitBreakerFactory<?, ?> circuitBreakerFactory) {
        return new AIServerClient(webClient, circuitBreakerFactory);
    }
}
