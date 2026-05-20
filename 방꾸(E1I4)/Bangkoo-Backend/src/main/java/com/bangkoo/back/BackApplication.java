package com.bangkoo.back;

import com.bangkoo.back.config.properites.JwtProperties;
import com.bangkoo.back.config.properites.SocialOAuthProperties;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;

@EnableConfigurationProperties(JwtProperties.class)
@SpringBootApplication
public class BackApplication {

    public static void main(String[] args) {
        SpringApplication.run(BackApplication.class, args);
    }

}
