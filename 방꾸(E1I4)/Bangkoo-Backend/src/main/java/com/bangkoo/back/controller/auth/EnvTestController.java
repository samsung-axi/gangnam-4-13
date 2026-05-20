package com.bangkoo.back.controller.auth;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class EnvTestController {


    /**
     * ENV 테스트용 값을 가져오는지 아닌지
     */
    @Value("${KAKAO_APP_CLIENT_ID:NOT_FOUND}")
    private String kakaoClientId;

    @GetMapping("/env/test")
    public ResponseEntity<String> testEnv() {
        return ResponseEntity.ok("KAKAO_APP_CLIENT_ID = " + kakaoClientId);
    }
}
