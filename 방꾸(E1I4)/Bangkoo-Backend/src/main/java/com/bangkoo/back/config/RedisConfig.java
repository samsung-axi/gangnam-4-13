package com.bangkoo.back.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.connection.*;
import org.springframework.data.redis.connection.lettuce.*;
import org.springframework.data.redis.core.*;

/**
 * ✅ Redis 설정 클래스
 * - 작성자: 김태원
 * - 작성일: 2025-04-12
 *
 * 📌 RedisConfig
 * - Lettuce 기반 RedisConnectionFactory 및 RedisTemplate을 등록하여
 *   서비스에서 Redis를 사용할 수 있도록 설정한다.
 * - application.yml 혹은 application-*.yml 내 spring.redis.host / port를 사용
 */

@Configuration
public class RedisConfig {

    /**
     * 🔧 RedisConnectionFactory 빈 등록
     * - Lettuce를 사용하여 Redis 연결 팩토리를 생성
     * - application.yml 설정 값 자동 반영
     */
    @Bean
    public RedisConnectionFactory redisConnectionFactory() {
        return new LettuceConnectionFactory();
    }

    /**
     * 🔧 RedisTemplate 빈 등록
     * - Redis에서 String key, Object value로 데이터를 주고받기 위한 기본 템플릿
     */
    @Bean
    public RedisTemplate<String, Object> redisTemplate() {
        RedisTemplate<String, Object> template = new RedisTemplate<>();
        template.setConnectionFactory(redisConnectionFactory());
        return template;
    }
}
