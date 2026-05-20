package com.banghyang.scentlens.controller;

import com.banghyang.scentlens.dto.ProductResponse;
import com.banghyang.scentlens.service.ScentlensService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/scentlens")
public class ScentlensController {
    private final ScentlensService scentlensService;

    @PostMapping("/get_image_search_result")
    public ResponseEntity<Map<String, List<ProductResponse>>> getImageSearchResult(@RequestParam("file") MultipartFile file) {
        List<ProductResponse> products = scentlensService.getImageSearchResult(file);

        Map<String, List<ProductResponse>> response = new HashMap<>();
        response.put("products", products);

        return ResponseEntity.ok(response);
    }
}
