package com.example.mytravellink.config;

import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;

import com.querydsl.jpa.impl.JPAQueryFactory;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Bean;

@Configuration
@RequiredArgsConstructor
public class QueryDslConfig {
    private final EntityManager entityManager;
    
    @Bean
    public JPAQueryFactory jpaQueryFactory() {
        return new JPAQueryFactory(entityManager);
    }
}
