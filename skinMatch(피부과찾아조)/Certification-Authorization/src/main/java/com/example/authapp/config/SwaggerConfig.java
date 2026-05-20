package com.example.authapp.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SwaggerConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Skin Story Solver - Authentication API")
                        .description("AI 기반 피부 분석 및 병원 추천 플랫폼의 인증 서비스 API")
                        .version("v1.0.0"));
    }
}
