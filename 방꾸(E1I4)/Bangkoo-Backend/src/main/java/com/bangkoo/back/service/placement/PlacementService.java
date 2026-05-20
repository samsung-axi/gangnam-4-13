package com.bangkoo.back.service.placement;

import com.bangkoo.back.dto.placement.PlacementResultResponse;
import com.bangkoo.back.model.placement.PlacementResult;
import com.bangkoo.back.repository.placement.PlacementResultRepository;
import com.bangkoo.back.utils.S3Uploader;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

import static org.springframework.http.HttpStatus.*;

/**
 * 최초 작성자 : 김태원
 * 최초 작성일 : 2025-04-11
 *
 * 🧠 PlacementService
 * - AI 서버 요청 및 결과 저장 로직 담당
 */
@Service
@RequiredArgsConstructor
public class PlacementService {

    private final RestTemplate restTemplate = new RestTemplate();
    private final S3Uploader s3Uploader;
    private final PlacementResultRepository placementResultRepository;

    @Value("${ai.server.url}")
    private String aiBaseUrl;

    /**
     * 🎨 AI 서버로 배치 요청 (mode, background, reference 전송)
     */
    public String sendToAiServer(String mode, MultipartFile background, MultipartFile reference) throws IOException {
        String aiUrl = aiBaseUrl + "/placement";
        System.out.println(aiUrl);
        MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
        body.add("mode", mode);
        body.add("background", convertToResource(background));

        if ("add".equals(mode) && reference != null) {
            body.add("reference", convertToResource(reference));
        }

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.MULTIPART_FORM_DATA);

        HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(body, headers);

        try {
            ResponseEntity<Map> response = restTemplate.postForEntity(aiUrl, requestEntity, Map.class);
            Map responseBody = response.getBody();

            if (responseBody == null || !responseBody.containsKey("image_base64")) {
                throw new ResponseStatusException(INTERNAL_SERVER_ERROR, "AI 서버 응답이 유효하지 않습니다.");
            }

            return (String) responseBody.get("image_base64");

        } catch (RestClientException e) {
            throw new ResponseStatusException(BAD_GATEWAY, "AI 서버 통신에 실패했습니다.", e);
        }
    }

    /**
     * 🔄 MultipartFile → ByteArrayResource 변환
     */
    private Resource convertToResource(MultipartFile file) throws IOException {
        try {
            return new ByteArrayResource(file.getBytes()) {
                @Override
                public String getFilename() {
                    return file.getOriginalFilename();
                }
            };
        } catch (IOException e) {
            throw new ResponseStatusException(INTERNAL_SERVER_ERROR, "파일 리소스 변환에 실패했습니다.", e);
        }
    }

    /**
     * 💾 S3 업로드 + Mongo 저장
     */
    public String uploadAndSaveResult(MultipartFile file, String userId, String explanation) throws IOException {
        try {
            String imageUrl = s3Uploader.upload(file, "img");

            PlacementResult result = PlacementResult.builder()
                    .userId(userId)
                    .imageUrl(imageUrl)
                    .explanation(explanation)
                    .createdAt(LocalDateTime.now())
                    .build();

            placementResultRepository.save(result);
            return imageUrl;

        } catch (IOException e) {
            throw new ResponseStatusException(INTERNAL_SERVER_ERROR, "S3 업로드에 실패했습니다.", e);
        } catch (Exception e) {
            throw new ResponseStatusException(INTERNAL_SERVER_ERROR, "결과 저장에 실패했습니다.", e);
        }
    }

    /**
     * 📂 사용자 저장 결과 조회
     */
    public List<PlacementResultResponse> getResultsByUser(String userId) {
        try {
            List<PlacementResult> results = placementResultRepository.findByUserId(userId);
            return results.stream()
                    .map(result -> PlacementResultResponse.builder()
                            .imageUrl(result.getImageUrl())
                            .createdAt(result.getCreatedAt())
                            .userId(result.getUserId())
                            .explanation(result.getExplanation()) // explanation 필드 포함 시
                            .build())
                    .toList();

        } catch (Exception e) {
            throw new ResponseStatusException(INTERNAL_SERVER_ERROR, "사용자 결과 조회 중 오류 발생", e);
        }
    }
}
