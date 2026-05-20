package com.example.mytravellink.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.core.Ordered;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addViewControllers(ViewControllerRegistry registry) {
        // 예: /loginSuccess 요청이 들어오면 index.html로 포워딩
        registry.addViewController("/loginSuccess")
                .setViewName("forward:/index.html");

        // 우선순위 설정 (선택)
        registry.setOrder(Ordered.HIGHEST_PRECEDENCE);
    }
}