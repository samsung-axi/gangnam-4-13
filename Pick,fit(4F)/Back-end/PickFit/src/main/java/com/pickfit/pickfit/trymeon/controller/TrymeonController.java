package com.pickfit.pickfit.trymeon.controller;

import org.springframework.beans.factory.annotation.Autowired; // 스프링에서 의존성을 주입하기 위한 어노테이션
import org.springframework.beans.factory.annotation.Value; // application.yml 파일에서 값을 가져오기 위한 어노테이션
import org.springframework.core.io.FileSystemResource; // 파일 시스템 자원을 처리하기 위한 클래스
import org.springframework.http.*; // HTTP 요청 및 응답을 처리하는 클래스들
import org.springframework.util.LinkedMultiValueMap; // 다중 값을 가지는 맵을 생성하기 위한 클래스
import org.springframework.util.MultiValueMap; // 다중 값을 지원하는 맵 인터페이스
import org.springframework.web.bind.annotation.*; // REST API 요청을 처리하기 위한 어노테이션
import org.springframework.web.client.RestTemplate; // 외부 API 요청을 보내기 위한 클래스
import com.pickfit.pickfit.trymeon.service.TrymeonService; // 비즈니스 로직을 처리하는 서비스 클래스
import com.pickfit.pickfit.trymeon.dto.TrymeonDTO; // 클라이언트와 데이터를 주고받기 위한 DTO 클래스
import com.pickfit.pickfit.trymeon.entity.TrymeonEntity; // 데이터베이스 테이블과 매핑된 엔티티 클래스

import com.fasterxml.jackson.databind.JsonNode; // JSON 데이터 파싱을 위한 클래스
import com.fasterxml.jackson.databind.ObjectMapper; // JSON 매핑을 위한 클래스

import java.io.File; // 파일을 처리하기 위한 클래스
import java.io.FileWriter; // 파일에 데이터를 쓰기 위한 클래스
import java.io.IOException; // 파일 입출력 예외를 처리하기 위한 클래스

@RestController // REST 컨트롤러임을 선언
@RequestMapping("/trymeon") // 이 컨트롤러의 기본 URL 설정
public class TrymeonController {

    @Autowired // 스프링 컨테이너에서 TrymeonService 빈을 주입
    private TrymeonService trymeonService;

    @Value("${spring.catvton.api.url}") // FastAPI 서버의 URL을 application.yml에서 읽음
    private String catVtonApiUrl;

    /**
     * 클라이언트에서 TryMeOn 요청을 처리하는 메서드
     */
    @PostMapping("/process") // POST 요청을 처리
    public ResponseEntity<?> processTryOn(@RequestBody TrymeonDTO trymeonDTO) {
        String clothImageUrl = trymeonDTO.getClothImageUrl(); // DTO에서 옷 이미지 URL을 추출
        String personImageUrl = trymeonDTO.getPersonImageUrl(); // DTO에서 모델 이미지 URL을 추출
        String bigCategory = trymeonDTO.getBigCategory(); // DTO에서 대분류 카테고리를 추출

        // bigCategory는 반드시 프론트엔드에서 제공되어야 함
        if (bigCategory == null || bigCategory.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Category is required and must not be empty.");
        }

        File tempJsonFile; // FastAPI로 보낼 JSON 파일 선언
        try {
            tempJsonFile = File.createTempFile("data", ".json"); // 임시 JSON 파일 생성
            try (FileWriter writer = new FileWriter(tempJsonFile)) { // 파일에 데이터를 쓰기 위한 FileWriter 생성
                writer.write(String.format(
                        "{\"person_url\":\"%s\",\"cloth_url\":\"%s\",\"category_analysis\": {\"big_category\": \"%s\"}}",
                        personImageUrl, clothImageUrl, bigCategory // JSON 형식의 데이터 작성
                ));
            }
        } catch (IOException e) { // 파일 생성 중 예외 발생 시 처리
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to create JSON file: " + e.getMessage());
        }

        try {
            MultiValueMap<String, Object> body = new LinkedMultiValueMap<>(); // 요청 본문 생성
            body.add("file", new FileSystemResource(tempJsonFile)); // JSON 파일을 multipart/form-data로 추가

            HttpHeaders headers = new HttpHeaders(); // HTTP 요청 헤더 생성
            headers.setContentType(MediaType.MULTIPART_FORM_DATA); // Content-Type 설정

            RestTemplate restTemplate = new RestTemplate(); // 외부 API 요청을 위한 RestTemplate 객체 생성
            HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(body, headers); // 요청 본문과 헤더 포함

            ResponseEntity<String> response = restTemplate.exchange(
                    catVtonApiUrl + "/upload/", // FastAPI의 업로드 엔드포인트
                    HttpMethod.POST, // POST 요청
                    requestEntity, // 요청 데이터
                    String.class // 응답 데이터를 문자열로 받음
            );

            // FastAPI 응답에서 "url" 필드 추출
            ObjectMapper objectMapper = new ObjectMapper();
            JsonNode responseJson = objectMapper.readTree(response.getBody());
            String relativeUrl = responseJson.get("url").asText();
            String imageUrl = catVtonApiUrl.replace("/upload", "") + relativeUrl;

            // FastAPI 응답 검증 및 저장
            if (imageUrl == null || imageUrl.isEmpty()) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Invalid response from FastAPI.");
            }

            TrymeonEntity savedImage = trymeonService.saveTrymeonImage( // 결과 이미지를 데이터베이스에 저장
                    imageUrl, // 결과 이미지 URL
                    trymeonDTO.getUserEmail(), // 사용자 이메일
                    trymeonDTO.getProductId() // 상품 ID
            );

            return ResponseEntity.ok(savedImage); // 저장된 이미지를 응답으로 반환
        } catch (Exception e) { // FastAPI와 통신 중 예외 발생 시 처리
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to communicate with FastAPI: " + e.getMessage());
        } finally {
            if (!tempJsonFile.delete()) { // 임시 파일 삭제 실패 시 로그 출력
                System.err.println("Failed to delete temporary JSON file: " + tempJsonFile.getAbsolutePath());
            }
        }
    }
}
// TrymeonEntity.java
