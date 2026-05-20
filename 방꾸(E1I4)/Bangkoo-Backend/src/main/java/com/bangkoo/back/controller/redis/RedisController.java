package com.bangkoo.back.controller.redis;

import com.bangkoo.back.service.redis.RedisService;
import com.bangkoo.back.utils.JwtUtil;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * ✅ RedisController (세션 기반 버전)
 * - 작성자: 김태원
 * - 작성일: 2025-04-12
 *
 * 🧠 Redis를 활용한 세션 단위 인테리어 상태 관리 컨트롤러
 * - JWT로 사용자 인증 → 세션 단위로 undo/redo 히스토리 분리 저장
 */

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/redis")
public class RedisController {

    private final RedisService redisService;
    private final JwtUtil jwtUtil;

    /**
     * 📌 상태 저장 (push)
     * - undo 스택에 push, redo 스택은 초기화
     */
    @PostMapping("/state")
    public ResponseEntity<String> pushState(
            @RequestParam("sessionId") String sessionId,
            @RequestBody String base64,
            HttpServletRequest request
    ) {
        String userId = jwtUtil.getUserIdFromToken(jwtUtil.extractToken(request));
        redisService.pushState(userId, sessionId, base64);
        return ResponseEntity.ok("✅ 상태 저장 완료");
    }

    /**
     * 🔙 undo 요청
     */
    @PostMapping("/undo")
    public ResponseEntity<?> undo(
            @RequestParam("sessionId") String sessionId,
            HttpServletRequest request
    ) {
        String userId = jwtUtil.getUserIdFromToken(jwtUtil.extractToken(request));
        String result = redisService.undo(userId, sessionId);
        return result == null ? ResponseEntity.noContent().build() : ResponseEntity.ok(result);
    }

    /**
     * 🔁 redo 요청
     */
    @PostMapping("/redo")
    public ResponseEntity<?> redo(
            @RequestParam("sessionId") String sessionId,
            HttpServletRequest request
    ) {
        String userId = jwtUtil.getUserIdFromToken(jwtUtil.extractToken(request));
        String result = redisService.redo(userId, sessionId);
        return result == null ? ResponseEntity.noContent().build() : ResponseEntity.ok(result);
    }

    /**
     * 📂 현재 상태 조회
     */
    @GetMapping("/state")
    public ResponseEntity<?> getCurrent(
            @RequestParam("sessionId") String sessionId,
            HttpServletRequest request
    ) {
        String userId = jwtUtil.getUserIdFromToken(jwtUtil.extractToken(request));
        String current = redisService.getCurrentState(userId, sessionId);
        return current == null ? ResponseEntity.noContent().build() : ResponseEntity.ok(current);
    }

    /**
     * 🧹 세션별 히스토리 삭제
     */
    @DeleteMapping("/clear")
    public ResponseEntity<String> clearSession(
            @RequestParam("sessionId") String sessionId,
            HttpServletRequest request
    ) {
        String userId = jwtUtil.getUserIdFromToken(jwtUtil.extractToken(request));
        redisService.clearSession(userId, sessionId);
        return ResponseEntity.ok("🧹 세션 히스토리 삭제 완료");
    }
}
