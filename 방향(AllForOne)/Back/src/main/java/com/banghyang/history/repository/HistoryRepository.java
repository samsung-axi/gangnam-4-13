package com.banghyang.history.repository;

import com.banghyang.history.entity.History;
import com.banghyang.member.entity.Member;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HistoryRepository extends JpaRepository<History, Long> {
    List<History> findByMember(Member member);
}
