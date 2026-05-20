package com.bangkoo.back.controller.search;

import com.bangkoo.back.dto.search.PopularSearchDTO;
import com.bangkoo.back.service.search.SearchLogService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 최초 작성자: 김동규
 * 최초 작성일: 2025-04-15
 *
 * 검색 로그 관련 API 컨트롤러
 *
 * - 검색어 저장 (로그인 사용자만 저장)
 * - 사용자별 최근 검색어 조회
 * - 전체 사용자 기준 인기 검색어 조회
 * - 사용자별 검색어 전체 삭제
 * - 사용자별 특정 검색어 삭제
 *
 */

@RestController
@RequestMapping("/api/search-logs")
@RequiredArgsConstructor
public class SearchLogController {

    private final SearchLogService searchLogService;

    /**
     * 검색어 저장 API (로그인 사용자 전용)
     *
     * @param query   검색어
     * @param userId  사용자 ID
     * @param source  검색 출처 (예: text, image+text)
     */
    @PostMapping
    public void saveSearchLog(@RequestParam("query") String query,
                              @RequestParam("userId") String userId,
                              @RequestParam(defaultValue = "text") String source) {
        searchLogService.saveSearchLog(query, userId, source);
    }

    /**
     * 사용자별 최근 검색어 조회 API
     *
     * @param userId  사용자 ID
     * @param limit   최대 개수 (기본값 10)
     * @return 최근 검색어 리스트
     */
    @GetMapping("/recent")
    public List<String> getRecent(@RequestParam("userId") String userId,
                                  @RequestParam(defaultValue = "10") int limit) {
        return searchLogService.getRecentSearches(userId, limit);
    }

    /**
     * 전체 사용자 기준 인기 검색어 조회 API
     *
     * @param limit 최대 개수 (기본값 10)
     * @return 인기 검색어 + 검색 횟수 리스트
     */
    @GetMapping("/popular")
    public List<PopularSearchDTO> getPopular(@RequestParam(defaultValue = "10") int limit) {
        return searchLogService.getPopularSearches(limit);
    }

    /**
     * 사용자별 검색어 전체 삭제 API
     *
     * @param userId 사용자 ID
     * @return 삭제된 검색어 수
     */
    @DeleteMapping
    public long deleteAll(@RequestParam("userId") String userId) {
        return searchLogService.deleteAll(userId);
    }

    /**
     * 사용자별 특정 검색어 삭제 API
     *
     * @param userId 사용자 ID
     * @param query  삭제할 검색어
     * @return 삭제된 문서 수 (0 또는 1)
     */
    @DeleteMapping("/item")
    public long deleteOne(@RequestParam("userId") String userId, @RequestParam String query) {
        return searchLogService.deleteOne(userId, query);
    }
}
