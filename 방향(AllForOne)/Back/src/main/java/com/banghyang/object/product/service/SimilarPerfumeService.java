package com.banghyang.object.product.service;

import com.banghyang.object.product.dto.SimilarPerfumeResponse;
import com.banghyang.object.product.entity.Product;
import com.banghyang.object.product.entity.ProductImage;
import com.banghyang.object.product.repository.ProductImageRepository;
import com.banghyang.object.product.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@EnableCaching
public class SimilarPerfumeService {

    private final ProductRepository productRepository;
    private final ProductImageRepository productImageRepository;
    private final WebClient webClient;

    /**
     * 특정 향수의 유사 향수 목록 조회 (FastAPI와 연동)
     */
    @Cacheable(value = "similarPerfumes", key = "'reviews_' + #productId")
    public Map<String, List<SimilarPerfumeResponse>> getSimilarPerfumes(Long productId) {
        try {
            String url = "http://localhost:8000/similar/" + productId;  // FastAPI 엔드포인트
            log.info("productId: {}", productId);

            // FastAPI로 GET 요청을 보내고 응답을 받음
            Map<String, List<Map<String, Object>>> response = webClient
                    .get()
                    .uri(url)
                    .accept(MediaType.APPLICATION_JSON)
                    .retrieve()
                    .bodyToMono(new ParameterizedTypeReference<Map<String, List<Map<String, Object>>>>() {})
                    .block();

            log.info("FastAPI response: {}", response);

            if (response == null) {
                throw new RuntimeException("유사 향수 API 응답이 없습니다.");
            }

            // "note_based" 및 "design_based" 데이터 가져오기
            List<Map<String, Object>> noteBasedList = response.getOrDefault("note_based", List.of());
            List<Map<String, Object>> designBasedList = response.getOrDefault("design_based", List.of());

            // 두 개의 추천 리스트 변환
            List<SimilarPerfumeResponse> noteBased = mapToSimilarPerfumeResponse(noteBasedList);
            List<SimilarPerfumeResponse> designBased = mapToSimilarPerfumeResponse(designBasedList);

            // 결과를 맵 형태로 반환 (각각 note_based, design_based 키 사용)
            return Map.of(
                    "note_based", noteBased,
                    "design_based", designBased
            );

        } catch (WebClientResponseException.NotFound e) {
            log.error("유사 향수 조회 중 404 오류: {}", e.getMessage());
            return Map.of("note_based", List.of(), "design_based", List.of());  // 빈 데이터 반환
        } catch (Exception e) {
            log.error("유사 향수 조회 중 오류 발생: {}", e.getMessage(), e);
            throw new RuntimeException("유사 향수 추천 처리 중 오류 발생: " + e.getMessage());
        }
    }

    /**
     * FastAPI 응답 데이터를 SimilarPerfumeResponse 객체 리스트로 변환
     */
    private List<SimilarPerfumeResponse> mapToSimilarPerfumeResponse(List<Map<String, Object>> recommendations) {
        return recommendations.stream()
                .map(item -> {
                    Long id = ((Number) item.get("id")).longValue();
                    double similarityScore = ((Number) item.get("similarity_score")).doubleValue();

                    // 제품 조회
                    Product product = productRepository.findById(id)
                            .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));

                    // 제품 이미지 조회
                    String imageUrl = productImageRepository.findByProduct(product)
                            .stream()
                            .findFirst()
                            .map(ProductImage::getUrl)
                            .orElse("/default-image.png");

                    return new SimilarPerfumeResponse(
                            id,
                            product.getNameEn(),
                            product.getNameKr(),
                            product.getBrand(),
                            product.getMainAccord(),
                            imageUrl,
                            similarityScore
                    );
                })
                .collect(Collectors.toList());
    }
}
