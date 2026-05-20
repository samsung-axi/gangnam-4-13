package com.bangkoo.back.service.detection;

import com.bangkoo.back.dto.detection.DetectionResponseDTO;
import com.bangkoo.back.model.detection.Detection;
import com.bangkoo.back.model.detection.DetectionResult;
import com.bangkoo.back.utils.MultipartInputStreamFileResource;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.*;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;

import java.io.ByteArrayInputStream;
import java.util.List;

@Service
public class DetectionService {

    private final RestTemplate restTemplate = new RestTemplate();

    public DetectionResponseDTO upload(byte[] imageBytes,int width,int height) {
        // FastAPI 서버 주소
        String fastApiUrl = "http://localhost:8000/api/detect_all_base64";

        // HTTP 헤더 설정
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.MULTIPART_FORM_DATA);

        // Multipart 형식으로 이미지 설정
        MultipartInputStreamFileResource fileResource =
                new MultipartInputStreamFileResource(new ByteArrayInputStream(imageBytes), "uploaded.png");

        MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
        body.add("file", fileResource);
        body.add("canvasWidth", String.valueOf(width));   // ✅ width 추가
        body.add("canvasHeight", String.valueOf(height)); // ✅ height 추가
        HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(body, headers);

        // FastAPI로 요청 후 응답 받기
        ResponseEntity<DetectionResponseDTO> response = restTemplate.postForEntity(
                fastApiUrl,
                requestEntity,
                DetectionResponseDTO.class
        );

        DetectionResponseDTO responseBody = response.getBody();

        List<DetectionResult> results = responseBody.getResults();  // ✅ 결과 꺼냄
        List<String> thumbnails = responseBody.getThumbnails_base64();
//        for (DetectionResult result : results) {
//            System.out.printf("📦 감지 결과: class=%s, score=%.2f, bbox=%s%n",
//                    result.getClassName(), result.getScore(), result.getBbox());
//        }
        for (int i = 0; i < results.size(); i++) {
            DetectionResult result = results.get(i);
            if (i < thumbnails.size()) {
                result.setThumbnail(thumbnails.get(i));
            }
        }

        String finalImageBase64 = responseBody.getFinal_image_base64();

        String originalImageBase64 = responseBody.getOriginal_image_base64();

        return responseBody;
    }
}