package com.example.mytravellink.infrastructure.ai.chat;

import com.example.mytravellink.api.chat.dto.ChatRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

@Component
public class AIChatInfrastructure {

    private final RestTemplate restTemplate;

    @Value("${ai.server.url}")
    private String fastAPIUrl;

    // AI 챗팅 보내기
    @Autowired
    public AIChatInfrastructure(RestTemplateBuilder restTemplateBuilder) {
        this.restTemplate = restTemplateBuilder.build();
    }

    public String callFastAPI(ChatRequest chatRequest){
        String endpoint = fastAPIUrl + "/api/chat";
        ResponseEntity<String> response = restTemplate.postForEntity(endpoint, chatRequest, String.class);
        return response.getBody();
    }
}
