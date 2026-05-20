package com.bangkoo.back.service.autoRecommend;

import com.bangkoo.back.utils.JwtUtil;
import com.bangkoo.back.utils.MultipartInputStreamFileResource;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Collections;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AutoRecommendService {

    @Value("${ai.server.url}")
    private String serverUrl; // AI 서버 URL

    private final RestTemplate restTemplate;                // 외부 API 호출
    private final RedisTemplate<String, String> redisTemplate; // Redis 저장
    private final ObjectMapper objectMapper; // JSON 변환
    private final JwtUtil jwtUtil; // JWT 유틸리티

    /**
     * FastAPI에 이미지 전송하여 추천 목록(List<Map<String,Object>>)을 받고,
     * Redis에 key로 저장하는 메서드
     *
     * @param file MultipartFile 업로드된 이미지
     * @param token JWT 토큰 (헤더 또는 매개변수에서 전달됨)
     * @return AI 서버가 반환한 추천 리스트
     */
    public List<Map<String, Object>> analyzeAndSaveToRedis(MultipartFile file, String token) {
        try {
            // JWT에서 useId 추출
            String useId = jwtUtil.getEmailFromToken(token); // 이메일 추출
            if (useId == null) {
                throw new RuntimeException("유효하지 않은 JWT 토큰입니다.");
            }

            // Redis 키 설정


            // 1) AI 서버 호출 준비
            String endpoint = serverUrl + "/analyze_room";
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.MULTIPART_FORM_DATA);
            MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
            body.add("file",
                    new MultipartInputStreamFileResource(file.getInputStream(), file.getOriginalFilename()));
            HttpEntity<MultiValueMap<String, Object>> request = new HttpEntity<>(body, headers);

            // 2) List<Map> 형태로 응답 받도록 ParameterizedTypeReference 사용
            ResponseEntity<List<Map<String, Object>>> response = restTemplate.exchange(
                    endpoint,
                    HttpMethod.POST,
                    request,
                    new ParameterizedTypeReference<List<Map<String, Object>>>() {}
            );

            // 3) AI 서버 응답 상태 체크
            if (response.getStatusCode() != HttpStatus.OK) {
                throw new RuntimeException("AI 서버로부터 유효한 추천 결과를 받지 못했습니다. 상태 코드: " + response.getStatusCode());
            }
            List<Map<String, Object>> recommendations = response.getBody();
            if (recommendations == null || recommendations.isEmpty()) {
                throw new RuntimeException("AI 서버에서 빈 추천 목록을 받았습니다.");
            }

            // 4) Redis에 저장
            String json = objectMapper.writeValueAsString(recommendations);
            redisTemplate.opsForValue().set(useId, json);
            System.out.println("Redis 저장 완료 key=" + useId + ", count=" + recommendations.size());

            // 5) 저장된 값 확인
            String stored = redisTemplate.opsForValue().get(useId);
            System.out.println(stored != null ? "Redis에 저장된 JSON: " + stored : "Redis에 값이 없습니다.");

            return recommendations;
        } catch (IOException e) {
            throw new RuntimeException("파일 처리 실패: " + e.getMessage(), e);
        } catch (RuntimeException e) {
            // 좀 더 명확한 예외 처리
            System.err.println("추천 및 Redis 저장 실패: " + e.getMessage());
            throw e;
        } catch (Exception e) {
            // 다른 예외 처리
            System.err.println("알 수 없는 오류 발생: " + e.getMessage());
            throw new RuntimeException("알 수 없는 오류 발생: " + e.getMessage(), e);
        }
    }

    /**
     * Redis에서 추천 결과를 조회하는 메서드
     * @param redisKey 저장된 키 (사용자 이메일 등으로)
     * @return 리스트가 없으면 빈 리스트 반환
     */
    public List<Map<String, Object>> getRecommendationsFromRedis(String redisKey) {
        try {
            String json = redisTemplate.opsForValue().get(redisKey);
            if (json == null) {
                System.out.println("Redis에 추천 결과가 없습니다.");
                return Collections.emptyList();
            }
            return objectMapper.readValue(json, new TypeReference<List<Map<String, Object>>>() {});
        } catch (IOException e) {
            System.err.println("Redis 조회 실패: " + e.getMessage());
            throw new RuntimeException("Redis 조회 실패: " + e.getMessage(), e);
        }
    }
}
