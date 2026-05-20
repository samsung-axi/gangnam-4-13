package com.banghyang.history.repository;

import com.banghyang.history.entity.History;
import com.banghyang.history.entity.Recommendation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RecommendationRepository extends JpaRepository<Recommendation, Long> {
    List<Recommendation> findByHistory(History history);
}
