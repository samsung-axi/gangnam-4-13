package com.bangkoo.back.service.redis;

import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

/**
 * ✅ RedisService
 * - 작성자: 김태원
 * - 작성일: 2025-04-12
 *
 * 🧠 Redis를 활용한 사용자별 인테리어 상태 히스토리 저장 로직
 * - 상태 push/undo/redo 기능 구현
 * - undo/redo 스택을 Redis 리스트로 관리
 */

@Service
@RequiredArgsConstructor
public class RedisService {

    private final RedisTemplate<String, String> redisTemplate;

    /**
     * 📌 상태 저장 (push)
     * - undo 스택에 새 상태 push
     * - redo 스택은 초기화
     */
    public void pushState(String userId, String sessionId, String base64) {
        String undoKey = getUndoKey(userId, sessionId);
        String redoKey = getRedoKey(userId, sessionId);

        redisTemplate.opsForList().leftPush(undoKey, base64);
        redisTemplate.delete(redoKey); // 새로 저장했으니 redo 초기화
    }

    /**
     * 🔙 되돌리기 (undo)
     * - 현재 상태 pop → redo 스택에 push
     * - undo 스택의 다음 항목을 current로 반환
     */
    public String undo(String userId, String sessionId) {
        String undoKey = getUndoKey(userId, sessionId);
        String redoKey = getRedoKey(userId, sessionId);

        Long size = redisTemplate.opsForList().size(undoKey);
        if (size == null || size <= 1) return null;

        String popped = redisTemplate.opsForList().leftPop(undoKey);
        if (popped != null) {
            redisTemplate.opsForList().leftPush(redoKey, popped);
        }

        return redisTemplate.opsForList().index(undoKey, 0);
    }

    /**
     * 🔁 다시 실행 (redo)
     * - redo에서 pop → undo에 push
     * - 새 상태를 current로 반환
     */
    public String redo(String userId, String sessionId) {
        String undoKey = getUndoKey(userId, sessionId);
        String redoKey = getRedoKey(userId, sessionId);

        String popped = redisTemplate.opsForList().leftPop(redoKey);
        if (popped != null) {
            redisTemplate.opsForList().leftPush(undoKey, popped);
        }

        return redisTemplate.opsForList().index(undoKey, 0);
    }

    /**
     * 📂 현재 상태 조회
     * - undo 스택의 top을 반환
     */
    public String getCurrentState(String userId, String sessionId) {
        String undoKey = getUndoKey(userId, sessionId);
        return redisTemplate.opsForList().index(undoKey, 0);
    }

    /**
     * 🧹 사용자 상태 전체 초기화
     */
    public void clearSession(String userId, String sessionId) {
        redisTemplate.delete(getUndoKey(userId, sessionId));
        redisTemplate.delete(getRedoKey(userId, sessionId));
    }

    // 🔑 키 생성 도우미
    private String getUndoKey(String userId, String sessionId) {
        return "undo:" + userId + ":" + sessionId;
    }

    private String getRedoKey(String userId, String sessionId) {
        return "redo:" + userId + ":" + sessionId;
    }
}
