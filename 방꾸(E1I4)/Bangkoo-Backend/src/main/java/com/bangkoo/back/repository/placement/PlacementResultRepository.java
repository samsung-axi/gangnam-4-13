package com.bangkoo.back.repository.placement;

import com.bangkoo.back.model.placement.PlacementResult;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * 최초 작성자 : 김태원
 * 최초 작성일 : 2025-04-11
 *
 * 📦 PlacementResultRepository
 * - 사용자별 배치 결과(PlacementResult) 데이터를 MongoDB에서 조회하는 리포지토리
 * - Spring Data MongoDB 기반
 */
@Repository
public interface PlacementResultRepository extends MongoRepository<PlacementResult, String> {

    /**
     * 특정 사용자(userId)의 모든 배치 결과를 조회
     *
     * @param userId 사용자 ID
     * @return 해당 사용자의 배치 결과 리스트
     */
    List<PlacementResult> findByUserId(String userId);
}
