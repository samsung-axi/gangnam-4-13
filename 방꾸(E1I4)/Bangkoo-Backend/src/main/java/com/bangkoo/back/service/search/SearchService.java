package com.bangkoo.back.service.search;

import com.bangkoo.back.utils.MultipartInputStreamFileResource;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;
import com.fasterxml.jackson.core.type.TypeReference;

import java.io.IOException;
import java.util.List;
import java.util.Map;

/**
 * 최초 작성자: 김동규
 * 최초 작성일: 2025-04-03
 *
 * AI 추천 요청 서비스 (Gemini + 유사도 검색 통합)
 */
@Service
public class SearchService {

    private final RestTemplate restTemplate;

    @Autowired
    private SearchLogService searchLogService;

    @Autowired
    private CandidateFeedbackService feedbackService;

    @Autowired
    private ObjectMapper objectMapper;

    @Value("${ai.server.url}")
    private String aiServerUrl;

    public SearchService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    /**
     * 이미지와 쿼리를 받아 /search 통합 API 호출
     * 이미지가 없으면 텍스트 기반 검색, 쿼리에 따라 추천/검색 자동 분기
     */
    public String recommendOrSearch(
            MultipartFile image,
            String query,
            String image_url,
            String userId,
            Boolean autoSave
    ) throws IOException {

        if (autoSave && userId != null && query != null && !query.isBlank()) {
            String source = image != null ? "image+text" : "text";
            searchLogService.saveSearchLog(query, userId, source);
        }

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.MULTIPART_FORM_DATA);

        MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
        body.add("query", query);

        if (image != null && !image.isEmpty()) {
            body.add("image", new MultipartInputStreamFileResource(image.getInputStream(), image.getOriginalFilename()));
        }

        if (image_url != null && !image_url.isEmpty()) {
            body.add("image_url", image_url);
        }

        if (userId != null && !userId.isEmpty()) {
            body.add("user_id", userId);
        }

        if (image_url != null) body.add("image_url", image_url);

        HttpEntity<MultiValueMap<String, Object>> request = new HttpEntity<>(body, headers);
        String fastapiUrl = aiServerUrl + "/search";

        // 1) AI 서버 호출
        String resultJson = restTemplate.postForObject(fastapiUrl, request, String.class);

        // 2) JSON 파싱 → List<Map<String,Object>>
        List<Map<String,Object>> candidates = objectMapper.readValue(
                resultJson,
                new TypeReference<List<Map<String,Object>>>() {}
        );

        // 3) 인상 로그 저장 (userId 포함)
        feedbackService.saveImpressions(candidates, userId);

        // 4) 원본 JSON 그대로 반환
        return resultJson;

    }
}
