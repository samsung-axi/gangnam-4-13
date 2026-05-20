package com.banghyang;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.ConfigurationPropertiesScan;

@SpringBootApplication
@ConfigurationPropertiesScan // @ConfigurationProperties 사용을 위해서 추가한 어노테이션
public class ProjectBanghyangApplication {
    public static void main(String[] args) {
        SpringApplication.run(ProjectBanghyangApplication.class, args);
    }
}
