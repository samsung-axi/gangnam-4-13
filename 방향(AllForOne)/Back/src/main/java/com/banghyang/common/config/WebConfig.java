package com.banghyang.common.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins("http://localhost:3000") // 허용할 도메인
                .allowedMethods("GET", "POST", "PUT", "DELETE")
                .allowCredentials(true) // allowedOrigins("*") 사용불가 주의(추후 확장시 고려)
                .exposedHeaders("*"); // 헤더에서 필요한 항목만 허용하면 보안 강화에 좋음(지금은 일단 모두 허용 "*")
    }
}
