package com.bangkoo.back.controller.search;

import com.bangkoo.back.service.search.SearchService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import com.bangkoo.back.service.search.SearchLogService;

import java.io.IOException;
import java.util.List;
import java.util.Map;

/**
 * 최초 작성자: 김동규
 * 최초 작성일: 2025-04-03
 *
 * AI 추천 및 검색 컨트롤러
 */
@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class SearchController {

    private final SearchService searchService;
    private final SearchLogService searchLogService;

    /**
     * 이미지 또는 텍스트 기반 AI 추천/검색 통합 요청
     *
     * @param image     이미지 파일 (선택)
     * @param query     텍스트 쿼리 (선택)
     * @param userId    사용자 아이디 (선택)
     * @param autoSave  검색 로그 자동저장 여부 (기본: true)
     * @return 추천 또는 검색 결과
     */
    @PostMapping(value = "/search", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<String> handleRecommendOrSearch(
            @RequestParam(required = false) MultipartFile image,
            @RequestParam(required = false) String query,
            @RequestParam(required = false) String image_url,
            @RequestParam(name = "userId", required = false) String userId,
            @RequestParam(name = "autoSave", required = false, defaultValue = "true") boolean autoSave
    ) throws IOException {
        System.out.println("[DEBUG] autoSave = " + autoSave);
        String result = searchService.recommendOrSearch(
                image,
                query,
                image_url,
                userId,
                autoSave    // ← 여기
        );

//        String result = searchService.recommendOrSearch(image, query, image_url, userId);
        return ResponseEntity.ok(result);
    }
}
