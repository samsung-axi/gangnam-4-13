package com.banghyang.common.config;

import com.banghyang.auth.kakao.client.KakaoAPIClient;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.support.WebClientAdapter;
import org.springframework.web.service.invoker.HttpServiceProxyFactory;

@Configuration
public class HttpInterfaceConfig {

    @Bean // API Client 등록
    public KakaoAPIClient kakaoAPIClient() {
        WebClient webClient = WebClient.create();
        HttpServiceProxyFactory factory = HttpServiceProxyFactory
                .builder(WebClientAdapter.forClient(webClient)).build();
        return factory.createClient(KakaoAPIClient.class);
    }
}
