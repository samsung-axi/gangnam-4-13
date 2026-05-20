package com.bangkoo.back.service.recommend;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class RecommendService {

    private final RestTemplate restTemplate;

    @Value("${ai.server.url}")
    private String aiServerUrl;

    public List<Map<String, Object>> getStyleBasedRecommendation(List<String> styles, Integer minPrice, Integer maxPrice) {
        String url = UriComponentsBuilder.fromHttpUrl(aiServerUrl + "/style-recommend")
                .queryParam("styles", styles.toArray())
                .queryParamIfPresent("min_price", Optional.ofNullable(minPrice))
                .queryParamIfPresent("max_price", Optional.ofNullable(maxPrice))
                .toUriString();

        ResponseEntity<List> response = restTemplate.getForEntity(url, List.class);
        return response.getBody();
    }

}
