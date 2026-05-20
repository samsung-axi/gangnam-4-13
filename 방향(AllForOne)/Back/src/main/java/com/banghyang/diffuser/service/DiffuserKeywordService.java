package com.banghyang.diffuser.service;

import com.banghyang.diffuser.dto.DiffuserKeywordRequest;
import com.banghyang.diffuser.dto.DiffuserKeywordResponse;
import com.banghyang.diffuser.dto.DiffuserResponse;
import com.banghyang.object.product.entity.Product;
import com.banghyang.object.product.entity.ProductImage;
import com.banghyang.object.product.repository.ProductImageRepository;
import com.banghyang.object.product.repository.ProductRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.ArrayList;
import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class DiffuserKeywordService {

    private final WebClient webClient;
    private final ProductRepository productRepository;
    private final ProductImageRepository productImageRepository;

    /**
     * 테라피 목적 디퓨저 추천
     */
    public DiffuserKeywordResponse recommendDiffusers(DiffuserKeywordRequest request) {
        try {
            // FastAPI 서버에 POST 요청을 보내 디퓨저 추천 정보를 받아옴
            DiffuserResponse diffuserResponse = webClient
                    .post()
                    .uri("http://localhost:8000/diffuser/recommend")
                    .contentType(MediaType.APPLICATION_JSON)
                    .bodyValue(request)
                    .retrieve()
                    .bodyToMono(DiffuserResponse.class)
                    .block();

            // 받아온 FastAPI 응답 로깅
            log.info("FastAPI response: {}", diffuserResponse);

            // 클라이언트에게 반환할 응답 객체 생성
            DiffuserKeywordResponse diffuserKeywordResponse = new DiffuserKeywordResponse();

            // FastAPI 로부터 받은 응답이 존재하고, 추천 목록이 비어있지 않은 경우 처리
            if (diffuserResponse != null && diffuserResponse.getRecommendations() != null
                    && !diffuserResponse.getRecommendations().isEmpty()) {

                // 추천 정보와 사용 방법을 응답 객체에 설정
                diffuserKeywordResponse.setRecommendations(diffuserResponse.getRecommendations());
                diffuserKeywordResponse.setUsageRoutine(diffuserResponse.getUsageRoutine());
                diffuserKeywordResponse.setTherapyTitle(diffuserResponse.getTherapyTitle());

                // 모든 추천 제품의 이미지 URL 들을 가져오기
                List<String> imageUrls = new ArrayList<>();

                // 각 추천 제품에 대한 이미지 URL 수집
                for (DiffuserResponse.Recommendation recommendation : diffuserResponse.getRecommendations()) {
                    // 추천된 제품 ID로 제품 정보 조회
                    Product product = productRepository.findById(recommendation.getProductId())
                            .orElseThrow(() -> new RuntimeException("Product not found with id: " +
                                    recommendation.getProductId()));

                    // 해당 제품의 모든 이미지 URL 을 추출
                    List<String> productImageUrls = productImageRepository.findByProduct(product)
                            .stream()
                            .map(ProductImage::getUrl)
                            .toList();

                    // 이미지 URL 이 존재하는 경우 전체 URL 리스트에 추가
                    if (!productImageUrls.isEmpty()) {
                        imageUrls.addAll(productImageUrls);
                    }
                }

                // 수집된 모든 이미지 URL 을 응답 객체에 설정
                diffuserKeywordResponse.setImageUrls(imageUrls);
            }
            return diffuserKeywordResponse;

        } catch (Exception e) {
            // 처리 중 발생한 모든 예외를 RuntimeException 으로 감싸서 던짐
            throw new RuntimeException("디퓨저 추천 처리 중 오류 발생: " + e.getMessage());
        }
    }
}
