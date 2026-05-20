package com.example.edgeservice.web;

import org.springframework.core.io.ClassPathResource;
import org.springframework.http.CacheControl;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class StaticPageController {

    private static final ClassPathResource LOGIN_HTML =
            new ClassPathResource("static/admin-login.html"); // src/main/resources/static/admin-login.html

    // 루트(/)와 /admin-login.html 모두 같은 페이지 반환 (캐시 방지 헤더 포함)
    @GetMapping(value = { "/", "/admin-login.html" }, produces = MediaType.TEXT_HTML_VALUE)
    public ResponseEntity<ClassPathResource> loginPage() {
        HttpHeaders headers = new HttpHeaders();
        headers.setCacheControl(CacheControl.noStore().mustRevalidate());
        headers.add(HttpHeaders.PRAGMA, "no-cache");
        headers.add(HttpHeaders.EXPIRES, "0");

        return ResponseEntity
                .ok()
                .headers(headers)
                .body(LOGIN_HTML);
    }
}
