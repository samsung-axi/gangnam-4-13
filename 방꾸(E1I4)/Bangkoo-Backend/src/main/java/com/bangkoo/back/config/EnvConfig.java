package com.bangkoo.back.config;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class EnvConfig {

    /**
     * .env 파일을 읽어오는 설정
     * @return
     */
    @Bean
    public Dotenv dotenv() {
        return Dotenv.configure()
                .directory("./")  // 현재 디렉터리에서 .env 찾기
                .ignoreIfMissing()  // .env 없으면 무시하고 실행
                .load();
    }
}

