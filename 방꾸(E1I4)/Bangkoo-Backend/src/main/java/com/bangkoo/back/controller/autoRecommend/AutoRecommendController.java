package com.bangkoo.back.controller.autoRecommend;

import com.bangkoo.back.service.autoRecommend.AutoRecommendService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import com.bangkoo.back.utils.JwtUtil;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class AutoRecommendController {

    private final AutoRecommendService autoRecommendService;
    private final JwtUtil jwtUtil;

    /**
     * 최초 작성자: 김병훈
     * 최초 작성일: 2025-04-22
     *
     * 이미지 기반 가구 추천 API (AI 분석 후 추천)
     *
     * @param file MultipartFile 업로드된 이미지 파일
     * @return Redis에 저장된 추천 결과 확인 메시지
     */
    @PostMapping("/recommend/from_image")
    public ResponseEntity<Map<String, String>> recommendProductsFromImage(
            @RequestParam("file") MultipartFile file,
            HttpServletRequest request
    ) {
        // 1) 파일 유효성 검사
        if (file == null || file.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "파일이 없습니다"));
        }

        try {
            // 2) JWT 토큰 원본 추출
            String token = jwtUtil.extractToken(request);
            if (token == null || token.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "JWT 토큰이 없습니다"));
            }

            // 3) 토큰에서 사용자 ID(email) 추출
            String userId = jwtUtil.getUserIdFromToken(token);

            // 4) AI 서버 호출 및 Redis 저장 (서비스에 실제 토큰 전달)
            autoRecommendService.analyzeAndSaveToRedis(file, token);

            // 5) 클라이언트에 redisKey를 알려주기 위해 Map 형태로 리턴
            Map<String, String> body = new HashMap<>();
            body.put("redisKey", userId);
            return ResponseEntity.ok(body);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity
                    .internalServerError()
                    .body(Map.of("error", "이미지 처리 오류: " + e.getMessage()));
        }
    }

    @GetMapping("/recommend/from_image/{redisKey}")
    public ResponseEntity<List<Map<String,Object>>> getRecommendationsFromRedis(
            @PathVariable("redisKey") String redisKey
    ) {
        List<Map<String, Object>> result =
                autoRecommendService.getRecommendationsFromRedis(redisKey);
        return ResponseEntity.ok(result);
    }
}