package com.banghyang.common.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;

@Configuration
public class RestTemplateConfig {

    // RestTemplate 빈을 등록하여 다른 클래스에서 사용할 수 있도록 설정
    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();  // 기본 RestTemplate 생성
    }
}
