package com.banghyang.diffuser.controller;

import com.banghyang.diffuser.dto.DiffuserKeywordRequest;
import com.banghyang.diffuser.dto.DiffuserKeywordResponse;
import com.banghyang.diffuser.service.DiffuserKeywordService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RequestMapping("/diffusers")
@RestController
@RequiredArgsConstructor
@Slf4j
public class DiffuserKeywordController {

    private final DiffuserKeywordService diffuserKeywordService;

    /**
     * 테라피 목적 디퓨저 추천 기능
     */
    @PostMapping
    public ResponseEntity<DiffuserKeywordResponse> recommendDiffusers(@RequestBody DiffuserKeywordRequest request) {
        log.info("Received diffuser recommendation request: {}", request.getUserInput());
        return ResponseEntity.ok(diffuserKeywordService.recommendDiffusers(request));
    }
}
