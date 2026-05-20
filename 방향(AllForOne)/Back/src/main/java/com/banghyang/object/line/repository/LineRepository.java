package com.banghyang.object.line.repository;

import com.banghyang.object.line.entity.Line;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LineRepository extends JpaRepository<Line, Long> {
    Line findByName(String lineName);
}
