package com.bangkoo.back.service.search;

import com.bangkoo.back.dto.search.PopularSearchDTO;
import com.bangkoo.back.model.search.SearchLog;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.Aggregation;
import org.springframework.data.mongodb.core.aggregation.AggregationResults;
import org.springframework.data.mongodb.core.query.*;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

/**
 * 최초 작성자: 김동규
 * 최초 작성일: 2025-04-15
 *
 *  * 검색 로그 관련 비즈니스 로직 처리 서비스
 *
 * - 검색어 저장
 * - 사용자별 최근 검색어 조회
 * - 인기 검색어 집계 조회
 * - 검색 기록 전체/개별 삭제
 */
@Service
@RequiredArgsConstructor
public class SearchLogService {

    private final MongoTemplate mongoTemplate;

    /**
     * 검색어 저장 (로그인 사용자만 저장)
     *
     * @param query  사용자가 검색한 쿼리
     * @param userId 사용자 ID (anonymous 제외)
     * @param source 검색 요청 출처 (예: text, image+text 등)
     */
    public void saveSearchLog(String query, String userId, String source) {
        if (query == null || userId == null) return;

        SearchLog log = new SearchLog();
        log.setQuery(query.trim());
        log.setUser_id(userId);
        log.setTimestamp(Instant.now());
        log.setSource(source);
        mongoTemplate.insert(log);
    }

    /**
     * 사용자별 최근 검색어 조회
     *
     * @param userId 사용자 ID
     * @param limit  최대 개수 (최근 N개)
     * @return 최근 검색어 문자열 리스트
     */
    public List<String> getRecentSearches(String userId, int limit) {
        if (userId == null) return List.of();

        Query query = new Query(Criteria.where("user_id").is(userId))
                .with(Sort.by(Sort.Direction.DESC, "timestamp"))
                .limit(limit);

        return mongoTemplate.find(query, SearchLog.class)
                .stream()
                .map(SearchLog::getQuery)
                .distinct()
                .collect(Collectors.toList());
    }

    /**
     * 전체 사용자 기준 인기 검색어 조회
     *
     * @param limit 최대 개수
     * @return query + count 정보를 담은 DTO 리스트
     */
    public List<PopularSearchDTO> getPopularSearches(int limit) {
        Aggregation aggregation = Aggregation.newAggregation(
                Aggregation.group("query").count().as("count"),
                Aggregation.sort(Sort.Direction.DESC, "count"),
                Aggregation.limit(limit),
                Aggregation.project("count").and("_id").as("query")
        );

        AggregationResults<PopularSearchDTO> results =
                mongoTemplate.aggregate(aggregation, "search_logs", PopularSearchDTO.class);

        return results.getMappedResults();
    }

    /**
     * 사용자별 전체 검색어 기록 삭제
     *
     * @param userId 사용자 ID
     * @return 삭제된 문서 개수
     */
    public long deleteAll(String userId) {
        Query query = new Query(Criteria.where("user_id").is(userId));
        return mongoTemplate.remove(query, "search_logs").getDeletedCount();
    }

    /**
     * 사용자별 특정 검색어 삭제
     *
     * @param userId    사용자 ID
     * @param queryText 삭제할 검색어
     * @return 삭제된 문서 수 (0 또는 1)
     */
    public long deleteOne(String userId, String queryText) {
        Query query = new Query(Criteria.where("user_id").is(userId).and("query").is(queryText));
        return mongoTemplate.remove(query, "search_logs").getDeletedCount();
    }
}
