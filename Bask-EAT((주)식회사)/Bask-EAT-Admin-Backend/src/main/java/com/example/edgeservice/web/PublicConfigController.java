// src/main/java/com/example/edgeservice/web/PublicConfigController.java
package com.example.edgeservice.web;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.CacheControl;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.LinkedHashMap;
import java.util.Map;

@RestController
@RequestMapping("/config")
public class PublicConfigController {

    @Value("${app.firebase.api-key}") private String apiKey;
    @Value("${app.firebase.auth-domain}") private String authDomain;
    @Value("${app.firebase.project-id}") private String projectId;
    @Value("${app.firebase.storage-bucket:}") private String storageBucket;
    @Value("${app.firebase.messaging-sender-id:}") private String messagingSenderId;
    @Value("${app.firebase.app-id}") private String appId;
    @Value("${app.firebase.measurement-id:}") private String measurementId;

    @GetMapping(value = "/firebase.json", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Map<String, String>> firebase() {
        Map<String, String> cfg = new LinkedHashMap<>();
        cfg.put("apiKey", apiKey);
        cfg.put("authDomain", authDomain);
        cfg.put("projectId", projectId);
        if (!storageBucket.isEmpty()) cfg.put("storageBucket", storageBucket);
        if (!messagingSenderId.isEmpty()) cfg.put("messagingSenderId", messagingSenderId);
        cfg.put("appId", appId);
        if (!measurementId.isEmpty()) cfg.put("measurementId", measurementId);

        return ResponseEntity.ok()
                .cacheControl(CacheControl.noStore()) // 키 회전 대비 캐시 방지
                .body(cfg);
    }
}
