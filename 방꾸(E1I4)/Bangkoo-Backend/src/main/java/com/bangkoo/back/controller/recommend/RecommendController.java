package com.bangkoo.back.controller.recommend;

import com.bangkoo.back.service.recommend.RecommendService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class RecommendController {

    private final RecommendService recommendService;

    @GetMapping("/style-recommend")
    public ResponseEntity<List<Map<String, Object>>> getStyleBasedRecommendation(
            @RequestParam List<String> styles,
            @RequestParam(required = false) Integer minPrice,
            @RequestParam(required = false) Integer maxPrice
    ) {
        List<Map<String, Object>> result = recommendService.getStyleBasedRecommendation(styles, minPrice, maxPrice);
        return ResponseEntity.ok(result);
    }

}
