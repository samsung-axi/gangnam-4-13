package com.bangkoo.back.service.embedding;

import com.bangkoo.back.dto.embedding.EmbeddingProductRequestDTO;
import com.bangkoo.back.dto.embedding.EmbeddingRequestDTO;
import com.bangkoo.back.model.product.Product;
import com.bangkoo.back.repository.product.ProductRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.IntStream;

@Service
public class EmbeddingService {
    /**
     * 최초 작성자: 김병훈
     */

    // FastAPI 서버의 URL을 properties 파일에서 읽어옴
    @Value("${ai.server.url}")
    private String aiBaseUrl;

    private final ProductRepository productRepository;
    private final RestTemplate restTemplate;

    // 의존성 주입을 통해 RestTemplate과 ProductRepository를 초기화
    public EmbeddingService(RestTemplate restTemplate, ProductRepository productRepository) {
        this.restTemplate = restTemplate;
        this.productRepository = productRepository;
    }

    /**
     * 이미지 URL을 바탕으로 임베딩 생성
     */
    public List<Double> generateImageEmbedding(String imageUrl) {
        // HTTP 헤더 설정 (JSON 형식)
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        // FastAPI가 [{ "name": ..., "imageUrl": ... }] 형태로 데이터를 기대하므로 DTO 객체로 감싸기
        EmbeddingProductRequestDTO requestDto = new EmbeddingProductRequestDTO(
                "dummyName",  // name은 임의로 넣거나 실제 값을 가져와야 할 경우 해당 값을 넣어주세요.
                "dummyDescription",  // description도 임의로 넣거나 실제 값을 넣어주세요.
                "dummyDetail",  // detail도 마찬가지로
                imageUrl,
                "dummyLink"  // link도 임의로 넣거나 실제 값을 넣어주세요.
        );

        // DTO 객체를 리스트로 감싸서 요청
        List<EmbeddingProductRequestDTO> requestList = List.of(requestDto);

        // HTTP 요청 객체 생성
        HttpEntity<List<EmbeddingProductRequestDTO>> request = new HttpEntity<>(requestList, headers);

        // FastAPI의 /embedding 엔드포인트에 POST 요청
        // 응답을 List<Double> 형태로 받기 위해 ResponseEntity<List<Double>>로 처리
        ResponseEntity<List<Double>> response = restTemplate.exchange(
                aiBaseUrl + "/embedding", // FastAPI URL
                HttpMethod.POST,
                request,
                new ParameterizedTypeReference<List<Double>>() {}
        );

        // 응답 본문을 List<Double>로 반환
        return response.getBody();
    }

    /**
     * 텍스트를 바탕으로 임베딩 생성
     */
    public List<Double> generateTextEmbedding(String text) {
        // HTTP 헤더 설정 (JSON 형식)
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        // 텍스트 데이터를 HTTP 요청에 담기
        HttpEntity<String> request = new HttpEntity<>(text, headers);

        // FastAPI의 /text-embedding 엔드포인트에 POST 요청
        // 응답을 List<Double> 형태로 받기 위해 ResponseEntity<List<Double>>로 처리
        ResponseEntity<List<Double>> response = restTemplate.exchange(
                aiBaseUrl + "/text-embedding",  // 별도 경로
                HttpMethod.POST,
                request,
                new ParameterizedTypeReference<List<Double>>() {}
        );

        // 응답 본문을 List<Double>로 반환
        return response.getBody();
    }

    /**
     * 제품 임베딩 생성 후 저장
     */
    public Product saveProductWithEmbeddings(EmbeddingRequestDTO dto) {
        // FastAPI로 임베딩 요청: 이미지 URL을 바탕으로 임베딩 생성
        List<Double> imageEmbedding = generateImageEmbedding(dto.getImageUrl());

        // FastAPI로 임베딩 요청: 텍스트를 바탕으로 임베딩 생성
        List<Double> textEmbedding = generateTextEmbedding(dto.getDescription() + " " + dto.getDetail());

        // 이미지 임베딩과 텍스트 임베딩을 결합하여 combinedEmbedding 생성
        List<Double> combinedEmbedding = averageEmbedding(imageEmbedding, textEmbedding);

        // 제품 객체 생성
        Product product = Product.builder()
                .name(dto.getName())
                .description(dto.getDescription())
                .detail(dto.getDetail())
                .imageUrl(dto.getImageUrl())
                .link(dto.getLink())
                .imageEmbedding(imageEmbedding)  // 이미지 임베딩 저장
                .textEmbedding(textEmbedding)  // 텍스트 임베딩 저장
                .combinedEmbedding(combinedEmbedding)  // 결합된 임베딩 저장
                .createdAt(LocalDateTime.now())  // 제품 생성 시간 저장
                .build();

        // 생성된 제품 정보를 데이터베이스에 저장
        return productRepository.save(product);
    }

    /**
     * 평균 임베딩 벡터 계산 (이미지 임베딩과 텍스트 임베딩을 결합)
     * @param a 이미지 임베딩
     * @param b 텍스트 임베딩
     * @return 결합된 평균 임베딩
     */
    private List<Double> averageEmbedding(List<Double> a, List<Double> b) {
        // 두 임베딩 벡터의 크기가 다를 수 있으므로, 작은 크기로 맞추어 평균을 계산
        int size = Math.min(a.size(), b.size());
        return IntStream.range(0, size)
                .mapToObj(i -> (a.get(i) + b.get(i)) / 2.0)  // 각 인덱스마다 평균값 계산
                .toList();  // List<Double>로 반환
    }

    // EmbeddingService.java

    public List<List<Double>> generateImageEmbeddings(List<String> imageUrls) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        List<Map<String, String>> requestBody = imageUrls.stream()
                .map(url -> Map.of("imageUrl", url))
                .toList();

        HttpEntity<List<Map<String, String>>> request = new HttpEntity<>(requestBody, headers);

        ResponseEntity<List<List<Double>>> response = restTemplate.exchange(
                "http://localhost:8000/embedding/image/list",
                HttpMethod.POST,
                request,
                new ParameterizedTypeReference<>() {}
        );

        return response.getBody();
    }

}
