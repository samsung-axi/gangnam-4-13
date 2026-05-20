package com.bangkoo.back.config;

import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.*;

/**
 * 최초 작성자 : 김동규
 * 최초 작성일 : 2025-04-01
 *
 * MongoDB 연결 설정 클래스
 * - MongoClient를 직접 Bean으로 등록하여 Spring Data MongoDB에서 사용
 * - application.yml에 명시된 MongoDB URI를 기반으로 연결
 */
@Configuration
public class MongoConfig {

    /**
     * application.yml 에서 설정된
     * spring.data.mongodb.uri 값을 주입
     */
    @Value("${spring.data.mongodb.uri}")
    private String mongoUri;

    /**
     * MongoClient Bean 생성
     * - Spring에서 MongoTemplate, MongoRepository 등과 연동됨
     *
     * @return MongoClient 객체
     */
    @Bean
    public MongoClient mongoClient() {
        return MongoClients.create(mongoUri);
    }
}
